import { useProductos } from "../services/productos.api";
import { Link } from "react-router-dom";
import Loading from "@/shared/components/Loading";

export default function ProductosList() {
  const { data, isLoading, error } = useProductos();

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-600">Ocurrió un error al cargar los productos.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Productos</h2>
        <Link
          to="/inventario/nuevo"
          className="rounded bg-neutral-900 px-4 py-2 text-white hover:opacity-90"
        >
          Nuevo Producto
        </Link>
      </div>
      
      <div className="overflow-x-auto rounded border bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-4 py-3 text-left">Código</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-right">Precio</th>
              <th className="px-4 py-3 text-right">Costo</th>
              <th className="px-4 py-3 text-right">Stock</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((p) => (
                <tr key={p.id} className="border-t hover:bg-neutral-50">
                  <td className="px-4 py-3">{p.codigo}</td>
                  <td className="px-4 py-3">{p.nombre}</td>
                  <td className="px-4 py-3 text-right">${p.precio.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">${p.costo.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
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
