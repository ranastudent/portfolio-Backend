import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";

interface JwtPayload {
  id: string;  // string
  role: string;
}

export const authMiddleware = (roles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      // find user in DB
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) return res.status(401).json({ message: "User not found" });

      // check role
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient rights" });
      }

      // attach user to request
      (req as any).user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};
