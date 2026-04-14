import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DashboardData } from "../services/dashboard.api";
import { AlertTriangle, TrendingUp, Package, Users, DollarSign } from "lucide-react";

export function AdminDashboard({ data }: { data: DashboardData }) {
  const metrics = data.metrics;

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                ${metrics.salesTotal.toLocaleString("es-AR", {
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
              <p className="text-sm text-gray-600">Productos</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.productsCount}</p>
              <p className="text-xs text-gray-500 mt-1">En inventario</p>
            </div>
            <Package className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.customersCount}</p>
              <p className="text-xs text-gray-500 mt-1">Registrados</p>
            </div>
            <Users className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Stock Crítico</h3>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2">{metrics.lowStockCount}</p>
          <p className="text-xs text-red-700 mt-1">Productos con stock bajo</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">Sin Rotación</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{metrics.noRotationCount}</p>
          <p className="text-xs text-yellow-700 mt-1">Productos sin ventas recientes</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Deudas Vencidas</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-2">{data.alerts.expiredDebts}</p>
          <p className="text-xs text-blue-700 mt-1">CxC vencidas</p>
        </div>
      </div>

      {/* Gráfico de ventas últimos 7 días */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas Últimos 7 Días</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.salesLast7Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#10b981" name="Ventas ($)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top 5 productos */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Productos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="code" />
            <YAxis yAxisId="left" label={{ value: "Cantidad", angle: -90, position: "insideLeft" }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: "Ventas ($)", angle: 90, position: "insideRight" }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="quantity" fill="#3b82f6" name="Cantidad" />
            <Bar
              yAxisId="right"
              dataKey="revenue"
              fill="#10b981"
              name="Ventas ($)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Contabilidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cuentas por Cobrar</h3>
          <p className="text-3xl font-bold text-orange-600">
            ${metrics.accountsReceivableBalance.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-600 mt-2">Saldo a cobrar de clientes</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cuentas por Pagar</h3>
          <p className="text-3xl font-bold text-red-600">
            ${metrics.accountsPayableBalance.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-600 mt-2">Saldo a pagar a proveedores</p>
        </div>
      </div>
    </div>
  );
}
