import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { DashboardData } from "../services/dashboard.api";
import { AlertTriangle, TrendingUp, ShoppingCart } from "lucide-react";

export function CajeroDashboard({ data }: { data: DashboardData }) {
  const metrics = data.metrics;
  const todaySales = data.salesLast7Days[data.salesLast7Days.length - 1];

  return (
    <div className="space-y-6">
      {/* Métricas de hoy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ventas Hoy</p>
              <p className="text-2xl font-bold text-gray-900">
                ${todaySales?.sales.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || "0.00"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {todaySales?.count || 0} transacciones
              </p>
            </div>
            <ShoppingCart className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ticket Promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                ${metrics.averageTicket.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">Por transacción</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Atendidos</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.customersCount}</p>
              <p className="text-xs text-gray-500 mt-1">Total registrados</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Alertas de stock */}
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-900">
            {metrics.lowStockCount} Producto(s) con Stock Crítico
          </h3>
        </div>
        <p className="text-sm text-red-700 mt-2">
          Revisar inventario de productos con stock bajo o agotado
        </p>
      </div>

      {/* Gráfico de últimos 7 días */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas Últimos 7 Días</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.salesLast7Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#10b981" name="Ventas ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 3 productos */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos Más Vendidos</h3>
        <div className="space-y-2">
          {data.topProducts.slice(0, 3).map((product, idx) => (
            <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <p className="font-semibold text-gray-900">
                  {idx + 1}. {product.name}
                </p>
                <p className="text-sm text-gray-600">Código: {product.code}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{product.quantity} unidades</p>
                <p className="text-sm text-gray-600">
                  ${product.revenue.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
