export class Sale {
  constructor(
    public customerId: number,
    public products: { id: number; quantity: number; price: number }[]
  ) {}

  calculateTotal(): number {
    return this.products.reduce((acc, p) => acc + p.quantity * p.price, 0);
  }
}