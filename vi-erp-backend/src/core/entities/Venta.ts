export class Venta {
  constructor(
    public clienteId: number,
    public productos: { id: number; cantidad: number; precio: number }[]
  ) {}

  calcularTotal(): number {
    return this.productos.reduce((acc, p) => acc + p.cantidad * p.precio, 0);
  }
}