import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { Role } from "../../constants/roles";

const router = Router();

// Admin only
router.get("/", authMiddleware([Role.ADMIN]), UserController.getAll);
router.get("/:id", authMiddleware([Role.ADMIN]), UserController.getById);
router.delete("/:id", authMiddleware([Role.ADMIN]), UserController.delete);

// Logged-in user
router.put("/me", authMiddleware(), UserController.update);

export default router;
