export class RegistrarVentaUseCase {
  constructor(private ventaRepo: IVentaRepository) {}

  async execute(data: { clienteId: number; productos: { id: number; cantidad: number; precio: number }[] }) {
    const venta = new Venta(data.clienteId, data.productos);
    return await this.ventaRepo.create(venta);
  }
}