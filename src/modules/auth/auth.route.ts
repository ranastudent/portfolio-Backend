import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import passport from "../../config/passport";

const router = Router();

// Normal auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", authMiddleware(), AuthController.getProfile);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  AuthController.googleCallback
);

export default router;
