import bcrypt from "bcrypt";
import { IUsuarioRepository } from "../../../core/repositories/IUsuarioRepository";
import { Usuario } from "../../../core/entities/Usuario";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  usuario: {
    id: number;
    email: string;
    nombre: string;
    role: string;
  };
  token?: string;
}

export class AutenticarUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(loginData: LoginDTO): Promise<LoginResponse> {
    // Buscar usuario por email
    const usuario = await this.usuarioRepository.findByEmail(loginData.email);

    if (!usuario) {
      throw new Error("Credenciales inválidas");
    }

    // Verificar si el usuario está activo
    if (!usuario.isActive) {
      throw new Error("Usuario inactivo. Contacte al administrador");
    }

    // Verificar la contraseña
    const passwordValida = await bcrypt.compare(
      loginData.password,
      usuario.password
    );

    if (!passwordValida) {
      throw new Error("Credenciales inválidas");
    }

    // Retornar datos del usuario (el token se genera en el controlador)
    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.name,
        role: usuario.role,
      },
    };
  }
}
