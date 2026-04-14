import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../auth/jwt";
import logger from "../../config/logger";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = verificarToken(token);
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    // Diferenciar entre token expirado e inválido
    if (error.name === "TokenExpiredError") {
      logger.warn("Token expirado");
      return res.status(401).json({ error: "Token expirado", code: "TOKEN_EXPIRED" });
    }
    
    logger.warn("Token inválido", { error: error.message });
    return res.status(403).json({ error: "Token inválido" });
  }
}