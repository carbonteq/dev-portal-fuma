---
title: Interpreter for (a small subset of) Forth
---

## Intro to Forth

[Forth](https://en.wikipedia.org/wiki/Forth_%28programming_language%29) is a [stack VM](https://en.wikipedia.org/wiki/Stack_machine) based language. You can learn more about the language and it's mechanics [here](https://www.forth.com/starting-forth/1-forth-stacks-dictionary/).

Simply put, the language is comprised of `WORDS` (you can also think of them as commands), and we write our programs by invoking these `WORDS` with `n` arguments/operands (in [postfix notation](https://en.wikipedia.org/wiki/Reverse_Polish_notation)). You might be familiar with this style of programming if you've ever coded a basic calculater or programmed in LISP. We can also define new `WORDS` by combining the existing ones (same thing we do while defining a function in modern languages).

## Exercise details

Your task is to implement an interpreter for some words of the Forth language. These words are:

- `+`, `-`, `*`, `/` (integer arithmetic)
- `DUP`, `DROP`, `SWAP`, `OVER` (stack manipulation)

You'll also have to add support for defining new words using this syntax `: word-name definition ;`.

## Simplified Grammar

The only data type we will be using in our programs are 16-bit signed integers. We'll also support only lowercase letters in our word definitions.

:::note
This is not a truly formal definition of our subset of the language.
:::

```js
(* A program is comprised of multiple statements *)
program = { statement } ;

(* Each statement is either a word definition or a word invocation *)
statement = word-definition | word-invocation;

(* A word definition is `:` followed by a word identifier, followed by `n` already defined words, followed by `;` *)
word-definition = word-ident, { white-space, word } ;

(* A word invocation is 0-n supported data types followed by a word indentifier *)
word-invocation = [{ data-type, white-space }], word-ident ;

(* the only supported data typed for now are 16-bit signed integers *)
data-type = number ;

(* A number is comprised of n digits. Make sure to stay within -32768 to 32767 *)
number = { digit } ;

(* A word indentifier is just a sequence of lowercase letters *)
word-ident = { letter };

digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;
letter = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" ;
white space = ? white space characters ? ;
```

### Example Programs

```js
["1 2 3"] => [1, 2, 3]
["1 2 +"] => [3]
["1 2 dup"] => [1, 2, 2] // 'dup' duplicates the data on stack top
["1 2 drop"] => [1] // 'drop' drops the data on stack top
["1 2 3 swap"] => [1, 3, 2] // 'swap' swaps the data on stack top
["1 2 3 over"] => [1, 2, 3, 2]
["1 2 swap 3 dup 4"] => [2, 1, 3, 3, 4] // can use ints after words as well
[": duptwice dup dup ;", "1 2 duptwice"] => [1, 2, 2, 2]
[": duptwice dup dup ;", "1 2 duptwice 3"] => [1, 2, 2, 2, 3]
[": firstfiveprimes 2 3 5 7 11 ;", "firstfiveprimes"] => [2, 3, 5, 7, 11]

// you can override earlier definitions
[": foo swap ;", ": foo dup dup ;", "1 2 foo"] => [1, 2, 2, 2] // not [2, 1]

// you can redefine existing words
[": swap dup ;", "1 2 swap"] => [1, 2, 2]

// redefining a word after making it a part of another word should use the earlier definition
[
  ": specialnumber 5 ;",
  ": twospecialnumbers specialnumber dup ;",
  ": specialnumber 6 ;"
  "twospecialnumbers specialnumber"
] => [5, 5, 6]

// while redefining a word, we can use the word itself in the new definition. It'll work if you have defined the feature above properly.
[": foo 10 ;", ": foo foo 1 + ;", "foo"] => [11]

// redefining numbers is not allowed
[": 1 2 ;"] => throw some informative error
```

## Guidelines

Your program should be usable as a library, and as a CLI/TUI/Web UI/GUI based program. The program will accept a sequence/list of word definitions and invocations, and should then print the final stack to the output area of whatever UI you choose. In case of any syntax errors, the user should be provided as much information as possible to resolve that error.

:::tip
Make it work, then make it simpler, and then faster.
:::

Follow the Single Responsibility principle, and write an extensive suite of unit tests for each of the programs' units, and then integration tests using the example programs above.

## Tips

Your program will consist of three logical parts:

- Lexer: turns a stream of strings to a stream of distinct tokens (no syntactic analysis here)
- Parser: Turns a stream of valid tokens to a stream of valid AST elements (performing syntactic analysis and throwing errors where necessary)
- Evaluator: Uses a stream of AST elements to perform actions on the stack (effectively evaluating/interpreting the program)

E.g. `["11 2 dup"]` should produce the token stream `11 -> 2 -> dup` (the arrows indicating the direction of time). This token stream will produce the AST element stream `Int(11) -> Int(2) -> Predefined(dup)/Word(dup)`. The evaluator will first get `Int(11)` and will push it onto the stack, same for `Int(2)`, and then will push the stack top (which is 2 right now) to the stack after "seeing" `Word(dup)`.

Other than that, it's a good idea to create separate modules for Stack and a store which will contain word -> definition mappings.

For word definitions, it would be helpful to think in terms of [state machines](https://en.wikipedia.org/wiki/Finite-state_machine). Getting the token `:` should lead to a state transition, the word indentifier token produces another state transition, then you remain in this state until you get the token `;` or a malformed input error.

For recursive definition of predefined words, it would be better to consider `Word` as a separate type from `PredefinedWord` (otherwise you would get a stackoverflow trying to execute a word as a part of itself). Simplify word definitions to contain only `Int` or `PredefinedWord` (the language primitives), and at runtime, while NOT executing a word definition, check if a predefined word is present in the word definition map. If it is, execute that alternative definition (taking care not to do the same inside the definition).

You'll see some common parsing checks etc popping up while working through the tips and guidelines stated above. Extract them out as abstractions, taking care not to break existing functionality.

## Test Tool

You can use the CLI tool linked below to run programs and compare the output against your interpreter. Use [Easy Forth](#resources) if you can't find a binary for your platform.

- [Linux](https://dev-portal-tools.s3.eu-central-1.amazonaws.com/forthrs)
- [Windows](https://dev-portal-tools.s3.eu-central-1.amazonaws.com/forthrs.exe)

## Resources

- [Stack vs Register based VMs](https://static.usenix.org/events/vee05/full_papers/p153-yunhe.pdf)
- [Statement vs Expression](https://www.freecodecamp.org/news/statement-vs-expression-whats-the-difference-in-programming/)
- [Writing an Interpreter - Toptal](https://www.toptal.com/scala/writing-an-interpreter)
- [Let’s Build A Simple Interpreter](https://ruslanspivak.com/lsbasi-part1/)
- [Crafting Interpreters - Domain Map](https://craftinginterpreters.com/a-map-of-the-territory.html)
- [Easy Forth (comes with an online interpreter)](https://skilldrick.github.io/easyforth/)
