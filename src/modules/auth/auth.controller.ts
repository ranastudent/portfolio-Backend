import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  static async googleCallback(req: Request, res: Response) {
  try {
    const result = await AuthService.googleAuth(req.user);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}


  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; // from middleware
      const user = await AuthService.getProfile(userId);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}
