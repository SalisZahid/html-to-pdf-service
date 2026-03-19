import { StatusCodes, getReasonPhrase } from "http-status-codes";

import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";
import { errorResponse } from "../utils/apiResponse.js";

export function notFoundHandler(req, res, next) {
  next(new AppError(`Not found: ${req.originalUrl}`, StatusCodes.NOT_FOUND));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || getReasonPhrase(statusCode);

  logger.error("Request error", {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: err.message,
    stack: err.stack,
  });

  if (process.env.NODE_ENV === "production" && statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    return errorResponse(res, {
      statusCode,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }

  return errorResponse(res, {
    statusCode,
    message,
    errors: err.errors || null,
  });
}

