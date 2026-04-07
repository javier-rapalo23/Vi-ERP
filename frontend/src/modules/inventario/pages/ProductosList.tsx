import { useProductos, useDesactivarProducto } from "../services/productos.api";
import { Link } from "react-router-dom";
import Loading from "@/shared/components/Loading";
import { useSettings } from "@/modules/mantenimientos/services/configuration.api";
import { toast } from "sonner";
import { PackagePlus } from "lucide-react";

export default function ProductosList() {
  const { data, isLoading, error } = useProductos();
  const desactivarMutation = useDesactivarProducto();
  const { data: settings = [] } = useSettings();

  const currencySymbol =
    settings.find((s) => s.key === "MONEDA_SIMBOLO")?.value?.trim() || "$";

  const handleDeactivate = async (id: number, name: string) => {
    if (!confirm(`¿Deseas desactivar el producto "${name}"?`)) return;
    try {
      await desactivarMutation.mutateAsync(id);
      toast.success("Producto desactivado exitosamente");
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? "Error al desactivar producto");
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-600 dark:text-red-400">Ocurrió un error al cargar los productos.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Productos</h2>
        <Link to="/inventario/nuevo" className="rounded-lg bg-vixo-500 hover:bg-vixo-600 px-4 py-2 text-white font-medium shadow-sm transition-colors flex items-center gap-2">
          <PackagePlus className="w-4 h-4" />
          Nuevo Producto
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Código producto</th>
              <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Código barras</th>
              <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Nombre</th>
              <th className="px-4 py-3 text-right text-slate-700 dark:text-slate-300 font-semibold">Precio</th>
              <th className="px-4 py-3 text-right text-slate-700 dark:text-slate-300 font-semibold">Costo</th>
              <th className="px-4 py-3 text-right text-slate-700 dark:text-slate-300 font-semibold">Stock</th>
              <th className="px-4 py-3 text-right text-slate-700 dark:text-slate-300 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((p) => (
                <tr key={p.id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-4 py-3 text-slate-900 dark:text-slate-50 font-medium">{p.code || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.barcode || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-slate-50">{p.name || 'Sin nombre'}</td>
                  <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{currencySymbol}{p.price?.toFixed(2) ?? '0.00'}</td>
                  <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{currencySymbol}{p.cost?.toFixed(2) ?? '0.00'}</td>
                  <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{p.stock ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link to={`/inventario/${p.id}/editar`} className="text-vixo-600 hover:text-vixo-800 dark:hover:text-vixo-400 text-sm">
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeactivate(p.id, p.name || "Sin nombre")}
                        disabled={desactivarMutation.isPending}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm disabled:opacity-50"
                      >
                        Desactivar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  No hay productos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
