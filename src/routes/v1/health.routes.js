import { Router } from "express";

import { healthCheck } from "../../controllers/health.controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get("/", healthCheck);

export default router;

