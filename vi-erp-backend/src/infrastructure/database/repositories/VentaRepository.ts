import { prisma } from "../client";
import { IVentaRepository } from "../../../core/repositories/IVentaRepository";
import { Venta } from "../../../core/entities/Venta";

export class VentaRepository implements IVentaRepository {
  async create(venta: Venta) {
    const total = venta.calcularTotal();
    return prisma.venta.create({
      data: {
        clienteId: venta.clienteId,
        total,
        detalles: {
          createMany: {
            data: venta.productos.map(p => ({
              productoId: p.id,
              cantidad: p.cantidad,
              precioUnit: p.precio,
            })),
          },
        },
      },
      include: { detalles: true },
    });
  }
}