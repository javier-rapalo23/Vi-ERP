import { useRoles, useDeleteRole } from "../services/roles.api";
import { Link } from "react-router-dom";
import Loading from "@/shared/components/Loading";
import { toast } from "sonner";
import { ShieldPlus, Pencil, Trash2 } from "lucide-react";

export default function RolesList() {
  const { data, isLoading, error } = useRoles();
  const deleteMutation = useDeleteRole();

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el rol "${name}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Rol eliminado exitosamente");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al eliminar rol");
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p className="text-terracota">Ocurrió un error al cargar los roles.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gris-piedra dark:text-neutral-100">Roles</h2>
        <Link
          to="/mantenimientos/roles/nuevo"
          className="rounded bg-oliva px-4 py-2 text-marfil hover:opacity-90 flex items-center gap-2"
        >
          <ShieldPlus className="w-4 h-4" />
          Nuevo Rol
        </Link>
      </div>

      <div className="overflow-x-auto rounded border border-beige-arena dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-beige-arena dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-gris-piedra dark:text-neutral-100">Nombre</th>
              <th className="px-4 py-3 text-left text-gris-piedra dark:text-neutral-100">Descripción</th>
              <th className="px-4 py-3 text-left text-gris-piedra dark:text-neutral-100">Permisos</th>
              <th className="px-4 py-3 text-right text-gris-piedra dark:text-neutral-100">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((role) => (
                <tr
                  key={role.id}
                  className="border-t border-beige-arena dark:border-neutral-700 hover:bg-beige-arena dark:hover:bg-neutral-700"
                >
                  <td className="px-4 py-3 text-gris-piedra dark:text-neutral-300">{role.name}</td>
                  <td className="px-4 py-3 text-gris-piedra dark:text-neutral-300">
                    {role.description || "-"}
                  </td>
                  <td className="px-4 py-3 text-gris-piedra dark:text-neutral-300">
                    {role.permissions && role.permissions.length > 0
                      ? `${role.permissions.length} permisos`
                      : "Sin permisos"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/mantenimientos/roles/${role.id}/editar`}
                        className="text-oliva hover:underline flex items-center gap-1"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(role.id, role.name)}
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
                <td colSpan={4} className="px-4 py-8 text-center text-gris-piedra dark:text-neutral-300 opacity-60">
                  No hay roles registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
