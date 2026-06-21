import { prisma } from "../client";
import { ISaleRepository, SalesHistoryFilters } from "../../../core/repositories/IVentaRepository";
import { Sale } from "../../../core/entities/Venta";
import { Prisma, SaleStatus } from "@prisma/client";

const INVOICE_METADATA_KEYS = [
  "EMPRESA_NOMBRE",
  "EMPRESA_RTN",
  "EMPRESA_DIRECCION",
  "EMPRESA_TELEFONO",
  "FACTURA_CAI",
  "FACTURA_RANGO_DESDE",
  "FACTURA_RANGO_HASTA",
  "FACTURA_FECHA_LIMITE",
  "FACTURA_FORMATO",
  "MONEDA_NOMBRE",
  "MONEDA_SIMBOLO",
  "IMPUESTO_NOMBRE",
  "IMPUESTO_TASA",
] as const;

const REQUIRED_INVOICE_METADATA_KEYS = [
  "EMPRESA_NOMBRE",
  "EMPRESA_RTN",
  "EMPRESA_DIRECCION",
  "FACTURA_CAI",
  "FACTURA_RANGO_DESDE",
  "FACTURA_RANGO_HASTA",
  "FACTURA_FECHA_LIMITE",
  "FACTURA_FORMATO",
  "MONEDA_NOMBRE",
  "MONEDA_SIMBOLO",
  "IMPUESTO_NOMBRE",
  "IMPUESTO_TASA",
] as const;

export class SaleRepository implements ISaleRepository {
  async create(sale: Sale) {
    const total = sale.calculateTotal();
    const consolidatedProducts = sale.products.reduce<Map<number, { productId: number; quantity: number }>>(
      (acc, line) => {
        const current = acc.get(line.id);
        if (current) {
          current.quantity += line.quantity;
          return acc;
        }

        acc.set(line.id, { productId: line.id, quantity: line.quantity });
        return acc;
      },
      new Map()
    );

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        return await prisma.$transaction(
          async (tx) => {
            const prefixSetting = await tx.setting.upsert({
              where: { key: "FACTURA_PREFIJO" },
              update: {},
              create: {
                key: "FACTURA_PREFIJO",
                name: "Prefijo de factura",
                value: "FAC-",
                description: "Prefijo del numero de factura",
                group: "FACTURA",
                isActive: true,
              },
            });

            const lengthSetting = await tx.setting.upsert({
              where: { key: "FACTURA_LONGITUD" },
              update: {},
              create: {
                key: "FACTURA_LONGITUD",
                name: "Longitud de correlativo",
                value: "8",
                description: "Cantidad de digitos del correlativo",
                group: "FACTURA",
                isActive: true,
              },
            });

            const currentSetting = await tx.setting.upsert({
              where: { key: "FACTURA_CORRELATIVO_ACTUAL" },
              update: {},
              create: {
                key: "FACTURA_CORRELATIVO_ACTUAL",
                name: "Correlativo actual",
                value: "0",
                description: "Ultimo correlativo generado para factura",
                group: "FACTURA",
                isActive: true,
              },
            });

            const prefix = prefixSetting.value || "FAC-";
            const parsedLength = Number(lengthSetting.value);
            const correlativoLength = Number.isFinite(parsedLength) && parsedLength > 0 ? parsedLength : 8;
            const parsedCurrent = Number(currentSetting.value);
            const currentCorrelative = Number.isFinite(parsedCurrent) && parsedCurrent >= 0 ? parsedCurrent : 0;
            const nextCorrelative = currentCorrelative + 1;
            const invoiceNumber = `${prefix}${String(nextCorrelative).padStart(correlativoLength, "0")}`;

            const createdSale = await tx.sale.create({
              data: {
                invoiceNumber,
                customerId: sale.customerId,
                paymentMethod: sale.paymentMethod,
                total,
                details: {
                  createMany: {
                    data: sale.products.map((p) => ({
                      productId: p.id,
                      quantity: p.quantity,
                      unitPrice: p.price,
                    })),
                  },
                },
              },
              include: {
                customer: {
                  select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true,
                  },
                },
                details: {
                  include: {
                    product: {
                      select: {
                        id: true,
                        name: true,
                        code: true,
                      },
                    },
                  },
                },
              },
            });

            for (const item of consolidatedProducts.values()) {
              const updated = await tx.product.updateMany({
                where: {
                  id: item.productId,
                  isActive: true,
                  stock: {
                    gte: item.quantity,
                  },
                },
                data: {
                  stock: {
                    decrement: item.quantity,
                  },
                  lastSaleDate: new Date(),
                },
              });

              if (updated.count === 0) {
                const product = await tx.product.findUnique({
                  where: { id: item.productId },
                  select: { name: true, code: true, stock: true, isActive: true },
                });

                if (!product || !product.isActive) {
                  throw new Error(`Producto no disponible para la venta: ID ${item.productId}`);
                }

                throw new Error(
                  `Stock insuficiente para ${product.name} (${product.code}). Disponible: ${product.stock}, solicitado: ${item.quantity}`
                );
              }

              await tx.inventoryTransaction.create({
                data: {
                  productId: item.productId,
                  quantity: item.quantity,
                  type: "OUT",
                },
              });
            }

            await tx.setting.update({
              where: { key: "FACTURA_CORRELATIVO_ACTUAL" },
              data: { value: String(nextCorrelative) },
            });

            const invoiceSettings = await tx.setting.findMany({
              where: {
                key: {
                  in: [...INVOICE_METADATA_KEYS],
                },
              },
            });

            const settingsMap = invoiceSettings.reduce<Record<string, string>>((acc, setting) => {
              acc[setting.key] = setting.value;
              return acc;
            }, {});

            const missingRequiredSettings = REQUIRED_INVOICE_METADATA_KEYS.filter((key) => {
              const value = settingsMap[key];
              return !value || value.trim() === "";
            });

            if (missingRequiredSettings.length > 0) {
              throw new Error(
                `Configuracion fiscal incompleta. Completa: ${missingRequiredSettings.join(", ")}`
              );
            }

            const taxRateRaw = Number(settingsMap.IMPUESTO_TASA);
            const taxRate = Number.isFinite(taxRateRaw) ? taxRateRaw : 15;
            const taxName = settingsMap.IMPUESTO_NOMBRE?.trim() || "ISV";
            const invoiceFormatRaw = (settingsMap.FACTURA_FORMATO || "TICKET").trim().toUpperCase();
            const invoiceFormat = invoiceFormatRaw === "PDF" ? "PDF" : "TICKET";

            const rangeStart = Number(settingsMap.FACTURA_RANGO_DESDE);
            const rangeEnd = Number(settingsMap.FACTURA_RANGO_HASTA);
            const validUntilDate = new Date(settingsMap.FACTURA_FECHA_LIMITE);

            if (!Number.isFinite(rangeStart) || !Number.isFinite(rangeEnd) || rangeStart <= 0 || rangeEnd < rangeStart) {
              throw new Error("Rango de facturacion invalido en configuracion fiscal");
            }

            if (Number.isNaN(validUntilDate.getTime())) {
              throw new Error("Fecha limite fiscal invalida en configuracion");
            }

            if (new Date().getTime() > validUntilDate.getTime()) {
              throw new Error("La fecha limite de facturacion fiscal ya vencio");
            }

            if (nextCorrelative < rangeStart || nextCorrelative > rangeEnd) {
              throw new Error(
                `Correlativo fuera de rango autorizado (${rangeStart}-${rangeEnd}). Correlativo solicitado: ${nextCorrelative}`
              );
            }

            const subtotal = createdSale.details.reduce((acc, detail) => acc + detail.quantity * detail.unitPrice, 0);
            const taxAmount = subtotal * (taxRate / 100);
            const totalWithTax = subtotal + taxAmount;

            const snapshot = {
              saleId: createdSale.id,
              invoiceNumber,
              date: createdSale.date,
              paymentMethod: createdSale.paymentMethod,
              customer: {
                id: createdSale.customer.id,
                name: createdSale.customer.name,
                phone: createdSale.customer.phone,
                email: createdSale.customer.email,
              },
              company: {
                name: settingsMap.EMPRESA_NOMBRE?.trim() || "Vi-ERP",
                rtn: settingsMap.EMPRESA_RTN?.trim() || "",
                address: settingsMap.EMPRESA_DIRECCION?.trim() || "",
                phone: settingsMap.EMPRESA_TELEFONO?.trim() || "",
              },
              fiscal: {
                cai: settingsMap.FACTURA_CAI?.trim() || "",
                rangeStart,
                rangeEnd,
                validUntil: validUntilDate.toISOString(),
              },
              format: invoiceFormat,
              currency: {
                symbol: settingsMap.MONEDA_SIMBOLO?.trim() || "$",
                name: settingsMap.MONEDA_NOMBRE?.trim() || "Dolar",
              },
              tax: {
                name: taxName,
                rate: taxRate,
                amount: taxAmount,
              },
              lines: createdSale.details.map((detail) => ({
                id: detail.id,
                productId: detail.productId,
                productName: detail.product?.name || "Producto",
                productCode: detail.product?.code || "",
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                lineTotal: detail.quantity * detail.unitPrice,
              })),
              subtotal,
              total: totalWithTax,
            };

            const saleWithSnapshot = await tx.sale.update({
              where: { id: createdSale.id },
              data: { invoiceSnapshot: snapshot as Prisma.InputJsonValue },
              include: {
                customer: {
                  select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true,
                  },
                },
                details: {
                  include: {
                    product: {
                      select: {
                        id: true,
                        name: true,
                        code: true,
                      },
                    },
                  },
                },
              },
            });

            return saleWithSnapshot;
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        );
      } catch (error: any) {
        const isSerializationConflict = error?.code === "P2034";
        const isInvoiceUniqueConflict = error?.code === "P2002";
        attempt += 1;

        if ((!isSerializationConflict && !isInvoiceUniqueConflict) || attempt >= maxRetries) {
          throw error;
        }
      }
    }

    throw new Error("No se pudo procesar la venta por conflictos de concurrencia");
  }

  async findAll(filters?: SalesHistoryFilters) {
    const where: Prisma.SaleWhereInput = {};

    if (filters?.dateFrom || filters?.dateTo) {
      where.date = {};
      if (filters.dateFrom) where.date.gte = filters.dateFrom;
      if (filters.dateTo) where.date.lte = filters.dateTo;
    }

    if (filters?.customer) {
      where.customer = {
        name: {
          contains: filters.customer,
          mode: "insensitive",
        },
      };
    }

    if (filters?.status) {
      where.status = filters.status as SaleStatus;
    }

    if (filters?.minAmount !== undefined || filters?.maxAmount !== undefined) {
      where.total = {};
      if (filters.minAmount !== undefined) where.total.gte = filters.minAmount;
      if (filters.maxAmount !== undefined) where.total.lte = filters.maxAmount;
    }

    const page = Math.max(1, filters?.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters?.limit ?? 20));
    const skip = (page - 1) * limit;

    const [total, amountResult, itemsResult, sales] = await Promise.all([
      prisma.sale.count({ where }),
      prisma.sale.aggregate({ where, _sum: { total: true } }),
      prisma.saleDetail.aggregate({ where: { sale: where }, _sum: { quantity: true } }),
      prisma.sale.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          details: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      data: sales,
      summary: {
        totalSales: total,
        totalAmount: Number(amountResult._sum.total ?? 0),
        totalItemsSold: Number(itemsResult._sum.quantity ?? 0),
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTotalsByPeriod() {
    const now = new Date();
    
    // Today: 00:00 to 23:59:59
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    
    // This week: Monday to Sunday
    const firstDay = now.getDate() - now.getDay();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), firstDay);
    const weekEnd = new Date(now.getFullYear(), now.getMonth(), firstDay + 6, 23, 59, 59, 999);
    
    // This month: 1st to last day
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const [todayResult, weekResult, monthResult] = await Promise.all([
      prisma.sale.aggregate({
        where: {
          date: { gte: todayStart, lte: todayEnd },
          NOT: { status: "CANCELLED" },
        },
        _count: { id: true },
        _sum: { total: true },
      }),
      prisma.sale.aggregate({
        where: {
          date: { gte: weekStart, lte: weekEnd },
          NOT: { status: "CANCELLED" },
        },
        _count: { id: true },
        _sum: { total: true },
      }),
      prisma.sale.aggregate({
        where: {
          date: { gte: monthStart, lte: monthEnd },
          NOT: { status: "CANCELLED" },
        },
        _count: { id: true },
        _sum: { total: true },
      }),
    ]);

    return {
      today: {
        count: todayResult._count.id || 0,
        total: Number(todayResult._sum.total || 0),
      },
      thisWeek: {
        count: weekResult._count.id || 0,
        total: Number(weekResult._sum.total || 0),
      },
      thisMonth: {
        count: monthResult._count.id || 0,
        total: Number(monthResult._sum.total || 0),
      },
    };
  }

  async findById(id: number) {
    return prisma.sale.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        details: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });
  }
}