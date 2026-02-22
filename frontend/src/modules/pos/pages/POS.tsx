import { useState } from "react";
import { useRegistrarVenta } from "../services/pos.api";
import { toast } from "sonner";
import api from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard } from "lucide-react";

type Item = { id: number; cantidad: number; price: number; name: string };

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
      return (res.data || []).map((p: any) => ({ id: p.id, name: p.name, price: p.price, cantidad: 1 } as Item));
    },
  });

  const total = items.reduce((acc, i) => acc + i.cantidad * i.price, 0);

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
        productos: items.map((it) => ({ id: it.id, cantidad: it.cantidad, precio: it.price })),
      };

      await registrar.mutateAsync(payload);
      toast.success("Venta registrada exitosamente");
      setItems([]);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al registrar venta");
    }
  }

  const filtered = (productos as Item[]).filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) || query.trim() === ""
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Punto de Venta</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto..."
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
              aria-label="Buscar producto"
            />
          </div>
          <button
            onClick={() => setQuery("")}
            className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product list */}
        <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-4">Productos</h3>

          {isLoading ? (
            <div className="text-slate-700 dark:text-slate-300">Cargando productos...</div>
          ) : isError ? (
            <div className="text-red-600 dark:text-red-400">Error al cargar productos</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-vixo-300 dark:hover:border-vixo-700 transition-all">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-50">{p.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">${p.price?.toFixed(2) ?? '0.00'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addProduct(p)}
                      className="rounded-lg bg-vixo-500 hover:bg-vixo-600 px-3 py-1.5 text-white font-medium transition-colors flex items-center gap-1 shadow-sm"
                      aria-label={`Agregar ${p.name}`}
                    >
                      <Plus className="w-4 h-4" />
                      Añadir
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div className="text-slate-700 dark:text-slate-300">No hay productos que coincidan.</div>}
            </div>
          )}
        </div>

        {/* Cart */}
        <aside className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito
          </h3>

          {items.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">No hay productos en el carrito</p>
          ) : (
            <ul className="space-y-3">
              {items.map((it, idx) => (
                <li key={it.id} className="flex items-center justify-between">
                  <div className="max-w-[55%]">
                    <div className="font-medium text-slate-900 dark:text-slate-50">{it.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">${it.price?.toFixed(2) ?? '0.00'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(idx, it.cantidad - 1)}
                      className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label={`Disminuir cantidad de ${it.name}`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      value={it.cantidad}
                      onChange={(e) => updateQty(idx, Number(e.target.value))}
                      className="w-16 text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 p-1 focus:ring-2 focus:ring-vixo-500"
                      min={1}
                      aria-label={`Cantidad de ${it.name}`}
                    />
                    <button
                      onClick={() => updateQty(idx, it.cantidad + 1)}
                      className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label={`Aumentar cantidad de ${it.name}`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(idx)}
                      className="ml-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      aria-label={`Eliminar ${it.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-slate-200 dark:border-slate-800 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>IVA (18%)</span>
              <span>${(total * 0.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-slate-50 text-lg">
              <span>Total</span>
              <span>${(total * 1.18).toFixed(2)}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={cobrar}
                disabled={registrar.isPending}
                className="flex-1 rounded-lg bg-vixo-500 hover:bg-vixo-600 active:bg-vixo-700 px-4 py-2.5 text-white font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                {registrar.isPending ? "Procesando..." : "Cobrar"}
              </button>
              <button
                onClick={() => setItems([])}
                className="rounded-lg border border-red-500 dark:border-red-600 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
