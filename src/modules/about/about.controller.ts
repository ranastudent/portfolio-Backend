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
      const parseResult = createAboutSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json(parseResult.error.issues);
      }

      const user = (req as any).user;
      if (user.role !== "ADMIN") {
        return res
          .status(403)
          .json({ message: "Only admin can create about info" });
      }

      const bodyData = parseResult.data;
      if (req.file) {
        bodyData.image = `/uploads/${req.file.filename}`; // local file path
      }
      const about = await AboutService.create(bodyData);
      res.status(201).json(about);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update About info (ADMIN only)
  static async update(req: Request, res: Response) {
    try {
      const parseResult = updateAboutSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json(parseResult.error.issues);
      }

      const user = (req as any).user;
      if (user.role !== "ADMIN") {
        return res
          .status(403)
          .json({ message: "Only admin can update about info" });
      }

      const about = await AboutService.update(parseResult.data);
      res.json(about);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

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
