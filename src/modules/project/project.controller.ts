import { Request, Response } from "express";
import { ProjectService } from "./project.service";
import { createProjectSchema, updateProjectSchema } from "./project.validation";

export class ProjectController {
  static async create(req: Request, res: Response) {
    try {
      const parseResult = createProjectSchema.safeParse(req.body);
      if (!parseResult.success)
        return res.status(400).json(parseResult.error.issues);

      const user = (req as any).user;
      if (user.role !== "ADMIN")
        return res.status(403).json({ message: "Only admin can create projects" });

      const project = await ProjectService.create(user.id, parseResult.data);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const parseResult = updateProjectSchema.safeParse(req.body);
      if (!parseResult.success)
        return res.status(400).json(parseResult.error.issues);

      const user = (req as any).user;
      if (user.role !== "ADMIN")
        return res.status(403).json({ message: "Only admin can update projects" });

      const project = await ProjectService.update(req.params.id, parseResult.data);
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
