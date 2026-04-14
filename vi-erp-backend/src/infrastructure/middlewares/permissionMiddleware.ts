import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/client";

type UserPayload = {
  id?: number;
  role?: string;
};

const roleFallbackPermissions: Record<string, string[]> = {
  admin: ["*"],
  cajero: [
    "ventas.ver",
    "ventas.crear",
    "ventas.editar",
    "ventas.anular",
    "cajas.ver",
    "cajas.crear",
    "cajas.editar",
    "clientes.ver",
    "clientes.crear",
    "clientes.editar",
    "productos.ver",
  ],
  contador: [
    "ventas.ver",
    "compras.ver",
    "compras.editar",
    "cajas.ver",
    "clientes.ver",
    "proveedores.ver",
  ],
  user: [
    "ventas.ver",
    "productos.ver",
    "clientes.ver",
  ],
};

function hasPermission(permissionNames: Set<string>, moduleKey: string, actionKey: string): boolean {
  if (permissionNames.has("*")) return true;

  const exact = `${moduleKey}.${actionKey}`;
  const wildcard = `${moduleKey}.*`;
  const all = `${moduleKey}.all`;

  return permissionNames.has(exact) || permissionNames.has(wildcard) || permissionNames.has(all);
}

export function requirePermission(moduleKey: string, actionKey: "ver" | "crear" | "editar" | "anular") {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as UserPayload | undefined;

      if (!authUser?.id) {
        return res.status(401).json({ error: "No autorizado" });
      }

      const roleName = String(authUser.role || "").toLowerCase();
      if (roleName === "admin") {
        return next();
      }

      const userWithPermissions = await prisma.user.findUnique({
        where: { id: authUser.id },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const dbPermissions =
        userWithPermissions?.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.name.toLowerCase())
        ) || [];

      const fallbackPermissions = roleFallbackPermissions[roleName] || [];
      const permissionNames = new Set<string>([
        ...dbPermissions,
        ...fallbackPermissions,
      ]);

      if (!hasPermission(permissionNames, moduleKey.toLowerCase(), actionKey.toLowerCase())) {
        return res.status(403).json({
          error: `Sin permiso para ${actionKey} en ${moduleKey}`,
          requiredPermission: `${moduleKey}.${actionKey}`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: "Error validando permisos" });
    }
  };
}
