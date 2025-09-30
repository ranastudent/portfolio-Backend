import { Router } from "express";
import { ResumeController } from "./resume.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Auth required
router.get("/", authMiddleware, ResumeController.get);
router.post("/", authMiddleware, ResumeController.save);
router.patch("/", authMiddleware, ResumeController.update);
router.delete("/", authMiddleware, ResumeController.delete);
router.get("/:userEmail", authMiddleware, ResumeController.getByEmail);

export default router;
