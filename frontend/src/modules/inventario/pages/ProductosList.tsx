import { useProductos } from "../services/productos.api";
import { Link } from "react-router-dom";
import Loading from "@/shared/components/Loading";
import { PackagePlus } from "lucide-react";

export default function ProductosList() {
  const { data, isLoading, error } = useProductos();

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
              <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Código</th>
              <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Nombre</th>
              <th className="px-4 py-3 text-right text-slate-700 dark:text-slate-300 font-semibold">Precio</th>
              <th className="px-4 py-3 text-right text-slate-700 dark:text-slate-300 font-semibold">Costo</th>
              <th className="px-4 py-3 text-right text-slate-700 dark:text-slate-300 font-semibold">Stock</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((p) => (
                <tr key={p.id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-4 py-3 text-slate-900 dark:text-slate-50 font-medium">{p.code || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-slate-50">{p.name || 'Sin nombre'}</td>
                  <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">${p.price?.toFixed(2) ?? '0.00'}</td>
                  <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">${p.cost?.toFixed(2) ?? '0.00'}</td>
                  <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{p.stock ?? 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
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
