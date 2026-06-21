import { usePurchases } from "../services/purchases.api";
import { useSettings } from "@/modules/mantenimientos/services/configuration.api";
import { Link } from "react-router-dom";
import Loading from "@/shared/components/Loading";
import BackButton from "@/shared/components/BackButton";
import { ShoppingCart, Eye } from "lucide-react";

const statusLabels = {
  PENDING:   { label: "Pendiente",  class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  PARTIAL:   { label: "Parcial",    class: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  PAID:      { label: "Pagado",     class: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  CANCELLED: { label: "Cancelado",  class: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

export default function PurchasesList() {
  const { data, isLoading, error } = usePurchases();
  const { data: settings } = useSettings();

  const currencySymbol = settings?.find((s) => s.key === "MONEDA_SIMBOLO")?.value ?? "$";
  const fmt = (n: number) =>
    `${currencySymbol}${n.toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-500">Ocurrió un error al cargar las compras.</p>;

  return (
    <div className="space-y-4">
      <BackButton to="/compras" />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Compras</h2>
        <Link
          to="/compras/nueva"
          className="rounded-lg bg-vixo-500 hover:bg-vixo-600 px-4 py-2 text-white font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          Nueva Compra
        </Link>
      </div>

      {/* Vista tarjetas — móvil */}
      <div className="sm:hidden space-y-3">
        {data && data.length > 0 ? (
          data.map((purchase) => {
            const s = statusLabels[purchase.status];
            return (
              <div
                key={purchase.id}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-50">{purchase.supplier.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {new Date(purchase.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`shrink-0 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${s.class}`}>
                    {s.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Vence: {new Date(purchase.dueDate).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-vixo-600 dark:text-vixo-400">{fmt(purchase.total)}</span>
                </div>
                <Link
                  to={`/compras/${purchase.id}`}
                  className="inline-flex items-center gap-1 text-sm text-vixo-600 hover:text-vixo-700 dark:text-vixo-400 dark:hover:text-vixo-300 font-medium transition-colors"
                >
                  <Eye className="w-4 h-4" /> Ver detalle
                </Link>
              </div>
            );
          })
        ) : (
          <p className="text-center py-8 text-slate-400 dark:text-slate-500">No hay compras registradas</p>
        )}
      </div>

      {/* Vista tabla — escritorio */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left text-slate-900 dark:text-slate-50 font-semibold">#</th>
              <th className="px-4 py-3 text-left text-slate-900 dark:text-slate-50 font-semibold">Fecha</th>
              <th className="px-4 py-3 text-left text-slate-900 dark:text-slate-50 font-semibold">Proveedor</th>
              <th className="px-4 py-3 text-right text-slate-900 dark:text-slate-50 font-semibold">Total</th>
              <th className="px-4 py-3 text-left text-slate-900 dark:text-slate-50 font-semibold">Estado</th>
              <th className="px-4 py-3 text-center text-slate-900 dark:text-slate-50 font-semibold">Vencimiento</th>
              <th className="px-4 py-3 text-center text-slate-900 dark:text-slate-50 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="border-t border-slate-200 dark:border-slate-700 hover:bg-vixo-50 dark:hover:bg-slate-900 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-400 dark:text-slate-500 text-xs font-mono">
                    #{purchase.id}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {new Date(purchase.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-slate-900 dark:text-slate-50 font-medium">
                    {purchase.supplier.name}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-50">
                    {fmt(purchase.total)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusLabels[purchase.status].class}`}>
                      {statusLabels[purchase.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">
                    {new Date(purchase.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      to={`/compras/${purchase.id}`}
                      className="inline-flex items-center gap-1 text-vixo-600 hover:text-vixo-700 dark:text-vixo-400 dark:hover:text-vixo-300 font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  No hay compras registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
