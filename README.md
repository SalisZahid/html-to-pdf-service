# Introduction

TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project.

# Getting Started

TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:

1. Installation process
2. Software dependencies
3. Latest releases
4. API references

# Build and Test

TODO: Describe and show how to build your code and run the tests.

# Contribute

TODO: Explain how other users and developers can contribute to make your code better.

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:

- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)

## Datarover Backend

Production-ready Node.js backend skeleton with a clean, scalable architecture. Built with Express, MongoDB (Mongoose), JWT auth, and best practices suitable for a SaaS product.

### Tech Stack

- **Runtime**: Node.js (ES modules, latest LTS)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT + bcrypt for password hashing
- **Validation**: Joi
- **Config**: dotenv-based env management
- **Logging**: Winston (+ morgan HTTP logging)
- **Security**: Helmet, CORS, rate limiting
- **Docs**: Swagger (OpenAPI 3)

### Folder Structure

```text
src/
  app.js               # Express app bootstrap (middleware, routes, swagger)
  server.js            # HTTP server + DB bootstrap

  config/
    env.js             # Environment variables and config
    db.js              # MongoDB connection via Mongoose

  controllers/         # Request/response layer (thin, no business logic)
    auth.controller.js
    user.controller.js
    health.controller.js

  services/            # Business logic layer
    auth.service.js
    user.service.js

  repositories/        # Data access layer (Mongoose queries)
    user.repository.js

  models/              # Mongoose schemas/models
    user.model.js

  routes/
    v1/                # API versioning (/api/v1)
      index.js
      auth.routes.js
      user.routes.js
      health.routes.js

  middlewares/
    auth.middleware.js         # JWT auth guard
    error.middleware.js        # 404 + global error handler
    logging.middleware.js      # Request logging via Winston
    validation.middleware.js   # Joi-based request validation

  validators/
    auth.validator.js
    user.validator.js

  utils/
    logger.js          # Winston logger + morgan stream
    apiResponse.js     # Success/error response formatters
    AppError.js        # Custom error class
    catchAsync.js      # Async controller wrapper
    jwt.js             # JWT helpers
    password.js        # bcrypt helpers

  constants/
    http.js            # Example constants (roles)

  docs/
    swagger.js         # Swagger setup (OpenAPI 3)

  jobs/
    example.job.js     # Placeholder for background jobs
```

### Core Modules

- **Auth**
  - `POST /api/v1/auth/register` – register user, hash password, return JWT.
  - `POST /api/v1/auth/login` – login with email/password, return JWT.
  - Uses `auth.service.js`, `user.repository.js`, `password.js`, `jwt.js`.
  - `auth.middleware.js` protects downstream routes by validating `Authorization: Bearer <token>`.

- **User**
  - `POST /api/v1/users` – create user (protected).
  - `GET /api/v1/users` – list users with pagination params (`page`, `limit`).
  - `GET /api/v1/users/:id` – get single user.
  - `PATCH /api/v1/users/:id` – update user.
  - `DELETE /api/v1/users/:id` – delete user.

### Cross-Cutting Concerns & Best Practices

- **Async/await & error handling**
  - Controllers are wrapped with `catchAsync` so all errors flow into the centralized `errorHandler`.
  - `AppError` carries HTTP status codes, human messages, and optional error details.

- **Validation**
  - `validation.middleware.js` wraps Joi schemas; each route passes a schema (e.g. `registerSchema`, `loginSchema`).
  - On validation failure, an `AppError` with `400` is thrown and formatted by the global error handler.

- **Response formatting**
  - `successResponse` and `errorResponse` ensure consistent JSON shape across the API.

- **Env-based config**
  - `env.js` reads `.env` (via `dotenv`) and enforces required vars (e.g. `JWT_SECRET`).
  - Different MongoDB URIs for `development` and `test`.

- **Security & logging**
  - `helmet`, `cors`, and `express-rate-limit` configured in `app.js`.
  - `winston` for structured logs, with `morgan` hooked into Winston via `morganStream`.

- **Versioning & health**
  - All business endpoints are under `/api/v1/...`.
  - `GET /api/v1/health` and root `/health` for basic health checks.

### API Documentation

- Swagger docs served at: `GET /api-docs`
- OpenAPI spec is generated from JSDoc comments in `src/routes/v1/*.js` and the base config in `src/docs/swagger.js`.

### Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create `.env` file**

   ```bash
   cp .env.example .env
   ```

   Minimal variables:

   ```bash
   NODE_ENV=development
   PORT=4000
   MONGODB_URI=mongodb://127.0.0.1:27017/datarover
   JWT_SECRET=change_me
   JWT_EXPIRES_IN=1d
   CORS_ORIGIN=*
   LOG_LEVEL=info
   ```

3. **Run in development**

   ```bash
   npm run dev
   ```

4. **Production run**

   ```bash
   npm start
   ```

### NPM Scripts

- **`npm run dev`** – start server with `nodemon`.
- **`npm start`** – start server with Node.
- **`npm run lint`** – run ESLint on `src/**/*.js`.
- **`npm run format`** – run Prettier on `src/**/*.js`.

### Extending the Architecture

- Add new modules by following the same pattern:
  - `models/*` → `repositories/*` → `services/*` → `controllers/*` → `routes/v1/*`.
- Keep controllers thin; put business logic in services.
- Add background processing in `jobs/` (e.g., queue workers with Bull/Agenda).
