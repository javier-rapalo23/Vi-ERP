import { Request, Response } from "express";
import { PermissionRepository } from "../../infrastructure/database/repositories/PermissionRepository";
import logger from "../../config/logger";

const permissionRepository = new PermissionRepository();

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await permissionRepository.findAll();
    res.json(permissions);
  } catch (error) {
    logger.error("Error fetching permissions:", error);
    res.status(500).json({ error: "Error al obtener permisos" });
  }
};

export const getPermissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const permission = await permissionRepository.findById(parseInt(id));
    
    if (!permission) {
      return res.status(404).json({ error: "Permiso no encontrado" });
    }
    
    res.json(permission);
  } catch (error) {
    logger.error("Error fetching permission:", error);
    res.status(500).json({ error: "Error al obtener permiso" });
  }
};

export const createPermission = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "El nombre del permiso es requerido" });
    }
    
    const permission = await permissionRepository.create({ name, description });
    res.status(201).json(permission);
  } catch (error: any) {
    logger.error("Error creating permission:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Ya existe un permiso con ese nombre" });
    }
    res.status(500).json({ error: "Error al crear permiso" });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const permission = await permissionRepository.update(parseInt(id), {
      name,
      description,
    });
    
    res.json(permission);
  } catch (error: any) {
    logger.error("Error updating permission:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Permiso no encontrado" });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Ya existe un permiso con ese nombre" });
    }
    res.status(500).json({ error: "Error al actualizar permiso" });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await permissionRepository.delete(parseInt(id));
    res.status(204).send();
  } catch (error: any) {
    logger.error("Error deleting permission:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Permiso no encontrado" });
    }
    res.status(500).json({ error: "Error al eliminar permiso" });
  }
};
