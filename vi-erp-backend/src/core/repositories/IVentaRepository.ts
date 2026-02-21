import { Sale } from "../entities/Venta";

export interface ISaleRepository {
  create(sale: Sale): Promise<any>;
}