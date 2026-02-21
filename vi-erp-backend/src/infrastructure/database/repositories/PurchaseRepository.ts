import { PrismaClient, PurchaseStatus } from "../generated/client";

const prisma = new PrismaClient();

export class PurchaseRepository {
  async findAll() {
    return prisma.purchase.findMany({
      include: {
        supplier: true,
        details: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });
  }

  async findById(id: number) {
    return prisma.purchase.findUnique({
      where: { id },
      include: {
        supplier: true,
        details: {
          include: {
            product: true,
          },
        },
        accountsPayable: {
          include: {
            payments: true,
          },
        },
      },
    });
  }

  async create(data: {
    supplierId: number;
    total: number;
    dueDate: Date;
    details: Array<{
      productId: number;
      quantity: number;
      unitPrice: number;
    }>;
  }) {
    return prisma.$transaction(async (tx) => {
      // Crear la compra
      const purchase = await tx.purchase.create({
        data: {
          supplierId: data.supplierId,
          total: data.total,
          status: PurchaseStatus.PENDING,
          dueDate: data.dueDate,
          details: {
            create: data.details,
          },
        },
        include: {
          details: true,
        },
      });

      // Actualizar el stock de los productos
      for (const detail of data.details) {
        await tx.product.update({
          where: { id: detail.productId },
          data: {
            stock: {
              increment: detail.quantity,
            },
            cost: detail.unitPrice, // Actualizar el costo con el último precio de compra
          },
        });

        // Registrar transacción de inventario
        await tx.inventoryTransaction.create({
          data: {
            productId: detail.productId,
            quantity: detail.quantity,
            type: "IN",
          },
        });
      }

      // Crear cuenta por pagar
      await tx.accountsPayable.create({
        data: {
          purchaseId: purchase.id,
          totalAmount: data.total,
          paidAmount: 0,
          balance: data.total,
          dueDate: data.dueDate,
        },
      });

      return purchase;
    });
  }

  async updateStatus(id: number, status: PurchaseStatus) {
    return prisma.purchase.update({
      where: { id },
      data: { status },
    });
  }

  async registerPayment(purchaseId: number, data: {
    amount: number;
    paymentMethod: string;
    reference?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const accountsPayable = await tx.accountsPayable.findUnique({
        where: { purchaseId },
      });

      if (!accountsPayable) {
        throw new Error("No se encontró la cuenta por pagar");
      }

      if (data.amount > accountsPayable.balance) {
        throw new Error("El monto del pago excede el saldo pendiente");
      }

      // Registrar el pago
      const payment = await tx.payment.create({
        data: {
          accountsPayableId: accountsPayable.id,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          reference: data.reference,
        },
      });

      // Actualizar el saldo
      const newPaidAmount = accountsPayable.paidAmount + data.amount;
      const newBalance = accountsPayable.balance - data.amount;

      await tx.accountsPayable.update({
        where: { id: accountsPayable.id },
        data: {
          paidAmount: newPaidAmount,
          balance: newBalance,
        },
      });

      // Actualizar el estado de la compra
      let newStatus: PurchaseStatus = PurchaseStatus.PARTIAL;
      if (newBalance === 0) {
        newStatus = PurchaseStatus.PAID;
      }

      await tx.purchase.update({
        where: { id: purchaseId },
        data: { status: newStatus },
      });

      return payment;
    });
  }
}
