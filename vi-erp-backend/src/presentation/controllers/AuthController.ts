import { Request, Response } from "express";
import { generarToken } from "../../infrastructure/auth/jwt";
import logger from "../../config/logger";

/**
 * Mock de autenticación - En producción, esto debería verificar
 * contra una base de datos de usuarios
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: "Email y password son requeridos" });
    }
    
    // Mock de usuarios (en producción esto debería estar en la BD)
    const usuariosMock = [
      { id: 1, email: "admin@vierp.com", password: "admin123", role: "admin", nombre: "Administrador" },
      { id: 2, email: "cajero@vierp.com", password: "cajero123", role: "cajero", nombre: "Cajero" },
      { id: 3, email: "usuario@vierp.com", password: "user123", role: "user", nombre: "Usuario" },
    ];
    
    const usuario = usuariosMock.find(
      (u) => u.email === email && u.password === password
    );
    
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    
    // Generar token JWT
    const token = generarToken({ id: usuario.id, role: usuario.role });
    
    logger.info(`Usuario autenticado: ${usuario.email}`);
    
    res.json({
      token,
      role: usuario.role,
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
      },
    });
  } catch (error) {
    logger.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};
