import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fixOldImageUrls() {
  const projects = await prisma.project.findMany();
  let fixedCount = 0;

  for (const project of projects) {
    if (project.thumbnail?.includes("i.ibb.co.com")) {
      const fixedThumbnail = project.thumbnail.replace("i.ibb.co.com", "i.ibb.co");
      await prisma.project.update({
        where: { id: project.id },
        data: { thumbnail: fixedThumbnail },
      });
      fixedCount++;
      console.log(`✅ Fixed thumbnail for project: ${project.title}`);
    }
  }

  return fixedCount;
}
