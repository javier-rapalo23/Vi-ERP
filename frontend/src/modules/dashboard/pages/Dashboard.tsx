import { useAuthStore } from "@/shared/store/auth.store";

export default function Dashboard() {
  const { user, role } = useAuthStore();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="rounded border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Bienvenido</h2>
        <p className="text-neutral-600">Usuario: {user?.name || user?.email || "Usuario"}</p>
        <p className="text-neutral-600">Rol: {role}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-neutral-700">Ventas del Día</h3>
          <p className="text-3xl font-bold mt-2">$0.00</p>
        </div>
        
        <div className="rounded border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-neutral-700">Productos</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        
        <div className="rounded border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-neutral-700">Clientes</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  );
}
