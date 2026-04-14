import dotenv from "dotenv";

dotenv.config();

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "clave_super_segura",
  databaseUrl: process.env.DATABASE_URL || "",
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  authMaxLoginAttempts: parseNumber(process.env.AUTH_MAX_LOGIN_ATTEMPTS, 5),
  authAttemptWindowMinutes: parseNumber(process.env.AUTH_ATTEMPT_WINDOW_MINUTES, 15),
  authLockoutMinutes: parseNumber(process.env.AUTH_LOCKOUT_MINUTES, 30),
};

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  PORT: process.env.PORT || "3000",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  AUTH_MAX_LOGIN_ATTEMPTS: String(config.authMaxLoginAttempts),
  AUTH_ATTEMPT_WINDOW_MINUTES: String(config.authAttemptWindowMinutes),
  AUTH_LOCKOUT_MINUTES: String(config.authLockoutMinutes),
};
