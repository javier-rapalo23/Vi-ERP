import { Usuario } from "../entities/Usuario";

export interface IUsuarioRepository {
  findByEmail(email: string): Promise<Usuario | null>;
  findById(id: number): Promise<Usuario | null>;
  create(usuario: Usuario): Promise<Usuario>;
  update(id: number, usuario: Partial<Usuario>): Promise<Usuario>;
  delete(id: number): Promise<void>;
  findAll(): Promise<Usuario[]>;
}
