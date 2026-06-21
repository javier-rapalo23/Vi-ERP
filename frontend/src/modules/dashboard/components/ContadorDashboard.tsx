import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { DashboardData } from "../services/dashboard.api";
import { AlertTriangle, Wallet, TrendingDown, DollarSign } from "lucide-react";

export function ContadorDashboard({ data, currencySymbol }: { data: DashboardData; currencySymbol: string }) {
  const metrics = data.metrics;

  // Calcular márgenes y flujo
  const totalSalesValue = metrics.salesTotal;
  const netMargin = (totalSalesValue * 0.25); // Asumiendo margen del 25%
  const cashFlow = totalSalesValue - metrics.accountsPayableBalance;

  return (
    <div className="space-y-6">
      {/* Métricas financieras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {currencySymbol}{totalSalesValue.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">{metrics.salesCount} transacciones</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Margen Neto Estimado</p>
              <p className="text-2xl font-bold text-gray-900">
                {currencySymbol}{netMargin.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">~25% de ventas</p>
            </div>
            <TrendingDown className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Flujo de Caja</p>
              <p className="text-2xl font-bold text-gray-900">
                {currencySymbol}{cashFlow.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ventas - Deudas</p>
            </div>
            <Wallet className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Activos</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.customersCount}</p>
              <p className="text-xs text-gray-500 mt-1">Con ventas</p>
            </div>
            <TrendingDown className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* CxC y CxP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">Cuentas por Cobrar (CxC)</h3>
          <p className="text-3xl font-bold text-orange-600 mb-2">
            {currencySymbol}{metrics.accountsReceivableBalance.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-orange-700">
            Deudas con clientes por cobrar
          </p>
          {data.alerts.expiredDebts > 0 && (
            <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-red-800 text-sm">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {data.alerts.expiredDebts} CxC vencida(s)
            </div>
          )}
        </div>

        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Cuentas por Pagar (CxP)</h3>
          <p className="text-3xl font-bold text-red-600 mb-2">
            {currencySymbol}{metrics.accountsPayableBalance.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-red-700">
            Deudas con proveedores por pagar
          </p>
          <p className="text-sm text-red-600 mt-2">
            Diferencia: {currencySymbol}{(metrics.accountsReceivableBalance - metrics.accountsPayableBalance).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Tendencia de ventas e ingresos */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ventas - Últimos 7 Días</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.salesLast7Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" label={{ value: "Ventas ($)", angle: -90, position: "insideLeft" }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: "Transacciones", angle: 90, position: "insideRight" }} />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#f97316"
              name="Ingresos ($)"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              name="Transacciones"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Resumen de puntos clave */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Resumen Financiero</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>✓ Activos corrientes (CxC): {currencySymbol}{metrics.accountsReceivableBalance.toLocaleString("es-AR", { maximumFractionDigits: 2 })}</p>
          <p>✓ Pasivos corrientes (CxP): {currencySymbol}{metrics.accountsPayableBalance.toLocaleString("es-AR", { maximumFractionDigits: 2 })}</p>
          <p>✓ Posición neta: {currencySymbol}{(metrics.accountsReceivableBalance - metrics.accountsPayableBalance).toLocaleString("es-AR", { maximumFractionDigits: 2 })}</p>
          <p>✓ Ticket promedio: {currencySymbol}{metrics.averageTicket.toLocaleString("es-AR", { maximumFractionDigits: 2 })}</p>
          <p>✓ Volumen de transacciones: {metrics.salesCount}</p>
        </div>
      </div>
    </div>
  );
}
