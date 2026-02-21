import { prisma } from "../client";

export interface RoleData {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface RoleWithPermissions extends RoleData {
  permissions?: { id: number; name: string; description?: string }[];
}

export class RoleRepository {
  async findAll(): Promise<RoleWithPermissions[]> {
    const roles = await prisma.role.findMany({
      where: { isActive: true },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description || undefined,
      isActive: role.isActive,
      permissions: role.rolePermissions.map((rp) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        description: rp.permission.description || undefined,
      })),
    }));
  }

  async findById(id: number): Promise<RoleWithPermissions | null> {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) return null;

    return {
      id: role.id,
      name: role.name,
      description: role.description || undefined,
      isActive: role.isActive,
      permissions: role.rolePermissions.map((rp) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        description: rp.permission.description || undefined,
      })),
    };
  }

  async create(data: RoleData): Promise<RoleData> {
    const role = await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });

    return {
      id: role.id,
      name: role.name,
      description: role.description || undefined,
      isActive: role.isActive,
    };
  }

  async update(id: number, data: Partial<RoleData>): Promise<RoleData> {
    const role = await prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
      },
    });

    return {
      id: role.id,
      name: role.name,
      description: role.description || undefined,
      isActive: role.isActive,
    };
  }

  async delete(id: number): Promise<void> {
    await prisma.role.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async assignPermissions(roleId: number, permissionIds: number[]): Promise<void> {
    // Delete existing permissions for this role
    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // Create new permissions
    if (permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      });
    }
  }
}
