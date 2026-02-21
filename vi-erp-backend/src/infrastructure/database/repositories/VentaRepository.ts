import { prisma } from "../client";
import { ISaleRepository } from "../../../core/repositories/IVentaRepository";
import { Sale } from "../../../core/entities/Venta";

export class SaleRepository implements ISaleRepository {
  async create(sale: Sale) {
    const total = sale.calculateTotal();
    return prisma.sale.create({
      data: {
        customerId: sale.customerId,
        total,
        details: {
          createMany: {
            data: sale.products.map(p => ({
              productId: p.id,
              quantity: p.quantity,
              unitPrice: p.price,
            })),
          },
        },
      },
      include: { details: true },
    });
  }
}