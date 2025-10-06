import prisma from "../../utils/prisma";
import { z } from "zod";
import { resumeSchema } from "./resume.validation";

export class ResumeService {
  static async getByUser(userId: string) {
    return prisma.resume.findUnique({ where: { userId } });
  }

  static async upsert(userId: string, data: z.infer<typeof resumeSchema>) {
    return prisma.resume.upsert({
      where: { userId },
      update: {
        name: data.name,
        designation: data.designation,
        contact: data.contact,
        workExp: data.workExp ?? [], // ✅ ensure JSON
        education: data.education ?? [],
        skills: data.skills ?? [],
        projects: data.projects ?? [],
        hobbies: data.hobbies ?? "",
        interests: data.interests ?? "",
      },
      create: {
        userId,
        name: data.name,
        designation: data.designation,
        contact: data.contact,
        workExp: data.workExp ?? [],
        education: data.education ?? [],
        skills: data.skills ?? [],
        projects: data.projects ?? [],
        hobbies: data.hobbies ?? "",
        interests: data.interests ?? "",
      },
    });
  }

  static async update(
    userId: string,
    data: Partial<z.infer<typeof resumeSchema>>
  ) {
    return prisma.resume.update({
      where: { userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.designation && { designation: data.designation }),
        ...(data.contact && { contact: data.contact }),
        ...(data.workExp && { workExp: data.workExp }),
        ...(data.education && { education: data.education }),
        ...(data.skills && { skills: data.skills }),
        ...(data.projects && { projects: data.projects }),
        ...(data.hobbies && { hobbies: data.hobbies }),
        ...(data.interests && { interests: data.interests }),
      },
    });
  }

  static async getByEmail(email: string) {
    return prisma.resume.findFirst({
      where: {
        user: {
          email,
        },
      },
      include: {
        user: true, // include user info if needed
      },
    });
  }

  static async delete(userId: string) {
    return prisma.resume.delete({
      where: { userId },
    });
  }
}
