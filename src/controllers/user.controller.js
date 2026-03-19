import { StatusCodes } from "http-status-codes";

import { userService } from "../services/user.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  return successResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "User created successfully",
    data: user,
  });
});

export const getUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const users = await userService.getUsers({
    page: Number(page) || 1,
    limit: Number(limit) || 20,
  });
  return successResponse(res, {
    message: "Users fetched successfully",
    data: users,
  });
});

export const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return successResponse(res, {
    message: "User fetched successfully",
    data: user,
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return successResponse(res, {
    message: "User updated successfully",
    data: user,
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  return successResponse(res, {
    message: "User deleted successfully",
  });
});

