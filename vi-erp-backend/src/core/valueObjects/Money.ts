export class Money {
  private readonly amount: number;
  private readonly currency: string;

  constructor(amount: number, currency: string = "USD") {
    if (amount < 0) {
      throw new Error("El monto no puede ser negativo");
    }
    this.amount = Number(amount.toFixed(2));
    this.currency = currency;
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("No se pueden sumar montos de diferentes monedas");
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("No se pueden restar montos de diferentes monedas");
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
