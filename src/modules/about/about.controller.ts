import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { AboutService } from "./about.service";
import { createAboutSchema, updateAboutSchema } from "./about.validation";

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export class AboutController {
  // Get About info
  static async get(req: Request, res: Response) {
    try {
      const about = await AboutService.get();

      // Optional: make image URL absolute
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
        image: req.file ? `/uploads/${req.file.filename}` : undefined,
      };

      const parseResult = createAboutSchema.safeParse(bodyData);
      if (!parseResult.success) {
        return res.status(400).json(parseResult.error.issues);
      }

      const about = await AboutService.create(parseResult.data);

      // Return absolute image URL
      if (about.image) {
        about.image = `${req.protocol}://${req.get("host")}${about.image}`;
      }

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
        image: req.file ? `/uploads/${req.file.filename}` : undefined,
      };

      const parseResult = updateAboutSchema.safeParse(bodyData);
      if (!parseResult.success) {
        return res.status(400).json(parseResult.error.issues);
      }

      const about = await AboutService.update(parseResult.data);

      if (about.image) {
        about.image = `${req.protocol}://${req.get("host")}${about.image}`;
      }

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
