import { Request, Response, NextFunction } from "express";

export const fixImageUrl = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const imageFields = ["thumbnail", "image", "banner", "profileImage"];

    for (const field of imageFields) {
      const value = (req.body as Record<string, string>)[field];
      if (typeof value === "string" && value.includes("i.ibb.co.com")) {
        (req.body as Record<string, string>)[field] = value.replace("i.ibb.co.com", "i.ibb.co");
      }
    }

    next();
  } catch (error) {
    console.error("Error in fixImageUrl middleware:", error);
    next();
  }
};
