import { Request, Response } from "express";
import { ShiftRepository } from "../../infrastructure/database/repositories/ShiftRepository";
import { OpenShiftUseCase } from "../../application/useCases/shifts/OpenShiftUseCase";
import { CloseShiftUseCase } from "../../application/useCases/shifts/CloseShiftUseCase";
import logger from "../../config/logger";
import { z } from "zod";

const openShiftSchema = z.object({
  openingAmount: z.number().min(0, "El monto de apertura debe ser >= 0"),
});

const closeShiftSchema = z.object({
  closingAmount: z.number().min(0, "El monto de cierre debe ser >= 0"),
  notes: z.string().optional(),
});

export const openShift = async (req: Request, res: Response) => {
  try {
    const { openingAmount } = openShiftSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const shiftRepository = new ShiftRepository();
    const useCase = new OpenShiftUseCase(shiftRepository);
    const shift = await useCase.execute(userId, openingAmount);

    logger.info(`Shift opened for user ${userId}: ${shift.id}`);
    res.status(201).json({
      message: "Turno abierto exitosamente",
      data: shift,
    });
  } catch (err: any) {
    const message = String(err?.message || "");
    if (message.includes("El usuario ya tiene un turno abierto")) {
      logger.warn("Open shift error:", message);
      return res.status(400).json({ error: message });
    }

    logger.error("Error opening shift:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

export const closeShift = async (req: Request, res: Response) => {
  try {
    const { closingAmount, notes } = closeShiftSchema.parse(req.body);
    const shiftId = parseInt(req.params.id);

    if (Number.isNaN(shiftId) || shiftId <= 0) {
      return res.status(400).json({ error: "ID de turno inválido" });
    }

    const shiftRepository = new ShiftRepository();
    const useCase = new CloseShiftUseCase(shiftRepository);
    const shift = await useCase.execute(shiftId, closingAmount, notes);

    logger.info(`Shift closed: ${shiftId}`);
    res.json({
      message: "Turno cerrado exitosamente",
      data: shift,
    });
  } catch (err: any) {
    const message = String(err?.message || "");
    if (
      message.includes("Turno no encontrado") ||
      message.includes("ya está cerrado")
    ) {
      logger.warn("Close shift error:", message);
      return res.status(400).json({ error: message });
    }

    logger.error("Error closing shift:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

export const getOpenShift = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const shiftRepository = new ShiftRepository();
    const shift = await shiftRepository.findOpenShiftByUserId(userId);

    if (!shift) {
      return res.json({ data: null });
    }

    const totalSales = (shift.sales || []).reduce((acc: number, sale: any) => acc + Number(sale.total || 0), 0);
    const expectedAmount = Number(shift.openingAmount || 0) + totalSales;

    const shiftWithExpected = {
      ...shift,
      expectedAmount,
    };

    res.json({
      data: shiftWithExpected,
    });
  } catch (err: any) {
    logger.error("Error fetching open shift:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

export const getShiftDetails = async (req: Request, res: Response) => {
  try {
    const shiftId = parseInt(req.params.id);

    if (Number.isNaN(shiftId) || shiftId <= 0) {
      return res.status(400).json({ error: "ID de turno inválido" });
    }

    const shiftRepository = new ShiftRepository();
    const shift = await shiftRepository.findByIdWithSales(shiftId);

    if (!shift) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    res.json({
      data: shift,
    });
  } catch (err: any) {
    logger.error("Error fetching shift details:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

export const getShiftHistory = async (req: Request, res: Response) => {
  try {
    const authUserId = req.user?.id;
    const authUserRole = String(req.user?.role ?? "").toLowerCase();

    if (!authUserId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const queryUserIdRaw = typeof req.query.userId === "string" ? Number(req.query.userId) : undefined;
    if (queryUserIdRaw !== undefined && (!Number.isFinite(queryUserIdRaw) || queryUserIdRaw <= 0)) {
      return res.status(400).json({ error: "userId invalido" });
    }

    const canViewOtherUsers = authUserRole === "admin";
    const targetUserId = canViewOtherUsers && queryUserIdRaw ? queryUserIdRaw : authUserId;

    const shiftRepository = new ShiftRepository();
    const shifts = await shiftRepository.findAllByUserId(targetUserId);

    const summary = shifts.reduce(
      (acc: any, shift: any) => {
        const openingAmount = Number(shift.openingAmount || 0);
        const expectedAmount = Number(shift.expectedAmount || 0);
        const closingAmount = Number(shift.closingAmount || 0);
        const variance = Number(shift.variance || 0);

        acc.totalShifts += 1;
        if (shift.status === "OPEN") acc.openShifts += 1;
        if (shift.status === "CLOSED") acc.closedShifts += 1;

        acc.totalOpening += openingAmount;
        acc.totalExpected += expectedAmount;
        acc.totalClosing += closingAmount;
        acc.totalVariance += variance;

        if (variance > 0) acc.overages += 1;
        if (variance < 0) acc.shortages += 1;

        return acc;
      },
      {
        totalShifts: 0,
        openShifts: 0,
        closedShifts: 0,
        totalOpening: 0,
        totalExpected: 0,
        totalClosing: 0,
        totalVariance: 0,
        overages: 0,
        shortages: 0,
      }
    );

    res.json({
      data: shifts,
      summary,
    });
  } catch (err: any) {
    logger.error("Error fetching shift history:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};
