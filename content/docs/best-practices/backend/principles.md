---
title: Principles
---

Before listing what we have adapted so far we like to explain what are we optimizing for this will serve as good key results or a litmus test to check if you have achieved good architecture

- **Independent of Frameworks.** Express/Koa is not your application.The architecture does not depend on the existence of some library of feature laden software. This allows you to use such frameworks as tools, rather than having to cram your system into their limited constraints.
- **Testable**. The business rules can be tested without the UI, Database, Web Server, or any other external element.
- **Independent of UI.** The UI can change easily, without changing the rest of the system. A Web UI could be replaced with a console UI, for example, without changing the business rules.
- **Independent of Database.** You can swap out Oracle or SQL Server, for Mongo, BigTable, CouchDB, or something else. Your business rules are not bound to the database.
- **Independent of any external agency.** In fact your business rules simply don’t know anything at all about the outside world.
- **Shippable right from the beginning.** Being agile as the defacto for every tech company it's really important, We have to make sure we can use declarative formats for setup, so it's much easier to bring on new engineer.
- **Being Resilient.** In this new API economy, relying on 3rd party systems is inevitable, resilient means allow systems to work with failure, rather than against it.
- **Scalable** Applications should scale right from the start, It doesn't necessarily mean we are optimizing for performance or efficiency. It means our apps are distributed system friendly by being stateless and developer friendly by being readable which affects how quickly we can onboard a new developer.

## Resources

- [Domain Driven Hexagon - With Code Examples](https://github.com/Sairyss/domain-driven-hexagon)
- [Martin Fowler - DDD](https://martinfowler.com/tags/domain%20driven%20design.html)
- [Microsoft - DDD](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/ddd-oriented-microservice)
- [Example C# App following DDD](https://github.com/tpierrain/CQRS)
- [Explicit Architecture](https://github.com/hgraca/explicit-architecture-php)
- [Digital Ocean - SOLID](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [Microsoft - Tackle Business Complexity in a Microservice with DDD and CQRS Patterns](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/)
- [Microsoft - CQRS](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- [Alistair Cockburn - Hexagonal Architecture](https://web.archive.org/web/20180121161736/http://alistair.cockburn.us/Hexagonal+Architecture)
- [Microsoft - Common Web App Architectures](https://docs.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)
