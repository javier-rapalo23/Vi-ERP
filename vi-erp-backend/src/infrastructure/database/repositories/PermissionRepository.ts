import { prisma } from "../client";

export interface PermissionData {
  id?: number;
  name: string;
  description?: string;
}

export class PermissionRepository {
  async findAll(): Promise<PermissionData[]> {
    const permissions = await prisma.permission.findMany({
      orderBy: { name: 'asc' },
    });

    return permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      description: permission.description || undefined,
    }));
  }

  async findById(id: number): Promise<PermissionData | null> {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) return null;

    return {
      id: permission.id,
      name: permission.name,
      description: permission.description || undefined,
    };
  }

  async create(data: PermissionData): Promise<PermissionData> {
    const permission = await prisma.permission.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return {
      id: permission.id,
      name: permission.name,
      description: permission.description || undefined,
    };
  }

  async update(id: number, data: Partial<PermissionData>): Promise<PermissionData> {
    const permission = await prisma.permission.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return {
      id: permission.id,
      name: permission.name,
      description: permission.description || undefined,
    };
  }

  async delete(id: number): Promise<void> {
    await prisma.permission.delete({
      where: { id },
    });
  }
}
