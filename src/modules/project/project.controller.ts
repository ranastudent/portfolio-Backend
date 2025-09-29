import { Request, Response } from "express";
import { ProjectService } from "./project.service";
import { createProjectSchema, updateProjectSchema } from "./project.validation";
import { MulterRequest } from "../../types/multer-request";

export class ProjectController {
  
  static async create(req: MulterRequest, res: Response) {
    try {
      const parseResult = createProjectSchema.safeParse(req.body);
      if (!parseResult.success) return res.status(400).json(parseResult.error.issues);

      const user = (req as any).user;
      if (user.role !== "ADMIN") return res.status(403).json({ message: "Only admin can create projects" });
      const thumbnail = req.file ? `/uploads/${req.file.filename}` : undefined;

      const project = await ProjectService.create(user.id, {...parseResult.data, ...(thumbnail && { thumbnail }),});
      res.status(201).json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const projects = await ProjectService.getAll();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const project = await ProjectService.getById(req.params.id);
      if (!project) return res.status(404).json({ message: "Project not found" });
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req: MulterRequest, res: Response) {
    try {
      const parseResult = updateProjectSchema.safeParse(req.body);
      if (!parseResult.success) return res.status(400).json(parseResult.error.issues);

      const user = (req as any).user;
      if (user.role !== "ADMIN") return res.status(403).json({ message: "Only admin can update projects" });
      const thumbnail = req.file ? `/uploads/${req.file.filename}` : undefined;

      const project = await ProjectService.update(req.params.id, {...parseResult.data, thumbnail});
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (user.role !== "ADMIN") return res.status(403).json({ message: "Only admin can delete projects" });

      await ProjectService.delete(req.params.id);
      res.json({ message: "Project deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
