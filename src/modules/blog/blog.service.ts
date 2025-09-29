import prisma from "../../utils/prisma";
import { CreateBlogInput, UpdateBlogInput } from "./blog.interface";
import slugify from "slugify"; // install: npm i slugify

// Simple SEO metadata generator
function generateSEO(title: string, content: string) {
  const plainText = content.replace(/<[^>]+>/g, ""); // remove HTML tags
  return {
    description: plainText.slice(0, 150), // first 150 chars
    tags: title.split(" ").slice(0, 5), // first 5 words as tags
  };
}

export class BlogService {
  static async create(authorId: string, data: CreateBlogInput) {
    const seo = generateSEO(data.title, data.content);

    return prisma.blog.create({
      data: {
        ...data,
        authorId,
        slug: slugify(data.title, { lower: true, strict: true }),
        description: seo.description,
        tags: seo.tags,
        image: data.image ?? null,
        seoTitle: data.title, // use title as SEO title
        seoDesc: seo.description, // use generated description
      },
    });
  }

  static async getAll() {
    return prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        tags: true,
        slug: true,
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

  static async update(
    blogId: string,
    userId: string,
    data: UpdateBlogInput,
    userRole: string
  ) {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new Error("Blog not found");

    // Only author or admin can update
    if (blog.authorId !== userId && userRole !== "ADMIN") {
      throw new Error("Forbidden: cannot update this blog");
    }

    const seo = generateSEO(
      data.title ?? blog.title,
      data.content ?? blog.content
    );

    return prisma.blog.update({
      where: { id: blogId },
      data: {
        ...data,
        slug: data.title
          ? slugify(data.title, { lower: true, strict: true })
          : blog.slug,
        description: seo.description,
        tags: seo.tags,
        image: data.image ?? blog.image,
        seoTitle: data.title, // use title as SEO title
        seoDesc: seo.description, // use generated description
      },
    });
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
