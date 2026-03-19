import Joi from "joi";
import { StatusCodes } from "http-status-codes";

import { AppError } from "../utils/AppError.js";

export const validate =
  (schema, property = "body") =>
  (req, _res, next) => {
    if (!schema || !Joi.isSchema(schema)) {
      throw new Error("Validation schema must be a Joi schema");
    }

    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      return next(new AppError("Validation error", StatusCodes.BAD_REQUEST, details));
    }

    // overwrite with validated value
    req[property] = value;
    return next();
  };

