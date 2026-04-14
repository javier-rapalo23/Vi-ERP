import { prisma } from "../database/client";
import logger from "../../config/logger";
import { config } from "../../config/env";

const MAX_LOGIN_ATTEMPTS = config.authMaxLoginAttempts;
const LOGIN_ATTEMPT_WINDOW_MS = config.authAttemptWindowMinutes * 60 * 1000;
const LOCKOUT_DURATION_MS = config.authLockoutMinutes * 60 * 1000;

type FailedAttemptsRow = { failedAttempts: number };
type LatestBlockRow = { blockedUntil: Date | null };

export async function recordLoginAttempt(
  email: string,
  success: boolean,
  userId?: number,
  ipAddress?: string
) {
  try {
    const now = new Date();
    const blockedUntil = !success ? new Date(now.getTime() + LOCKOUT_DURATION_MS) : null;

    await prisma.$executeRaw`
      INSERT INTO "LoginAttempt" ("userId", "email", "ipAddress", "success", "blockedUntil", "createdAt")
      VALUES (
        ${userId || null},
        ${email},
        ${ipAddress || null},
        ${success},
        ${blockedUntil},
        NOW()
      )
    `;

    logger.info(`Login attempt recorded: ${email} - ${success ? "SUCCESS" : "FAILED"}`);
  } catch (error) {
    logger.warn("No se pudo registrar intento de login", {
      email,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function checkLoginBlock(email: string): Promise<{
  isBlocked: boolean;
  failedAttempts: number;
  blockedUntil?: Date;
}> {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - LOGIN_ATTEMPT_WINDOW_MS);

    const failedAttemptsRows = await prisma.$queryRaw<FailedAttemptsRow[]>`
      SELECT COUNT(*)::int as "failedAttempts"
      FROM "LoginAttempt"
      WHERE "email" = ${email}
        AND "success" = false
        AND "createdAt" >= ${windowStart}
    `;

    const failedAttempts = failedAttemptsRows[0]?.failedAttempts ?? 0;

    if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
      const latestBlockRows = await prisma.$queryRaw<LatestBlockRow[]>`
        SELECT "blockedUntil"
        FROM "LoginAttempt"
        WHERE "email" = ${email}
          AND "blockedUntil" IS NOT NULL
        ORDER BY "createdAt" DESC
        LIMIT 1
      `;

      const blockedUntil = latestBlockRows[0]?.blockedUntil ?? null;
      if (blockedUntil && blockedUntil > now) {
        return {
          isBlocked: true,
          failedAttempts,
          blockedUntil,
        };
      }
    }

    return {
      isBlocked: false,
      failedAttempts,
    };
  } catch (error) {
    logger.warn("Error checking login block", {
      email,
      error: error instanceof Error ? error.message : String(error),
    });
    return { isBlocked: false, failedAttempts: 0 };
  }
}

export async function clearLoginAttempts(email: string) {
  try {
    await prisma.$executeRaw`
      DELETE FROM "LoginAttempt"
      WHERE "email" = ${email} AND "success" = false
    `;
    logger.info(`Login attempts cleared for ${email}`);
  } catch (error) {
    logger.warn("No se pudo limpiar intentos de login", {
      email,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export function getClientIp(headerXForwardedFor?: string | string[]): string | undefined {
  if (typeof headerXForwardedFor === "string") {
    return headerXForwardedFor.split(",")[0].trim();
  }
  if (Array.isArray(headerXForwardedFor)) {
    return headerXForwardedFor[0]?.split(",")[0].trim();
  }
  return undefined;
}
