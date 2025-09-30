import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

export class DashboardController {
  static async getStats(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (user.role !== "ADMIN") {
        return res.status(403).json({ message: "Only admin can access dashboard stats" });
      }

      const stats = await DashboardService.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
