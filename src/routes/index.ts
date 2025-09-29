import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import userRoutes from "../modules/user/user.route";
import blogRoutes from "../modules/blog/blog.route";
import projectRoutes from "../modules/project/project.route";
import aboutRoutes from "../modules/about/about.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users",userRoutes );
router.use("/blogs", blogRoutes);
router.use("/projects", projectRoutes);
router.use("/about", aboutRoutes);


export default router;
