import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Admin-only stats
router.get("/stats", authMiddleware, DashboardController.getStats);

export default router;
