import { Request, Response } from "express";
import { ProjectService } from "./project.service";
import { createProjectSchema, updateProjectSchema } from "./project.validation";
import { fixOldImageUrls } from "../../middlewares/fixImageUrl";

export class ProjectController {

   static async fixOldUrls(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (user.role !== "ADMIN")
        return res.status(403).json({ message: "Only admin can perform this action" });

      const count = await fixOldImageUrls();
      res.json({ message: `✅ Fixed ${count} invalid image URLs.` });
    } catch (error: any) {
      console.error("Error fixing image URLs:", error);
      res.status(500).json({ message: "Failed to fix image URLs", error: error.message });
    }
  }

  // CREATE project
  static async create(req: Request, res: Response) {
    try {
      const parseResult = createProjectSchema.safeParse(req.body);
      if (!parseResult.success)
        return res.status(400).json(parseResult.error.issues);

      const user = (req as any).user;
      if (user.role !== "ADMIN")
        return res.status(403).json({ message: "Only admin can create projects" });

      // Take thumbnail URL from JSON body
      const project = await ProjectService.create(user.id, parseResult.data);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET all projects
  static async getAll(req: Request, res: Response) {
    try {
      const projects = await ProjectService.getAll();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET single project by ID
  static async getById(req: Request, res: Response) {
    try {
      const project = await ProjectService.getById(req.params.id);
      if (!project) return res.status(404).json({ message: "Project not found" });
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // UPDATE project
  static async update(req: Request, res: Response) {
    try {
      const parseResult = updateProjectSchema.safeParse(req.body);
      if (!parseResult.success)
        return res.status(400).json(parseResult.error.issues);

      const user = (req as any).user;
      if (user.role !== "ADMIN")
        return res.status(403).json({ message: "Only admin can update projects" });

      // Use thumbnail URL from JSON body
      const project = await ProjectService.update(req.params.id, parseResult.data);
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE project
  static async delete(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (user.role !== "ADMIN")
        return res.status(403).json({ message: "Only admin can delete projects" });

      await ProjectService.delete(req.params.id);
      res.json({ message: "Project deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
