import { Request, Response } from "express";
import { prisma } from "../../infrastructure/database/client";
import logger from "../../config/logger";
import { logCriticalAction } from "../../infrastructure/services/audit.service";

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.setting.findMany({
      where: { isActive: true },
      orderBy: [{ group: "asc" }, { key: "asc" }],
    });
    res.json(settings);
  } catch (error) {
    logger.error("Error fetching settings:", error);
    res.status(500).json({ error: "Error al obtener la configuración" });
  }
};

export const getSettingByKey = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const setting = await prisma.setting.findUnique({ where: { key } });
    if (!setting) return res.status(404).json({ error: "Configuración no encontrada" });
    res.json(setting);
  } catch (error) {
    logger.error("Error fetching setting:", error);
    res.status(500).json({ error: "Error al obtener configuración" });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    // Body: array de { key, value }
    const updates: { key: string; value: string }[] = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: "Se requiere un arreglo de actualizaciones" });
    }

    const keys = updates.map((u) => u.key);
    const existing = await prisma.setting.findMany({ where: { key: { in: keys } } });
    const existingByKey = new Map(existing.map((s) => [s.key, s]));

    const results = await Promise.all(
      updates.map(({ key, value }) =>
        prisma.setting.update({
          where: { key },
          data: { value },
        })
      )
    );

    for (const updated of results) {
      const previous = existingByKey.get(updated.key);
      if (previous && previous.value !== updated.value) {
        await logCriticalAction(req, {
          module: "configuracion",
          action: "editar",
          entity: "Setting",
          entityId: updated.id,
          oldValues: { key: updated.key, value: previous.value },
          newValues: { key: updated.key, value: updated.value },
          metadata: { mode: "bulk" },
        });
      }
    }

    res.json(results);
  } catch (error: any) {
    logger.error("Error updating settings:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Una o más claves de configuración no existen" });
    }
    res.status(500).json({ error: "Error al guardar la configuración" });
  }
};

export const updateSettingByKey = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined || value === null) {
      return res.status(400).json({ error: "El campo value es requerido" });
    }

    const previous = await prisma.setting.findUnique({ where: { key } });

    const setting = await prisma.setting.update({
      where: { key },
      data: { value: String(value) },
    });

    if (previous && previous.value !== setting.value) {
      await logCriticalAction(req, {
        module: "configuracion",
        action: "editar",
        entity: "Setting",
        entityId: setting.id,
        oldValues: { key: setting.key, value: previous.value },
        newValues: { key: setting.key, value: setting.value },
        metadata: { mode: "single-key" },
      });
    }

    res.json(setting);
  } catch (error: any) {
    logger.error("Error updating setting:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Configuración no encontrada" });
    }
    res.status(500).json({ error: "Error al actualizar configuración" });
  }
};
