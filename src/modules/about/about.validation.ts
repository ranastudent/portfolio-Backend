import { z } from "zod";

// Create: required fields
export const createAboutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  email: z.string().email("Invalid email"),
  contact: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

// Update: all optional
export const updateAboutSchema = createAboutSchema.partial();
