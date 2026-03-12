import { useState } from "react";
import { useRegistrarVenta } from "../services/pos.api";
import { useSettings } from "@/modules/mantenimientos/services/configuration.api";
import { useClientes } from "@/modules/ventas/services/clientes.api";
import { toast } from "sonner";
import api from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, User } from "lucide-react";

type Item = { id: number; cantidad: number; price: number; name: string };

export default function POS() {
  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const registrar = useRegistrarVenta();
  const { data: settings = [] } = useSettings();
  const { data: clientes = [], isLoading: isLoadingClientes, isError: isErrorClientes } = useClientes();

  // Cargar productos reales desde la API
  const { data: productos = [], isLoading, isError } = useQuery<Item[], Error>({
    queryKey: ["productos"],
    queryFn: async () => {
      const res = await api.get("/productos");
      // Mapear a Item con cantidad por defecto 1 y validar campos
      return (res.data || [])
        .filter((p: any) => p && p.id && p.name && typeof p.price === 'number')
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          cantidad: 1
        } as Item));
    },
  });

  const total = items.reduce((acc, i) => acc + i.cantidad * i.price, 0);

  const settingsMap = settings.reduce<Record<string, string>>((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});

  const taxName = settingsMap.IMPUESTO_NOMBRE?.trim() || "ISV";
  const rawTaxRate = Number(settingsMap.IMPUESTO_TASA);
  const taxRate = Number.isFinite(rawTaxRate) ? rawTaxRate : 15;
  const taxDecimal = taxRate / 100;
  const taxAmount = total * taxDecimal;
  const grandTotal = total + taxAmount;

  const currencySymbol = settingsMap.MONEDA_SIMBOLO?.trim() || "$";
  const currencyName = settingsMap.MONEDA_NOMBRE?.trim() || "Dolar";
  const selectedCustomer = clientes.find((cliente) => cliente.id === selectedCustomerId) ?? null;

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

    if (!selectedCustomer) {
      toast.error("Selecciona un cliente para registrar la venta");
      return;
    }

    try {
      const payload = {
        customerId: selectedCustomer.id,
        products: items.map((it) => ({ id: it.id, quantity: it.cantidad, price: it.price })),
      };

      await registrar.mutateAsync(payload);
      toast.success("Venta registrada exitosamente");
      setItems([]);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al registrar venta");
    }
  }

  const filtered = (productos as Item[]).filter(
    (p) => p.name?.toLowerCase().includes(query.toLowerCase()) || query.trim() === ""
  );
  const normalizedCustomerQuery = customerQuery.trim().toLowerCase();
  const filteredCustomers = clientes.filter((cliente) => {
    if (!normalizedCustomerQuery) return true;

    return [cliente.name, cliente.phone, cliente.email]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalizedCustomerQuery));
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-50">Punto de Venta</h1>

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Buscar producto</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
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

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-50">
              <User className="w-4 h-4 text-vixo-600 dark:text-vixo-400" />
              <p className="text-sm font-medium">Cliente de la venta</p>
            </div>
            {selectedCustomer && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCustomerId(null);
                  setCustomerQuery("");
                }}
                className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                Quitar
              </button>
            )}
          </div>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              value={customerQuery}
              onChange={(e) => setCustomerQuery(e.target.value)}
              placeholder="Buscar cliente por nombre, teléfono o email"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
              aria-label="Buscar cliente"
            />
          </div>

          {selectedCustomer ? (
            <div className="mt-3 rounded-lg border border-vixo-200 dark:border-vixo-800 bg-vixo-50 dark:bg-vixo-950/30 p-3">
              <p className="font-medium text-slate-900 dark:text-slate-50">{selectedCustomer.name}</p>
              <div className="mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                {selectedCustomer.phone && <p>Tel: {selectedCustomer.phone}</p>}
                {selectedCustomer.email && <p>Email: {selectedCustomer.email}</p>}
              </div>
            </div>
          ) : isLoadingClientes ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Cargando clientes...</p>
          ) : isErrorClientes ? (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">Error al cargar clientes</p>
          ) : (
            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
              {filteredCustomers.slice(0, 6).map((cliente) => (
                <button
                  key={cliente.id}
                  type="button"
                  onClick={() => {
                    setSelectedCustomerId(cliente.id);
                    setCustomerQuery(cliente.name);
                  }}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-left hover:border-vixo-300 dark:hover:border-vixo-700 transition-colors"
                >
                  <p className="font-medium text-slate-900 dark:text-slate-50">{cliente.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {cliente.phone || cliente.email || "Sin datos adicionales"}
                  </p>
                </button>
              ))}
              {filteredCustomers.length === 0 && (
                <p className="text-sm text-slate-600 dark:text-slate-400">No se encontraron clientes.</p>
              )}
            </div>
          )}
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
                    <div className="font-medium text-slate-900 dark:text-slate-50">{p.name || 'Sin nombre'}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{currencySymbol}{p.price?.toFixed(2) ?? '0.00'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addProduct(p)}
                      className="rounded-lg bg-vixo-500 hover:bg-vixo-600 px-3 py-1.5 text-white font-medium transition-colors flex items-center gap-1 shadow-sm"
                      aria-label={`Agregar ${p.name || 'producto'}`}
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

          <div className="mb-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Cliente</p>
            <p className="mt-1 font-medium text-slate-900 dark:text-slate-50">
              {selectedCustomer?.name || "Selecciona un cliente"}
            </p>
            {(selectedCustomer?.phone || selectedCustomer?.email) && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {selectedCustomer.phone || selectedCustomer.email}
              </p>
            )}
          </div>

          {items.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">No hay productos en el carrito</p>
          ) : (
            <ul className="space-y-3">
              {items.map((it, idx) => (
                <li key={it.id} className="flex items-center justify-between">
                  <div className="max-w-[55%]">
                    <div className="font-medium text-slate-900 dark:text-slate-50">{it.name || 'Sin nombre'}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{currencySymbol}{it.price?.toFixed(2) ?? '0.00'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(idx, it.cantidad - 1)}
                      className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label={`Disminuir cantidad de ${it.name || 'producto'}`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      value={it.cantidad}
                      onChange={(e) => updateQty(idx, Number(e.target.value))}
                      className="w-16 text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 p-1 focus:ring-2 focus:ring-vixo-500"
                      min={1}
                      aria-label={`Cantidad de ${it.name || 'producto'}`}
                    />
                    <button
                      onClick={() => updateQty(idx, it.cantidad + 1)}
                      className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label={`Aumentar cantidad de ${it.name || 'producto'}`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(idx)}
                      className="ml-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      aria-label={`Eliminar ${it.name || 'producto'}`}
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
              <span>{currencySymbol}{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>{taxName} ({taxRate}%)</span>
              <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-slate-50 text-lg">
              <span>Total</span>
              <span>{currencySymbol}{grandTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Moneda: {currencyName}</p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={cobrar}
                disabled={registrar.isPending || !selectedCustomer}
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
