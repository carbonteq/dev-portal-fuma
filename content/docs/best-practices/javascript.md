---
title: JavaScript/Typescript
---

## General Practices for JS and TS

### Make use of ES6+ features

[ES6](https://262.ecma-international.org/6.0/) (and subsequent updates) added a lot of features to Javascript/Ecmascript with the goal of making it a proper programming language and not something that was [written in 10 days](https://www.computer.org/csdl/magazine/co/2012/02/mco2012020007/13rRUy08MzA). All jokes aside, these updates truly do improve the developer experience quite a lot, and you spend less time fighting with the language and all its hidden caveats, and more on solving whatever you set out to solve.

Some key features introduced in these updates include classes (all hail Java), [arrow functions](https://www.digitalocean.com/community/tutorials/understanding-arrow-functions-in-javascript), [modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) vs [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const), [spread operator](https://developer.mozilla.org/en-US/docs/web/javascript/reference/operators/spread_syntax), [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) and [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). You'll find more detail on some of these features (and others not mentioned here) in the subsequent sections, along with the reasons to use them.

### Var ❌ Let/Const ✅

Declaring a variable with `var`, as was done in the olden days of JS, has the potential of introducing side effects. You declare a variable with `var` at some point in your code, and then inadvertently reassign it in some place later, leading to embarrassing runtime errors.

Using `let` for declaring re-bindable variables, and `const` for declaring constants will not only make your code readable, but will also lead to such errors as outlined above being caught at compile (/transpile) time. Prefer using `const` when declaring variables unless the variables is to be redefined (or needs to be used in a nested scope). If you think it has to be redefined, think again of some better approach, as the program design that leads to such a situation can often be made better. And if there is no other way, try to keep the part where you are redefining the variable as close to the original declaration as possible.

### Arrow Functions

Another great feature introduced by ES6 was arrow functions, which allow us to define a function quite concisely.

```ts
function oldStyle(param1: string, param2: int): string {
  // ...

  return "placeholder";
}

const arrowFunc = (param1: string, param2: int): string => {
  // ...

  return "placeholder";
};

// Can also define without '{}'
const arrowFunc2 = (param1: string, param2: int) => "placeholder";

// No need for '()' in the function signature if there's a single parameter
const singleParamFunc = (user) => processUser(user);

// Returning an object requires surrounding the object braces '{}' with brackets '()'
const concatProps = (name: string, id: UUID) => ({ name, id });
```

Even though we can remove the brackets from the arrow function in case of a single parameter, it is generally better to include the brackets, especially when using Typescript.
One (kinda technical) thing to keep in mind though is that you cannot use `this` inside an arrow function. There are multiple reasons for this (one of them being to keep arrow functions 'pure') which you can go through using Google or the relevant [MDN page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).

You'll find more examples and use-cases of arrow functions in the sections below.

### Prefer async-await / Promise API to Callbacks

You might have seen something like this in a tutorial, or some JS/TS program out in the wild. Or you might have heard of the term "Callback Hell".

```ts title="Callback Hell"
const getUserProfiles = (userId, processUserProfiles) => {
  getUserFromDb(userId, (user) => {
    fetchUserProfiles(user, (userProfiles) => {
      // can't return here, so if we want to do something with userProfiles, we need a callback argument in getUserProfiles.
      processUserProfiles(userProfiles);
    });
  });
};
```

You can see how the complexity of such code can increase dramatically. And if we add error handling (onError callbacks), things really get out of hand. Code like this is not only difficult to reason about, but also more difficult to debug, as it doesn't provide good stack traces in the errors. Imagine staying up the whole night trying to fix the production server, attempting to find the bug by going through the logs, and the error stack trace being all confusing and you banging you head on the wall/table (whichever one you prefer) in frustration. Good error handling would of course help you there, but one core component of good error handling is to make those errors easier to catch (and handle).

A better approach would be to use promises

```ts title="Promise based Solution"
const getUserProfiles = (userId, processUserProfiles) => {
  getUserFromDb(userId)
    .then((user) => fetchUserProfiles(user))
    .then((userProfiles) => processUserProfiles(userProfiles))
    .catch((err) => {
      // handle the error here
    });
};
```

Or, even better, async-await.

```ts title="Async-Await Solution"
const getUserProfiles = async (userId) => {
  try {
    const user = await getUserFromDb(userId);
    const userProfiles = await fetchUserProfiles(user);

    return userProfiles;
  } catch (err) {
    // handle err
  }
};

const userProfiles = await getUserProfiles(userId);
await processUserProfiles(userProfiles);
```

But what if you are working with a third-party package and their API is callback based (it happens quite often). Well, there's a simple and nifty way to wrap a callback based function with Promises, enabling us to use the Promise API and async-await (whichever convention is being followed in your current project).

```ts title="Callback Based"
const thirdPartyFunc = (options, onSuccess, onError) => {
  // ...
};
```

```ts title="Promise Wrapper"
const promiseWrapper = (options) => {
  return new Promise((resolve, reject) => {
    thirdPartyFunc(
      options,
      (result) => {
        // onSuccess
        resolve(result);
      },
      (err) => {
        // onError
        reject(err);
      }
    );
  });
};
```

You can find more info on async-await and Promises in the resources section.

### Use default arguments instead of short-circuiting or conditional statements

Consider the following code.

```ts
const SOME_DEFAULT_NAME = "some default name";
// ...
const createSomething = (/*...otherArgs,*/ name: string | undefined) => {
  const somethingName = name || SOME_DEFAULT_NAME;
  // ...
};
```

There are a couple of problems with this piece of code. Firstly, even if the caller knows that name is an optional argument, they would not know the default value for it unless they read the source for it, leading to an unnecessary context jump. Moreover, what if we want to allow (for some reason) passing an empty string for the name. It will be replaced by `DEFAULT_SOMETHING_NAME` as it is a falsy value in JS. Most importantly though, the function signature `(name: string | undefined)` doesn't really convey our intention regarding what we'll do when no value is provided for name. Maybe we'll replace it with the default value (as is the case above). Maybe we'll compute a value based on some other parameters or program state. Maybe we'll issue a command to set the server on fire. Who knows?

A much simpler and better approach would be to use a default argument.

```ts
const SOME_DEFAULT_NAME = "some default name";
// ...
const createSomething = (
  /*...otherArgs,*/ somethingName: string = SOME_DEFAULT_NAME
) => {
  // ...
};
```

This won't take care of cases where we want to compute the value for this argument based on some other arguments, but the caller would know whether we are using some default value for this argument (and which value) or not.

### String interpolation with [Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

Use template literals for formatting strings instead of using concatenation. This not only makes the code more readable but also more performant. As an added bonus, you can evaluate expressions inside the formatting braces, need to focus less on escaping quotes, and are also able to use them as [template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) for a better type system, and with template functions as [tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates).

```ts title="String Concatenation - Bad"
const dbURI =
  "mysql://" +
  dbUser +
  ":" +
  dbPass +
  "@" +
  dbHost +
  ":" +
  dbPort +
  "/" +
  dbName;
```

```ts title="Using Template Literals"
const dbURI = `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
```

### "for … of" Loops

Suppose you have to iterate over every element of an iterable (like an array). One way to do that would be:

```ts
const arr = [9, 6, 102, 23];

for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

In such cases, you can either use the [`forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) method (but you can't return from inside the `forEach` method, at least not in the way you want to) or you can use the `for ... of` syntax.

```ts
const arr = [9, 6, 102, 23];

arr.forEach((arrElem) => {
  console.log(arrElem);
});

for (const arrElem of arr) {
  console.log(arrElem);
}
```

### Null-ish coalescing ('??')

You might have seen boolean short-circuiting before, usually used to provide a default value in cases where the input is `null` or `undefined`. The problem with that method is that it would evaluate to use default value not only for `null` and `undefined` but for all falsy values.

```ts
const printItem = (item: any) => console.log(item || "Missing");

printItem(null); // Correct - prints "Missing"
printItem("abc"); // Correct - prints "abc"
printItem(undefined); // Correct - prints "Missing"
printItem(123); // Correct - prints "123"

printItem(0); // Incorrect - prints "Missing"
printItem(""); // Incorrect - prints "Missing"
printItem(false); // Incorrect - prints "Missing"
printItem(NaN); // Incorrect - prints "Missing"
```

You can fix this kind of problem easily via [null-ish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator).

```ts
// Replaced '||' with '??'
const printItem = (item: any) => console.log(item ?? "Missing");

printItem(null); // Correct - prints "Missing"
printItem("abc"); // Correct - prints "abc"
printItem(undefined); // Correct - prints "Missing"
printItem(123); // Correct - prints "123"

printItem(0); // Incorrect - prints "Missing"
printItem(""); // Incorrect - prints "Missing"
printItem(false); // Incorrect - prints "Missing"
printItem(NaN); // Incorrect - prints "Missing"
```

You can also use it in conjunction with the assignment operator (`x ??= y`), just like you use `||=` and `&&=`.

### Optional Chaining

Imagine a deeply nested data structure, like a user object. Suppose you want to get the `email` and `phoneNumber` of the person's contact info.

```ts
const person = {
  // ...
  contact: {
    // ...
    email: "some@email.dev",
    phone: "1234567890",
  },
};

console.log(person.contact.email, person.contact.phone);
```

The problem though is that the contact property may not be present on the person. Trying to access `person.contact.name` in such a case would throw `TypeError`.

Developers used to overcome this problem by adding explicit checks, something like `var email = person && person.contact && person.contact.email`. You can see how cumbersome it is to perform such checks, and how ugly the code becomes with them. We can perform the same using [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining).

```ts
const person1 = {
  // ...
  contact: {
    // ...
    email: "some@email.dev",
    phone: "1234567890",
  },
};

const person2 = {
  // ...
};

console.log(person1?.contact?.email); // would print "some@email.dev"
console.log(person2?.contact?.email); // would print undefined
```

### Object and Array Destructuring

[Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) allows you to extract/unpack values from an array/object.

```ts title="Array Destructuring Example"
const [a, b, c] = [1, 2, 4]; // a=1, b=2, c=4
```

Quite simple. The only thing you'll need to take care of is making sure the number of elements on the left side of the assignment operator equals the number of elements on the right side (_there's a way around that using the `rest` syntax, which you'll see in the next section_).

Much more useful is object destructuring, where you can extract specific properties from an object, even the deeply nested ones.

```ts title="Object Destructuring Example"
const obj = {
  Id: "80eae428-d3ea-481c-9f2c-7d315e46ca68",
  title: "random title",
  meta: {
    createdAt: "2022-04-12T10:22:03.354Z",
    updatedAt: "2022-04-12T10:22:03.354Z",
  },
};

const {
  Id,
  title,
  meta: { createdAt },
} = obj;
```

The names of the variables on the left side of `=` in object destructuring must match the names of the right side object's properties. If you want to name those variables something else, you can do so like this.

```ts
const obj = {
  Id: "80eae428-d3ea-481c-9f2c-7d315e46ca68",
  title: "random title",
  meta: {
    createdAt: "2022-04-12T10:22:03.354Z",
    updatedAt: "2022-04-12T10:22:03.354Z",
  },
};

const { Id, title: postTitle } = obj;
const { Id: postId, title: postTitle2 } = obj;
```

One really useful way to use this syntax is in function parameters. Let's use an example from above:

```ts
class User {
  email: string;
  userName: string;

  constructor(email: string, userName?: string) {
    this.email = email;
    this.userName = userName ?? email; // If userName is undefined, it's set to the value of `email`
  }
}
```

So far so good. But let's say you add some other properties to the `User` class, and add some more parameters to the constructor. Some of those parameters will be required, others optional.

```ts
class User {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;

  constructor(
    email: string,
    userName?: string,
    firstName?: string,
    lastName?: string
  ) {
    this.email = email;
    this.userName = userName ?? email;
    this.firstName = userName ?? email;
    this.lastName = lastName || "";
  }
}
```

With this structure though, the calling code will not have as much freedom as it should. Additionally, the caller has to keep in mind the order of the parameters. What if they want to pass the `firstName` but not the `userName`, or what if they switch the order of `firstName` and `lastName`. It may be simple for us to remember it, as we just defined the function a few minutes ago, but if your project grows to a significant size, it becomes harder to keep track of things like this. You might say that you can just hover over the function name to see what parameters it takes, and in what order, but that's extra effort that will pull you out of the problem-solving domain and send you into the "check the syntax" domain. The more times you switch between the two domains (or the more context switches you make), the more difficult it becomes to stay focused on the task at hand.

A better approach for the scenario outlined above would be to accept an object containing the parameters.

```ts
interface IUserData {
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
}

class User {
  constructor(userData: IUserData) {
    this.email = userData.email;
    this.userName = userData.userName ?? userData.email;
    this.firstName = userData.userName ?? userData.email;
    this.lastName = userData.lastName || "";
  }
}

// Now the caller has more control over how they can call the method implemented above
const user1 = new User({ email: "user1@carbonteq.com" });
const user2 = new User({
  email: "user2@carbonteq.com",
  userName: "learningToCode",
});
const user3 = new User({ email: "user3@carbonteq.com", lastName: "Intern" });
const user4 = new User({
  email: "user4@carbonteq.com",
  userName: "alsoLearningToCode",
  firstName: "TheOther",
  lastName: "Intern",
});
```

That solves the design part of this problem. But the solution still looks a bit ugly. We can use destructuring to make it a bit better.

```ts
interface IUserData {
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
}

class User {
  constructor(userData: IUserData) {
    const { email, userName, firstName, lastName } = userData;

    this.email = email;
    this.userName = userName ?? email;
    this.firstName = userName ?? email;
    this.lastName = lastName || "";
  }
}
```

Much better now. But we can actually simplify it even further by moving the destructuring part directly to the constructor function signature.

```ts
interface IUserData {
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
}

class User {
  constructor({ email, userName, firstName, lastName }: IUserData) {
    this.email = email;
    this.userName = userName ?? email;
    this.firstName = userName ?? email;
    this.lastName = lastName || "";
  }
}

const { email, userName } = dataSource;
const user = new User({
  email,
  userName,
  firstName: "Senior",
  lastName: "Developer",
});
```

### Make use of the spread operator and `rest`

ES6 came with the new `...` (three dots), known as the '[spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)'. This operator is used in two main ways:

- Extract/Expand elements from an iterable (like array / string) or an object literal.
- Joining multiple parameters into an array (used mainly in variadic functions)

Let me give you an example.

```ts
const originalArray = [1, 2, 3, 4];
const originalObject = { k: "v", someProp: "propValue" };

const arrayCopy = [...originalArray]; // arrayCopy = [1, 2, 3, 4]
const objectCopy = { ...originalObject }; // objectCopy = {k: 'v', someProp: 'propValue'}
```

As you can see, it's a really easy and concise way to copy the original object. Not only that, it also simplifies merging multiple arrays/objects.

```ts
const mergedArray = [...array1, ...array2]; // contains the contents of array1 and array2
const mergedArrayWithExtraElement = [...array1, ...array2, 5, 6]; // contains the contents of array1, array 2, along with 5 & 6.

const mergedObject = { ...obj1, ...obj2 };
const mergedObjectWithExtraProps = { ...obj1, ...obj2, someProp: "propValue" };
```

One thing to keep in mind for merging objects using the spread operator is that `obj1` and `obj2` may have different values for the same keys, or they might have some different value for `someProp` key. In this situation, the precedence goes from right to left.

```ts
const obj1 = { id: "random-1" };
const obj2 = { id: "random-2" };

const merged1 = { ...obj1, ...obj2 }; // = {id: 'random-2'} => obj2 keys take precedence
const merged2 = { ...obj2, ...obj1 }; // = {id: 'random-1'} => obj1 keys take precedence
const merged3 = { ...obj1, ...obj2, id: "random-3" }; // = {id: 'random-3'} => provided value for id takes precedence
const merged4 = { ...obj1, id: "random-5", ...obj2 }; // Predict what will this be equal to, and then check your prediction.
```

The reason for this precedence is that using `...` actually spreads the object properties / array elements.

```ts
const arr = [1, 2, 4];
const obj = { userName: "testUser", userPass: "testPass" };
const obj2 = { userName: "intern", dbName: "notImportant" };

// this is functionally equal to `const anotherArr = [1, 2, 4];`
const anotherArr = [...arr];

// this is functionally equal to `const anotherObj = {userName: 'testUser', userPass: 'testPass', userName: 'intern', dbName: 'notImportant'};`
const anotherObj = { ...obj, ...obj2 };
```

Finally, we come to the `rest` syntax, used in conjunction with the spread operator and destructuring. Let's say you want to extract/pop some specific properties/elements out of an object/array. Instead of using the `delete` keyword or `splice` function, you can accomplish it quite easily like so:

```ts
const users = [
  {
    name: "user1",
    password: "salt$7b4883b926ed2e16",
    id: "bc750b8d-4d85-4f4a-9599-b885e0b73c91",
  },
  {
    name: "user2",
    password: "salt$d7cc0e2abc678410",
    id: "e22a8cee-141e-49f6-bbde-ab9dd3f97c08",
  },
  {
    name: "user3",
    password: "salt$af7790e5d2e5714f",
    id: "80eae428-d3ea-481c-9f2c-7d315e46ca68",
  },
];

const [user1, ...otherUsers] = users; // otherUsers contains users at index 1 and 2.
const { password, ...otherProps } = user1; // otherProps = {name: 'user1', id: 'bc750b8d-4d85-4f4a-9599-b885e0b73c91'}
```

### Prefer functional style over imperative style

Try to use pure functions and functional paradigm rather than defining your operations in an imperative array, especially when it comes to iterables like arrays. Using array methods like [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) and [`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) not only allow you to express the business logic in a simpler manner, but also prevents side effects and allows method chaining.

```ts title="Imperative Style"
enum Department {
  WebDev,
  AI,
  DevOps,
}

const employees = [
  {
    id: "bb9e706a-b797-4eb1-835c-44523e6bbd1e",
    salary: 76.1,
    department: Department.DevOps,
  },
  {
    id: "86d83ac3-8814-4d4d-82bd-e1e82967f4d0",
    salary: 13.9,
    department: Department.AI,
  },
  {
    id: "6c6312a3-0521-41f4-84ad-efb2453fa5be",
    salary: 96.4,
    department: Department.DevOps,
  },
];

const PROPOSED_RAISE_FOR_DEVOPS = 0.1;

const devOpsEmployees = [];

for (const employee of employees) {
  if (employee.department === Department.DevOps)
    devOpsEmployees.push({ ...employee }); // Don't modify the original object whenever possible
}

const devOpsAfterRaise = [];

for (const employee of devOpsEmployees) {
  devOpsAfterRaise.push({
    ...employee,
    salary: employee.salary * (1 + PROPOSED_RAISE_FOR_DEVOPS),
  });
}

let totalDevOpsSalaryAfterRaise = 0;

for (const employee of devOpsAfterRaise) {
  totalDevOpsSalaryAfterRaise += employee.salary;
}
```

There are a lot of temporary variables we have to create and keep track of, and those variables take up space not only on the machine but also in our brains.

Compare the imperative solution to the functional one below.

```ts title="Functional Style"
enum Department {
  WebDev,
  AI,
  DevOps,
}

const employees = [
  {
    id: "bb9e706a-b797-4eb1-835c-44523e6bbd1e",
    salary: 76.1,
    department: Department.DevOps,
  },
  {
    id: "86d83ac3-8814-4d4d-82bd-e1e82967f4d0",
    salary: 13.9,
    department: Department.AI,
  },
  {
    id: "6c6312a3-0521-41f4-84ad-efb2453fa5be",
    salary: 96.4,
    department: Department.DevOps,
  },
];

const PROPOSED_RAISE_FOR_DEVOPS = 0.1;

const totalDevOpsSalaryAfterRaise = employees
  .filter((employee) => employee.department === Department.DevOps)
  .map((devOpsEmployee) => ({
    ...devOpsEmployee,
    salary: devOpsEmployee.salary * (1 + PROPOSED_RAISE_FOR_DEVOPS),
  }))
  .reduce((runningTotal, { salary }) => runningTotal + salary, 0);
```

### Map and Set

[`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) are extremely useful data structures, known usually in most languages as **HashMap** and **HashSet**.

`Set` allows you to check for presence of an element in a much faster time (theoretically O(1)) than doing the same using `Array`. Try using it in places where you want to check the presence of some item a lot of times, or when you are keeping track of collections of items you have processed in some way and therefore don't want to process again.

```ts title="Fast Presence Check"
const ALLOWED_METHODS = new Set(["GET", "POST"]);

// ...

const isDisallowedMethod = (method) => !ALLOWED_METHODS.has(method);

// ...

if (isDisallowedMethod(method)) {
  // return or throw error
}
```

```ts title="Corollary - Keeping Track of Processed Items"
const processedUserIds = new Set();

const hasBeenProcessed = (user) => processedUserIds.has(user.Id);
const markUserAsProcessed = (user) => processedUserIds.add(user.Id);

for (user of users) {
  if (hasBeenProcessed(user)) continue;

  expensiveProcessingOperation(user);

  markUserAsProcessed(user);
}

// OR
const visitedPages = new Set();

const alreadyVisited = (url) => visitedPages.has(url);
const markAsVisited = (url) => visitedPages.add(url);

for (const url of urlQueue) {
  if (alreadyVisited(url)) continue;

  visitAndProcess(url);

  markAsVisited(url);
}
```

Similarly, you can use `Map` for checking the presence of a key and fetching the corresponding value if exists. Kinda like the table of contents in a book, which gives you the page number for a given chapter rather than you having to flip the pages one by one and checking if the page is where your queried chapter starts.

Let's say you want to modify the data of some users, and the only common property in the new and old data is the `Id`. Instead of going through the whole collection/array again and again for each new data point in a nested loop, you can use a `Map`.

```ts
// The updates will be in-place this time
const usersOrig = [
  { Id: "user1", expired: true },
  { Id: "user2", expired: false },
  { Id: "user3", expired: true },
  { Id: "user4", expired: false },
  { Id: "user5", expired: false },
  { Id: "user6", expired: false },
];

// console.table(usersOrg)

const idsForUsersToExpire = ["user4", "user6"];

let users = [...usersOrig];
// Linear Search - O(n)
idsForUsersToExpire.forEach((toExpireId) => {
  users.forEach((candidate) => {
    if (candidate.Id === toExpireId) candidate.expired = true; // in-place update. Not encouraged in our best practices
  });
});

// console.table(users)

// Using Maps - O(1) search
const idToUser = new Map(users.map((user) => [user.Id, user])); // {'user1': user1, ...}

users = [...usersOrig];
idsForUsersToExpire.forEach((toExpireId) => {
  const user = idToUser.get(toExpireId); // User or undefined

  if (user !== undefined) user.expired = true;
});
// console.table(users)
```

### Named capture groups

Let's start with a quick recap of capture groups in regular expressions. A capture group is a part of the string that matches a portion of regex in parentheses.

```ts
let re = /(\d{4})-(\d{2})-(\d{2})/;
let result = re.exec("Pi day this year falls on 2021-03-14!");

console.log(result[0]); // '2020-03-14', the complete match
console.log(result[1]); // '2020', the first capture group
console.log(result[2]); // '03', the second capture group
console.log(result[3]); // '14', the third capture group
```

Regular expressions have also supported named capture groups for quite some time, which is a way for the capture groups to be referenced by a name rather than an index. With ES9, this feature made its way to JavaScript.

```ts
let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
let result = re.exec("Pi day this year falls on 2021-03-14!");

console.log(result.groups.year); // '2020', the group named 'year'
console.log(result.groups.month); // '03', the group named 'month'
console.log(result.groups.day); // '14', the group named 'day'
```

Combine that with destructured assignment to instantly gain code style points.

```ts
let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
let result = re.exec("Pi day this year falls on 2021-03-14!");
let { year, month, day } = result.groups;

console.log(year); // '2020'
console.log(month); // '03'
console.log(day); // '14'
```

### Effortless Concurrency with [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

You will probably come across a situation where you are making HTTP calls to multiple external sources. Rather than doing these operations one by one and wasting our time waiting for network bound results, we can make these calls concurrently (not in parallel, looks similar but is an entirely different).

```ts title="Making HTTP requests one by one"
const data1 = await fetchFromDatabase(); // 1.8 seconds
const data2 = await fetchFromApiOne(); // 4.3 seconds
const data3 = await fetchFromApiTwo(); // 2.7 seconds

// Total time taken -> 1.8s + 4.3s + 2.7s -> 8.8 seconds
```

```ts title="Concurrent API Requests"
const [data1, data2, data3] = await Promise.all([
  fetchFromDatabase(),
  fetchFromApiOne(),
  fetchFromApiTwo(),
]);

// Total time taken = max(1.8s, 4.3s, 2.7s) -> 4.3s
```

`Promise.all` can be used not only for network bound concurrent operations but also for concurrent I/O bound operations. The only requirement is that one operation should not be depending on the result of another. Otherwise, we can really perform the dependent operation before its dependency has finished execution.

## Tips for Typescript

## Resources

- [Google - Typescript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [MDN - Async Programming (specific sections below)](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)
- [MDN - Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [MDN - Introducing Async JS](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing)

## Best Practice Example

<BestPractice>

!!practices Good vs Bad API Patterns

!example[Good: Clear Error Handling]
```ts
async function fetchUserData(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}
```

!example[Bad: Silent Failures]
```ts
async function fetchUserData(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  return await response.json();
}
```

!!practices Function Naming

!example[Good: Descriptive Names]
```ts
function calculateTotalPriceWithTax(price: number, taxRate: number): number {
  return price * (1 + taxRate);
}

function isUserEligibleForDiscount(user: User): boolean {
  return user.accountAge > 365 && user.totalPurchases > 1000;
}
```

!example[Bad: Vague Names]
```ts
function calc(p: number, t: number): number {
  return p * (1 + t);
}

function check(u: User): boolean {
  return u.age > 365 && u.purchases > 1000;
}
```

</BestPractice>
