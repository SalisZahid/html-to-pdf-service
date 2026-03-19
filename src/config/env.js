import dotenv from "dotenv";

dotenv.config();

const required = (value, key) => {
  if (value === undefined || value === null || value === "") {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

const NODE_ENV = process.env.NODE_ENV || "development";

export const env = {
  NODE_ENV,
  PORT: process.env.PORT || 4000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  // DB & Auth — uncomment when MongoDB is enabled
  // MONGODB_URI:
  //   process.env.MONGODB_URI ||
  //   (NODE_ENV === "test" ? "mongodb://127.0.0.1:27017/datarover_test" : "mongodb://127.0.0.1:27017/datarover"),
  // JWT_SECRET: process.env.JWT_SECRET || "dummy_jwt_secret_change_me",
  // JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
};

