import prisma from "../../utils/prisma";
import slugify from "slugify";
import { CreateProjectInput, UpdateProjectInput } from "./project.interface";

export class ProjectService {
  static async create(userId: string, data: CreateProjectInput) {
     // ✅ Fix invalid i.ibb.co URLs automatically
    if (data.thumbnail?.includes("i.ibb.co.com")) {
      data.thumbnail = data.thumbnail.replace("i.ibb.co.com", "i.ibb.co");
    }
    return prisma.project.create({
      data: {
        ...data,
        userId,
        slug: slugify(data.title, { lower: true, strict: true }),
      },
    });
  }

  static async getAll() {
    return prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        features: true,
        thumbnail: true,
        liveLink: true,
        repoLink: true,
        slug: true,
        createdAt: true,
      },
    });
  }

  static async getById(id: string) {
    return prisma.project.findUnique({ where: { id } });
  }

  static async update(id: string, data: UpdateProjectInput) {
     // ✅ Fix invalid i.ibb.co URLs automatically
    if (data.thumbnail?.includes("i.ibb.co.com")) {
      data.thumbnail = data.thumbnail.replace("i.ibb.co.com", "i.ibb.co");
    }
    return prisma.project.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }
}
