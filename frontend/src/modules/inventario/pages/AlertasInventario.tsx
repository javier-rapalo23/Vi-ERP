import { useQuery } from "@tanstack/react-query";
import axios from "@/shared/api/axios";
import BackButton from "@/shared/components/BackButton";
import Loading from "@/shared/components/Loading";
import { AlertTriangle, AlertCircle, TrendingDown } from "lucide-react";
import { useState } from "react";

interface StockAlert {
  productId: number;
  code: string;
  name: string;
  stock: number;
  minStock: number;
  severity: "critical" | "warning";
}

interface RotationAlert {
  productId: number;
  code: string;
  name: string;
  lastSaleDate: string | null;
  daysSinceLastSale: number | null;
  severity: "critical" | "warning";
}

interface AllAlerts {
  stockAlerts: StockAlert[];
  rotationAlerts: RotationAlert[];
  totalAlerts: number;
}

export default function AlertasInventario() {
  const [activeTab, setActiveTab] = useState<"stock" | "rotation">("stock");

  const { data: alerts, isLoading, error } = useQuery<AllAlerts>({
    queryKey: ["inventoryAlerts"],
    queryFn: async () => {
      const { data } = await axios.get("/api/productos/alerts/all");
      return data;
    },
  });

  const getSeverityColor = (severity: "critical" | "warning") => {
    return severity === "critical"
      ? "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20"
      : "border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
  };

  const getSeverityBadgeColor = (severity: "critical" | "warning") => {
    return severity === "critical"
      ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
  };

  const getSeverityLabel = (severity: "critical" | "warning") => {
    return severity === "critical" ? "CRÍTICO" : "ADVERTENCIA";
  };

  if (isLoading) return <Loading />;
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <BackButton to="/inventario" />
        <div className="rounded border border-red-300 bg-red-50 dark:bg-red-900/20 p-6 text-red-800 dark:text-red-200">
          Error al cargar las alertas
        </div>
      </div>
    );
  }

  const stockAlerts = alerts?.stockAlerts || [];
  const rotationAlerts = alerts?.rotationAlerts || [];

  return (
    <div className="max-w-6xl mx-auto">
      <BackButton to="/inventario" />

      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gris-piedra dark:text-neutral-100">
            Alertas de Inventario
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Total de alertas: <span className="font-bold">{alerts?.totalAlerts || 0}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-beige-arena dark:border-neutral-700">
          <button
            onClick={() => setActiveTab("stock")}
            className={`px-4 py-2 border-b-2 font-medium transition ${
              activeTab === "stock"
                ? "border-oliva text-oliva"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-gris-piedra dark:hover:text-neutral-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Stock Bajo ({stockAlerts.length})
            </div>
          </button>

          <button
            onClick={() => setActiveTab("rotation")}
            className={`px-4 py-2 border-b-2 font-medium transition ${
              activeTab === "rotation"
                ? "border-oliva text-oliva"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-gris-piedra dark:hover:text-neutral-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Sin Rotación ({rotationAlerts.length})
            </div>
          </button>
        </div>

        {/* Stock Alerts Tab */}
        {activeTab === "stock" && (
          <div className="space-y-3">
            {stockAlerts.length === 0 ? (
              <div className="rounded border border-green-300 bg-green-50 dark:bg-green-900/20 p-6 text-center text-green-800 dark:text-green-200">
                ✓ Todos los productos tienen stock adecuado
              </div>
            ) : (
              stockAlerts.map((alert) => (
                <div
                  key={alert.productId}
                  className={`rounded p-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        alert.severity === "critical" ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gris-piedra dark:text-neutral-100">
                            {alert.code}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${getSeverityBadgeColor(
                            alert.severity
                          )}`}>
                            {getSeverityLabel(alert.severity)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                          {alert.name}
                        </p>
                        <p className="text-sm mt-2">
                          <strong>Stock actual:</strong> {alert.stock} unidades |{" "}
                          <strong>Mínimo:</strong> {alert.minStock} unidades
                        </p>
                      </div>
                    </div>
                    <button className="text-oliva hover:opacity-80 font-medium text-sm">
                      Reordenar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Rotation Alerts Tab */}
        {activeTab === "rotation" && (
          <div className="space-y-3">
            {rotationAlerts.length === 0 ? (
              <div className="rounded border border-green-300 bg-green-50 dark:bg-green-900/20 p-6 text-center text-green-800 dark:text-green-200">
                ✓ Todos los productos tienen buena rotación
              </div>
            ) : (
              rotationAlerts.map((alert) => (
                <div
                  key={alert.productId}
                  className={`rounded p-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <TrendingDown className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        alert.severity === "critical" ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gris-piedra dark:text-neutral-100">
                            {alert.code}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${getSeverityBadgeColor(
                            alert.severity
                          )}`}>
                            {getSeverityLabel(alert.severity)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                          {alert.name}
                        </p>
                        <p className="text-sm mt-2">
                          {alert.lastSaleDate ? (
                            <>
                              <strong>Última venta:</strong> hace {alert.daysSinceLastSale} días
                              {alert.daysSinceLastSale! > 60 && (
                                <span className="ml-2 text-red-600 dark:text-red-400">
                                  (Más de 2 meses sin vender)
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-red-600 dark:text-red-400">
                              <strong>Nunca ha sido vendido</strong>
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button className="text-oliva hover:opacity-80 font-medium text-sm">
                      Revisar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
