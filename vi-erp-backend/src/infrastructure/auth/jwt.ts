import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export type AuthUser = {
  id: number;
  role: string;
  iat?: number;
  exp?: number;
};

export function generarToken(payload: Pick<AuthUser, "id" | "role">) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "8h" });
}

export function verificarToken(token: string): AuthUser {
  return jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
}