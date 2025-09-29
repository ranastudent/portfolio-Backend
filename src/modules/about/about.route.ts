import { Router } from "express";
import { AboutController } from "./about.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Public
router.get("/", AboutController.get);

// Private (admin only)
router.post("/", authMiddleware(["ADMIN"]), AboutController.create);
router.patch("/", authMiddleware(["ADMIN"]), AboutController.update);

export default router;
