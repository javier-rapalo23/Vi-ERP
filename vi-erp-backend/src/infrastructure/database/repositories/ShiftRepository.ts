import { prisma } from "../client";
import { IShiftRepository } from "../../../core/repositories/IShiftRepository";
import { Shift } from "../../../core/entities/Shift";

export class ShiftRepository implements IShiftRepository {
  async create(shift: Shift) {
    return prisma.shift.create({
      data: {
        userId: shift.userId,
        openingAmount: shift.openingAmount,
        status: "OPEN",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async close(shiftId: number, closingAmount: number, notes?: string) {
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      include: {
        sales: {
          where: { NOT: { status: "CANCELLED" } },
          select: { total: true },
        },
      },
    });

    if (!shift) {
      throw new Error("Turno no encontrado");
    }

    if (shift.status === "CLOSED") {
      throw new Error("Este turno ya fue cerrado");
    }

    const totalSales = shift.sales.reduce((acc: number, sale: any) => acc + Number(sale.total || 0), 0);
    const expectedAmount = shift.openingAmount + totalSales;
    const variance = closingAmount - expectedAmount;

    return prisma.shift.update({
      where: { id: shiftId },
      data: {
        closingAmount,
        expectedAmount,
        variance,
        status: "CLOSED",
        notes,
        closedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sales: {
          where: { NOT: { status: "CANCELLED" } },
          select: {
            id: true,
            invoiceNumber: true,
            total: true,
            date: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return prisma.shift.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByIdWithSales(id: number) {
    return prisma.shift.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sales: {
          where: { NOT: { status: "CANCELLED" } },
          select: {
            id: true,
            invoiceNumber: true,
            total: true,
            date: true,
            customer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { date: "desc" },
        },
      },
    });
  }

  async findOpenShiftByUserId(userId: number) {
    return prisma.shift.findFirst({
      where: {
        userId,
        status: "OPEN",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sales: {
          where: { NOT: { status: "CANCELLED" } },
          select: {
            id: true,
            invoiceNumber: true,
            total: true,
            date: true,
            customer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { date: "desc" },
        },
      },
    });
  }

  async findAllByUserId(userId: number) {
    return prisma.shift.findMany({
      where: { userId },
      orderBy: { openedAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sales: {
          where: { NOT: { status: "CANCELLED" } },
          select: {
            id: true,
            invoiceNumber: true,
            total: true,
            date: true,
          },
        },
      },
    });
  }

  async findAll() {
    return prisma.shift.findMany({
      orderBy: { openedAt: "desc" },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sales: {
          where: { NOT: { status: "CANCELLED" } },
          select: {
            id: true,
            total: true,
          },
        },
      },
    });
  }
}
