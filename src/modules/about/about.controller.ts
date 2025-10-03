import { Request, Response } from "express";
import { AboutService } from "./about.service";
import { createAboutSchema, updateAboutSchema } from "./about.validation";

export class AboutController {
  // Get About info
  static async get(req: Request, res: Response) {
    try {
      const about = await AboutService.get();
      res.json(about);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Create About info (only once, ADMIN only)
  static async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (user.role !== "ADMIN") {
        return res
          .status(403)
          .json({ message: "Only admin can create about info" });
      }

      // Build body manually because req.body from multipart/form-data are strings
      const bodyData = {
        name: req.body.name,
        bio: req.body.bio,
        email: req.body.email,
        contact: req.body.contact,
        skills: req.body.skills
          ? req.body.skills.split(",").map((skill: string) => skill.trim())
          : [],
        image: req.file ? `/uploads/${req.file.filename}` : undefined,
      };

      // Validate with Zod
      const parseResult = createAboutSchema.safeParse(bodyData);
      if (!parseResult.success) {
        return res.status(400).json(parseResult.error.issues);
      }

      const about = await AboutService.create(parseResult.data);
      res.status(201).json(about);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update About info (ADMIN only)
  static async update(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (user.role !== "ADMIN") {
        return res
          .status(403)
          .json({ message: "Only admin can update about info" });
      }

      // Build body manually for multipart/form-data
      const bodyData = {
        name: req.body.name,
        bio: req.body.bio,
        email: req.body.email,
        contact: req.body.contact,
        skills: req.body.skills
          ? req.body.skills.split(",").map((skill: string) => skill.trim())
          : undefined,
        image: req.file ? `/uploads/${req.file.filename}` : undefined,
      };

      // Validate
      const parseResult = updateAboutSchema.safeParse(bodyData);
      if (!parseResult.success) {
        return res.status(400).json(parseResult.error.issues);
      }

      const about = await AboutService.update(parseResult.data);
      res.json(about);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete About info (ADMIN only)
  static async delete(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (user.role !== "ADMIN") {
        return res
          .status(403)
          .json({ message: "Only admin can delete about info" });
      }

      const result = await AboutService.delete();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
