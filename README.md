# Travles API

Simple Express + MongoDB API for user authentication.

## Tech Stack

- Node.js (ES modules)
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Cookies (`cookie-parser`)
- Password hashing (`bcryptjs`)

## Prerequisites

- Node.js 18+ (recommended)
- MongoDB connection string

## Setup

1. Install dependencies:

```bash
pnpm install
```

or

```bash
npm install
```

2. Create `.env.local` in the project root:

```env
PORT=3000
DB_URL=mongodb://127.0.0.1:27017/travles-api
SERVER_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

3. Start the server:

```bash
pnpm dev
```

or

```bash
npm run dev
```

## Scripts

- `pnpm dev` / `npm run dev`: run with nodemon
- `pnpm start` / `npm start`: run with node

## API Base URL

`http://localhost:<PORT>/api/v1`

## Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`

`register` and `login` return a JWT and also set an HTTP-only `token` cookie.  
`logout` clears the `token` cookie.

Example register/login body:

```json
{
  "name": "Raymond",
  "email": "raymond@example.com",
  "password": "password123"
}
```

Example logout response:

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

### Users (placeholder routes)

- `GET /users`
- `GET /users/:id`

## Project Structure

```text
.
├── app.js
├── config/
├── controllers/
├── database/
├── middlewares/
├── modals/
└── routes/
```

## Notes

- Environment variables are loaded from `.env.local` when `NODE_ENV=development`.
- Root health route: `GET /` returns `welcome to travels API`.
