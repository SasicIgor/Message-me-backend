# MESSAGE ME (chat app) backend

## 1. Goal

Goal of the project is to get familiar with backend side of application as a front end developer.

## Prerequisites, configuration and installation

### prerequisites:

- **Node.js Version**: You must use **Node.js v23.6.0 or higher** to run the API directly. This version includes native support for executing TypeScript files and strips the type annotations.

### configuration:

- To configure project you will need next <mark>.env</mark> variables:
  - PORT
  - NEON_DB_URL
  - BCRYPT_ROUNDS
  - JWT_SECRET

### install:

- download repository
- in the terminal run:
  - npm i
  - npm run dev

## Technologies

- Runtime: **Node.js**,
- Framework: **Express**,
- Database: **Neon Postgres**,
- Auth: **JWT**(JSON web token),
- Real-time communication: **Socket.io** (to be implemented)

## Features

- **Authentication**: With username and password.
- **Chat Persistance**: Storing chat information, private and group.
- **Message Persistance**: Store message history using Neon.
- **Real-time Chat**: Instant message delivery via Socket.io (soon)

## API endpoints

Base api URL: http://localhost:${PORT}/api/v1

#### USER ROUTES

-route path: <mark>/auth/user</mark>
| Method | Endpoint | Description | JWT? | expects | returns |
| ------ | -------- | ----------- | ---- | ------ | -------- |
| POST | /register| register user | false | username, email, password, confirmedPassword | message, newUser (username, id), token |
| POST | /login| login user | false | username, password | message, user, token |
| PATCH | /update | update user | true | username or email | message, user |
| DELETE | /delete | delete user | true | null | null |

#### CHAT ROUTES

-route path: <mark>/chats</mark>
| Method | Endpoint | Description | JWT? | expects | returns |
| ------ | -------- | ----------- | ---- | ------ | -------- |
| GET | / | Get chats for a user | true | null | message, chats |
| POST | /private| get/create private chat (1v1) | true | memberId (other user)| message, chat |
| POST | /group | creates group chat | true | memberId (other users as array), name? (default "new group") | message, chat
| PUT | /:chatId | updates chat name | true | name | message, chat |
| PATCH | /:chatId | updates chat members | true | memberId | message |
| DELETE | /:chatId | delete's chat for a user | true | null | null |

#### MESSAGE ROUTES

- route path: <mark>/messages</mark>

| Method | Endpoint            | Description             | JWT? | expects | returns       |
| ------ | ------------------- | ----------------------- | ---- | ------- | ------------- |
| GET    | /:chatId            | Get messages for a user | true | null    | message, msgs |
| POST   | /:chatId            | Creates message         | true | content | message, msg  |
| PATCH  | /:chatId/:messageId | Edit message            | true | content | message, msg  |
| DELETE | /:chatId/:messageId | Delete message          | true | null    | null          |
