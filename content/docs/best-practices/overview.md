---
title: Overview
---

This section goes over a set of techniques, principles and standards which can make your code simple, readable,
reliable, less error-prone and easier to understand, test, maintain, debug, extend and scale. You'll usually not be
working on a project alone. The easier you make it to reason about your code, the less time and cognitive resources you
and others have to spend on the coding part of things, leaving you with more of both for solving the actual problem for
which you are writing this code.

---

## General Practices

### Abstractions

Before looking at abstraction from a coding point of view what is a general definition of
abstraction, [Wiki](http://en.wikipedia.org/wiki/Abstraction) has a few definition

> Abstraction in its main sense is a conceptual process by which general rules and concepts are derived from the usage
> and classification of specific examples, literal (“real” or “concrete”) signifiers

> Conceptual abstractions may be formed by filtering the information content of a concept or an observable phenomenon,
> selecting only the aspects which are relevant for a particular purpose. For example, abstracting a leather soccer ball
> to the more general idea of a ball selects only the information on general ball attributes and behavior, eliminating the
> other characteristics of that particular ball

Abstraction – Computer Science

> In computer science, abstraction is a technique for managing complexity of computer systems. It works by establishing
> a level of complexity on which a person interacts with the system, suppressing the more complex details below the
> current level

> When abstraction proceeds into the operations defined, enabling objects of different types to be substituted, it is
> called polymorphism. When it proceeds in the opposite direction, inside the types or classes, structuring them to
> simplify a complex set of relationships, it is called delegation orinheritance.

[Code Complete 2](http://www.amazon.co.uk/gp/product/0735619670/ref=as_li_tl?ie=UTF8&camp=1634&creative=19450&creativeASIN=0735619670&linkCode=as2&tag=hsdcb-21&linkId=RRIEZMGTSDYM3OTS)
gives a clear definition of what an abstraction is

> Abstraction is the ability to view a complex operation in a simplified form. A class interface provides an abstraction
> of the implementation that’s hidden behind the interface

Abstractions are used regularly in everyday language, we use abstraction when talking about lots of things, such as

- Chair
- Table
- Computer
- Mobile Phone

These are abstract ideas which everyone understands but people don’t have a mobile phone, they have an exact make of
mobile phone but most people don’t talk about the exact type by the abstract type of mobile phone.

### **Data Abstraction And Control Abstractions**

While doing some research to write this article, I often saw people claiming that data abstraction was exclusive to OOP
paradigm. Well, it’s wrong.

**ADT as Data Abstractions**

A primitive data type (a data type made available directly by your programming language) is already an abstraction. For
example, the data type string is, to us, a collection of characters, but in memory the value of your variable will be a
bunch of bits.
In non oop languages we can still achieve the similar thing using Abstract Data Types also sometime called custom data
types

Data abstraction is usually meant to:

- Simplifying by hiding the complex memory management (for some language) and behavioral mechanisms.
- Providing general behaviors you can reuse everywhere.
- Giving the power for developers to create new abstractions with ADTs.

**Functions as control abstractions**

Nowadays, we are likely to work with structured programming languages, which allow us to use different structures to
create behaviors.

In most programming language, functions will be your control abstraction of choice. Yes, even in OOP.

Here’s why a function is an abstraction:

- The name of a function simplify and hide its internal mechanism. After all, when you call a function, you don’t really
  care about its implementation. Its name, its inputs and outputs (the function signature) should give you the details
  you need to use it when necessary.
- A function generalize a behavior: it can be reused anywhere, hopefully in a small defined scope.

**Classes and Objects as Both**

What happens then if you’re using your Objects? It doesn’t really matter if your internal properties change as long as
the methods still receive the same arguments and do the same thing as before. If something is wrong, you only need to
change it once.

Appropriate example would be: Vectors

### **Generalizing With Abstractions**

Every function and structures available as part of a programming language are generalizations. They define a concept you
can use everywhere, possibly in every application, even if they have nothing related to each other on the business
level. You need to use a loop? You can use the construct for, which generalize the concept of loops.

:::caution

It sounds obvious enough, but generalizing at the right level is really hard.

:::

Your code is more related to the reality of the business you work for. If you’re programming an e-commerce platform,
you’ll have to deal with products, orders, shipments, and customers, for example.

A company needs to adapt to its market and, therefore, possibly change very quickly its tactics and strategies. You need
to understand the business well in order to translate its concepts in your code and make them scalable. When you need to
generalize them, your understanding have to be even greater.

Indeed, modifying generalizations can be dangerous. If your abstractions are used everywhere, you need to be sure that
anything using them won’t break because of your changes. This is one of the biggest challenge in software engineering.

That’s **why you should not generalize up front**. When you code something, a piece of behavior which might be used
somewhere else in the future, so as you (or anybody else) think, don’t abstract it right away. Doing so would be only a
wild assumption, a guess, and guessing is not what you should do.

---

## Naming

### Avoid using magic numbers

Bad:

```javascript
// What the heck is 86400000 for?
setTimeout(blastOff, 86400000);
```

Good:

```javascript
// Declare them as capitalized named constants.
const MILLISECONDS_PER_DAY = 60 * 60 * 24 * 1000; //86400000;

setTimeout(blastOff, MILLISECONDS_PER_DAY);
```

### Use meaningful and pronounceable variable names

Bad:

```javascript
const yyyymmdstr = moment().format("YYYY/MM/DD");
```

Good:

```javascript
const currentDate = moment().format("YYYY/MM/DD");
```

### Name your variables/methods/classes/components appropriately

The name of your code components should highlight the purpose of the said component, rather than just being a
placeholder.

```ts
const items =
...
const total = processItems(items)
```

Compare that to

```ts
const receipts =
...
const totalDue = calculateDues(receipts)
```

---

```ts
const iva =
...
```

vs

```ts
const isVaccineAvailable =
...
```

---

Explicit is better than implicit

```python
result = [x for (x, y) in lst if y < 0.34]
```

```python
# In some other part of the code
const
SIMILARITY_THRESHOLD = 0.34

...

similarMovies = [movieId for (movieId, similarityScore) in nearestNeighbors if similarityScore < SIMILARITY_THRESHOLD]
```

While going through the code, one should know why a variable/method is here, and what kind of data/functionality it
represents.

### Don't add unneeded context

If your class/object name tells you something, don't repeat that in your variable name.

Bad:

```javascript
const Car = {
  carMake: "Honda",
  carModel: "Accord",
  carColor: "Blue",
};

function paintCar(car, color) {
  car.carColor = color;
}
```

Good:

```javascript
const Car = {
  make: "Honda",
  model: "Accord",
  color: "Blue",
};

function paintCar(car, color) {
  car.color = color;
}
```

---

## Functions

### Functions should do one thing only

This is by far the most important rule in software engineering. When functions do more than one thing, they are harder to compose, test, and reason about. When you can isolate a function to just one action, it can be refactored easily and your code will read much cleaner. If you take nothing else away from this guide other than this, you'll be ahead of many developers.

Bad:

```javascript
function emailClients(clients) {
  clients.forEach((client) => {
    const clientRecord = database.lookup(client);
    if (clientRecord.isActive()) {
      email(client);
    }
  });
}
```

Good:

```javascript
function emailActiveClients(clients) {
  clients.filter(isActiveClient).forEach(email);
}

function isActiveClient(client) {
  const clientRecord = database.lookup(client);
  return clientRecord.isActive();
}
```

### Function arguments (2 or fewer ideally)

Limiting the amount of function parameters is incredibly important because it makes testing your function easier. Having more than three leads to a combinatorial explosion where you have to test tons of different cases with each separate argument.

One or two arguments is the ideal case, and three should be avoided if possible. Anything more than that should be consolidated. Usually, if you have more than two arguments then your function is trying to do too much. In cases where it's not, most of the time a higher-level object will suffice as an argument.
Bad:

```javascript
function createMenu(title, body, buttonText, cancellable) {
  // ...
}

createMenu("Foo", "Bar", "Baz", true);
```

Good:

```javascript
function createMenu({ title, body, buttonText, cancellable }) {
  // ...
}

createMenu({
  title: "Foo",
  body: "Bar",
  buttonText: "Baz",
  cancellable: true,
});
```

### Don't use flags as function parameters

Flags tell your user that this function does more than one thing. Functions should do one thing. Split out your functions if they are following different code paths based on a boolean.

Bad:

```javascript
function createFile(name, temp) {
  if (temp) {
    fs.create(`./temp/${name}`);
  } else {
    fs.create(name);
  }
}
```

Good:

```javascript
function createFile(name) {
  fs.create(name);
}

function createTempFile(name) {
  createFile(`./temp/${name}`);
}
```

---

## Testing

Software Testing helps catching bugs early. Properly tested software product ensures reliability, security and high performance which further results in time saving, cost effectiveness and customer satisfaction.

Use White Box testing only when it is really needed and as an addition to Black Box testing, not the other way around.

It's all about investing only in the tests that yield the biggest return on your effort.

### Single concept per test

Bad:

```javascript
import assert from "assert";

describe("MomentJS", () => {
  it("handles date boundaries", () => {
    let date;

    date = new MomentJS("1/1/2015");
    date.addDays(30);
    assert.equal("1/31/2015", date);

    date = new MomentJS("2/1/2016");
    date.addDays(28);
    assert.equal("02/29/2016", date);

    date = new MomentJS("2/1/2015");
    date.addDays(28);
    assert.equal("03/01/2015", date);
  });
});
```

Good:

```javascript
import assert from "assert";

describe("MomentJS", () => {
  it("handles 30-day months", () => {
    const date = new MomentJS("1/1/2015");
    date.addDays(30);
    assert.equal("1/31/2015", date);
  });

  it("handles leap year", () => {
    const date = new MomentJS("2/1/2016");
    date.addDays(28);
    assert.equal("02/29/2016", date);
  });

  it("handles non-leap year", () => {
    const date = new MomentJS("2/1/2015");
    date.addDays(28);
    assert.equal("03/01/2015", date);
  });
});
```

---

## Error Handling

### Exceptions are for exceptional situations. Use Results

Complex domains usually have a lot of errors that are not exceptional, but a part of a business logic (like "seat already booked, choose another one"). Those errors may need special handling. In those cases returning explicit error types can be a better approach than throwing.

Returning an error instead of throwing explicitly shows a type of each exception that a method can return so you can handle it accordingly. It can make an error handling and tracing easier.

To help with that you can use some kind of Result object type with a Success or a Failure (an Either monad from functional languages like Haskell). Unlike throwing exceptions, this approach allows to define types for every error and will force you to handle those cases explicitly instead of using try/catch. For example:

```javascript
if (await userRepo.exists(command.email)) {
  throw new UserAlreadyExistsError();
}
const user = await this.userRepo.create(user);
return user;
```

Good

```javascript
if (await userRepo.exists(command.email)) {
  return Result.err(new UserAlreadyExistsError()); // <- returning an Error
}
// else
const user = await this.userRepo.create(user);
return Result.ok(user);
```

Returning errors instead of throwing them adds some extra boilerplate code, but can make your application more robust and secure.

Reference

- [Handling Failures Without Exceptions](https://livebook.manning.com/book/secure-by-design/chapter-9/51)

---

## Documentation

Here are some useful tips to help users/other developers to use your program.

### Write self-documenting code

Code can be self-documenting to some degree. One useful trick is to separate complex code to smaller chunks with a descriptive name. For example:

- Separating a big function into a bunch of small ones with descriptive names, each with a single responsibility;
- Moving in-line primitives or hard to read conditionals into a variable with a descriptive name.
  This makes code easier to understand and maintain.

Bad:

```javascript
function addToDate(date, month) {
  // ...
}
const date = new Date();

// It's hard to tell from the function name what is added
addToDate(date, 1);
```

Good:

```javascript
function addMonthToDate(month, date) {
  // ...
}

const date = new Date();
addMonthToDate(1, date);
```

### Prefer statically typed languages

Types give useful semantic information to a developer and can be useful for creating self-documenting code. Good code should be easy to use correctly, and hard to use incorrectly. Types system can be a good help for that. It can prevent some nasty errors at a compile time, so IDE will show type errors right away.

Applications written using statically typed languages are usually easier to maintain, more scalable and better suited for large teams.

### Avoid useless comments

Comments are an apology, not a requirement. Good code mostly documents itself.

Bad:

```javascript
function hashIt(data) {
  // The hash
  let hash = 0;

  // Length of string
  const length = data.length;

  // Loop through every character in data
  for (let i = 0; i < length; i++) {
    // Get character code.
    const char = data.charCodeAt(i);
    // Make the hash
    hash = (hash << 5) - hash + char;
    // Convert to 32-bit integer
    hash &= hash;
  }
}
```

Good:

```javascript
function hashIt(data) {
  let hash = 0;
  const length = data.length;

  for (let i = 0; i < length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;

    // Convert to 32-bit integer
    hash &= hash;
  }
}
```

### Add Readme

Lets be honest communication is harder and inefficient. A simple litmus test for maintaining documentation is how easy it is for new commer to setup and understand codebase.

## Know when to break/compromise on these rules

Coding guidelines vary across different contexts. Depending on your programming language or problem domain, there may be
different coding guidelines for naming conventions, coding style, indentation, and file structures. Be mindful of your
project’s individual needs and honor those coding standards when you can. It doesn't make sense to sacrifice speed for
the sake of readability in a real-time application where a millisecond latency incurs significant costs. The same is
true the other way round. In most projects, adding a few (hundred) milliseconds of delay is worth it if it helps keep
the project simple and improves the developer experience.
