---
title: React Architecture
---

Patterns or practices described here are based on one’s experience. They may not work for every large-scale application of every kind. Take the parts that resonate with you or you think will help you get things more organized in your React project and leave out the rest

### Codebase

```
└── /src
    ├── /assets
    ├── /components
    ├── /context
    ├── /containers
    ├── /hooks
    ├── /pages
    ├── /services
    ├── /utils
    └── App.js
    ├── index.js
```

The important part here is not to make the directory name a hard and fast rule but to follow a neat organization that anyone in the codebase can understand.

**Understanding Codebase**

As the codebase is mentioned above, each and every directory plays an important role for creating sufficient abstraction layer between the Presentation Layer, Application Layer and the Data fetched from the backend APIs.

- Starting from the Presentation Layer, atomic and reusable components should be implemented and saved inside the components directory. Container is a higher-level component which comprises of sub-components and its only work is to fetch the data and pass to the corresponding sub-component. (data fetching must be done by calling a service).
- In services directory, services like authentication, fetching/updating data etc. All interaction with the backend takes place here. It is a best practice to create an abstraction layer over the API client library being used e.g. Axios, it will be easier in future to replace Axios with anyother API client library.
- In Pages directory, Login page, Home page, About page etc. are present and loaded according to the route.
- Context/Store directory stores the data and state of the application, whenever any service is called which returns some useful data, it is stored in the context/store directory which can be accessed later the container components to futher pass the data.

**Add Custom Components in their own directories**

Reusable components can be buttons, input fields, and content containers like cards. All of these components live within the /components directory. Each component will live inside its own sub-directory. For example, if you are creating reusable Buttons, here is an example of a directory structure you can consider:

```
└── /components
    ├── /common
    |   ├── /Button
    |   |   ├── Button.js
    |   |   ├── Button.styles.js
    |   |   ├── Button.test.js
    |   |   ├── Button.stories.js
    |   ├──index.js
```

### Common Modules

One advantage of React being un-opinionated is it doesn’t care how you divide your modules. When developing a page in a React app, consider dividing it into modular pieces. This will help you reduce the complexity and create structures that are open for reusable or shared across the application.

Shareable code in React app should be divided under its own domain. A common module can be reusable custom components, custom hooks, business logic, constants, and utility functions. These reusable pieces are shared across the application to be used on more than one page component. Having a directory for them in your application’s directory structure is a good starting point.

### Create Custom Hooks

A reusable React Hook is like a reusable working part. Just like you create custom components, creating a custom hook can help reduce code complexity.

Consider an example. In your React app, you have two different pages representing a login and a signup form. Each of these pages contains text input fields where users can enter their credentials and submit the form using a button. One of the input fields used in both forms is for users to enter their password. The password field contains an icon that allows the app user to toggle between the field’s visibility. Suppose you write the same code to implement this behavior in both login and signup forms. In that case, you will be duplicating the code.

A solution to this problem is to create a custom hook to toggle the icon and the field’s visibility based on the icon. Here is an example of a custom hook:

```typescript
export const useTogglePasswordVisibility = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState("eye");
  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };
  return {
    passwordVisibility,
    rightIcon,
    handlePasswordVisibility,
  };
};
```

The custom hook above starts with a use naming convention. Even though React isn’t strict about naming conventions, it is important to follow them in this scenario. This hook also handles its own state and method and can be re-used on a password field, whether inside the login or a signup form.

**<u>[Example](https://medium.com/swlh/using-custom-hooks-to-reduce-component-complexity-fcb4563a9ffe)</u>**

### Use Absolute Imports

It makes it a lot easier to import components within the project and also, at the same time moving files without the need to change the import statements. It also helps in tree shaking.

## Separation of concern

The /pages directory will contain the UI for most of the application and the structure of each page in the form of React components. These components are naturally coupled with the business logic they represent. It is a common behavior that you will find in any React application. However, avoid unnecessary complexity in a UI component, you can separate the business logic from it.

One way to separate the UI and the logic is to create a custom hook or by using presentational/container components pattern to achieve the same goal.

## Avoiding creating a single Context for everything

When you pass props from a parent to a child component, it can be as simple as passing them from one to another. However, the complexity arises when there are many components in between. This creates an inconvenient way to pass props.

There are multiple ways to pass data through the component tree without prop drilling.

- State managing libraries like redux, recoil etc
- React Context
- HOCs

## Composition over inheritance

Both Inheritance and Composition, aim towards code reuse and cleaner code structure. But what does the React team recommend?

React recommends use of Composition over Inheritance, here is why. Everything in React is a component, and it follows a strong component based model. This is one of the primary reasons that composition is a better approach than inheritance for code reuse.

**Multiple approaches that use composition**

- Higher Order Components
- State management libraries
