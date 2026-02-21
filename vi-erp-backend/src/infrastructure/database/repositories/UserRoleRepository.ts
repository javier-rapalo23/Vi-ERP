import { prisma } from "../client";

export interface UserRoleData {
  userId: number;
  roleId: number;
}

export interface UserWithRoles {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  roles: { id: number; name: string; description?: string }[];
}

export class UserRoleRepository {
  async assignRolesToUser(userId: number, roleIds: number[]): Promise<void> {
    // Delete existing roles for this user
    await prisma.userRole.deleteMany({
      where: { userId },
    });

    // Create new roles
    if (roleIds.length > 0) {
      await prisma.userRole.createMany({
        data: roleIds.map((roleId) => ({
          userId,
          roleId,
        })),
      });
    }
  }

  async getUserWithRoles(userId: number): Promise<UserWithRoles | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      roles: user.userRoles.map((ur) => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description || undefined,
      })),
    };
  }

  async getAllUsersWithRoles(): Promise<UserWithRoles[]> {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      roles: user.userRoles.map((ur) => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description || undefined,
      })),
    }));
  }
}
