---
title: "Error Handling in MVC Architecture with Effect"
---

This guide shows you how to handle errors properly in an MVC application using Effect. We assume you've already read the "Monads vs Try-Catch" document and understand why Effect is better than try-catch.

Now let's see how to apply that knowledge to build a production-ready API with proper error handling at every layer.

---

## The API We're Building

We're building one complete endpoint: **Borrow a book**

**Endpoint:** `POST /api/books/:bookId/borrow`

**Request Body:**

```json
{
  "userId": "user-123"
}
```

**Success Response (200):**

```json
{
  "lendingId": "lending-456",
  "bookTitle": "The Hobbit",
  "dueDate": "2025-12-01T00:00:00Z"
}
```

**Business Rules:**

1. User must exist in the database
2. Book must exist in the database
3. Book must be available (not already borrowed)
4. User cannot borrow more than 3 books at a time
5. Create a lending record with a 14-day due date

**The Flow:**

```
HTTP Request
    ↓
Route Handler
    ↓
Controller (coordinates the request)
    ↓
Service (business logic)
    ↓
Repository (database access)
    ↓
Database
```

Let's build this layer by layer, handling errors properly at each level.

---

## The Architecture Overview

Before we dive into code, here's how the layers work together:

### Layer 1: Repository (Data Access)

- **Responsibility**: Talk to the database
- **Errors it produces**: `DatabaseError`
- **Returns**: `Effect<Data, DatabaseError>`

### Layer 2: Service (Business Logic)

- **Responsibility**: Validate business rules, orchestrate repository calls
- **Errors it produces**: `NotFoundError`, `BookNotAvailableError`, `BorrowLimitExceededError`, `ServiceError` (mapped from DatabaseError)
- **Errors it receives**: `DatabaseError` from repositories
- **Returns**: `Effect<Result, DomainError>`
- **Key point**: Maps `DatabaseError` to `ServiceError` so upper layers don't know about database

### Layer 3: Controller (Request/Response)

- **Responsibility**: Validate input, call service, format response
- **Errors it produces**: `ParseError` (from schema validation)
- **Errors it receives**: Domain errors from service (no `DatabaseError`)
- **Returns**: Sends HTTP response

### Layer 4: Error Middleware

- **Responsibility**: Convert all errors to HTTP responses
- **Errors it receives**: All errors from controller
- **Returns**: JSON error response with appropriate status code

Now let's build each layer.

---

## Step 1: Define Your Errors

First, define all the errors that can happen in your application. Group them by concern.

```typescript
// errors/AppErrors.ts
import { Data } from "effect";

// ============================================================================
// Database Errors (Repository Layer)
// ============================================================================

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  readonly operation: string; // e.g., "findById", "insert", "update"
  readonly table: string; // e.g., "books", "users"
  readonly cause?: string; // Original error message
}> {}

// ============================================================================
// Domain Errors (Service Layer)
// ============================================================================

export class UserNotFoundError extends Data.TaggedError("UserNotFoundError")<{
  readonly userId: string;
}> {}

export class BookNotFoundError extends Data.TaggedError("BookNotFoundError")<{
  readonly bookId: string;
}> {}

export class BookNotAvailableError extends Data.TaggedError(
  "BookNotAvailableError"
)<{
  readonly bookId: string;
  readonly bookTitle: string;
}> {}

export class BorrowLimitExceededError extends Data.TaggedError(
  "BorrowLimitExceededError"
)<{
  readonly userId: string;
  readonly currentCount: number;
  readonly maxAllowed: number;
}> {}

export class ServiceError extends Data.TaggedError("ServiceError")<{
  readonly message: string;
  readonly operation: string;
}> {}
```

**Why this structure?**

- Each layer knows what errors it can produce
- Errors carry relevant context (IDs, counts, etc.)
- Tagged errors enable type-safe pattern matching
- Errors flow up the stack—each layer handles or passes them along

---

## Step 2: Repository Layer (Database Access)

The repository layer is the lowest level—it talks to the database. Every database operation can fail, so we wrap them in Effects that can fail with `DatabaseError`.

### Define the entities

```typescript
// entities/Book.ts
export class Book {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly isAvailable: boolean
  ) {}
}

// entities/User.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string
  ) {}
}

// entities/Lending.ts
export class Lending {
  constructor(
    public readonly id: string,
    public readonly bookId: string,
    public readonly userId: string,
    public readonly borrowedAt: Date,
    public readonly dueDate: Date
  ) {}
}
```

### Build the repositories

Here's where we interact with the database. You might notice we're using `Effect.tryPromise`—let's clarify what this does.

**Why `Effect.tryPromise` is NOT the same as try-catch:**

Traditional promises throw errors imperatively. When you call `db.query()`, it returns a `Promise` that might reject. If we called it directly, those errors would be thrown at runtime with no type safety.

`Effect.tryPromise` converts a throwing Promise into a typed Effect:

- The **success** path becomes the Effect's success type
- The **rejection** is caught and transformed into a typed error
- The result is `Effect<Success, Error>` where the compiler knows both types

**Key difference from try-catch:**

- Try-catch: Errors are hidden, caught imperatively at runtime
- `Effect.tryPromise`: Errors are transformed into typed values that the compiler tracks

Think of it as **bridging the gap** between the untyped Promise world (database drivers, HTTP clients) and the type-safe Effect world.

```typescript
// repositories/BookRepository.ts
import { Effect } from "effect";
import { DatabaseError } from "../errors/AppErrors";
import { Book } from "../entities/Book";

export class BookRepository {
  constructor(private db: Database) {}

  // Find a book by ID
  findById(id: string): Effect.Effect<Book | null, DatabaseError> {
    // Effect.tryPromise converts a Promise (which might reject)
    // into an Effect with a typed error
    return Effect.tryPromise({
      try: async () => {
        // This database call returns a Promise that might reject
        const row = await this.db.query(
          "SELECT id, title, is_available FROM books WHERE id = ?",
          [id]
        );

        if (!row) return null;

        return new Book(row.id, row.title, row.is_available);
      },
      // Instead of catching any error at runtime,
      // we transform it into our typed DatabaseError
      catch: (error) =>
        new DatabaseError({
          operation: "findById",
          table: "books",
          cause: String(error),
        }),
    });
  }

  // Update book availability
  updateAvailability(
    bookId: string,
    isAvailable: boolean
  ): Effect.Effect<void, DatabaseError> {
    return Effect.tryPromise({
      try: () =>
        this.db.query("UPDATE books SET is_available = ? WHERE id = ?", [
          isAvailable,
          bookId,
        ]),
      catch: (error) =>
        new DatabaseError({
          operation: "updateAvailability",
          table: "books",
          cause: String(error),
        }),
    });
  }
}
```

```typescript
// repositories/UserRepository.ts
import { Effect } from "effect";
import { DatabaseError } from "../errors/AppErrors";
import { User } from "../entities/User";

export class UserRepository {
  constructor(private db: Database) {}

  findById(id: string): Effect.Effect<User | null, DatabaseError> {
    return Effect.tryPromise({
      try: async () => {
        const row = await this.db.query(
          "SELECT id, name, email FROM users WHERE id = ?",
          [id]
        );

        if (!row) return null;

        return new User(row.id, row.name, row.email);
      },
      catch: (error) =>
        new DatabaseError({
          operation: "findById",
          table: "users",
          cause: String(error),
        }),
    });
  }
}
```

```typescript
// repositories/LendingRepository.ts
import { Effect } from "effect";
import { DatabaseError } from "../errors/AppErrors";
import { Lending } from "../entities/Lending";

export class LendingRepository {
  constructor(private db: Database) {}

  // Count how many books a user currently has borrowed
  countActiveByUserId(userId: string): Effect.Effect<number, DatabaseError> {
    return Effect.tryPromise({
      try: async () => {
        const result = await this.db.query(
          "SELECT COUNT(*) as count FROM lendings WHERE user_id = ? AND returned_at IS NULL",
          [userId]
        );
        return result.count;
      },
      catch: (error) =>
        new DatabaseError({
          operation: "countActiveByUserId",
          table: "lendings",
          cause: String(error),
        }),
    });
  }

  // Create a new lending record
  create(lending: Lending): Effect.Effect<void, DatabaseError> {
    return Effect.tryPromise({
      try: () =>
        this.db.query(
          "INSERT INTO lendings (id, book_id, user_id, borrowed_at, due_date) VALUES (?, ?, ?, ?, ?)",
          [
            lending.id,
            lending.bookId,
            lending.userId,
            lending.borrowedAt,
            lending.dueDate,
          ]
        ),
      catch: (error) =>
        new DatabaseError({
          operation: "create",
          table: "lendings",
          cause: String(error),
        }),
    });
  }
}
```

**Key points about the repository layer:**

- Every database operation returns `Effect<Data, DatabaseError>`
- Use `Effect.tryPromise` to convert Promises into typed Effects.
- **This is NOT try-catch**: Errors become typed values, tracked by the compiler, composable with Effect
- Database libraries return Promises (untyped errors) → we make them type-safe
- Return `null` when data not found (not an error at this layer)
- Include operation name and table in the error for debugging

## Step 3: Service Layer (Business Logic)

The service layer contains your business logic. It uses repositories to fetch data, validates business rules, and orchestrates operations.

### Define the service

```typescript
// services/BookService.ts
import { Effect, pipe } from "effect";
import {
  BookNotFoundError,
  UserNotFoundError,
  BookNotAvailableError,
  BorrowLimitExceededError,
  DatabaseError,
} from "../errors/AppErrors";
import { BookRepository } from "../repositories/BookRepository";
import { UserRepository } from "../repositories/UserRepository";
import { LendingRepository } from "../repositories/LendingRepository";
import { Lending } from "../entities/Lending";

export class BookService {
  constructor(
    private bookRepo: BookRepository,
    private userRepo: UserRepository,
    private lendingRepo: LendingRepository
  ) {}

  borrowBook(
    bookId: string,
    userId: string
  ): Effect.Effect<
    { lendingId: string; bookTitle: string; dueDate: Date },
    | BookNotFoundError
    | UserNotFoundError
    | BookNotAvailableError
    | BorrowLimitExceededError
    | ServiceError
  > {
    return pipe(
      // Step 1: Load book and user in parallel
      Effect.all({
        book: this.bookRepo.findById(bookId),
        user: this.userRepo.findById(userId),
        activeCount: this.lendingRepo.countActiveByUserId(userId),
      }),

      // Map DatabaseError to ServiceError (hide DB details from upper layers)
      Effect.mapError(
        (dbError) =>
          new ServiceError({
            message: "Failed to fetch data",
            operation: "borrowBook",
          })
      ),

      // Step 2: Validate book exists
      Effect.flatMap(({ book, user, activeCount }) =>
        book
          ? Effect.succeed({ book, user, activeCount })
          : Effect.fail(new BookNotFoundError({ bookId }))
      ),

      // Step 3: Validate user exists
      Effect.flatMap(({ book, user, activeCount }) =>
        user
          ? Effect.succeed({ book, user, activeCount })
          : Effect.fail(new UserNotFoundError({ userId }))
      ),

      // Step 4: Validate book is available
      Effect.filterOrFail(
        ({ book }) => book.isAvailable,
        ({ book }) =>
          new BookNotAvailableError({
            bookId: book.id,
            bookTitle: book.title,
          })
      ),

      // Step 5: Validate borrow limit
      Effect.filterOrFail(
        ({ activeCount }) => activeCount < 3,
        ({ activeCount }) =>
          new BorrowLimitExceededError({
            userId,
            currentCount: activeCount,
            maxAllowed: 3,
          })
      ),

      // Step 6: Create lending record
      Effect.flatMap(({ book, user }) => {
        const lendingId = crypto.randomUUID();
        const borrowedAt = new Date();
        const dueDate = new Date(borrowedAt);
        dueDate.setDate(dueDate.getDate() + 14); // 14-day loan

        const lending = new Lending(
          lendingId,
          book.id,
          user.id,
          borrowedAt,
          dueDate
        );

        return pipe(
          // Mark book as unavailable
          this.bookRepo.updateAvailability(book.id, false),

          // Then create the lending record
          Effect.flatMap(() => this.lendingRepo.create(lending)),

          // Map any DatabaseError to ServiceError
          Effect.mapError(
            (dbError) =>
              new ServiceError({
                message: "Failed to create lending",
                operation: "createLending",
              })
          ),

          // Return success response
          Effect.map(() => ({
            lendingId,
            bookTitle: book.title,
            dueDate,
          }))
        );
      })
    );
  }
}
```

**Key points:**

- Function signature shows only domain errors (no `DatabaseError`)
- Use `Effect.mapError` to transform `DatabaseError` → `ServiceError`
- Controller doesn't need to know about database implementation
- Use `Effect.all` to load multiple things in parallel
- Functional validation with ternary and `Effect.filterOrFail`

**Error mapping:**

- `DatabaseError` from repository → map to `ServiceError`
- `null` from repository → `NotFoundError`
- Business rule violation → specific domain error

---

## Step 4: Controller Layer (Request/Response)

The controller validates the HTTP request, calls the service, and handles the Effect result.

### Define input schemas

```typescript
// schemas/BorrowBookSchema.ts
import { Schema as S } from "effect";

export const BorrowBookParams = S.Struct({
  bookId: S.String.pipe(
    S.minLength(1, { message: () => "Book ID is required" }),
    S.maxLength(100)
  ),
});

export const BorrowBookBody = S.Struct({
  userId: S.String.pipe(
    S.minLength(1, { message: () => "User ID is required" }),
    S.maxLength(100)
  ),
});

export type BorrowBookParamsType = S.Schema.Type<typeof BorrowBookParams>;
export type BorrowBookBodyType = S.Schema.Type<typeof BorrowBookBody>;
```

### Build the controller

```typescript
// controllers/BookController.ts
import { Effect, pipe } from "effect";
import { Schema as S } from "effect";
import { BookService } from "../services/BookService";
import { BorrowBookParams, BorrowBookBody } from "../schemas/BorrowBookSchema";

export class BookController {
  constructor(private bookService: BookService) {}

  async borrowBook(req: Request, res: Response, next: NextFunction) {
    const program = pipe(
      // Step 1: Validate request params and body
      Effect.all({
        params: S.decodeUnknown(BorrowBookParams)(req.params),
        body: S.decodeUnknown(BorrowBookBody)(req.body),
      }),

      // Step 2: Call service with validated input
      Effect.flatMap(({ params, body }) =>
        this.bookService.borrowBook(params.bookId, body.userId)
      )
    );

    // Execute the Effect
    const result = await Effect.runPromise(Effect.either(program));

    if (result._tag === "Left") {
      // Pass error to error middleware
      next(result.left);
    } else {
      // Return success response
      res.status(200).json(result.right);
    }
  }
}
```

**Key points:**

- Validate input with Effect Schema at the controller boundary
- Schema validation produces `ParseError` if input is invalid
- Use `Effect.either` to get `Left` (error) or `Right` (success)
- Pass errors to Express error middleware with `next(error)`
- Controller doesn't know about specific error types—just passes them along

**Error flow at this point:**

- Schema validation fails → `ParseError`
- Service returns error → Pass to middleware
- Service succeeds → Return 200 with JSON

---

## Step 5: Error Middleware (HTTP Mapping)

The error middleware is the final layer. It takes all possible errors and converts them to appropriate HTTP responses.

```typescript
// middleware/errorHandler.ts
import { Schema as S } from "effect";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Don't handle if response already sent
  if (res.headersSent) {
    return next(error);
  }

  // Handle tagged errors from our application
  if (typeof error === "object" && error !== null && "_tag" in error) {
    switch ((error as any)._tag) {
      // ============================================================
      // 400 - Bad Request (Validation Errors)
      // ============================================================
      case "ParseError": {
        const parseError = error as S.ParseError;
        return res.status(400).json({
          error: "ValidationError",
          message: "Invalid request data",
          details: formatParseError(parseError),
        });
      }

      // ============================================================
      // 404 - Not Found
      // ============================================================
      case "BookNotFoundError": {
        const err = error as any;
        return res.status(404).json({
          error: "BookNotFound",
          message: `Book with ID "${err.bookId}" not found`,
        });
      }

      case "UserNotFoundError": {
        const err = error as any;
        return res.status(404).json({
          error: "UserNotFound",
          message: `User with ID "${err.userId}" not found`,
        });
      }

      // ============================================================
      // 409 - Conflict (Business Rule Violations)
      // ============================================================
      case "BookNotAvailableError": {
        const err = error as any;
        return res.status(409).json({
          error: "BookNotAvailable",
          message: `The book "${err.bookTitle}" is currently unavailable`,
          details: {
            bookId: err.bookId,
          },
        });
      }

      case "BorrowLimitExceededError": {
        const err = error as any;
        return res.status(409).json({
          error: "BorrowLimitExceeded",
          message: `You have reached the maximum of ${err.maxAllowed} borrowed books (you currently have ${err.currentCount})`,
          details: {
            currentCount: err.currentCount,
            maxAllowed: err.maxAllowed,
          },
        });
      }

      // ============================================================
      // 500 - Internal Server Error
      // ============================================================
      case "ServiceError": {
        const err = error as any;
        console.error("Service error:", err);
        return res.status(500).json({
          error: "InternalServerError",
          message: "An unexpected error occurred",
        });
      }

      case "DatabaseError": {
        const err = error as any;
        console.error("Database error:", err);

        // Don't expose internal details in production
        if (process.env.NODE_ENV === "production") {
          return res.status(500).json({
            error: "InternalServerError",
            message: "An unexpected error occurred",
          });
        }

        return res.status(500).json({
          error: "DatabaseError",
          message: "A database error occurred",
          details: {
            operation: err.operation,
            table: err.table,
          },
        });
      }
    }
  }

  // Unknown error - log it and return generic 500
  console.error("Unexpected error:", error);
  res.status(500).json({
    error: "InternalServerError",
    message: "An unexpected error occurred",
  });
}

// Helper to format Effect Schema ParseErrors
function formatParseError(error: S.ParseError): Record<string, string> {
  // Simplified - in production you'd traverse the error tree
  return {
    message: error.message || "Validation failed",
  };
}
```

**Key points:**

- One centralized place maps all errors to HTTP responses
- Use `_tag` for type-safe error handling
- Map errors to appropriate status codes:
  - 400 → Validation errors
  - 404 → Resource not found
  - 409 → Business rule violations
  - 500 → Infrastructure failures
- Don't expose internal details in production
- Unknown errors get logged and return generic 500

---

## Step 6: Wire It All Together

Now connect all the layers in your Express app.

```typescript
// app.ts
import express from "express";
import { BookController } from "./controllers/BookController";
import { BookService } from "./services/BookService";
import {
  BookRepository,
  UserRepository,
  LendingRepository,
} from "./repositories";
import { errorHandler } from "./middleware/errorHandler";
import { db } from "./database";

const app = express();
app.use(express.json());

// Initialize repositories
const bookRepo = new BookRepository(db);
const userRepo = new UserRepository(db);
const lendingRepo = new LendingRepository(db);

// Initialize service
const bookService = new BookService(bookRepo, userRepo, lendingRepo);

// Initialize controller
const bookController = new BookController(bookService);

// Define routes
app.post("/api/books/:bookId/borrow", (req, res, next) =>
  bookController.borrowBook(req, res, next)
);

// Error handling middleware (MUST be last)
app.use(errorHandler);

export default app;
```

---

## The Complete Error Flow

Let's trace what happens when errors occur:

### Scenario 1: Book doesn't exist

```
1. Request: POST /api/books/book-999/borrow { userId: "user-1" }

2. Controller validates input ✅

3. Service calls bookRepo.findById("book-999")

4. Repository queries database → returns null

5. Service checks: if (!book) → Effect.fail(BookNotFoundError)

6. Controller receives Left(BookNotFoundError)

7. Controller calls next(BookNotFoundError)

8. Error middleware catches it:
   - Sees _tag === "BookNotFoundError"
   - Returns 404 with message

9. Response: 404 { error: "BookNotFound", message: "Book with ID 'book-999' not found" }
```

### Scenario 2: User has too many books

```
1. Request: POST /api/books/book-1/borrow { userId: "user-1" }

2. Controller validates input ✅

3. Service loads: book ✅, user ✅, activeCount = 3

4. Service checks: if (activeCount >= 3) → Effect.fail(BorrowLimitExceededError)

5. Controller receives Left(BorrowLimitExceededError)

6. Error middleware catches it:
   - Sees _tag === "BorrowLimitExceededError"
   - Returns 409 with details

7. Response: 409 { error: "BorrowLimitExceeded", message: "You have reached...", details: {...} }
```

### Scenario 3: Database connection fails

```
1. Request: POST /api/books/book-1/borrow { userId: "user-1" }

2. Controller validates input ✅

3. Service calls bookRepo.findById("book-1")

4. Repository returns Effect.fail(DatabaseError)

5. Service's mapError transforms: DatabaseError → ServiceError

6. Controller receives Left(ServiceError)

7. Error middleware catches ServiceError → returns 500

8. Response: 500 { error: "InternalServerError", message: "An unexpected error occurred" }
```

### Scenario 4: Invalid input

```
1. Request: POST /api/books//borrow { userId: "" }

2. Controller validates input:
   - S.decodeUnknown(BorrowBookParams)({ bookId: "" }) → ParseError
   - Schema validation fails

3. Controller receives Left(ParseError)

4. Error middleware catches it:
   - Sees _tag === "ParseError"
   - Returns 400 with validation details

5. Response: 400 { error: "ValidationError", message: "Invalid request data", details: {...} }
```

---

## Summary: Error Handling by Layer

| Layer                | Responsibility   | Errors Produced                | Errors Received       | What to Do                                |
| -------------------- | ---------------- | ------------------------------ | --------------------- | ----------------------------------------- |
| **Repository**       | Database access  | `DatabaseError`                | None                  | Wrap DB calls in `Effect.tryPromise`      |
| **Service**          | Business logic   | Domain errors + `ServiceError` | `DatabaseError`       | Map `DatabaseError` to `ServiceError`     |
| **Controller**       | Request handling | `ParseError`                   | Domain + ServiceError | Validate input, pass errors to middleware |
| **Error Middleware** | HTTP responses   | None                           | All controller errors | Map `_tag` to HTTP status codes           |

### Key Principles

1. **Each layer has a clear responsibility**

   - Repository: database access only
   - Service: business logic only
   - Controller: request/response coordination only
   - Middleware: error-to-HTTP mapping only

2. **Errors are mapped at each layer**

   - Repository: `DatabaseError`
   - Service: Maps `DatabaseError` → `ServiceError` (hides DB details)
   - Controller: Only sees domain errors + `ServiceError` (no `DatabaseError`)
   - Middleware: Converts all errors to HTTP responses

3. **Type safety at every step**

   - Function signatures show all possible errors
   - Compiler ensures you handle every error type
   - No surprises at runtime

4. **Composability through Effect**

   - Use `pipe` and `flatMap` to chain operations
   - Errors propagate automatically
   - Clean, linear code flow

5. **Centralized error handling**
   - One middleware handles all error-to-HTTP mapping
   - Consistent error responses across entire API
   - Easy to change error format in one place

**Bottom line**: With Effect and proper layering, error handling becomes predictable, type-safe, and maintainable. Each layer knows exactly what it's responsible for, and the compiler ensures you handle every possible error case.