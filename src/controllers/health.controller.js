import { successResponse } from "../utils/apiResponse.js";

export function healthCheck(_req, res) {
  return successResponse(res, {
    message: "API is healthy",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
}

