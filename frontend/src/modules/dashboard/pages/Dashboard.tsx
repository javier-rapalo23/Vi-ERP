import { useAuthStore } from "@/shared/store/auth.store";

export default function Dashboard() {
  const { user, role } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Header / Hero */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gris-piedra">Hola, {user?.name || user?.email || "Usuario"}</h1>
          <p className="mt-1 text-sm text-gris-piedra opacity-75">Panel de control — Rol: <span className="font-medium">{role}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 bg-oliva text-marfil px-4 py-2 rounded-md shadow hover:opacity-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva venta
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 bg-white border border-beige-arena rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gris-piedra">Ventas hoy</h3>
              <p className="mt-2 text-2xl font-bold text-gris-piedra">$0.00</p>
            </div>
            <div className="h-10 w-10 rounded-md bg-marfil flex items-center justify-center text-oliva">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1v2"/></svg>
            </div>
          </div>
        </div>

  <div className="bg-white border border-beige-arena rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gris-piedra">Productos</h3>
              <p className="mt-2 text-2xl font-bold text-gris-piedra">10</p>
            </div>
            <div className="h-10 w-10 rounded-md bg-marfil flex items-center justify-center text-oliva">📦</div>
          </div>
        </div>

  <div className="bg-white border border-beige-arena rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gris-piedra">Clientes</h3>
              <p className="mt-2 text-2xl font-bold text-gris-piedra">5</p>
            </div>
            <div className="h-10 w-10 rounded-md bg-marfil flex items-center justify-center text-oliva">👥</div>
          </div>
        </div>

  <div className="bg-white border border-beige-arena rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gris-piedra">Stock bajo</h3>
              <p className="mt-2 text-2xl font-bold text-terracota">2</p>
            </div>
            <div className="h-10 w-10 rounded-md bg-marfil flex items-center justify-center text-terracota">⚠️</div>
          </div>
        </div>
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  <div className="lg:col-span-2 bg-white border border-beige-arena rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gris-piedra mb-4">Ventas (últimos 7 días)</h3>
          <div className="h-48 rounded-md bg-gradient-to-r from-marfil via-beige-arena to-white flex items-end p-4">
            {/* Placeholder bars */}
            <div className="w-full flex items-end gap-2">
              <div className="h-10 w-full max-w-[20px] bg-oliva rounded" style={{height: '30%'}} />
              <div className="h-10 w-full max-w-[20px] bg-oliva rounded" style={{height: '60%'}} />
              <div className="h-10 w-full max-w-[20px] bg-oliva rounded" style={{height: '45%'}} />
              <div className="h-10 w-full max-w-[20px] bg-oliva rounded" style={{height: '70%'}} />
              <div className="h-10 w-full max-w-[20px] bg-oliva rounded" style={{height: '55%'}} />
              <div className="h-10 w-full max-w-[20px] bg-oliva rounded" style={{height: '80%'}} />
              <div className="h-10 w-full max-w-[20px] bg-oliva rounded" style={{height: '40%'}} />
            </div>
          </div>
        </div>

  <div className="bg-white border border-beige-arena rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gris-piedra mb-4">Productos recientes</h3>
          <ul className="space-y-3 text-sm text-gris-piedra">
            <li className="flex items-center justify-between">
              <span>Hub USB-C Anker</span>
              <span className="text-neutral-500">Stock: 45</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Laptop Dell XPS 13</span>
              <span className="text-neutral-500">Stock: 15</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Auriculares Sony WH-1000XM4</span>
              <span className="text-neutral-500">Stock: 20</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
