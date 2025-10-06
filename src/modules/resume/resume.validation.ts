import { z } from "zod";

export const resumeSchema = z.object({
  name: z.string().min(1),
  designation: z.string().min(1),
  contact: z.string().min(1),

  workExp: z
    .array(
      z.object({
        company: z.string(),
        role: z.string(),
        duration: z.string(),
        description: z.string(),
      })
    )
    .optional(),

  education: z
    .array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        year: z.string(),
      })
    )
    .optional(),

  skills: z.array(z.string()).optional(),

  projects: z
    .array(
      z.object({
        title: z.string(),
        techStack: z.array(z.string()),
        features: z.array(z.string()),
        link: z.string().url().optional(),
      })
    )
    .optional(),

  hobbies: z.string().optional(),
  interests: z.string().optional(),
});
