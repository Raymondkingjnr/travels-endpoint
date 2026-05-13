# complete authentication process

A clean RESTful API for user authentication and account management, built with Node.js, Express, MongoDB, and JWT-based authentication.

complete authentication process provides the backend foundation for a travel application. It currently focuses on secure user registration, login, email verification, password recovery, protected user profile access, and cookie/Bearer-token authentication. The project is structured with separate route, controller, middleware, model, configuration, and database layers so it can grow into a larger production API without becoming difficult to maintain.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens
- **Password Security:** bcryptjs
- **Email Delivery:** Nodemailer with Gmail SMTP
- **Environment Management:** dotenv
- **Logging:** Morgan
- **CORS:** cors
- **Deployment Target:** Vercel serverless functions
- **Package Manager:** pnpm or npm

## Key Features

- User registration with hashed passwords
- JWT authentication using both HTTP-only cookies and `Authorization` headers
- Email verification with short verification tokens
- Resend verification token flow
- Login and logout support
- Forgot password and password recovery flow
- Authenticated password change endpoint
- Protected user lookup endpoint
- Centralized error handling middleware
- MongoDB connection through Mongoose
- CORS configured for credential-based frontend requests
- Modular API architecture for easier scaling and maintenance

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js 18 or newer
- pnpm or npm
- A MongoDB database connection string
- A Gmail account or app password for sending emails through Nodemailer

### Clone the Repository

```bash
git clone <repository-url>
cd travles-api
```

### Install Dependencies

Using pnpm:

```bash
pnpm install
```

Using npm:

```bash
npm install
```

## Environment Variable Setup

Create a `.env.local` file in the project root for local development:

```env
PORT=3000
NODE_ENV=development

DB_URL=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
SERVER_URL=http://localhost:3000

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d

GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password
```

### Environment Variables Explained

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | Yes | Port used by the local Express server. |
| `NODE_ENV` | Yes | Use `development` locally so `.env.local` is loaded. |
| `DB_URL` | Yes | MongoDB connection URI. |
| `SERVER_URL` | Recommended | Base server URL for the API environment. |
| `JWT_SECRET` | Yes | Secret key used to sign and verify JWTs. |
| `JWT_EXPIRES_IN` | Yes | JWT lifetime, such as `1d`, `7d`, or `30d`. |
| `GMAIL_USER` | Yes | Gmail address used to send verification and password reset emails. |
| `GMAIL_PASS` | Yes | Gmail app password used by Nodemailer. |

> Never commit `.env`, `.env.local`, or production secrets to Git.

## Running the Project Locally

Start the development server with automatic restarts:

```bash
pnpm dev
```

or:

```bash
npm run dev
```

Start the server in normal Node.js mode:

```bash
pnpm start
```

or:

```bash
npm start
```

When the server starts successfully, you should see output similar to:

```text
Listening on http://localhost:3000
MongoDB connected
```

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Runs the API with `nodemon` for local development. |
| `pnpm start` | Runs the API with Node.js. |
| `npm run dev` | npm equivalent of the development command. |
| `npm start` | npm equivalent of the production-style start command. |

## API Base URL

Local base URL:

```text
http://localhost:3000/api/v1
```

Root health/welcome route:

```http
GET /
```

Response:

```text
welcome to travels API
```

## Authentication Overview

The API uses JWT authentication. After a successful registration or login, the API returns a token in the JSON response and also sets it as an HTTP-only cookie named `token`.

Protected routes can be accessed in either of these ways:

### Option 1: Bearer Token

```http
Authorization: Bearer <jwt-token>
```

### Option 2: HTTP-only Cookie

If your frontend sends requests with credentials enabled, the browser can send the `token` cookie automatically.

Example frontend request configuration:

```js
fetch("http://localhost:3000/api/v1/users/<user-id>", {
  credentials: "include"
});
```

## API Endpoints

### Register User

Creates a new user, hashes their password, generates an email verification token, sends the verification email, returns a JWT, and sets the `token` cookie.

```http
POST /api/v1/auth/register
```

Request body:

```json
{
  "name": "Raymond",
  "email": "raymond@example.com",
  "password": "password123"
}
```

Success response:

```json
{
  "success": true,
  "message": "User created successfully. Verification code sent to email.",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "65f1c2a8d9a1b2c3d4e5f678",
      "name": "Raymond",
      "email": "raymond@example.com",
      "password": "hashed_password",
      "isVerified": false,
      "verificationToken": "A1B2",
      "verificationTokenExpiresAt": "2026-05-13T13:00:00.000Z",
      "resetPasswordToken": null,
      "resetPasswordExpiresAt": null,
      "createdAt": "2026-05-13T12:00:00.000Z",
      "updatedAt": "2026-05-13T12:00:00.000Z"
    }
  }
}
```

### Verify Email

Verifies a user's email address using the token sent to their email.

```http
POST /api/v1/auth/verify-email
```

Request body:

```json
{
  "email": "raymond@example.com",
  "token": "A1B2"
}
```

Success response:

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Resend Verification Token

Generates and emails a new verification token for an unverified user.

```http
POST /api/v1/auth/resend-verification-token
```

Request body:

```json
{
  "email": "raymond@example.com"
}
```

Success response:

```json
{
  "success": true,
  "message": "Verification code sent successfully"
}
```

### Login User

Authenticates a user with email and password, then returns a JWT and sets the `token` cookie.

```http
PUT /api/v1/auth/login
```

Request body:

```json
{
  "email": "raymond@example.com",
  "password": "password123"
}
```

Success response:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "65f1c2a8d9a1b2c3d4e5f678",
      "name": "Raymond",
      "email": "raymond@example.com",
      "isVerified": true,
      "createdAt": "2026-05-13T12:00:00.000Z",
      "updatedAt": "2026-05-13T12:10:00.000Z"
    }
  }
}
```

### Logout User

Clears the authentication cookie.

```http
POST /api/v1/auth/logout
```

Success response:

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

### Forgot Password

Generates a password reset token and emails it to the user.

```http
POST /api/v1/auth/forgot-password
```

Request body:

```json
{
  "email": "raymond@example.com"
}
```

Success response:

```json
{
  "success": true,
  "message": "Verification code sent successfully"
}
```

### Recover Password

Resets a user's password using a valid reset token.

```http
POST /api/v1/auth/recover-password
```

Request body:

```json
{
  "email": "raymond@example.com",
  "token": "C3D4",
  "password": "newPassword123"
}
```

Success response:

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Change Password

Changes the password for the currently authenticated user.

```http
PUT /api/v1/auth/change-password
```

Authorization required:

```http
Authorization: Bearer <jwt-token>
```

Request body:

```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword123"
}
```

Success response:

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Get All Users

Returns all users.

```http
GET /api/v1/users
```

Success response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1c2a8d9a1b2c3d4e5f678",
      "name": "Raymond",
      "email": "raymond@example.com",
      "isVerified": true,
      "createdAt": "2026-05-13T12:00:00.000Z",
      "updatedAt": "2026-05-13T12:10:00.000Z"
    }
  ]
}
```

### Get User by ID

Returns a single user by MongoDB user ID. This route is protected.

```http
GET /api/v1/users/:id
```

Authorization required:

```http
Authorization: Bearer <jwt-token>
```

Success response:

```json
{
  "success": true,
  "data": {
    "_id": "65f1c2a8d9a1b2c3d4e5f678",
    "name": "Raymond",
    "email": "raymond@example.com",
    "isVerified": true,
    "createdAt": "2026-05-13T12:00:00.000Z",
    "updatedAt": "2026-05-13T12:10:00.000Z"
  }
}
```

### Edit User Placeholder

This route is currently a protected placeholder that echoes the request body.

```http
POST /api/v1/users/edit/:id
```

Authorization required:

```http
Authorization: Bearer <jwt-token>
```

Request body:

```json
{
  "name": "Updated Name"
}
```

Response:

```json
{
  "name": "Updated Name"
}
```

## Error Handling Format

Most application errors are returned through the centralized error middleware in this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Unauthorized requests return:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

Unauthorized JWT verification failures may also include an error field:

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "jwt expired"
}
```

Common error scenarios:

| Status | Example Cause |
| --- | --- |
| `400` | Invalid password, invalid token, validation error, or duplicate value. |
| `401` | Missing, invalid, or expired authentication token. |
| `404` | User or resource not found. |
| `409` | User already exists during registration. |
| `500` | Unexpected server error. |

## Folder Structure

```text
travles-api/
├── app.js                         # Main Express app, middleware, routes, and server startup
├── bin/
│   └── www                        # Express generator server bootstrap file
├── config/
│   ├── env.js                     # Environment variable loading and exports
│   └── nodemiler.js               # Nodemailer Gmail transporter
├── controllers/
│   ├── auth.controllers.js        # Authentication and password controller logic
│   └── users.contollers.js        # User controller logic
├── database/
│   └── mongodb.js                 # MongoDB connection helper
├── middlewares/
│   ├── auth.middleware.js         # JWT authorization middleware
│   └── error.middleware.js        # Centralized error middleware
├── modals/
│   └── users.modals.js            # Mongoose user schema and model
├── public/
│   ├── index.html                 # Static public page
│   └── stylesheets/
│       └── style.css              # Static stylesheet
├── routes/
│   ├── auth.routes.js             # Authentication route definitions
│   └── users.routes.js            # User route definitions
├── utils/
│   └── email-template.js          # Email HTML template helpers
├── vercel.json                    # Vercel deployment configuration
├── package.json                   # Scripts and dependencies
├── pnpm-lock.yaml                 # pnpm lockfile
└── README.md                      # Project documentation
```

## Architecture Notes

The project follows a simple layered Express architecture:

- **Routes** define public API paths and attach middleware.
- **Controllers** contain request handling and business logic.
- **Models** define MongoDB document structure with Mongoose.
- **Middlewares** handle cross-cutting concerns such as authentication and error formatting.
- **Config files** centralize environment and external service setup.
- **Utilities** hold reusable helpers such as email templates.

This separation keeps the API beginner-friendly while still making it practical to extend with travel bookings, destinations, payments, admin roles, reviews, and other product modules.

## Dependencies Used

### Runtime Dependencies

| Package | Purpose |
| --- | --- |
| `express` | HTTP server and routing framework. |
| `mongoose` | MongoDB object modeling and schema management. |
| `mongodb` | MongoDB driver dependency. |
| `jsonwebtoken` | JWT creation and verification. |
| `bcryptjs` | Password hashing and comparison. |
| `cookie-parser` | Reading cookies from incoming requests. |
| `cors` | Cross-origin request support. |
| `dotenv` | Loading environment variables from local files. |
| `morgan` | HTTP request logging middleware. |
| `nodemailer` | Sending verification and password reset emails. |
| `debug` | Debug logging utility. |

### Development Dependencies

| Package | Purpose |
| --- | --- |
| `nodemon` | Restarts the server automatically during development. |
| `eslint` | JavaScript linting. |
| `@eslint/js` | ESLint JavaScript configuration helpers. |
| `globals` | Shared global variable definitions for ESLint. |

## Deployment Guide

The repository includes a `vercel.json` file configured to deploy `app.js` through `@vercel/node`.

### Deploying to Vercel

1. Push the project to GitHub, GitLab, or Bitbucket.
2. Import the repository into Vercel.
3. Add the required environment variables in the Vercel project settings:

```env
NODE_ENV=production
DB_URL=<production-mongodb-uri>
SERVER_URL=<production-api-url>
JWT_SECRET=<production-jwt-secret>
JWT_EXPIRES_IN=7d
GMAIL_USER=<gmail-address>
GMAIL_PASS=<gmail-app-password>
```

4. Deploy the project.
5. Test the deployed root route:

```http
GET https://your-vercel-domain.vercel.app/
```

Production notes:

- Use a strong, unique `JWT_SECRET`.
- Use a MongoDB Atlas database or another production-ready MongoDB provider.
- Configure your frontend to send credentials if you rely on cookie authentication.
- Keep Gmail app passwords and database credentials private.

## Testing Instructions

No automated test script is currently defined in `package.json`.

You can manually test the API with Postman, Insomnia, Thunder Client, or `curl`.

Example health check:

```bash
curl http://localhost:3000/
```

Example registration request:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raymond",
    "email": "raymond@example.com",
    "password": "password123"
  }'
```

Example authenticated request:

```bash
curl http://localhost:3000/api/v1/users/65f1c2a8d9a1b2c3d4e5f678 \
  -H "Authorization: Bearer <jwt-token>"
```

Recommended future test coverage:

- Authentication controller unit tests
- User route integration tests
- Validation and error middleware tests
- Password reset and verification token tests
- Protected route authorization tests

## Contribution Guidelines

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Install dependencies and run the project locally.
4. Make focused changes with clear commit messages.
5. Test your changes manually or with automated tests when available.
6. Open a pull request with a summary of what changed and how it was tested.

Development guidelines:

- Keep routes thin and place business logic in controllers or services.
- Keep environment secrets out of Git.
- Return consistent JSON response shapes.
- Add validation for new request payloads.
- Add tests when introducing new behavior.

## License

This project is currently private and does not declare a license in `package.json`.

If you plan to make the repository public, add a license file such as `MIT`, `Apache-2.0`, or another license that matches your intended usage.
