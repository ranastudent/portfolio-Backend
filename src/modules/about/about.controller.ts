import { Request, Response } from "express";
import { AboutService } from "./about.service";
import { createAboutSchema, updateAboutSchema } from "./about.validation";

export class AboutController {
  // Get About info
  static async get(req: Request, res: Response) {
    try {
      const about = await AboutService.get();

      // Optional: prepend host to image URL if exists
      if (about?.image) {
        about.image = `${req.protocol}://${req.get("host")}${about.image}`;
      }

      res.json(about);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Create About info (ADMIN only)
  static async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (user.role !== "ADMIN") {
        return res.status(403).json({ message: "Only admin can create about info" });
      }

      // Parse skills from string or array
      const skills: string[] =
        typeof req.body.skills === "string"
          ? req.body.skills.split(",").map((s: string) => s.trim())
          : Array.isArray(req.body.skills)
          ? req.body.skills.map((s: string) => s.trim())
          : [];

      const bodyData = {
        name: req.body.name,
        bio: req.body.bio,
        email: req.body.email,
        contact: req.body.contact,
        skills,
        image: req.body.image || null, // JSON expects URL string
      };

      const parseResult = createAboutSchema.safeParse(bodyData);
      if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error.issues });
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
        return res.status(403).json({ message: "Only admin can update about info" });
      }

      const skills: string[] | undefined =
        typeof req.body.skills === "string"
          ? req.body.skills.split(",").map((s: string) => s.trim())
          : Array.isArray(req.body.skills)
          ? req.body.skills.map((s: string) => s.trim())
          : undefined;

      const bodyData = {
        name: req.body.name,
        bio: req.body.bio,
        email: req.body.email,
        contact: req.body.contact,
        skills,
        image: req.body.image || undefined, // JSON expects URL string
      };

      const parseResult = updateAboutSchema.safeParse(bodyData);
      if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error.issues });
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
        return res.status(403).json({ message: "Only admin can delete about info" });
      }

      const result = await AboutService.delete();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
