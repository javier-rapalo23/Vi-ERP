export class Shift {
  id?: number;
  userId: number;
  openingAmount: number;
  closingAmount?: number;
  expectedAmount?: number;
  variance?: number;
  status: "OPEN" | "CLOSED";
  notes?: string;
  openedAt?: Date;
  closedAt?: Date;

  constructor(
    userId: number,
    openingAmount: number,
    status: "OPEN" | "CLOSED" = "OPEN"
  ) {
    this.userId = userId;
    this.openingAmount = openingAmount;
    this.status = status;
    this.openedAt = new Date();
  }

  close(closingAmount: number, notes?: string) {
    this.closingAmount = closingAmount;
    this.status = "CLOSED";
    this.closedAt = new Date();
    this.notes = notes;
  }

  calculateVariance(expectedAmount: number) {
    if (this.closingAmount !== undefined) {
      this.expectedAmount = expectedAmount;
      this.variance = this.closingAmount - expectedAmount;
    }
  }
}
