---
title: Best Practices
---

In this section are presented some of the best practices, and guidelines for backend applications gathered from different sources.
Best Practices Mentioned here are language agnostic and can be used in any backend project

**Everything below should be seen as a recommendation**, not a rule. Different projects have different requirements, so any pattern mentioned in this section should be adjusted to project needs or even skipped entirely if it doesn't fit. In real world production applications you will most likely only need a fraction of those patterns depending on your use cases.

---

### Architecture

Software architecture is about making fundamental choices of your application structure.

> Architecture serves as a blueprint for a system. It provides an abstraction to manage the system complexity and establish a communication and coordination mechanism among components.

Choosing the right architecture is crucial for your application.

---

### **API Security**

Software security is the application of techniques that allow to mitigate and protect software systems from vulnerabilities and malicious attacks.

Software security is a large and complex discipline so we will not cover it in details here.

Instead here are some generic recommendations to ensure at least basic level of security:

- **Continous Security** Ensure secure coding practices and always try to keep yourself up to date
- **Validate Validate Validate** Validate all inputs and requests.
- Ensure you don’t store sensitive information in your Authentication tokens.
- **Encryption at Transit** Always use TLS, even when communicating with internal services
- **Encryption at Rest** Ensure you encrypt all sensitive information stored in your database
- **Exclude Secrets From VC** Never store secrets (passwords, keys, etc.) in the sources in version control (like github). Use environmental variables to store secrets. Put files with your secrets (like .env) to .gitignore.
- Update your packages and software tools frequently so ensure latest bugs and vulnerabilities are fixed
- Monitor vulnerabilities in any third party software / libraries you use
- Don’t pass sensitive data in your API queries, for example: https://example.com/login/username=john&password=12345

Read more:

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)

---

### **Testing**

Software Testing helps catching bugs early. Properly tested software product ensures reliability, security and high performance which further results in time saving, cost effectiveness and customer satisfaction.

Use White Box testing only when it is really needed and as an addition to Black Box testing, not the other way around.

It's all about investing only in the tests that yield the biggest return on your effort.

> Code never lies, comments sometimes do.

Only comment about _why_ instead of _what_. Use comments only in some special cases, like when writing an counter-intuitive "hack" or performance optimization which is hard to read.

---

### Database Best Practices

**Backups**
Data is one of the most important things in your business. Keeping it safe is a top priority of any backend service.

Here are some basic recommendations:

- Create backups frequently and regularly
- Use remote storages for your backups. Backing up your data and storing it on the same disk as your original data is a road to losing everything. When your storage breaks you will lose an original data and your backups. So keep your backups separately
- Keep backups encrypted and protected. Backup encryption ensures data is protected from leaks and that your data will be what you expect when you recover it
- Consider retention span. Keeping every backup forever isn’t feasible due to a limited amount of space for storage
- Monitor the backup and restore process

**Migrations** can help for database table/schema changes: Try to make sure migrations are declarative in nature and versioned.

**Seeders** To avoid manually creating data in the database, seeding is a great solution to populate database with data for development and testing purposes.

---

### Configuration

- **Use Config Files**. Try to avoid using in-line literals/primitives. This will make it easier to find and maintain all configurable parameters when they are in one place.
- **Create hierarchical config files** that are grouped into sections. If possible, create multiple files for different configs (like database config, API config, tasks config etc).
- **Use Cloud Based Secret Stores** Never store sensitive configuration variables (passwords/API keys/secret keys etc) in plain text in a configuration files or source code.
- **Use Env Variables:** Store sensitive configuration variables, or variables that change depending on environment, as environment variables.
- **Config Integrity** Application should fail and provide the immediate feedback if the required environment variables are not present at start-up. env-var is a nice package for nodejs that can take care of that.

---

### Observability (Logging/Monitoring)

**Logging**

- Try to log all meaningful events in a program that can be useful to anybody in your team.
- **Use proper log levels**: log/info for events that are meaningful during production, debug for events useful while developing/debugging, and warn/error for unwanted behavior on any stage.
- **Write meaningful log messages with context** Try to include metadata that may be useful. Try to avoid cryptic messages that only you understand.
- **Never log sensitive data**: passwords, emails, credit card numbers etc. since this data will end up in log files. If log files are not stored securely this data can be leaked.
- **Avoid default logging tools** (like console.log). Use mature and machine friendly logger libraries (for example Pino) that support features like enabling/disabling log levels, convenient log formats that are easy to parse (like JSON) etc.
- **Docker Friendly Logging** Make sure to generate log output to stdout/stderr for logging to be docker/kubernetes friendly

**Monitoring**
With advent of cloud and docker based ecosystem It's now much easier to handle code based monitoring in cloud

- **Delegate anything possible** Anything which can be delegated 3rd party calls, gzip, ssl at infrastructure level
- **Create a health endpoint** Modern platforms can scale and auto repair based on this health endpoint
- **Errors and Downtime** They should be observers and recorded with releases preferable using an APM

---

### Static Code Analysis

**Code Formatting/Linting** The way code looks adds to our understanding of it. Good style makes reading code a pleasurable and consistent experience.

Consider using code formatters like Prettier to maintain same code styles in the project.

**Test Coverage** Try to achieve least 70% test coverage for all of your codebase, and it should be tied to CI system and coverage should be tracked with every release

**Static Application Security Testing** Goal is developers writing more secure code by detecting Vulnerabilities and Security Hotspots

---

### Consuming 3rd Party API's

- **Avoid Cascading Failures**
  - Observe ratelimits and use retries for 3rd party APIs
  - If API is critical to important workflows in app try to use circuit breaker pattern
- **Don't use API's directly** Try to create abstractions on top of existing sdk/clients
- **Version your API Clients** Given enough time new versions of API's are inevitable try to version your clients as well
