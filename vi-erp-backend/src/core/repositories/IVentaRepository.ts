import { Venta } from "../entities/Venta";

export interface IVentaRepository {
  create(venta: Venta): Promise<any>;
}