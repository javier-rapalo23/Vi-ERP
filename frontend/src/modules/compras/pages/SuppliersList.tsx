import { useSuppliers, useDeleteSupplier } from "../services/suppliers.api";
import { Link } from "react-router-dom";
import Loading from "@/shared/components/Loading";
import { toast } from "sonner";
import { UserPlus, Pencil, Trash2, Phone, Mail, MapPin } from "lucide-react";

export default function SuppliersList() {
  const { data, isLoading, error } = useSuppliers();
  const deleteMutation = useDeleteSupplier();

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar al proveedor "${name}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Proveedor eliminado exitosamente");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al eliminar proveedor");
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-600 dark:text-red-400">Ocurrió un error al cargar los proveedores.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Proveedores</h2>
        <Link
          to="/compras/proveedores/nuevo"
          className="rounded-lg bg-vixo-500 hover:bg-vixo-600 px-4 py-2 text-white font-medium shadow-sm transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Proveedor
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data && data.length > 0 ? (
          data.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {supplier.name}
                  </h3>
                  <span
                    className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      supplier.isActive
                        ? "bg-vixo-100 text-vixo-700 dark:bg-vixo-950 dark:text-vixo-400"
                        : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                    }`}
                  >
                    {supplier.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {supplier.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-vixo-600 dark:text-vixo-400" />
                    {supplier.phone}
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-vixo-600 dark:text-vixo-400" />
                    {supplier.email}
                  </div>
                )}
                {supplier.adress && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-vixo-600 dark:text-vixo-400" />
                    {supplier.adress}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Link
                  to={`/compras/proveedores/${supplier.id}/editar`}
                  className="flex-1 text-center rounded-lg border border-vixo-500 dark:border-vixo-600 px-3 py-1.5 text-sm text-vixo-600 dark:text-vixo-400 hover:bg-vixo-500 hover:text-white dark:hover:bg-vixo-600 transition-colors flex items-center justify-center gap-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(supplier.id, supplier.name)}
                  className="flex-1 rounded-lg border border-red-500 dark:border-red-600 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
            No hay proveedores registrados
          </div>
        )}
      </div>
    </div>
  );
}
