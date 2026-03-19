import mongoose from "mongoose";

import { env } from "./env.js";
import { logger } from "../utils/logger.js";

mongoose.set("strictQuery", true);

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== "production",
    });

    logger.info("Connected to MongoDB");

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error", { error: err });
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });
  } catch (error) {
    logger.error("Failed to connect to MongoDB", { error });
    throw error;
  }
}

