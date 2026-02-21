import { prisma } from "../client";
import { IUsuarioRepository } from "../../../core/repositories/IUsuarioRepository";
import { Usuario } from "../../../core/entities/Usuario";

export class UsuarioRepository implements IUsuarioRepository {
  async findByEmail(email: string): Promise<Usuario | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new Usuario(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
      user.isActive,
      user.createdAt,
      user.updatedAt
    );
  }

  async findById(id: number): Promise<Usuario | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new Usuario(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
      user.isActive,
      user.createdAt,
      user.updatedAt
    );
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const user = await prisma.user.create({
      data: {
        name: usuario.name,
        email: usuario.email,
        password: usuario.password,
        role: usuario.role,
        isActive: usuario.isActive,
      },
    });

    return new Usuario(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
      user.isActive,
      user.createdAt,
      user.updatedAt
    );
  }

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: usuario.name,
        email: usuario.email,
        password: usuario.password,
        role: usuario.role,
        isActive: usuario.isActive,
      },
    });

    return new Usuario(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
      user.isActive,
      user.createdAt,
      user.updatedAt
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Usuario[]> {
    const users = await prisma.user.findMany({
      where: { isActive: true },
    });

    return users.map(
      (user) =>
        new Usuario(
          user.id,
          user.name,
          user.email,
          user.password,
          user.role,
          user.isActive,
          user.createdAt,
          user.updatedAt
        )
    );
  }
}
