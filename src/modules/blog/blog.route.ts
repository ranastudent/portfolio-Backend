import { Router } from "express";
import { BlogController } from "./blog.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Public
router.get("/", BlogController.getAll);
router.get("/:id", BlogController.getById);

// Private
router.post("/", authMiddleware(["ADMIN"]), BlogController.create);
router.put("/:id", authMiddleware(["ADMIN"]), BlogController.update);
router.delete("/:id", authMiddleware(["ADMIN"]), BlogController.delete);

export default router;
