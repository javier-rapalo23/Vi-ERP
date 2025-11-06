export class Cliente {
  constructor(
    public id: number,
    public nombre: string,
    public telefono?: string,
    public email?: string
  ) {
    this.validar();
  }

  private validar(): void {
    if (!this.nombre || this.nombre.trim() === "") {
      throw new Error("El nombre del cliente es requerido");
    }
    if (this.email && !this.esEmailValido(this.email)) {
      throw new Error("El email no tiene un formato válido");
    }
  }

  private esEmailValido(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  actualizarTelefono(telefono: string): void {
    this.telefono = telefono;
  }

  actualizarEmail(email: string): void {
    if (!this.esEmailValido(email)) {
      throw new Error("El email no tiene un formato válido");
    }
    this.email = email;
  }
}
