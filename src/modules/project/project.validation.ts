import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  thumbnail: z.string().url().optional(),
  liveLink: z.string().url().optional(),
  repoLink: z.string().url().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
