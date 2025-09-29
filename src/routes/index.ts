import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import userRoutes from "../modules/user/user.route";
import blogRoutes from "../modules/blog/blog.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users",userRoutes );
router.use("/blogs", blogRoutes);


export default router;
