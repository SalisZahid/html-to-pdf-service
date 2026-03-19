import { Router } from "express";

import { htmlToPdf } from "../../controllers/pdf.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { htmlToPdfSchema } from "../../validators/pdf.validator.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: PDF
 *   description: HTML to PDF conversion
 */

/**
 * @swagger
 * /api/v1/html-to-pdf:
 *   post:
 *     summary: Convert HTML to PDF
 *     tags: [PDF]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   html:
 *                     type: string
 *                     description: Full HTML document string
 *                 required: [html]
 *               - type: object
 *                 properties:
 *                   htmlParts:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Array of HTML fragments, each rendered as a page
 *                 required: [htmlParts]
 *     responses:
 *       200:
 *         description: Generated PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.post("/html-to-pdf", validate(htmlToPdfSchema), htmlToPdf);

export default router;

