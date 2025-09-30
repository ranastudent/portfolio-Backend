import { Request, Response } from "express";
import { ResumeService } from "./resume.service";
import { resumeSchema } from "./resume.validation";

export class ResumeController {
  static async get(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const resume = await ResumeService.getByUser(user.id);
      res.json(resume);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async save(req: Request, res: Response) {
    try {
      const parseResult = resumeSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json(parseResult.error.issues);
      }

      const user = (req as any).user;
      const resume = await ResumeService.upsert(user.id, parseResult.data);
      res.json(resume);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const resume = await ResumeService.update(user.id, req.body);
      res.json(resume);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

    static async getByEmail(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (user.role !== "ADMIN") {
        return res.status(403).json({ message: "Only admin can access resumes by email" });
      }

      const { userEmail } = req.params;
      const resume = await ResumeService.getByEmail(userEmail);

      if (!resume) {
        return res.status(404).json({ message: "Resume not found for this email" });
      }

      res.json(resume);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }


  static async delete(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      await ResumeService.delete(user.id);
      res.json({ message: "Resume deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
