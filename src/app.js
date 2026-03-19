import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import { env } from "./config/env.js";
import { logger, morganStream } from "./utils/logger.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { requestLogger } from "./middlewares/logging.middleware.js";
import v1Router from "./routes/v1/index.js";
import { setupSwagger } from "./docs/swagger.js";

const app = express();

// Security middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "60mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev", { stream: morganStream }));
app.use(requestLogger);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// API versioning
app.use("/api/v1", v1Router);

// Swagger docs
setupSwagger(app);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", { reason });
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", { error: err });
});

export { app };
