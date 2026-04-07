import { ISaleRepository } from "../../../core/repositories/IVentaRepository";
import { Sale } from "../../../core/entities/Venta";

export class RegisterSaleUseCase {
  constructor(private saleRepo: ISaleRepository) {}

  async execute(data: { customerId: number; paymentMethod: "CASH" | "TRANSFER" | "CARD"; products: { id: number; quantity: number; price: number }[] }) {
    const sale = new Sale(data.customerId, data.paymentMethod, data.products);
    return await this.saleRepo.create(sale);
  }
}