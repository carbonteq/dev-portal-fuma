---
title: Overview
---

In this section are presented some of the best practices, and guidelines for frontend applications gathered from different sources.

**Everything below should be seen as a recommendation**, not a rule. Different projects have different requirements, so any pattern mentioned in this section should be adjusted to project needs or even skipped entirely if it doesn't fit. In real world production applications you will most likely only need a fraction of those patterns depending on your use cases.

---

### **Don’t repeat yourself**

As a rule of thumb, if you repeat something more than 2 times, factorize it. There are many reasons for that:

- It makes your code easier to maintain
- It allows less bug to happen
- It adds more clarity to your code
- It narrows down the performance of your IDE (and your machine) in the long run
- Like the previous, it narrows down the application’s performance for the end-user

---

### **Test-Driven Development**

Software Testing helps catching bugs early. Properly tested software product ensures reliability, security and high performance which further results in time saving, cost effectiveness and customer satisfaction.

Test-Driven Development starts with designing and developing tests for every small functionality of an application. TDD framework instructs developers to write new code only if an automated test has failed. This avoids duplication of code.

Use White Box testing only when it is really needed and as an addition to Black Box testing, not the other way around.

<!-- > Code never lies, comments sometimes do.

Only comment about *why* instead of *what*. Use comments only in some special cases, like when writing an counter-intuitive "hack" or performance optimization which is hard to read. -->

---

### **Document your code**

Be it through testing or markdown documents in the project, documenting helps you and your mates to get started quickly. It enlights the purpose of your projects and the subtleness of some of their parts.

---

### **Keep it simple**

This is easy to lose from sight what is the purpose of what you are coding. Keeping things simple may sound easy at the beginning. But soon the codebase can become over-engineered and cluttered.

To avoid that you have to write tests of course, but also to refactor often. This is the guarantee to avoid complexity.

---

### **Configuration**

- **Use Config Files**. Try to avoid using in-line literals/primitives. This will make it easier to find and maintain all configurable parameters when they are in one place.
- **Create hierarchical config files** that are grouped into sections. If possible, create multiple files for different configs (like stripe config, google config etc).
- **Use Cloud Based Secret Stores** Never store sensitive configuration variables (passwords/API keys/secret keys etc) in plain text in a configuration files or source code.
- **Use Env Variables:** Store sensitive configuration variables, or variables that change depending on environment, as environment variables.

---

### **Observability (Logging)**

- Try to log all meaningful events in a program that can be useful to anybody in your team.
- Use proper log levels: log/info for events that are meaningful during production, debug for events useful while developing/debugging, and warn/error for unwanted behavior on any stage.
- Write meaningful log messages with context. Try to include metadata that may be useful. Try to avoid cryptic messages that only you understand.
- Never log sensitive data: passwords, emails, credit card numbers etc
- Use mature and machine friendly logger libraries (for example Logrocket/Sentry).

---

### **Static Code Analysis**

**Code Formatting/Linting** Eslint does a great job: A good eslint config file can save you from developing dumb things. It highlights the weakness of your code and gives you advice on what to do to fix them.

It also enforces consistency if you use it with a style guide like Standard JS, Airbnb, or Google Styleguide JS. It’s customizable and compatible with TypeScript.

Consider using code formatters like Prettier to maintain same code styles in the project.

**Static Application Security Testing** Goal is developers writing more secure code by detecting Vulnerabilities and Security Hotspots

---

### **Creating Good Abstraction Layers**

**Implement Clean Architecture** Divide every part of the application into layers. Front-End mainly includes Presentation Layer, Use-Cases/Services Layer, Data/Entities Layer. Each of these layers must not know about the outside world. Abstracting out the app into layers will help to make app scalable and maintainable.

**Loose Coupling** helps to switch between frameworks and libraries depending upon the need. For example if one wants to switch from one UI design system to another, for this reason there must be a good abstraction layer between our application and the components used from a design system.

---

### **Consuming 3rd Party API's**

**Don't use API's directly** Try to create abstractions on top of existing sdk/clients and create services.
