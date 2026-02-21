import { useUsers, useDeleteUser } from "../services/users.api";
import { Link } from "react-router-dom";
import Loading from "@/shared/components/Loading";
import { toast } from "sonner";
import { UserPlus, Pencil, Trash2 } from "lucide-react";

export default function UsersList() {
  const { data, isLoading, error } = useUsers();
  const deleteMutation = useDeleteUser();

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar al usuario "${name}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Usuario eliminado exitosamente");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al eliminar usuario");
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p className="text-terracota">Ocurrió un error al cargar los usuarios.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gris-piedra dark:text-neutral-100">Usuarios</h2>
        <Link
          to="/mantenimientos/usuarios/nuevo"
          className="rounded bg-oliva px-4 py-2 text-marfil hover:opacity-90 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Usuario
        </Link>
      </div>

      <div className="overflow-x-auto rounded border border-beige-arena dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-beige-arena dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-gris-piedra dark:text-neutral-100">Nombre</th>
              <th className="px-4 py-3 text-left text-gris-piedra dark:text-neutral-100">Email</th>
              <th className="px-4 py-3 text-left text-gris-piedra dark:text-neutral-100">Roles</th>
              <th className="px-4 py-3 text-left text-gris-piedra dark:text-neutral-100">Estado</th>
              <th className="px-4 py-3 text-right text-gris-piedra dark:text-neutral-100">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-beige-arena dark:border-neutral-700 hover:bg-beige-arena dark:hover:bg-neutral-700"
                >
                  <td className="px-4 py-3 text-gris-piedra dark:text-neutral-300">{user.name}</td>
                  <td className="px-4 py-3 text-gris-piedra dark:text-neutral-300">{user.email}</td>
                  <td className="px-4 py-3 text-gris-piedra dark:text-neutral-300">
                    {user.roles && user.roles.length > 0
                      ? user.roles.map((r) => r.name).join(", ")
                      : "Sin roles"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs ${
                        user.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {user.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/mantenimientos/usuarios/${user.id}/editar`}
                        className="text-oliva hover:underline flex items-center gap-1"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="text-terracota hover:underline flex items-center gap-1"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gris-piedra dark:text-neutral-300 opacity-60">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
