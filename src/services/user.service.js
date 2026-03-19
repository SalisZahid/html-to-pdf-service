import { StatusCodes } from "http-status-codes";

import { userRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/AppError.js";

export const userService = {
  async createUser(payload) {
    const existing = await userRepository.findByEmail(payload.email);
    if (existing) {
      throw new AppError("Email already in use", StatusCodes.CONFLICT);
    }
    return userRepository.create(payload);
  },

  async getUsers({ page = 1, limit = 20 } = {}) {
    return userRepository.findAll({}, { page, limit });
  },

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    return user;
  },

  async updateUser(id, payload) {
    const user = await userRepository.updateById(id, payload);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    return user;
  },

  async deleteUser(id) {
    const user = await userRepository.deleteById(id);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    return user;
  },
};

