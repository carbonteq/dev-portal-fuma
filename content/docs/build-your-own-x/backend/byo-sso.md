---
title: Build Your Own Single Sign On Server
---

## Problem Statement:

Single sign-on (SSO) is a user authentication method that allows users to access multiple applications or websites with one set of credentials. SSO can improve user experience, security and productivity by simplifying the login process and reducing the need for multiple passwords. Many enterprsie level platforms and services require implementation of SSO in order to simplify the logging in process, there are many popular technologies provided by cloud providers, such as SAML in Google Cloud and Okta. By performing this exercise devlepers will be learn the inner working of SSO and will be more adept in implementing the technology in production software. Apart from this, they will also learn about secure authentication which will increase the robustness and security of the application as well.

## Overview:

Single sign-on (SSO) is a session and user authentication service that permits a user to use one set of login credentials -- for example, a username and password to access multiple applications. SSO can be used by enterprises, small and midsize organizations, and individuals to ease the management of multiple credentials.

In a basic web SSO service, an agent module on the application server retrieves the specific authentication credentials for an individual user from a dedicated SSO policy server, while authenticating the user against a user repository, such as a Lightweight Directory Access Protocol directory. The service authenticates the end user for all the applications the user has been given rights to and eliminates future password prompts for individual applications during the same session.

There are many types of SSO, here are a few these listed:

1. Security Access Markup Language (SAML): This is an open standard that encodes text into machine language and enables the exchange of identification information. It has become one of the core standards for SSO and is used to help application providers ensure their authentication requests are appropriate.
2. Kerberos-based setup, once user credentials are provided, a ticket-granting ticket (TGT) is issued. The TGT fetches service tickets for other applications the user wants to access, without asking the user to reenter credentials.
3. Smart card-based SSO asks an end user to use a card holding the sign-in credentials for the first login. Once the card is used, the user does not have to reenter usernames or passwords. SSO smart cards store either certificates or passwords.

## Implementational Details:

The basic idea of building an SSO server is to create a central authority that can authenticate users and issue tokens that can be used by other applications or websites. The tokens can be based on standards such as OAuth 2.0 or OpenID Connect, which define how to exchange information between the SSO server and the relying parties (RPs).

The following diagram illustrates the general flow of an SSO scenario:
![Image](https://images.ctfassets.net/23aumh6u8s0i/4hakDPwQtaPfcDNwkd4C9x/e54ee76304953540b4b71fcccbaf690a/typical-sso-v2)

1. The user visits an <a href="https://en.wikipedia.org/wiki/Relying_party#:~:text=A%20relying%20party%20(RP)%20is,relying%20party%20(RP)%20applications.">Relying Party</a> (RP) website (e.g., domain1.com) and clicks on a login button.
2. The RP website redirects the user to the SSO server (e.g. sso.com) with some parameters such as the RP's identifier and the requested scope of access.
3. The SSO server presents a login form to the user and asks for their credentials (e.g. username and password).
4. The user enters their credentials and submits the form.
5. The SSO server validates the credentials and generates a token (e.g. an authorization code) for the user.
6. The SSO server redirects the user back to the RP website with the token as a query parameter.
7. The RP website exchanges the token with the SSO server for another token (e.g. an access token) that can be used to access protected resources on behalf of the user.
8. The RP website uses the token to make requests to its own backend or other APIs that trust the SSO server.
9. The user can repeat steps 1-8 for other RPs without having to enter their credentials again, as long as they have an active session with the SSO server.

## Exercise Details:

In this exercise you need to do the following:

- Create a centralized authorization server for a <a href="https://auth0.com/blog/how-saml-authentication-works/">SAML</a> like SSO.
- Implement routes for registration, login, logout and profile
- Implement middleware for session management and authentication
- Implement endpoints for authorization code grant flow
- Implement connect endpoints for discovery and userinfo
- Implement a proper log out mechanism that prevents access from all apps.

## Concerns:

#### Consider these three relationship in mind while writing the “Logout” Functionality.

1. Local session exists, global session must exist.
2. Global session exists, local session does not necessarily exist.
3. Global session is destroyed, local session must be destroyed.

#### If you are using JWT as the intermediate token please avoid sharing any critical data over this JWT.

## Further Learning:

1. Add role management into the SSO server you have made.
2. Make SSO server of types other than SAML.

## Resources:

1. <a href="https://www.techtarget.com/searchsecurity/definition/single-sign-on">What is single sign-on (SSO)?</a>
2. <a href="https://www.youtube.com/watch?v=O1cRJWYF-g4">What Is Single Sign-on (SSO)? How It Works</a>
3. <a href="https://www.youtube.com/watch?v=SvppXbpv-5k&t=833s">SAML 2.0: Technical Overview</a>
4. <a href="https://www.cloudflare.com/en-gb/learning/access-management/what-is-sso/">What is SSO? | How single sign-on works</a>
5. <a href="https://frontegg.com/blog/a-complete-guide-to-implementing-single-sign-on">A Complete Guide to Implementing Single Sign-on</a>
