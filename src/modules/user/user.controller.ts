import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; // from authMiddleware
      const updatedUser = await UserService.update(userId, req.body);
      res.json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await UserService.delete(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
