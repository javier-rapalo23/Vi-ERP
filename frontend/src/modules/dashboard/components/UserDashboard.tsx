import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { DashboardData } from "../services/dashboard.api";
import { Package, TrendingUp } from "lucide-react";

export function UserDashboard({ data }: { data: DashboardData }) {
  const metrics = data.metrics;

  return (
    <div className="space-y-6">
      {/* Métricas básicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ventas Registradas</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.salesCount}</p>
              <p className="text-xs text-gray-500 mt-1">Transacciones totales</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Productos</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.productsCount}</p>
              <p className="text-xs text-gray-500 mt-1">En existencia</p>
            </div>
            <Package className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.customersCount}</p>
              <p className="text-xs text-gray-500 mt-1">Registrados</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Gráfico de actividad */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Últimos 7 Días</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.salesLast7Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name="Transacciones" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Información general */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded border border-gray-200">
            <p className="text-sm text-gray-600">Ticket Promedio</p>
            <p className="text-xl font-bold text-gray-900">
              ${metrics.averageTicket.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="p-3 bg-white rounded border border-gray-200">
            <p className="text-sm text-gray-600">Total de Ventas</p>
            <p className="text-xl font-bold text-gray-900">
              ${metrics.salesTotal.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Nota de acceso limitado */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800">
        <p>ℹ️ Esta es una vista general del sistema. Para acceder a funcionalidades completas, comunícate con tu administrador.</p>
      </div>
    </div>
  );
}
