---
title: Principles
---

Principles play an important role providing set of rules to test the efficient implementation of best practices.

- **Business Logic First.** Presentation layer and services should be designed around the business/application rules and business logic should not know anything about presentation/services layer. Start the developent process from application logic and then gradually add presentation layer.
- **Easily Testable.** Business logic can be tested individually without relying on view/presentation logic or services or any other external agency. In fact for UI components, separate tests can be written.
- **Independent of Presentation Layer.** Presentation layer of applications must be swapped easily without requiring any changes in application logic. We should be able to switch between React or React Native or Electron etc.
- **Independent of UI Design System.** UI libraries/Design-System must be swapped easily. We should be able to switch between Ant Design, Chakra or any other UI design system.
- **Independent of Services.** Presentation and Application logic should not be exposed to any backend API directly. Only the services code should be handling all the API calls and a good abstraction layer must be implemented to swap between Axios or httpclient or any other services library.
- **Atomic UI Components.** Consider a page/screen as a molecule which is composed of different atoms, in our case we call them "components". These molecules/screens combine to make a model/UI.
- **Being Resilient.** In this new API economy, relying on 3rd party systems is inevitable, resilient means allow systems to work with failure, rather than against it.
- **Scalable** Applications should scale right from the start, It doesn't necessarily mean we are optimizing for performance or efficiency. It means our apps are distributed system friendly by being stateless and developer friendly by being readable which affects how quickly we can onboard a new developer.

## Resources

- [Brad Frost - Atomic Design](https://atomicdesign.bradfrost.com/)
- [Atomic Design - Blog](https://bradfrost.com/blog/post/atomic-web-design/)
- [Frontend Architecture for Design Systems](https://learning.oreilly.com/library/view/frontend-architecture-for/9781491926772/)
- [Principles for Scalable Frontends](https://www.simform.com/blog/principles-of-scalable-front-ends/)
- [Client-Side Architecture Basics](https://khalilstemmler.com/articles/client-side-architecture/introduction/)
- [Nir Kaufman - Front-End Architecture 101](https://www.youtube.com/watch?v=o8THlN8hgcw&ab_channel=ReactNYC)
- [Rob Aguilera - Frontend architecture: Decoupling apps from frameworks](https://www.youtube.com/watch?v=jmcx3b78V8s)
