import { useParams } from "react-router-dom";
import { useProductKardex } from "../services/productos.api";
import BackButton from "@/shared/components/BackButton";
import Loading from "@/shared/components/Loading";
import { ArrowDownLeft, ArrowUpRight, Package } from "lucide-react";
import { useState } from "react";

export default function KardexProducto() {
  const { productId } = useParams();
  const id = productId ? parseInt(productId, 10) : 0;
  const { data: kardex, isLoading, error } = useProductKardex(id);
  const [filterType, setFilterType] = useState<"ALL" | "IN" | "OUT">("ALL");

  const getTypeColor = (type: string) => {
    return type === "IN"
      ? "text-green-600 dark:text-green-400"
      : type === "OUT"
      ? "text-red-600 dark:text-red-400"
      : "text-blue-600 dark:text-blue-400";
  };

  const getTypeBgColor = (type: string) => {
    return type === "IN"
      ? "bg-green-50 dark:bg-green-900/20"
      : type === "OUT"
      ? "bg-red-50 dark:bg-red-900/20"
      : "bg-blue-50 dark:bg-blue-900/20";
  };

  const getTypeLabel = (type: string) => {
    return type === "IN" ? "Entrada" : type === "OUT" ? "Salida" : "Ajuste";
  };

  const getTypeIcon = (type: string) => {
    return type === "IN" ? (
      <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
    ) : (
      <ArrowDownLeft className="w-4 h-4 text-red-600 dark:text-red-400" />
    );
  };

  if (isLoading) return <Loading />;
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <BackButton to="/inventario" />
        <div className="rounded border border-red-300 bg-red-50 dark:bg-red-900/20 p-6 text-red-800 dark:text-red-200">
          Error al cargar el kardex
        </div>
      </div>
    );
  }

  if (!kardex) {
    return (
      <div className="max-w-7xl mx-auto">
        <BackButton to="/inventario" />
        <div className="rounded border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-6 text-yellow-800 dark:text-yellow-200">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  const filteredLines =
    filterType === "ALL"
      ? kardex.lines
      : kardex.lines.filter((line) => line.type === filterType);

  return (
    <div className="max-w-7xl mx-auto">
      <BackButton to="/inventario" />

      {/* Header */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-oliva" />
          <div>
            <h1 className="text-3xl font-bold text-gris-piedra dark:text-neutral-100">
              Kardex
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {kardex.code} - {kardex.name}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded border border-beige-arena dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">Stock Actual</div>
          <div className="text-3xl font-bold text-gris-piedra dark:text-neutral-100 mt-2">
            {kardex.currentStock}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">unidades</div>
        </div>

        <div className="rounded border border-beige-arena dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">Costo Promedio</div>
          <div className="text-3xl font-bold text-gris-piedra dark:text-neutral-100 mt-2">
            ${kardex.averageCost.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">por unidad</div>
        </div>

        <div className="rounded border border-beige-arena dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">Valor Total</div>
          <div className="text-3xl font-bold text-gris-piedra dark:text-neutral-100 mt-2">
            ${(kardex.currentStock * kardex.averageCost).toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">inventario</div>
        </div>
      </div>

      {/* Movement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded border border-green-300 bg-green-50 dark:bg-green-900/20 p-4">
          <div className="text-sm font-medium text-green-800 dark:text-green-200">Entradas Totales</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-green-700 dark:text-green-300">
              {kardex.totalEntriesQty}
            </span>
            <span className="text-sm text-green-600 dark:text-green-400">unidades</span>
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            Valor: ${kardex.totalEntriesValue.toFixed(2)}
          </div>
        </div>

        <div className="rounded border border-red-300 bg-red-50 dark:bg-red-900/20 p-4">
          <div className="text-sm font-medium text-red-800 dark:text-red-200">Salidas Totales</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-red-700 dark:text-red-300">
              {kardex.totalExitsQty}
            </span>
            <span className="text-sm text-red-600 dark:text-red-400">unidades</span>
          </div>
          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
            Valor: ${kardex.totalExitsValue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 border-b border-beige-arena dark:border-neutral-700 pb-3">
        {(["ALL", "IN", "OUT"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded font-medium transition ${
              filterType === type
                ? "bg-oliva text-marfil"
                : "bg-beige-arena dark:bg-neutral-700 text-gris-piedra dark:text-neutral-300 hover:opacity-80"
            }`}
          >
            {type === "ALL" ? "Todos" : type === "IN" ? "Entradas" : "Salidas"}
            <span className="ml-2 text-sm opacity-75">
              (
              {type === "ALL"
                ? kardex.lines.length
                : kardex.lines.filter((l) => l.type === type).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Movement Table */}
      <div className="overflow-x-auto rounded border border-beige-arena dark:border-neutral-700">
        <table className="w-full text-sm">
          <thead className="bg-beige-arena dark:bg-neutral-700 border-b border-beige-arena dark:border-neutral-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gris-piedra dark:text-neutral-100">
                Fecha
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gris-piedra dark:text-neutral-100">
                Referencia
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gris-piedra dark:text-neutral-100">
                Tipo
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gris-piedra dark:text-neutral-100">
                Cantidad
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gris-piedra dark:text-neutral-100">
                Costo Unit.
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gris-piedra dark:text-neutral-100">
                Valor
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gris-piedra dark:text-neutral-100">
                Saldo
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gris-piedra dark:text-neutral-100">
                Usuario
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLines.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
                  No hay movimientos para este filtro
                </td>
              </tr>
            ) : (
              filteredLines.map((line) => (
                <tr
                  key={line.id}
                  className={`border-b border-beige-arena dark:border-neutral-700 hover:opacity-75 ${getTypeBgColor(
                    line.type
                  )}`}
                >
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {new Date(line.date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <span className="font-mono text-xs bg-white dark:bg-neutral-800 px-2 py-1 rounded">
                      {line.reference}
                    </span>
                    {line.description && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {line.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(line.type)}
                      <span className={`font-medium ${getTypeColor(line.type)}`}>
                        {getTypeLabel(line.type)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gris-piedra dark:text-neutral-100">
                    {line.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                    ${line.costPerUnit.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gris-piedra dark:text-neutral-100">
                    ${line.transactionValue.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-oliva">
                    {line.runningBalance}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <span className="text-xs">{line.userName}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="mt-6 p-4 rounded bg-beige-arena/30 dark:bg-neutral-700/30 text-sm text-slate-600 dark:text-slate-400">
        <p>
          Total de movimientos: <strong>{kardex.lines.length}</strong> | Entradas:{" "}
          <strong>{kardex.totalEntriesQty}</strong> | Salidas: <strong>{kardex.totalExitsQty}</strong>
        </p>
      </div>
    </div>
  );
}
