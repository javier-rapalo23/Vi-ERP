import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SupplierRepository {
  async findAll() {
    return prisma.supplier.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: number) {
    return prisma.supplier.findUnique({
      where: { id },
      include: {
        purchases: {
          orderBy: { date: "desc" },
          take: 10,
        },
      },
    });
  }

  async create(data: {
    name: string;
    phone?: string;
    email?: string;
    adress?: string;
    createdBy?: number;
  }) {
    return prisma.supplier.create({
      data: {
        ...data,
        isActive: true,
      },
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      phone?: string;
      email?: string;
      adress?: string;
      isActive?: boolean;
      updatedBy?: number;
    }
  ) {
    return prisma.supplier.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.supplier.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
