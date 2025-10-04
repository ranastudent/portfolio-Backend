import { Router } from "express";
import { ProjectController } from "./project.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import multer from "multer";


const router = Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Public
router.get("/", ProjectController.getAll);
router.get("/:id", ProjectController.getById);

// Private (admin only, with file upload)
router.post("/", authMiddleware(["ADMIN"]), ProjectController.create);
router.patch("/:id", authMiddleware(["ADMIN"]), ProjectController.update);
router.delete("/:id", authMiddleware(["ADMIN"]), ProjectController.delete);

router.patch(
  "/fix-thumbnails",
  authMiddleware(["ADMIN"]),
  ProjectController.fixOldUrls
);

export default router;
