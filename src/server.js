import http from "http";

import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const PORT = env.PORT;

async function startServer() {
  try {
    // Database connection is disabled for now so services can run without MongoDB.
    // To re-enable, import connectDB from ./config/db.js and call it here.
    // await connectDB();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode (DB disabled)`);
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
}

startServer();

