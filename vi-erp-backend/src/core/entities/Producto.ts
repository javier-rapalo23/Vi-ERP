export class Product {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public barcode: string | null,
    public price: number,
    public cost: number,
    public stock: number = 0
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.price < 0) {
      throw new Error("Price cannot be negative");
    }
    if (this.cost < 0) {
      throw new Error("Cost cannot be negative");
    }
    if (this.stock < 0) {
      throw new Error("Stock cannot be negative");
    }
    if (!this.name || this.name.trim() === "") {
      throw new Error("Product name is required");
    }
    if (!this.code || this.code.trim() === "") {
      throw new Error("Product code is required");
    }
  }

  calculateMargin(): number {
    if (this.cost === 0) return 0;
    return ((this.price - this.cost) / this.cost) * 100;
  }

  hasStock(quantity: number): boolean {
    return this.stock >= quantity;
  }

  decreaseStock(quantity: number): void {
    if (!this.hasStock(quantity)) {
      throw new Error(`Insufficient stock. Available: ${this.stock}, Requested: ${quantity}`);
    }
    this.stock -= quantity;
  }

  addStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity to add must be positive");
    }
    this.stock += quantity;
  }
}
