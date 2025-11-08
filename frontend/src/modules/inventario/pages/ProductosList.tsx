import { useProductos } from "../services/productos.api";
import { Link } from "react-router-dom";
import Loading from "@/shared/components/Loading";

export default function ProductosList() {
  const { data, isLoading, error } = useProductos();

  if (isLoading) return <Loading />;
  if (error) return <p className="text-terracota">Ocurrió un error al cargar los productos.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gris-piedra">Productos</h2>
        <Link to="/inventario/nuevo" className="rounded bg-oliva px-4 py-2 text-marfil hover:opacity-90">
          Nuevo Producto
        </Link>
      </div>

      <div className="overflow-x-auto rounded border border-beige-arena bg-marfil shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-beige-arena">
            <tr>
              <th className="px-4 py-3 text-left text-gris-piedra">Código</th>
              <th className="px-4 py-3 text-left text-gris-piedra">Nombre</th>
              <th className="px-4 py-3 text-right text-gris-piedra">Precio</th>
              <th className="px-4 py-3 text-right text-gris-piedra">Costo</th>
              <th className="px-4 py-3 text-right text-gris-piedra">Stock</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((p) => (
                <tr key={p.id} className="border-t border-beige-arena hover:bg-marfil">
                  <td className="px-4 py-3 text-gris-piedra">{p.codigo}</td>
                  <td className="px-4 py-3 text-gris-piedra">{p.nombre}</td>
                  <td className="px-4 py-3 text-right text-gris-piedra">${p.precio.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gris-piedra">${p.costo.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gris-piedra">{p.stock}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gris-piedra opacity-60">
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
