---
title: Build your own Virtual DOM
---

## Problem Statement:

Often times front end developers are faced with bugs due to multiple re-rendering of the DOM and other component lifecycle changes. This is because they may not fully understand how the Virtual DOM works and when it actually applies changes to the DOM tree in the browser. As a result, the code they write may not be very stable or maintainable and may contain unnecessary re-renders, which can bloat the code and reduce the performance of the application.

Performing this exercise will be helpful to front-end developers because it will provide a hands-on opportunity to understand and implement one of the core concepts used by modern web frameworks to optimize web application performance. Building your own Virtual DOM library will help you to gain a deeper understanding of how Virtual DOM works and how to leverage its benefits to improve web application performance. By completing this exercise, you will be better equipped to make informed decisions about which libraries and frameworks to use for your own projects, and to develop more efficient, performant web applications.

## Overview:

Virtual Document Object Model (DOM) is a concept used by modern web frameworks such as React, Vue, and Angular to optimize web application performance. By using a Virtual DOM, changes in the application state are first reflected in the Virtual DOM, which then updates the actual DOM. This way, the framework only updates the necessary parts of the DOM, reducing the number of expensive DOM manipulations required.

Here are general steps of how a virtual DOM functions:

1. When a user interacts with a web application, the virtual DOM is updated with the new state of the application.
2. The virtual DOM then compares the updated state with the previous state to determine what has changed.
3. Once the changes have been identified, the virtual DOM creates a minimal set of instructions (known as a "diff") that are required to update the real DOM.
4. Finally, the real DOM is updated with the changes, and the web page is re-rendered to reflect the new state of the application.

## Implementation Details:

### Virtual DOM Element Object

The DOM is usually represented as a tree in the browser, as you can see in the image down below:

![image](https://user-images.githubusercontent.com/114756286/222674145-d5d6685e-590e-4f0b-97b4-4778217a9460.png)

Each node in the tree represents an HTML element, these elements can have branches that have child elements, Each node apart from containing their children has certain other properties which are known as attributes, these attributes could be things like href, source image (src) etc. The HTML in the browser is then rendered top to bottom.

This tree can be represented as an object in Javascript, here is an example object representation of a simple virtual DOM Object.

```
<div id="main">
  <div id="header">
    <h1 id="heading">
      Hello World 
    </h1>
  </div>
</div>
```

```
{
  "tag" : "div",
  "attributes" : {
    "id" : "main"
  },
   "children": [
    {
      "tag" : "div",
      "attributes" : {
        "id" : "header"
      },
      "children" : [
      {
        "tag" : "h1",
        "attributes" : {
          "id" : "heading"
        },
        "children" : "Hello World"
      }
     ]
    },
  ]
}
```

### Diffing Algorithm:

Whenever something updates or chanes in the virtual DOM, a copy of the virtual DOM is made with the changes done on it, then the original and the modified virtual DOM objects are compared, and the differences are then reflected on the actual DOM. React for example keeps tracks of the changes and when the proper time comes it performs a batch update.

You will also need to program a "diff" algorithm, which runs whenever the state or the elements in the virtual DOM updates. This algorithm will only update components that are modifed in the virtual DOM. This algorithm is responsible for making our virtual DOM highly performant as compared to acutal DOM. You can read more about the diffing algorithm by going to the links in the resources section. 

There are certain things that you need to keep in mind, firstly if the root of a tree is changed, e.g. a div element is converted to a span than the root and all its children will be recreated, however if only a specific attribute changes than only that will be updated and nothing will be recreated.

## Exercise Details:
In this exercise you should implement a Virtual DOM library using JavaScript or TypeScript. The library should have the following functionality:

1. Create virtual nodes with a given tag name and attributes.
2. Create a virtual text node with a given text content.
3. Append a child virtual node to a parent virtual node.
4. Remove a child virtual node from a parent virtual node.
5. Update the attributes or text content of a virtual node.
6. Diff two virtual nodes and return a list of patches to be applied to the actual DOM.

To complete the exercise, you should create a simple web page that uses your Virtual DOM library to render dynamic content. This web page should contain:
1. A simple counter that updates on button clicks.
2. An input box and a submit button which changes the text context of header
3. A dynamic unordered list which you can add or remove elements by clicking the plus or minus buttons.

Your Virtual DOM library should be designed to handle changes to the application state efficiently, updating only the necessary parts of the DOM to improve performance.


## Considerations:

1. You should make sure that your implementation does not use mutliple O(N2) time complexity functions when comparing the difference between virtual DOM and the actual DOM. Your implementation should be actually faster than updating the actual DOM. Read more about the heuristic approach that React has adopted to further optimize your code (Ideally, you should compare your virtual dom updates to actual DOM updates using console.time function).
2. Make sure it easy to distinguish variables and code that performs actions on virtual DOM from the code that functions on the actual DOM.
3. Have unique identifiers for your list or dynamic lists otherwise you will have unecessary computations
## Further Learning:

1. Build your own JSX transpiler for your custom virtual DOM library.
2. Make a global state management system for your custom virtual DOM library.
3. Create a function for running code logic whenever a component is mounted (similar to use useEffect or componentdidMount)

## Resources:

1. <a href = "https://medium.com/@happymishra66/virtual-dom-in-reactjs-43a3fdb1d130"> Virtual DOM in ReactJS </a>
2. <a href = "https://blog.logrocket.com/virtual-dom-react/#:~:text=React%20uses%20the%20virtual%20DOM,to%20write%20more%20predictable%20code." > What is the virtual DOM in React? </a>
3. <a href = "https://reactjs.org/docs/reconciliation.html" > Reconciliation React DOCS </a>
4. <a href = "https://www.geeksforgeeks.org/what-is-diffing-algorithm/"> What is Diffing Algorithm ? </a>
5. <a href = "https://javascript.plainenglish.io/reacts-diffing-algorithm-1a64cfefa4e0"> React’s Diffing Algorithm </a>
6. <a href = "https://www.youtube.com/watch?v=i793Qm6kv3U"> Understanding React's UI Rendering Process </a>
7. <a href = "https://indepth.dev/posts/1501/exploring-how-virtual-dom-is-implemented-in-react"> Exploring how virtual DOM is implemented in React </a>
8. <a href = "https://dev.to/maulik/the-best-example-to-understand-virtual-dom-4lfn" > The best example to understand virtual DOM </a>
