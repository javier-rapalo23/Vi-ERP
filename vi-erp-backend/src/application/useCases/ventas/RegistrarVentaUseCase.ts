import { ISaleRepository } from "../../../core/repositories/IVentaRepository";
import { Sale } from "../../../core/entities/Venta";

export class RegisterSaleUseCase {
  constructor(private saleRepo: ISaleRepository) {}

  async execute(data: { customerId: number; products: { id: number; quantity: number; price: number }[] }) {
    const sale = new Sale(data.customerId, data.products);
    return await this.saleRepo.create(sale);
  }
}