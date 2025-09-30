import { Request, Response } from "express";
import { BlogService } from "./blog.service";
import { createBlogSchema, updateBlogSchema } from "./blog.validation";
import prisma from "../../utils/prisma";

export class BlogController {
  static async create(req: Request, res: Response) {
    try {
      const parseResult = createBlogSchema.safeParse(req.body);
      if (!parseResult.success) return res.status(400).json(parseResult.error.issues);

      const userId = (req as any).user.id;
      const blog = await BlogService.create(userId, parseResult.data);
      res.status(201).json(blog);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const blogs = await BlogService.getAll();
      res.json(blogs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
  try {
    const blog = await BlogService.getById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Increment view count
    await prisma.blog.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } },
    });

    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


  static async update(req: Request, res: Response) {
    try {
      const parseResult = updateBlogSchema.safeParse(req.body);
      if (!parseResult.success) return res.status(400).json(parseResult.error.issues);

      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;
      const blog = await BlogService.update(req.params.id, userId, parseResult.data, userRole);
      res.json(blog);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;
      await BlogService.delete(req.params.id, userId, userRole);
      res.json({ message: "Blog deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
