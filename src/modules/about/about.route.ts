import { Router } from "express";
import { AboutController } from "./about.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();

// Public
router.get("/", AboutController.get);

// Private (admin only)
router.post("/", authMiddleware(["ADMIN"]),upload.single("image"), AboutController.create);
router.patch("/", authMiddleware(["ADMIN"]),upload.single("image"),AboutController.update);
router.delete("/", authMiddleware(["ADMIN"]), AboutController.delete);

export default router;
