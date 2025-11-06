export interface IVentaRepository {
  create(venta: Venta): Promise<any>;
}