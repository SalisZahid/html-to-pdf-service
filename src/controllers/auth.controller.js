import { StatusCodes } from "http-status-codes";

import { authService } from "../services/auth.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { catchAsync } from "../utils/catchAsync.js";

export const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  return successResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "User registered successfully",
    data: { user, token },
  });
});

export const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  return successResponse(res, {
    message: "Logged in successfully",
    data: { user, token },
  });
});

