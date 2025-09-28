import prisma from "../../utils/prisma";
import { CreateBlogInput, UpdateBlogInput } from "./blog.interface";

export class BlogService {
  static async create(authorId: string, data: CreateBlogInput) {
    return prisma.blog.create({
      data: { ...data, authorId, slug: slugify(data.title, { lower: true, strict: true }), },
    });
  }

  static async getAll() {
    return prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        tags: true,
        author: { select: { id: true, name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(blogId: string) {
    return prisma.blog.findUnique({
      where: { id: blogId },
      include: { author: { select: { id: true, name: true } } },
    });
  }

  static async update(blogId: string, userId: string, data: UpdateBlogInput, userRole: string) {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new Error("Blog not found");

    // Only author or admin can update
    if (blog.authorId !== userId && userRole !== "ADMIN") {
      throw new Error("Forbidden: cannot update this blog");
    }

    return prisma.blog.update({ where: { id: blogId }, data });
  }

  static async delete(blogId: string, userId: string, userRole: string) {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new Error("Blog not found");

    // Only author or admin can delete
    if (blog.authorId !== userId && userRole !== "ADMIN") {
      throw new Error("Forbidden: cannot delete this blog");
    }

    return prisma.blog.delete({ where: { id: blogId } });
  }
}
function slugify(title: string, arg1: { lower: boolean; strict: boolean; }): any {
      throw new Error("Function not implemented.");
}

