import prisma from "../../utils/prisma";

export class DashboardService {
  static async getStats() {
    const totalBlogs = await prisma.blog.count();
    const totalProjects = await prisma.project.count();
    const totalResumes = await prisma.resume.count();

    const totalBlogViews = await prisma.blog.aggregate({
      _sum: { views: true },
    });

    return {
      totalBlogs,
      totalProjects,
      totalResumes,
      totalBlogViews: totalBlogViews._sum.views || 0,
    };
  }
}
