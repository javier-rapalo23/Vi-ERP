export class Customer {
  constructor(
    public id: number,
    public name: string,
    public phone?: string,
    public email?: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim() === "") {
      throw new Error("Customer name is required");
    }
    if (this.email && !this.isValidEmail(this.email)) {
      throw new Error("Email format is invalid");
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  updatePhone(phone: string): void {
    this.phone = phone;
  }

  updateEmail(email: string): void {
    if (!this.isValidEmail(email)) {
      throw new Error("Email format is invalid");
    }
    this.email = email;
  }
}
