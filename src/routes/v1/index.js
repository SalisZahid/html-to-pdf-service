import { Router } from "express";

import healthRoutes from "./health.routes.js";
import pdfRoutes from "./pdf.routes.js";

// DB-dependent routes (auth, users) are disabled until MongoDB is connected.
// import authRoutes from "./auth.routes.js";
// import userRoutes from "./user.routes.js";

const router = Router();

// router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
router.use("/health", healthRoutes);
router.use("/", pdfRoutes);

export default router;

