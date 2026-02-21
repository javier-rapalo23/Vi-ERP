import { Request, Response } from "express";
import { generarToken } from "../../infrastructure/auth/jwt";
import logger from "../../config/logger";
import { AutenticarUsuarioUseCase } from "../../application/useCases/auth/AutenticarUsuarioUseCase";
import { UsuarioRepository } from "../../infrastructure/database/repositories/UsuarioRepository";

// Instanciar las dependencias
const usuarioRepository = new UsuarioRepository();
const autenticarUsuarioUseCase = new AutenticarUsuarioUseCase(usuarioRepository);

/**
 * Controlador de autenticación
 * Verifica las credenciales del usuario contra la base de datos
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: "Email y password son requeridos" });
    }
    
    // Ejecutar caso de uso de autenticación
    const resultado = await autenticarUsuarioUseCase.execute({ email, password });
    
    // Generar token JWT
    const token = generarToken({ 
      id: resultado.usuario.id, 
      role: resultado.usuario.role 
    });
    
    logger.info(`Usuario autenticado: ${resultado.usuario.email}`);
    
    res.json({
      token,
      role: resultado.usuario.role,
      user: {
        id: resultado.usuario.id,
        email: resultado.usuario.email,
        nombre: resultado.usuario.nombre,
      },
    });
  } catch (error) {
    // Manejar errores específicos
    if (error instanceof Error) {
      if (error.message === "Credenciales inválidas") {
        return res.status(401).json({ error: error.message });
      }
      if (error.message === "Usuario inactivo. Contacte al administrador") {
        return res.status(403).json({ error: error.message });
      }
    }
    
    logger.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};
