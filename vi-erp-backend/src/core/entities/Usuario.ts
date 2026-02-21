export class Usuario {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public role: string,
    public isActive: boolean = true,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim() === "") {
      throw new Error("El nombre del usuario es requerido");
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error("El formato del email es inválido");
    }
    if (!this.password || this.password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }
    if (!this.role || this.role.trim() === "") {
      throw new Error("El rol del usuario es requerido");
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  updateEmail(email: string): void {
    if (!this.isValidEmail(email)) {
      throw new Error("El formato del email es inválido");
    }
    this.email = email;
  }

  updateRole(role: string): void {
    if (!role || role.trim() === "") {
      throw new Error("El rol del usuario es requerido");
    }
    this.role = role;
  }

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }
}
