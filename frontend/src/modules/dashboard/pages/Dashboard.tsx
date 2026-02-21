import { useAuthStore } from "@/shared/store/auth.store";
import { ShoppingCart, TrendingUp, Package, Users, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const { user, role } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Header / Hero */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">Hola, {user?.name || user?.email || "Usuario"}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Panel de control — Rol: <span className="font-medium text-vixo-600 dark:text-vixo-400">{role}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 bg-vixo-500 hover:bg-vixo-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors">
            <ShoppingCart className="w-4 h-4" />
            Nueva venta
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Ventas hoy</h3>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">$0.00</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-vixo-100 dark:bg-vixo-950 flex items-center justify-center text-vixo-600 dark:text-vixo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Productos</h3>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">10</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-vixo-100 dark:bg-vixo-950 flex items-center justify-center text-vixo-600 dark:text-vixo-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>

  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Clientes</h3>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">5</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-vixo-blue dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Stock bajo</h3>
              <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">2</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-4">Ventas (últimos 7 días)</h3>
          <div className="h-48 rounded-lg bg-gradient-to-br from-vixo-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-end p-4">
            {/* Placeholder bars */}
            <div className="w-full flex items-end gap-2">
              <div className="h-10 w-full max-w-[20px] bg-vixo-500 hover:bg-vixo-600 rounded transition-colors cursor-pointer" style={{height: '30%'}} />
              <div className="h-10 w-full max-w-[20px] bg-vixo-500 hover:bg-vixo-600 rounded transition-colors cursor-pointer" style={{height: '60%'}} />
              <div className="h-10 w-full max-w-[20px] bg-vixo-500 hover:bg-vixo-600 rounded transition-colors cursor-pointer" style={{height: '45%'}} />
              <div className="h-10 w-full max-w-[20px] bg-vixo-500 hover:bg-vixo-600 rounded transition-colors cursor-pointer" style={{height: '70%'}} />
              <div className="h-10 w-full max-w-[20px] bg-vixo-500 hover:bg-vixo-600 rounded transition-colors cursor-pointer" style={{height: '55%'}} />
              <div className="h-10 w-full max-w-[20px] bg-vixo-500 hover:bg-vixo-600 rounded transition-colors cursor-pointer" style={{height: '80%'}} />
              <div className="h-10 w-full max-w-[20px] bg-vixo-500 hover:bg-vixo-600 rounded transition-colors cursor-pointer" style={{height: '40%'}} />
            </div>
          </div>
        </div>

  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-4">Productos recientes</h3>
          <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-center justify-between p-2 rounded hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors">
              <span>Hub USB-C Anker</span>
              <span className="text-slate-500 dark:text-slate-400">Stock: 45</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors">
              <span>Laptop Dell XPS 13</span>
              <span className="text-slate-500 dark:text-slate-400">Stock: 15</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors">
              <span>Auriculares Sony WH-1000XM4</span>
              <span className="text-slate-500 dark:text-slate-400">Stock: 20</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
