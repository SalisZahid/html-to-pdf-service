import { StatusCodes } from "http-status-codes";

import { userRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/AppError.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signJwt } from "../utils/jwt.js";

export const authService = {
  async register({ name, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError("Email already in use", StatusCodes.CONFLICT);
    }

    const hashed = await hashPassword(password);
    const user = await userRepository.create({ name, email, password: hashed });

    const token = signJwt({ sub: user.id });

    return { user, token };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const token = signJwt({ sub: user.id });

    user.password = undefined;

    return { user, token };
  },
};

