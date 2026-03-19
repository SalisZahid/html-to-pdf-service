import { logger } from "../utils/logger.js";

export function requestLogger(req, _res, next) {
  logger.info("Incoming request", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });
  next();
}

