import { useState } from "react";
import { useRegistrarVenta } from "../services/pos.api";
import { toast } from "sonner";

export default function POS() {
  const [items, setItems] = useState<
    { id: number; cantidad: number; precio: number; nombre?: string }[]
  >([]);
  const registrar = useRegistrarVenta();

  const total = items.reduce((acc, i) => acc + i.cantidad * i.precio, 0);

  const agregarItem = () => {
    setItems((s) => [
      ...s,
      { id: 1, cantidad: 1, precio: 100, nombre: "Producto Demo" },
    ]);
  };

  const eliminarItem = (index: number) => {
    setItems((s) => s.filter((_, i) => i !== index));
  };

  const cobrar = async () => {
    if (items.length === 0) {
      toast.error("Agrega al menos un producto");
      return;
    }

    try {
      await registrar.mutateAsync({ clienteId: 1, productos: items });
      toast.success("Venta registrada exitosamente");
      setItems([]);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al registrar venta");
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">Punto de Venta</h2>

      <div className="rounded border bg-white p-6 shadow">
        <div className="mb-4">
          <button
            onClick={agregarItem}
            className="rounded bg-neutral-900 px-4 py-2 text-white hover:opacity-90"
          >
            Agregar item demo
          </button>
        </div>

        {items.length > 0 ? (
          <>
            <ul className="space-y-2 mb-4">
              {items.map((i, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span className="font-medium">{i.nombre || `Producto ${i.id}`}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-neutral-600">
                      {i.cantidad} x ${i.precio.toFixed(2)}
                    </span>
                    <span className="font-semibold">
                      ${(i.cantidad * i.precio).toFixed(2)}
                    </span>
                    <button
                      onClick={() => eliminarItem(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={cobrar}
                  disabled={registrar.isPending}
                  className="flex-1 rounded bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {registrar.isPending ? "Procesando..." : "Cobrar"}
                </button>
                <button
                  onClick={() => setItems([])}
                  className="rounded border px-4 py-3 hover:bg-neutral-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-neutral-500 py-8">
            No hay productos en el carrito
          </p>
        )}
      </div>
    </div>
  );
}
