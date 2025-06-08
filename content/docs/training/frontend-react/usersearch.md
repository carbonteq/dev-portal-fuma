---
title: Address Book App
---

This is a fictional address book app, where you can search for users addresses and personal information. The app should display a list of users for clients to browse and get personal information for a selected user.

## Home page (browse with search)

The page should be located on the root url `/`. Display the users in a grid. Each user has : a `picture.thumbnail`​ field, `name.first`​ field, `name.last`​ field, `name.username`​ field, `email`​ field, the user's grid should automatically load more users as you scroll down. The database is under high load due to the growing demand for users, so please display an animated "loading..." message while the visitor waits. To improve the user's experience, we should always preemptively fetch the next batch of users in advance, making use of idle time. But they still should not be displayed until the visitor has scrolled to the bottom of the user's grid. Max length of the catalog is 1000 - the next batch size of users is 50. When the visitor reaches the end and there are no more users to display, show the message "end of users catalog".

## Details modal

When a visitor clicks on the specific user in the row (can also be a button or an icon in a row), the modal with additional info should open. Each detail modal should have : a ‘location.street’​ field, ‘location.city’​ field, ‘location.state’​ field, ‘location.postcode’​ field, ‘phone’​ field, ‘cell’​ field, modal should be closable so that visitor can browse/search on.

## Search

Display user search on top of the app. Search field should be case-insensitive and should filter the results by `name.first + name.last`​. When the user scrolls down, the search should follow the screen so that it is always visible. Search should filter all visible users and show only those which match the search string.

## Users API

Please read the documentation on the https://randomuser.me, and get users data from there.

## Settings page

On different URLs, for example, `/settings`, we should have a settings page. Here the visitor can set, from which nationalities users are fetched for browsing/searching.
Possible choices should be: CH, ES, FR, GB. There should be a button, link or something implemented so that visitors can access the settings page as well go back to the search/browse page. Settings should affect the home page and fetch the users based on their selected nationality.
Settings should be affected without page reloading.

### Goals

- Understanding of client requirements and communication.
- Problem solving.
- Understanding AntD and Design Tokens.

### Expectations

- You are required to design a custom hook that manages infinite scrolling. This hook should be able to detect the last element on the screen and update the data accordingly. You should further design a custom hook that manages all external http API calls.
- It is desirable that you do at least 1 unit test for 1 component you used.
- Use of Gitflow
- Use Webpack to create the react application instead of create-react-app.
- Follow airbnb react style guidelines.
- Use error boundaries for stability and error reporting.
- Use Ant Design and Design Tokens.
- Use design tokens in such way that modefying a single token should reflect changes across the application.

### Nice to have:

- Code splitting.
- Use of selectors for computed properties.
- Providing light and dark mode option.
