import winston from "winston";

import { env } from "../config/env.js";

const { combine, timestamp, json, colorize, printf } = winston.format;

const consoleFormat = combine(
  colorize(),
  timestamp(),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${ts} [${level}]: ${message}${metaString}`;
  })
);

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console({
      format: env.NODE_ENV === "production" ? combine(timestamp(), json()) : consoleFormat,
    }),
  ],
});

// morgan stream for HTTP logging
export const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

