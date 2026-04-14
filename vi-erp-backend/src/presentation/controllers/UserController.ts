import { Request, Response } from "express";
import { UserRoleRepository } from "../../infrastructure/database/repositories/UserRoleRepository";
import { UsuarioRepository } from "../../infrastructure/database/repositories/UsuarioRepository";
import { Usuario } from "../../core/entities/Usuario";
import bcrypt from "bcrypt";
import logger from "../../config/logger";
import { logCriticalAction } from "../../infrastructure/services/audit.service";

const userRoleRepository = new UserRoleRepository();
const usuarioRepository = new UsuarioRepository();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRoleRepository.getAllUsersWithRoles();
    res.json(users);
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userRoleRepository.getUserWithRoles(parseInt(id));
    
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    res.json(user);
  } catch (error) {
    logger.error("Error fetching user:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, roleIds } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y contraseña son requeridos" });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const usuario = new Usuario(0, name, email, hashedPassword, role || "user", true);
    const createdUser = await usuarioRepository.create(usuario);
    
    // Assign roles if provided
    if (roleIds && Array.isArray(roleIds) && roleIds.length > 0) {
      await userRoleRepository.assignRolesToUser(createdUser.id, roleIds);
    }
    
    // Get user with roles
    const userWithRoles = await userRoleRepository.getUserWithRoles(createdUser.id);
    
    res.status(201).json(userWithRoles);
  } catch (error: any) {
    logger.error("Error creating user:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Ya existe un usuario con ese email" });
    }
    res.status(500).json({ error: error.message || "Error al crear usuario" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, isActive, roleIds } = req.body;
    const userId = parseInt(id);
    const existingUser = await usuarioRepository.findById(userId);
    
    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    // Update user
    await usuarioRepository.update(userId, updateData);
    
    // Update roles if provided
    if (roleIds && Array.isArray(roleIds)) {
      await userRoleRepository.assignRolesToUser(userId, roleIds);
    }
    
    // Get updated user with roles
    const userWithRoles = await userRoleRepository.getUserWithRoles(userId);

    if (existingUser && typeof isActive === "boolean" && existingUser.isActive !== isActive) {
      await logCriticalAction(req, {
        module: "usuarios",
        action: "anular",
        entity: "User",
        entityId: userId,
        oldValues: { isActive: existingUser.isActive },
        newValues: { isActive },
        metadata: { email: existingUser.email, name: existingUser.name },
      });
    }
    
    res.json(userWithRoles);
  } catch (error: any) {
    logger.error("Error updating user:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Ya existe un usuario con ese email" });
    }
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    const existingUser = await usuarioRepository.findById(userId);
    await usuarioRepository.delete(userId);

    if (existingUser) {
      await logCriticalAction(req, {
        module: "usuarios",
        action: "anular",
        entity: "User",
        entityId: userId,
        oldValues: { isActive: existingUser.isActive },
        newValues: { deleted: true },
        metadata: { email: existingUser.email, name: existingUser.name },
      });
    }

    res.status(204).send();
  } catch (error: any) {
    logger.error("Error deleting user:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

export const assignRolesToUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roleIds } = req.body;
    
    if (!Array.isArray(roleIds)) {
      return res.status(400).json({ error: "roleIds debe ser un array" });
    }
    
    await userRoleRepository.assignRolesToUser(parseInt(id), roleIds);
    const userWithRoles = await userRoleRepository.getUserWithRoles(parseInt(id));
    
    res.json(userWithRoles);
  } catch (error) {
    logger.error("Error assigning roles:", error);
    res.status(500).json({ error: "Error al asignar roles" });
  }
};
