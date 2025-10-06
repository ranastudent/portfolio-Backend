import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  
  content: z.string().min(20, "Content must be at least 20 characters"),
  tags: z.array(z.string()).optional(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional().or(z.literal("")), // allow empty
  content: z.string().min(20).optional(),
  tags: z.array(z.string()).optional(),
});
