import { Request, Response } from "express";
import { generarToken } from "../../infrastructure/auth/jwt";
import logger from "../../config/logger";
import { AutenticarUsuarioUseCase } from "../../application/useCases/auth/AutenticarUsuarioUseCase";
import { UsuarioRepository } from "../../infrastructure/database/repositories/UsuarioRepository";
import {
  recordLoginAttempt,
  checkLoginBlock,
  clearLoginAttempts,
  getClientIp,
} from "../../infrastructure/services/session.service";

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
    const ipAddress = getClientIp(req.headers["x-forwarded-for"]) || req.ip;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: "Email y password son requeridos" });
    }

    // Verificar si el email está bloqueado por intentos fallidos
    const blockStatus = await checkLoginBlock(email);
    if (blockStatus.isBlocked) {
      logger.warn(`Intento de login bloqueado para ${email} desde ${ipAddress}`);
      return res.status(429).json({
        error: "Demasiados intentos fallidos. Intente más tarde.",
        code: "LOGIN_BLOCKED",
        blockedUntil: blockStatus.blockedUntil,
        retryAfter: blockStatus.blockedUntil
          ? Math.ceil((blockStatus.blockedUntil.getTime() - Date.now()) / 1000)
          : 0,
      });
    }

    // Ejecutar caso de uso de autenticación
    try {
      const resultado = await autenticarUsuarioUseCase.execute({ email, password });

      // Login exitoso: generar token
      const token = generarToken({
        id: resultado.usuario.id,
        role: resultado.usuario.role,
      });

      // Registrar intento exitoso
      await recordLoginAttempt(email, true, resultado.usuario.id, ipAddress);

      // Limpiar intentos fallidos previos
      await clearLoginAttempts(email);

      logger.info(`Usuario autenticado exitosamente: ${resultado.usuario.email}`);

      res.json({
        token,
        role: resultado.usuario.role,
        user: {
          id: resultado.usuario.id,
          email: resultado.usuario.email,
          nombre: resultado.usuario.nombre,
        },
      });
    } catch (authError: any) {
      // Login fallido: registrar intento
      await recordLoginAttempt(email, false, undefined, ipAddress);

      logger.warn(`Intento de login fallido para ${email} desde ${ipAddress}`);

      if (authError.message === "Credenciales inválidas") {
        return res.status(401).json({ error: authError.message });
      }
      if (authError.message === "Usuario inactivo. Contacte al administrador") {
        return res.status(403).json({ error: authError.message });
      }

      throw authError;
    }
  } catch (error) {
    logger.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;

    if (!authUser?.id) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // Generar nuevo token
    const token = generarToken({
      id: authUser.id,
      role: authUser.role,
    });

    logger.info(`Token renovado para usuario: ${authUser.id}`);

    res.json({ token });
  } catch (error) {
    logger.error("Error renovando token:", error);
    res.status(500).json({ error: "Error al renovar token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    logger.info(`Usuario desconectado: ${authUser?.id}`);
    res.json({ message: "Desconexión exitosa" });
  } catch (error) {
    logger.error("Error en logout:", error);
    res.status(500).json({ error: "Error al desconectar" });
  }
};

export const checkSession = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;

    if (!authUser?.id) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const user = await usuarioRepository.findById(authUser.id);
    if (!user || !user.isActive) {
      return res.status(403).json({ error: "Usuario inactivo o no encontrado" });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    logger.error("Error verificando sesión:", error);
    res.status(500).json({ error: "Error al verificar sesión" });
  }
};


