import { Request } from "express";
import logger from "../../config/logger";
import { prisma } from "../database/client";

export type CriticalAuditPayload = {
  module: string;
  action: "ver" | "crear" | "editar" | "anular" | "cambiar";
  entity: string;
  entityId?: number;
  oldValues?: unknown;
  newValues?: unknown;
  metadata?: unknown;
};

export async function logCriticalAction(req: Request | undefined, payload: CriticalAuditPayload) {
  try {
    const userId = Number((req as any)?.user?.id);
    const safeUserId = Number.isFinite(userId) && userId > 0 ? userId : null;

    const oldJson = JSON.stringify(payload.oldValues ?? null);
    const newJson = JSON.stringify(payload.newValues ?? null);
    const metadataJson = JSON.stringify(payload.metadata ?? null);

    await prisma.$executeRaw`
      INSERT INTO "AuditLog" ("userId", "module", "action", "entity", "entityId", "oldValues", "newValues", "metadata", "createdAt")
      VALUES (
        ${safeUserId},
        ${payload.module},
        ${payload.action},
        ${payload.entity},
        ${payload.entityId ?? null},
        ${oldJson}::jsonb,
        ${newJson}::jsonb,
        ${metadataJson}::jsonb,
        NOW()
      )
    `;
  } catch (error) {
    logger.warn("No se pudo registrar evento de auditoria", {
      module: payload.module,
      action: payload.action,
      entity: payload.entity,
      entityId: payload.entityId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
