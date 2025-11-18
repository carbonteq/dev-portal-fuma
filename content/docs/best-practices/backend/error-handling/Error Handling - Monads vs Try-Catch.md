---
title: "Error Handling: Monads vs Try-Catch"
---

Let's talk about something that bites every development team eventually: error handling.

You start with try-catch because it's simple and familiar. Then your codebase grows, your team adds features, and suddenly you're spending hours debugging production issues because someone forgot to handle an error case. Or you're staring at nested try-catch blocks trying to figure out what's actually happening.

This document shows you **why try-catch falls apart at scale** and **how Effect (monads) fixes these problems**.

We'll use a **realistic Payment Processing API** scenario because that's where error handling really matters. We'll look at three problems that'll sound familiar if you've worked on any production system:

1. **No Type Safety**: The compiler has no idea what errors your function can throw
2. **Nested Try-Catch Hell**: Branching logic turns your code into an indentation nightmare
3. **Testing Becomes Verbose**: You end up writing more test boilerplate than actual test logic

Let's dig in.

---

## Problem 1: No Type Safety in Error Handling

### Here's the issue

Look at a function signature using try-catch:

```typescript
async function processPayment(
  userId: string,
  amount: number
): Promise<PaymentResult>;
```

What errors can this throw? No idea. You have to read the implementation, or worse, find out in production.

This causes real problems:

- **You forget to handle errors**: No compiler warning when you miss a case
- **Production surprises**: An error you didn't know about takes down your API
- **Refactoring nightmares**: Add a new error type? Good luck finding every place that calls this function

### Here's what it looks like with try-catch

```typescript
// ❌ Function signature doesn't tell you what can fail
async function processPayment(
  userId: string,
  amount: number
): Promise<PaymentResult> {
  // Could throw ValidationError, UserNotFoundError, InsufficientFundsError, PaymentGatewayError
  // But the signature just says Promise<PaymentResult>!
}

// ❌ Call site - no type safety
app.post("/api/payments", async (req, res) => {
  try {
    const result = await processPayment(req.body.userId, req.body.amount);
    res.json(result);
  } catch (error) {
    // ❌ TypeScript thinks error is 'unknown' or 'any'
    // ❌ Must manually check with instanceof

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

    // ❌ What if we forgot to handle a new error type?
    // ❌ Compiler won't tell us we missed it!
    res.status(500).json({ error: "Unknown error" });
  }
});
```

### Why this is painful:

❌ **The signature lies**: `Promise<PaymentResult>` tells you nothing about what can go wrong  
❌ **The compiler can't help you**: Forgot to handle `InsufficientFundsError`? Hope you catch it before your users do  
❌ **instanceof checks everywhere**: Repetitive, verbose, and easy to mess up  
❌ **Adding errors breaks things silently**: Add a new error type? Time to grep your entire codebase and hope you found everything  
❌ **No safety net**: The compiler won't warn you when you forget an error case

---

## Problem 2: Branching Logic Creates Nested Try-Catch Hell

### The issue

Here's a real scenario: your payment flow needs to handle discount codes. Simple enough, right?

But then the requirements come in:

- Apply the discount code if the user provides one
- If discount validation fails, just continue without the discount (don't fail the payment)
- If the discount is expired, send them an email, but still process the payment
- After payment, send a confirmation email
- If the confirmation email fails, that's fine—the payment already went through

With try-catch, **handling these "some things can fail, but keep going" scenarios turns your code into a nested mess**.

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
        // ❌ Should we fail the payment? Or continue without discount?
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
    // ❌ This outer catch will catch EVERYTHING
    throw error;
  }
}
```

### Why this hurts:

❌ **Indentation hell**: Try-catch inside try-catch inside try-catch... you lose track of where you are  
❌ **Hard to follow**: Your eyes bounce between try blocks and catch blocks trying to trace the flow  
❌ **One typo breaks everything**: Forget to catch one error and the entire payment fails when it shouldn't  
❌ **Variable scope nightmares**: That variable you need? It's three try blocks ago  
❌ **Testing is brutal**: Good luck setting up tests for all these branches

---

## Problem 3: Testing Becomes Verbose and Error-Prone

### The issue

Want to test your error handling? Get ready for some boilerplate.

With try-catch, every test needs its own try-catch block, manual `fail()` calls, complex mocking setups, and verbose assertions just to check error types.

### Example test patterns

```typescript
// ❌ Verbose test with try-catch
it("should return 402 when insufficient funds", async () => {
  try {
    await processPayment("user-123", 1000);
    fail("Should have thrown InsufficientFundsError"); // Easy to forget this!
  } catch (error) {
    expect(error).toBeInstanceOf(InsufficientFundsError);
  }
});
```

### Why this is annoying:

❌ **Try-catch everywhere**: Even your tests are full of try-catch blocks  
❌ **Easy to mess up**: Forget that `fail()` call? Your test passes when it should fail  
❌ **Verbose assertions**: Three lines of code just to check one error property  
❌ **Composition is hard**: Testing "step 2 fails but step 3 should still run" requires mental gymnastics  
❌ **Mock madness**: You spend more time setting up mocks than writing actual test logic

---

## The Solution: Effect (Monads) for Type-Safe Error Handling

### What's Effect?

Think of Effect as a way to represent a computation that might fail—but with the errors baked into the type system.

```typescript
Effect<Success, Error>;
```

See that `Error` parameter? That's the magic. **The compiler now knows what errors your function can produce.** Not just "it returns a Promise" or "it might throw something." You get actual type safety for your error handling.

Let me show you how this fixes each problem.

---

## Solving Problem 1: Type-Safe Error Handling

### Here's the same code with Effect

```typescript
import { Effect, Data, pipe } from "effect";

// ✅ Define typed errors
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

// ✅ Function signature shows ALL possible errors
function processPayment(
  userId: string,
  amount: number
): Effect.Effect<
  PaymentResult,
  | ValidationError
  | UserNotFoundError
  | InsufficientFundsError
  | PaymentGatewayError
> {
  // Implementation...
}

// ✅ Call site - Type-safe error handling
app.post("/api/payments", async (req, res) => {
  const program = processPayment(req.body.userId, req.body.amount);
  const result = await Effect.runPromise(Effect.either(program));

  if (result._tag === "Left") {
    const error = result.left;

    // ✅ Exhaustive checking - compiler ensures all cases covered
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

      // ✅ If you add a new error type, compiler will warn you missed it here!
    }
  }

  res.json(result.right);
});
```

### Why this is better:

✅ **The signature tells the truth**: Look at the function signature and you know exactly what can go wrong  
✅ **The compiler has your back**: Forget to handle an error? You'll get a compiler warning, not a production incident  
✅ **Clean pattern matching**: No more instanceof checks—just switch on `_tag`  
✅ **Refactoring is safe**: Add a new error type and the compiler shows you every place that needs updating  
✅ **No surprises**: Every error path is explicit and tracked

---

## Solving Problem 2: Composable Branching Logic

### Here's the same complex flow with Effect

```typescript
function processPaymentWithDiscount(
  userId: string,
  amount: number,
  discountCode?: string
): Effect.Effect<
  PaymentResult,
  | UserNotFoundError
  | InsufficientFundsError
  | PaymentGatewayError
  | DatabaseError
> {
  return pipe(
    // Step 1: Get user
    fetchUser(userId),

    // Step 2: Apply discount if provided
    Effect.flatMap((user) =>
      discountCode
        ? pipe(
            validateDiscountCode(discountCode, userId),
            // ✅ Handle discount errors gracefully - continue without discount
            Effect.catchAll((error) => {
              logger.warn(
                "Discount validation failed, continuing without discount:",
                error
              );
              return Effect.succeed(null);
            }),
            Effect.flatMap((discount) =>
              discount && discount.expiresAt >= new Date()
                ? Effect.succeed(amount - discount.amount)
                : pipe(
                    // Try to send expired email, but don't fail if it errors
                    sendExpiredDiscountEmail(user.email),
                    Effect.catchAll(() => Effect.void),
                    Effect.map(() => amount)
                  )
            )
          )
        : Effect.succeed(amount)
    ),

    // Step 3: Check balance
    Effect.flatMap((finalAmount) =>
      pipe(
        getBalance(userId),
        Effect.flatMap((balance) =>
          balance < finalAmount
            ? Effect.fail(
                new InsufficientFundsError({
                  required: finalAmount,
                  available: balance,
                })
              )
            : Effect.succeed({ userId, amount: finalAmount })
        )
      )
    ),

    // Step 4: Process payment
    Effect.flatMap(({ userId, amount }) =>
      pipe(
        paymentGateway.charge(userId, amount),
        Effect.mapError(
          (error) =>
            new PaymentGatewayError({
              gatewayCode: error.code,
              message: "Payment gateway failed",
            })
        )
      )
    ),

    // Step 5: Send confirmation email (don't fail payment if email fails)
    Effect.tap((paymentResult) =>
      pipe(
        fetchUser(userId),
        Effect.flatMap((user) =>
          sendConfirmationEmail(user.email, paymentResult)
        ),
        Effect.catchAll((emailError) => {
          logger.error("Failed to send confirmation email:", emailError);
          return Effect.void;
        })
      )
    )
  );
}
```

### Why this is better:

✅ **Linear flow**: Reads top to bottom—no more jumping between try and catch blocks  
✅ **Clear branching**: Conditional logic is explicit and easy to follow  
✅ **Explicit error handling**: When you use `catchAll`, you're being clear about "this might fail, and here's what to do"  
✅ **Partial failures are easy**: Use `tap` for side effects that shouldn't kill the main operation  
✅ **Error transformation is built-in**: Convert infrastructure errors to domain errors with `mapError`  
✅ **No scope nightmares**: Each step in the chain has access to what it needs

---

## Solving Problem 3: Clean, Type-Safe Tests

### Here's what testing looks like with Effect

```typescript
it("should return InsufficientFundsError when balance is low", async () => {
  const mockGetBalance = () => Effect.succeed(50);

  const program = pipe(
    processPayment("user-123", 100),
    Effect.provideService(BalanceService, { getBalance: mockGetBalance })
  );

  const result = await Effect.runPromise(Effect.either(program));

  // ✅ Type-safe assertions - no try-catch needed
  expect(result._tag).toBe("Left");
  expect(result.left._tag).toBe("InsufficientFundsError");
  expect(result.left.required).toBe(100);
  expect(result.left.available).toBe(50);
});
```

### Why this is better:

✅ **No try-catch in tests**: Just use `Effect.either`—Left for errors, Right for success  
✅ **Mocking is trivial**: Return `Effect.succeed` or `Effect.fail` directly—done  
✅ **Clear assertions**: Check the `_tag` and you're good to go  
✅ **Type-safe tests**: The compiler ensures you're testing the right error types  
✅ **Composition is easy**: Testing "step 2 fails but keep going" is straightforward

---

## Let's Put Them Side by Side

### Try-Catch

```typescript
// ❌ Hidden errors in signature
async function processPayment(userId: string, amount: number): Promise<PaymentResult>

// ❌ Manual instanceof checks
if (error instanceof InsufficientFundsError) { ... }

// ❌ Nested try-catch for branching
try { try { try { ... } catch { } } catch { } } catch { }

// ❌ Tests need try-catch
try { await fn(); fail(); } catch(e) { expect... }
```

### Effect

```typescript
// ✅ Errors explicit in signature
function processPayment(userId: string, amount: number): Effect<
  PaymentResult,
  InsufficientFundsError | PaymentGatewayError | ...
>

// ✅ Type-safe pattern matching
switch (error._tag) { case "InsufficientFundsError": ... }

// ✅ Linear composition with pipe
pipe(step1, Effect.flatMap(step2), Effect.flatMap(step3))

// ✅ Tests use Effect.either
const result = await Effect.runPromise(Effect.either(program))
```

---

## Key Takeaways

### Why Effect wins

Here's what you get with Effect that try-catch simply can't provide:

1. **Type Safety**: The compiler tracks your errors—no more guessing games
2. **Exhaustive Checking**: Forget to handle an error case? The compiler tells you
3. **Composability**: Linear, readable flow instead of nested try-catch pyramids
4. **Error Context**: All error information preserved and accessible throughout the chain
5. **Testability**: Clean, straightforward tests without try-catch boilerplate
6. **Maintainability**: Add an error type and the compiler shows you what needs updating
7. **Partial Failures**: Built-in patterns for "this can fail, but keep going anyway"

### The fundamental difference

> **Try-Catch**: Errors are side effects thrown imperatively. The type system has no idea they exist.
>
> **Effect**: Errors are values in the type system. The compiler tracks them like any other type.

**This isn't just a different syntax—it's a different way of thinking about errors that eliminates entire categories of production bugs.**

---

## Summary

| Aspect               | Try-Catch                     | Effect                               |
| -------------------- | ----------------------------- | ------------------------------------ |
| **Type Safety**      | ❌ No - errors hidden         | ✅ Yes - errors in signature         |
| **Exhaustiveness**   | ❌ Compiler can't help        | ✅ Compiler warns missing cases      |
| **Composition**      | ❌ Nested try-catch hell      | ✅ Linear pipe composition           |
| **Testing**          | ❌ Verbose try-catch in tests | ✅ Clean Effect.either tests         |
| **Error Context**    | ❌ Lost in catch blocks       | ✅ Preserved in error object         |
| **Partial Failures** | ❌ Difficult to express       | ✅ Built-in patterns (tap, catchAll) |
| **Maintainability**  | ❌ Manual call site updates   | ✅ Compiler finds all call sites     |

**Bottom line**: If you're building production applications with complex error flows (and who isn't?), Effect gives you compile-time safety that try-catch simply cannot provide. The time you invest learning Effect pays back quickly in fewer production bugs and easier maintenance.