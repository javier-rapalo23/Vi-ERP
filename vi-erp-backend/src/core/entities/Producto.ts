export class Producto {
  constructor(
    public id: number,
    public nombre: string,
    public codigo: string,
    public precio: number,
    public costo: number,
    public stock: number = 0
  ) {
    this.validar();
  }

  private validar(): void {
    if (this.precio < 0) {
      throw new Error("El precio no puede ser negativo");
    }
    if (this.costo < 0) {
      throw new Error("El costo no puede ser negativo");
    }
    if (this.stock < 0) {
      throw new Error("El stock no puede ser negativo");
    }
    if (!this.nombre || this.nombre.trim() === "") {
      throw new Error("El nombre del producto es requerido");
    }
    if (!this.codigo || this.codigo.trim() === "") {
      throw new Error("El código del producto es requerido");
    }
  }

  calcularMargen(): number {
    if (this.costo === 0) return 0;
    return ((this.precio - this.costo) / this.costo) * 100;
  }

  hayStock(cantidad: number): boolean {
    return this.stock >= cantidad;
  }

  descontarStock(cantidad: number): void {
    if (!this.hayStock(cantidad)) {
      throw new Error(`Stock insuficiente. Disponible: ${this.stock}, Solicitado: ${cantidad}`);
    }
    this.stock -= cantidad;
  }

  agregarStock(cantidad: number): void {
    if (cantidad <= 0) {
      throw new Error("La cantidad a agregar debe ser positiva");
    }
    this.stock += cantidad;
  }
}
