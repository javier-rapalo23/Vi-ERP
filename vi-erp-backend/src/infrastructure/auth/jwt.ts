import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generarToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "8h" });
}

export function verificarToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}