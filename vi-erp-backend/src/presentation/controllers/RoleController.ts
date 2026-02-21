import { Request, Response } from "express";
import { RoleRepository } from "../../infrastructure/database/repositories/RoleRepository";
import logger from "../../config/logger";

const roleRepository = new RoleRepository();

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await roleRepository.findAll();
    res.json(roles);
  } catch (error) {
    logger.error("Error fetching roles:", error);
    res.status(500).json({ error: "Error al obtener roles" });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await roleRepository.findById(parseInt(id));
    
    if (!role) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }
    
    res.json(role);
  } catch (error) {
    logger.error("Error fetching role:", error);
    res.status(500).json({ error: "Error al obtener rol" });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "El nombre del rol es requerido" });
    }
    
    const role = await roleRepository.create({ name, description });
    res.status(201).json(role);
  } catch (error: any) {
    logger.error("Error creating role:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Ya existe un rol con ese nombre" });
    }
    res.status(500).json({ error: "Error al crear rol" });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    
    const role = await roleRepository.update(parseInt(id), {
      name,
      description,
      isActive,
    });
    
    res.json(role);
  } catch (error: any) {
    logger.error("Error updating role:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Rol no encontrado" });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Ya existe un rol con ese nombre" });
    }
    res.status(500).json({ error: "Error al actualizar rol" });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await roleRepository.delete(parseInt(id));
    res.status(204).send();
  } catch (error: any) {
    logger.error("Error deleting role:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Rol no encontrado" });
    }
    res.status(500).json({ error: "Error al eliminar rol" });
  }
};

export const assignPermissionsToRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;
    
    if (!Array.isArray(permissionIds)) {
      return res.status(400).json({ error: "permissionIds debe ser un array" });
    }
    
    await roleRepository.assignPermissions(parseInt(id), permissionIds);
    res.json({ message: "Permisos asignados correctamente" });
  } catch (error) {
    logger.error("Error assigning permissions:", error);
    res.status(500).json({ error: "Error al asignar permisos" });
  }
};
