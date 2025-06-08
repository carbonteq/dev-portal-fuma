---
title: Todo App
---

> Revisiting the basics, for development of large scale apps.

## Preparations

### Tasks

- Create a Todo Item API
  - With Sequential
- Cover gitflow and prepare a custom diagram in draw.io. Goal is to visualize SDLC from gitflow perspective

### Expectations

- Prefer async-await over then and callbacks.

- Don't rely on database generated Id and instead use application generated UUID.

- Goal is to use [layered architecture](https://dzone.com/articles/layered-architecture-is-good), directory structure should be well organized.

- Create Http layer (Presentation Layer) to house all express related code (middleware, route, controller, expressApp)

- Use auth [middleware](https://refactoring.guru/design-patterns/chain-of-responsibility) in express to handle login.

## Refactor Phase 1

### Tasks

- Refactor the code to adapt following features from [12 Factor Apps](https://12factor.net/).

  - Codebase

  - Dependencies

  - [Config](https://www.npmjs.com/package/dotenv)

- Create domain layer and refactor your code to house [entities](https://www.raywenderlich.com/books/real-world-android-by-tutorials/v1.0/chapters/3-domain-layer) and utilize factory pattern ([static factory methods](https://stackify.com/static-factory-methods/#:~:text=A%20static%20factory%20method%20is,separate%20interface%20and%20implementation%20class.) or factories to create entities) for todo and users

  - _References_

    - [Static Factory Method](https://refactoring.guru/design-patterns/factory-method)

- Create a physical store like API on top of the mongoose model using an [adapter pattern.](https://sourcemaking.com/design_patterns/adapter)

- Implement [Google Auth](https://medium.com/@jackrobertscott/how-to-use-google-auth-api-with-node-js-888304f7e3a0) for login, using google nodejs client.

### Expectations

- Understand the above mentioned concepts of 12 factor apps.

- Understand the static factory method by the end of exercise.

- Develop a good understanding of OAuth2 with Google.

- Make sure the store API's are similar to actual physical stores, and they always receive and return entities.

## Refactor Phase 2

### Tasks

- Create application services to move the logic away from controllers.

- Add pagination options to API endpoints.

- Add custom exceptions to stores and services and rely on exception handling to send appropriate error messages from API.

- Use custom exceptions to express errors in system and log your exceptions.

### Expectations

- Controllers should only be responsible for preparing the inputs for services and should be as lean as possible.

- Use standard pagination options as input for pagination and paginatedCollections as output.

- Use intelligent exceptions messages and always rely on exception for failures instead of return types.

- Logs must always be written to std streams and must give insights for failures.

## Refactor Phase 3

### Tasks

- Cover next concepts in 12 factor app

  - Processes

  - Port binding

  - Concurrency

- Add Infrastructure Layer and refactor your stores to repositories.

- Use Migrations and fakers to repopulate databases.

- Express server invocation should be moved to its own (BIN or CLI) presentation layer.

- Implement [JWT](https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens) auth for login.

### Expectations

- Use [Dependency Injection](https://inversify.io/) to inject repositories to your application services.

- Use commander to instantiate express server.

- Pre-populate the database with fake/seed data.

- Understand mechanics of JWT and how it helps us achieve a stateless system.

## Refactor Phase 4

### Tasks

- Use single docker containers to run databases.

- Shift Login related to passport js with jwt support.

- Implement the [Command Bus](https://blog.carbonteq.com/command-bus-pattern/) pattern to interact with stores and entities in todo app.

- Use mocha, sinon and chai to add test cases to the app.

### Expectations

- Properly Implement command bus pattern and use commands to create entities from raw objects and handler should extract entities manipulate and save them

- Use spies and stubs to properly unit test stores.

- Mock Sequalize.

- Understand basic concepts of docker.

- Run docker containers as daemons.

- Monitor and inspect running containers and their logs.

## Refactor Phase 5

### Tasks

- Implement Observer pattern to raise events on creation of user and todo items.

- Implement email/slack notification drivers to notify users.

- Move the codebase to docker compose.

- Add Integrations tests for stores and command bus.

### Expectations

- Have good understanding of emitting and handling events.

- Debug applications running on docker compose.

- Understand the difference between unit and integration testing.

## How to submit your work

Create a public repo on Github and push your code on it. then share the link back with the team.
