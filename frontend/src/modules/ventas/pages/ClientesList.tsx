import { useClientes, useDesactivarCliente } from "../services/clientes.api";
import { Link } from "react-router-dom";
import Loading from "@/shared/components/Loading";
import BackButton from "@/shared/components/BackButton";
import { toast } from "sonner";
import { UserPlus, Pencil, UserX, Phone, Mail, MapPin } from "lucide-react";

export default function ClientesList() {
  const { data, isLoading, error } = useClientes();
  const desactivarMutation = useDesactivarCliente();

  const handleDeactivate = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de desactivar al cliente "${name}"?`)) return;
    try {
      await desactivarMutation.mutateAsync(id);
      toast.success("Cliente desactivado exitosamente");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al desactivar cliente");
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-600 dark:text-red-400">Ocurrió un error al cargar los clientes.</p>;

  return (
    <div className="space-y-4">
      <BackButton to="/ventas" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">Clientes</h2>
        <Link
          to="/ventas/clientes/nuevo"
          className="rounded-lg bg-vixo-500 hover:bg-vixo-600 px-4 py-2 text-white font-medium shadow-sm transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Cliente
        </Link>
      </div>

      {/* Mobile: cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:hidden">
        {data && data.length > 0 ? (
          data.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{cliente.name}</h3>
                  <span
                    className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      cliente.isActive
                        ? "bg-vixo-100 text-vixo-700 dark:bg-vixo-950 dark:text-vixo-400"
                        : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                    }`}
                  >
                    {cliente.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Link
                    to={`/ventas/clientes/${cliente.id}/editar`}
                    className="rounded-md p-1.5 text-vixo-600 hover:bg-vixo-100 dark:hover:bg-vixo-950 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  {cliente.isActive && (
                    <button
                      onClick={() => handleDeactivate(cliente.id, cliente.name)}
                      className="rounded-md p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-950 transition-colors"
                      title="Desactivar"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                {cliente.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-vixo-500" />
                    {cliente.phone}
                  </div>
                )}
                {cliente.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-vixo-500" />
                    {cliente.email}
                  </div>
                )}
                {cliente.adress && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-vixo-500" />
                    {cliente.adress}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-8">
            No hay clientes registrados.
          </p>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold">Teléfono</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Dirección</th>
              <th className="px-4 py-3 text-left font-semibold">Estado</th>
              <th className="px-4 py-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {data && data.length > 0 ? (
              data.map((cliente) => (
                <tr key={cliente.id} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-50">{cliente.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{cliente.phone || "—"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{cliente.email || "—"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{cliente.adress || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        cliente.isActive
                          ? "bg-vixo-100 text-vixo-700 dark:bg-vixo-950 dark:text-vixo-400"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                      }`}
                    >
                      {cliente.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/ventas/clientes/${cliente.id}/editar`}
                        className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-vixo-600 hover:bg-vixo-100 dark:hover:bg-vixo-950 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </Link>
                      {cliente.isActive && (
                        <button
                          onClick={() => handleDeactivate(cliente.id, cliente.name)}
                          className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-950 transition-colors"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          Desactivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  No hay clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
