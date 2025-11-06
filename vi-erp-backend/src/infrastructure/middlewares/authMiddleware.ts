import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../auth/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = verificarToken(token);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Token inválido" });
  }
}