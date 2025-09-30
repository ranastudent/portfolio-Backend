import prisma from "../../utils/prisma";
import { z } from "zod";
import { createAboutSchema, updateAboutSchema } from "./about.validation";

export class AboutService {
  static async get() {
    return prisma.about.findFirst(); // only one entry
  }

  static async create(data: z.infer<typeof createAboutSchema>) {
    // Ensure no duplicate entry (only one About row allowed)
    const existing = await prisma.about.findFirst();
    if (existing) {
      throw new Error("About info already exists. Please use update instead.");
    }

    return prisma.about.create({
      data: {
        name: data.name,
        bio: data.bio,
        email: data.email,
        contact: data.contact,
        skills: data.skills ?? [],
      },
    });
  }

  static async update(data: z.infer<typeof updateAboutSchema>) {
    const about = await prisma.about.findFirst();
    if (!about) throw new Error("About info not found. Please create first.");

    return prisma.about.update({
      where: { id: about.id },
      data,
    });
  }

  static async delete() {
    const about = await prisma.about.findFirst();
    if (!about) throw new Error("About info not found to delete.");

    await prisma.about.delete({
      where: { id: about.id },
    });

    return { message: "About info deleted successfully" };
  }
}
