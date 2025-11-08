import { useState } from "react";
import { useRegistrarVenta } from "../services/pos.api";
import { toast } from "sonner";
import api from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";

type Item = { id: number; cantidad: number; precio: number; nombre: string };

export default function POS() {
  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const registrar = useRegistrarVenta();

  // Cargar productos reales desde la API
  const { data: productos = [], isLoading, isError } = useQuery<Item[], Error>({
    queryKey: ["productos"],
    queryFn: async () => {
      const res = await api.get("/productos");
      // Mapear a Item con cantidad por defecto 1
      return (res.data || []).map((p: any) => ({ id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 } as Item));
    },
  });

  const total = items.reduce((acc, i) => acc + i.cantidad * i.precio, 0);

  function addProduct(p: Item) {
    setItems((s) => {
      const found = s.find((x) => x.id === p.id);
      if (found) {
        return s.map((x) => (x.id === p.id ? { ...x, cantidad: x.cantidad + 1 } : x));
      }
      return [...s, { ...p }];
    });
  }

  function updateQty(index: number, qty: number) {
    if (qty <= 0) return removeItem(index);
    setItems((s) => s.map((it, i) => (i === index ? { ...it, cantidad: qty } : it)));
  }

  function removeItem(index: number) {
    setItems((s) => s.filter((_, i) => i !== index));
  }

  async function cobrar() {
    if (items.length === 0) {
      toast.error("Agrega al menos un producto");
      return;
    }

    try {
      // Enviar solo los campos que el backend valida (id, cantidad, precio)
      const payload = {
        clienteId: 1,
        productos: items.map((it) => ({ id: it.id, cantidad: it.cantidad, precio: it.precio })),
      };

      await registrar.mutateAsync(payload);
      toast.success("Venta registrada exitosamente");
      setItems([]);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al registrar venta");
    }
  }

  const filtered = (productos as Item[]).filter(
    (p) => p.nombre.toLowerCase().includes(query.toLowerCase()) || query.trim() === ""
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gris-piedra">Punto de Venta</h2>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto..."
            className="rounded border border-beige-arena px-3 py-2 focus:outline-none focus:ring-2 focus:ring-oliva"
            aria-label="Buscar producto"
          />
          <button
            onClick={() => setQuery("")}
            className="rounded border border-beige-arena px-3 py-2 text-gris-piedra hover:bg-marfil"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product list */}
        <div className="lg:col-span-2 bg-white border border-beige-arena rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-medium text-gris-piedra mb-4">Productos</h3>

          {isLoading ? (
            <div className="text-gris-piedra">Cargando productos...</div>
          ) : isError ? (
            <div className="text-terracota">Error al cargar productos</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded border border-beige-arena bg-marfil">
                  <div>
                    <div className="font-medium text-gris-piedra">{p.nombre}</div>
                    <div className="text-sm text-gris-piedra opacity-75">${p.precio.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addProduct(p)}
                      className="rounded bg-oliva px-3 py-1 text-marfil hover:opacity-95"
                      aria-label={`Agregar ${p.nombre}`}
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div className="text-gris-piedra">No hay productos que coincidan.</div>}
            </div>
          )}
        </div>

        {/* Cart */}
        <aside className="bg-white border border-beige-arena rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-medium text-gris-piedra mb-4">Carrito</h3>

          {items.length === 0 ? (
            <p className="text-gris-piedra opacity-60">No hay productos en el carrito</p>
          ) : (
            <ul className="space-y-3">
              {items.map((it, idx) => (
                <li key={it.id} className="flex items-center justify-between">
                  <div className="max-w-[55%]">
                    <div className="font-medium text-gris-piedra">{it.nombre}</div>
                    <div className="text-sm text-gris-piedra opacity-75">${it.precio.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(idx, it.cantidad - 1)}
                      className="px-2 py-1 rounded border border-beige-arena text-gris-piedra"
                      aria-label={`Disminuir cantidad de ${it.nombre}`}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={it.cantidad}
                      onChange={(e) => updateQty(idx, Number(e.target.value))}
                      className="w-16 text-center rounded border border-beige-arena p-1"
                      min={1}
                      aria-label={`Cantidad de ${it.nombre}`}
                    />
                    <button
                      onClick={() => updateQty(idx, it.cantidad + 1)}
                      className="px-2 py-1 rounded border border-beige-arena text-gris-piedra"
                      aria-label={`Aumentar cantidad de ${it.nombre}`}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(idx)}
                      className="ml-2 text-terracota"
                      aria-label={`Eliminar ${it.nombre}`}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-beige-arena mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-gris-piedra">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gris-piedra">
              <span>IVA (18%)</span>
              <span>${(total * 0.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gris-piedra text-lg">
              <span>Total</span>
              <span>${(total * 1.18).toFixed(2)}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={cobrar}
                disabled={registrar.isPending}
                className="flex-1 rounded bg-oliva px-4 py-2 text-marfil hover:opacity-95 disabled:opacity-50"
              >
                {registrar.isPending ? "Procesando..." : "Cobrar"}
              </button>
              <button
                onClick={() => setItems([])}
                className="rounded border border-beige-arena px-4 py-2 text-gris-piedra hover:bg-marfil"
              >
                Vaciar
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
