# ![RealWorld Example App](logo.png)

> ### Express.js + Couchbase + JavaScript codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

This is a fork of https://github.com/winterrrrrff/realWorld-server, using Couchbase and Ottoman.js instead of MongoDB and Mongoose.


### [Demo](https://demo.realworld.io/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a fully fledged fullstack application built with **Express.js + Couchbase + JavaScript** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Express.js + Couchbase + JavaScript** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# Getting started

1. install npm
1. Run `npm install` in the project folder
1. Run `npm run dev` for dev mode and `npm run start` for regular mode

# How it works

> All the routes are defined in the `routes` folder, and their corresponding controllers are implemented in the `controllers` folder.

# Design Choices and Tradeoffs

- Only one `access_token_secret` is used for all the accounts registration and login. Drawback: data can be forged if this secret is leaked
- Included array structures, e.g. list of comments in the article model and favorited articles in the user model. Drawback: not good for scalability
- Usernames are case-sensitive
