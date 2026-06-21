import { useRoles, useDeleteRole } from "../services/roles.api";
import { Link } from "react-router-dom";
import Loading from "@/shared/components/Loading";
import BackButton from "@/shared/components/BackButton";
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
  if (error) return <p className="text-red-600 dark:text-red-400">Ocurrió un error al cargar los roles.</p>;

  return (
    <div className="space-y-4">
      <BackButton to="/mantenimientos" />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-neutral-100">Roles</h2>
        <Link
          to="/mantenimientos/roles/nuevo"
          className="rounded bg-vixo-500 hover:bg-vixo-600 px-4 py-2 text-white transition-colors flex items-center gap-2 text-sm"
        >
          <ShieldPlus className="w-4 h-4" />
          Nuevo Rol
        </Link>
      </div>

      {/* Vista tarjetas — móvil */}
      <div className="sm:hidden space-y-3">
        {data && data.length > 0 ? (
          data.map((role) => (
            <div key={role.id} className="rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-700 dark:text-neutral-100">{role.name}</p>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {role.permissions && role.permissions.length > 0 ? `${role.permissions.length} permisos` : "Sin permisos"}
                </span>
              </div>
              {role.description && <p className="text-sm text-neutral-500 dark:text-neutral-400">{role.description}</p>}
              <div className="flex gap-3 pt-1">
                <Link to={`/mantenimientos/roles/${role.id}/editar`} className="flex items-center gap-1 text-sm text-vixo-600 dark:text-vixo-400 hover:underline">
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </Link>
                <button onClick={() => handleDelete(role.id, role.name)} className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:underline" disabled={deleteMutation.isPending}>
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-8 text-slate-700 dark:text-neutral-300 opacity-60">No hay roles registrados</p>
        )}
      </div>

      {/* Vista tabla — escritorio */}
      <div className="hidden sm:block overflow-x-auto rounded border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-slate-700 dark:text-neutral-100">Nombre</th>
              <th className="px-4 py-3 text-left text-slate-700 dark:text-neutral-100">Descripción</th>
              <th className="px-4 py-3 text-left text-slate-700 dark:text-neutral-100">Permisos</th>
              <th className="px-4 py-3 text-right text-slate-700 dark:text-neutral-100">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((role) => (
                <tr key={role.id} className="border-t border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-700">
                  <td className="px-4 py-3 text-slate-700 dark:text-neutral-300">{role.name}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-neutral-300">{role.description || "-"}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-neutral-300">
                    {role.permissions && role.permissions.length > 0 ? `${role.permissions.length} permisos` : "Sin permisos"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/mantenimientos/roles/${role.id}/editar`} className="text-vixo-600 dark:text-vixo-400 hover:underline flex items-center gap-1">
                        <Pencil className="w-3.5 h-3.5" /> Editar
                      </Link>
                      <button onClick={() => handleDelete(role.id, role.name)} className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1" disabled={deleteMutation.isPending}>
                        <Trash2 className="w-3.5 h-3.5" /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-700 dark:text-neutral-300 opacity-60">No hay roles registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
