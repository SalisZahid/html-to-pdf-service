import { StatusCodes } from "http-status-codes";

import { verifyJwt } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";
import { userRepository } from "../repositories/user.repository.js";

export const authMiddleware = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("Authentication required", StatusCodes.UNAUTHORIZED);
    }

    const token = header.split(" ")[1];
    const decoded = verifyJwt(token);

    const user = await userRepository.findById(decoded.sub);
    if (!user) {
      throw new AppError("User no longer exists", StatusCodes.UNAUTHORIZED);
    }

    req.user = user;
    next();
  } catch (error) {
    if (!(error instanceof AppError)) {
      return next(new AppError("Invalid or expired token", StatusCodes.UNAUTHORIZED));
    }
    return next(error);
  }
};

