---
title: "Better Error Handling With Monads"
description: Lets analyze why the default error handling approach falls apart at scale and how (Monads) fixes these problems.
---

Let's talk about something that bites every development team eventually: error handling.

You start with try-catch because it's simple and familiar. Then your codebase grows, your team adds features, and suddenly you're spending hours debugging production issues because someone forgot to handle an error case. Or you're staring at nested try-catch blocks trying to figure out what's actually happening.


We'll use a **realistic Payment Processing API** scenario because that's where error handling really matters. We'll look at two problems that'll sound familiar if you've worked on any production system:

1. **No Type Safety**: The compiler has no idea what errors your function can throw
2. **Nested Try-Catch Hell**: Branching logic turns your code into an indentation nightmare

Let's dig in.

---

## Problem 1: No Type Safety in Error Handling

### The issue

Look at this function signature:

```typescript
async function processPayment(
  userId: string,
  amount: number
): Promise<PaymentResult>;
```

From the type alone, you still don't know what can go wrong. The only way to find out is to read the implementation (or discover it the hard way at runtime).

This causes real problems:

- **Missed error cases**: Nothing forces callers to consider every failure mode
- **Runtime surprises**: Unknown errors show up in production, not during development
- **Fragile refactors**: Adding a new error often requires hunting down call sites manually

### What it looks like with try-catch

```typescript
// Function signature doesn't tell you what can fail
async function processPayment(
  userId: string,
  amount: number
): Promise<PaymentResult> {
  // Could throw ValidationError, UserNotFoundError, InsufficientFundsError, PaymentGatewayError
  // But the signature just says Promise<PaymentResult>!
}

// Call site - no compile-time guidance on which errors to handle
app.post("/api/payments", async (req, res) => {
  try {
    const result = await processPayment(req.body.userId, req.body.amount);
    res.json(result);
  } catch (error) {
    // TypeScript doesn't know what 'error' is here.
    // You end up doing runtime checks (instanceof) to branch behavior.

    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    if (error instanceof UserNotFoundError) {
      return res.status(404).json({ error: "User not found" });
    }

    if (error instanceof InsufficientFundsError) {
      return res.status(402).json({
        error: "Insufficient funds",
        required: error.required,
        available: error.available,
      });
    }

    if (error instanceof PaymentGatewayError) {
      logger.error("Payment gateway error:", error);
      return res.status(500).json({ error: "Payment processing failed" });
    }

    // If processPayment starts throwing a new error type,
    // nothing reminds us to update this handler.
    res.status(500).json({ error: "Unknown error" });
  }
});
```

### Why this hurts in practice

- **The type signature is incomplete**: `Promise<PaymentResult>` describes the happy path, but not the failure path.
- **No compiler enforcement**: You can forget to handle `InsufficientFundsError` (or any other case) and still ship.
- **Runtime branching everywhere**: You rely on `instanceof` checks, which are repetitive and easy to drift over time.
- **New errors fail silently**: Adding a new error requires updating call sites, but nothing points you to the places you missed.

---

## Problem 2: Real-World Branching Turns try/catch into Spaghetti

### The issue

Here's a realistic requirement: your payment flow supports optional discount codes. That sounds straightforward until you add the "keep going" rules.

But then the requirements come in:

- Apply the discount code if the user provides one
- If discount validation fails, continue without the discount (don't fail the payment)
- If the discount is expired, email the user, but still process the payment
- After a successful payment, send a confirmation email
- If the confirmation email fails, log it and move on (the payment already went through)

With try/catch, **these "some steps are best-effort" rules tend to produce deeply nested control flow**.

### Here's what happens with try-catch

```typescript
async function processPaymentWithDiscount(
  userId: string,
  amount: number,
  discountCode?: string
): Promise<PaymentResult> {
  try {
    const user = await fetchUser(userId);
    if (!user) throw new UserNotFoundError(userId);

    // Discount code handling
    if (discountCode) {
      try {
        const discount = await validateDiscountCode(discountCode, userId);
        if (discount) {
          if (discount.expiresAt < new Date()) {
            try {
              await sendExpiredDiscountEmail(user.email);
            } catch (emailError) {
              logger.error(
                "Failed to send expired discount email:",
                emailError
              );
            }
          } else {
            amount = amount - discount.amount;
          }
        }
      } catch (discountError) {
        // Should we fail the payment? Or continue without the discount?
        if (discountError instanceof DatabaseError) {
          throw discountError;
        }
        logger.error("Discount validation error:", discountError);
      }
    }

    // Balance check
    try {
      const balance = await getBalance(userId);
      if (balance === null) throw new Error("Could not retrieve balance");
      if (balance < amount) throw new InsufficientFundsError(amount, balance);
    } catch (balanceError) {
      if (balanceError instanceof InsufficientFundsError) throw balanceError;
      throw new PaymentGatewayError("BALANCE_ERROR", "Failed to check balance");
    }

    // Process payment
    try {
      const paymentResult = await paymentGateway.charge(userId, amount);

      // Send confirmation email
      try {
        await sendConfirmationEmail(user.email, paymentResult);
      } catch (emailError) {
        logger.error("Failed to send confirmation email:", emailError);
      }

      return paymentResult;
    } catch (gatewayError) {
      throw new PaymentGatewayError(
        gatewayError.code,
        "Payment gateway failed"
      );
    }
  } catch (error) {
    // This outer catch will catch everything
    throw error;
  }
}
```

### Why this hurts in practice

- **Control flow becomes hard to read**: your eyes bounce between `try` and `catch` blocks to understand what the system does.
- **Error policy gets scattered**: some failures should abort (gateway down), others should not (email failed), but that intent is easy to lose.
- **Accidental behavior changes are common**: a new `throw` in the wrong place can turn a best-effort step into a hard failure.
- **Scope and state become awkward**: the values you need are often "three blocks up", so you start widening scope or mutating variables.
- **Testing branches explodes**: every best-effort rule adds another path you need to set up and assert.

---

## The Solution: Typed, Composable Error Handling (Monadic Approach)

### The core idea

Instead of throwing exceptions, represent a computation that may fail **as a value**, with its possible error types encoded in the type system.

In the TypeScript ecosystem you can model this with libraries like `fp-ts`, `effect`, or `@carbonteq/fp`. In this article we'll keep the examples consistent by using **Effect**, but the core idea applies to all of them.

```typescript
Effect<Success, Error>;
```

See that `Error` parameter? **The compiler can now track what errors your function can produce.** Not just "it returns a Promise" or "it might throw something", but a concrete set of error types.

Let me show you how this fixes each problem.

---

## Solving Problem 1: Type-Safe Error Handling

### Here's the same code with Effect

```typescript
import { Effect as E, Data, pipe } from "effect";

// Define typed errors
class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly field: string;
  readonly message: string;
}> {}

class UserNotFoundError extends Data.TaggedError("UserNotFoundError")<{
  readonly userId: string;
}> {}

class InsufficientFundsError extends Data.TaggedError(
  "InsufficientFundsError"
)<{
  readonly required: number;
  readonly available: number;
}> {}

class PaymentGatewayError extends Data.TaggedError("PaymentGatewayError")<{
  readonly gatewayCode: string;
  readonly message: string;
}> {}

// Function signature shows the possible errors
function processPayment(
  userId: string,
  amount: number
): E.Effect<
  PaymentResult,
  | ValidationError
  | UserNotFoundError
  | InsufficientFundsError
  | PaymentGatewayError
> {
  // Implementation...
}

// Make the return type (and its error union) obvious at the call site.
type ProcessPaymentReturn = ReturnType<typeof processPayment>;
// ProcessPaymentReturn is:
// E.Effect<
//   PaymentResult,
//   ValidationError | UserNotFoundError | InsufficientFundsError | PaymentGatewayError
// >

// Call site - handle errors explicitly
app.post("/api/payments", async (req, res) => {
  const program = processPayment(req.body.userId, req.body.amount);
  const result = await E.runPromise(E.either(program));

  if (result._tag === "Left") {
    const error = result.left;

    // Pattern match on the tagged error
    switch (error._tag) {
      case "ValidationError":
        return res
          .status(400)
          .json({ error: error.message, field: error.field });

      case "UserNotFoundError":
        return res.status(404).json({ error: "User not found" });

      case "InsufficientFundsError":
        return res.status(402).json({
          error: "Insufficient funds",
          required: error.required,
          available: error.available,
        });

      case "PaymentGatewayError":
        logger.error("Payment gateway error:", error);
        return res.status(500).json({ error: "Payment processing failed" });

      // If you add a new error type, TypeScript can help you enforce exhaustiveness.
    }
  }

  res.json(result.right);
});
```

### Why this is better

- **The signature is complete**: callers can see the success type and the error types.
- **The compiler can assist**: you can make handlers exhaustive so new error cases don't slip through silently.
- **Clear branching**: you branch on a tagged value (`_tag`) instead of relying on scattered `instanceof` checks.
- **Safer refactors**: adding an error type forces you to update the places that pattern-match on it.
- **More predictable behavior**: error handling becomes explicit and consistent.

---

## Solving Problem 2: Composable Branching Logic

### Here's the same complex flow with Effect

```typescript
function processPaymentWithDiscount(
  userId: string,
  amount: number,
  discountCode?: string
): E.Effect<
  PaymentResult,
  | UserNotFoundError
  | InsufficientFundsError
  | PaymentGatewayError
  | DatabaseError
> {
  const now = new Date();

  const validateDiscountBestEffort = (code: string) =>
    pipe(
      validateDiscountCode(code, userId),
      E.map(O.fromNullable),
      // Discount validation is best-effort: log and continue without a discount.
      // But if it's a real infrastructure failure (e.g. DB), we still fail the whole request.
      E.catchAll((error) =>
        (error as { _tag?: string })._tag === "DatabaseError"
          ? E.fail(error as DatabaseError)
          : pipe(
              E.sync(() =>
                logger.warn(
                  "Discount validation failed, continuing without discount:",
                  error
                )
              ),
              E.as(O.none())
            )
      )
    );

  const applyDiscount = (user: { email: string }) => {
    const discountOption = O.fromNullable(discountCode);

    const validatedDiscount: E.Effect<O.Option<Discount>, DatabaseError> = pipe(
      discountOption,
      O.map((code) => validateDiscountBestEffort(code)),
      O.getOrElse(() => E.succeed(O.none()))
    );

    return pipe(
      validatedDiscount,
      E.flatMap(
        O.match({
          onNone: () => E.succeed(amount),
          onSome: (discount) =>
            E.if(discount.expiresAt >= now, {
              onTrue: () => E.succeed(amount - discount.amount),
              // Expired discount: notify the user, but don't fail the payment.
              onFalse: () =>
                pipe(
                  sendExpiredDiscountEmail(user.email),
                  E.catchAll(() => E.void),
                  E.as(amount)
                ),
            }),
        })
      )
    );
  };

  const ensureSufficientBalance = (finalAmount: number) =>
    pipe(
      getBalance(userId),
      E.flatMap((balance) =>
        E.if(balance < finalAmount, {
          onTrue: () =>
            E.fail(
              new InsufficientFundsError({
                required: finalAmount,
                available: balance,
              })
            ),
          onFalse: () => E.succeed({ userId, amount: finalAmount }),
        })
      )
    );

  return pipe(
    // Step 1: Get user
    fetchUser(userId),

    // Step 2: Apply discount if provided
    E.flatMap((user) => applyDiscount(user)),

    // Step 3: Check balance
    E.flatMap(ensureSufficientBalance),

    // Step 4: Process payment
    E.flatMap(({ userId, amount }) =>
      pipe(
        paymentGateway.charge(userId, amount),
        E.mapError(
          (error) =>
            new PaymentGatewayError({
              gatewayCode: error.code,
              message: "Payment gateway failed",
            })
        )
      )
    ),

    // Step 5: Send confirmation email (don't fail payment if email fails)
    E.tap((paymentResult) =>
      pipe(
        fetchUser(userId),
        E.flatMap((user) =>
          sendConfirmationEmail(user.email, paymentResult)
        ),
        E.catchAll((emailError) => {
          logger.error("Failed to send confirmation email:", emailError);
          return E.void;
        })
      )
    )
  );
}

// Same idea here: composition "accumulates" errors as a union.
type ProcessPaymentWithDiscountReturn = ReturnType<typeof processPaymentWithDiscount>;
// ProcessPaymentWithDiscountReturn is:
// E.Effect<PaymentResult, UserNotFoundError | InsufficientFundsError | PaymentGatewayError | DatabaseError>
```

### Why this is better

- **Linear flow**: reads top to bottom without nested try/catch blocks.
- **Clear branching**: conditional logic is explicit and localized.
- **Explicit error policy**: `catchAll` makes it clear which failures are recovered and how.
- **Best-effort steps are easy**: `tap` lets you run side effects without turning them into hard failures.
- **Error transformation is deliberate**: you can map infrastructure errors into domain errors (e.g. `mapError`).
- **Less scope juggling**: each step receives what it needs from the previous step.

---


## Key Takeaways

### Why Monadic approach wins

The typed-effect approach mainly changes one thing: it makes failure **explicit**.
Instead of reading implementations (or learning in production) what can go wrong, you see the possible error types in the return type, right next to the success type.

Once errors are part of the type, a few practical benefits follow naturally. You can structure handlers so they cover all tagged error cases, and when a new error is introduced you get compiler feedback at the places that need updating. Control flow also becomes easier to reason about: you compose steps linearly, and you can mark certain steps as best-effort (log and continue) without turning your whole function into nested try/catch blocks.

Just as importantly, you keep the error context as data. That makes it easier to log, transform infrastructure errors into domain errors, and pass structured details (like `required` vs `available`) back to callers.

### The fundamental difference

> **Try-Catch**: Errors are side effects thrown imperatively. The type system has no idea they exist.
>
> **Effect**: Errors are values in the type system. The compiler tracks them like any other type.

This isn't about syntax. It's about making the failure path visible and enforceable, so you spend less time chasing “unknown” errors and more time writing code that behaves the way you intended.

---

## Summary

| Aspect               | Try-Catch                     | Effect                               |
| -------------------- | ----------------------------- | ------------------------------------ |
| **Type Safety**      | No — errors are not part of the signature | Yes — errors can be encoded in the signature |
| **Exhaustiveness**   | Limited — easy to miss cases             | Stronger — can enforce coverage via tagged unions |
| **Composition**      | Often nested control flow                 | Linear composition with `pipe` / combinators |
| **Testing**          | More boilerplate around exceptions         | Assert on values (e.g. `either`) |
| **Error Context**    | Can get lost across catch blocks           | Preserved in typed error values |
| **Partial Failures** | Awkward to express                         | Built-in patterns (`tap`, `catchAll`) |
| **Maintainability**  | Manual call site updates                   | Compiler-guided updates when types change |

**Bottom line**: for production systems with non-trivial error flows, making failures explicit (and typed) tends to reduce surprises and make refactors safer. This article uses Monadic approach for the concrete examples, but the underlying approach is the important part.