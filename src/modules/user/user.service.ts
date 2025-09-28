import { prisma } from "../../config/db";
import { UpdateUserInput } from "./user.interface";

export class UserService {
  static async getAll() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
  }

  static async getById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  static async update(userId: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, role: true },
    });
  }

  static async delete(userId: string) {
    return prisma.user.delete({ where: { id: userId } });
  }
}
