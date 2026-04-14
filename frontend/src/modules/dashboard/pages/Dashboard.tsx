import { useAuthStore } from "@/shared/store/auth.store";
import { useDashboardSummary } from "../services/dashboard.api";
import { AdminDashboard } from "../components/AdminDashboard";
import { CajeroDashboard } from "../components/CajeroDashboard";
import { ContadorDashboard } from "../components/ContadorDashboard";
import { UserDashboard } from "../components/UserDashboard";
import Loading from "@/shared/components/Loading";

export default function Dashboard() {
  const { user, role } = useAuthStore();
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Error al cargar el dashboard</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-50">
          Hola, {user?.name || user?.email || "Usuario"}
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Panel de control — Rol:{" "}
          <span className="font-medium text-vixo-600 dark:text-vixo-400">{role}</span>
        </p>
      </div>

      {/* Role-based dashboard content */}
      {role === "admin" && <AdminDashboard data={data} />}
      {role === "cajero" && <CajeroDashboard data={data} />}
      {role === "contador" && <ContadorDashboard data={data} />}
      {role !== "admin" && role !== "cajero" && role !== "contador" && (
        <UserDashboard data={data} />
      )}
    </div>
  );
}

