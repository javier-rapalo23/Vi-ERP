import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "@/shared/store/auth.store";

export default function Navbar() {
  const { role, logout, token } = useAuthStore();

  if (!token) return null;

  return (
    <header className="border-b bg-white shadow-sm">
      <nav className="container mx-auto flex items-center gap-4 p-3">
        <Link to="/" className="text-lg font-semibold text-neutral-900">
          Vi-ERP
        </Link>
        
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `hover:underline ${isActive ? "font-semibold text-neutral-900" : "text-neutral-600"}`
          }
        >
          Dashboard
        </NavLink>
        
        <NavLink
          to="/pos"
          className={({ isActive }) =>
            `hover:underline ${isActive ? "font-semibold text-neutral-900" : "text-neutral-600"}`
          }
        >
          POS
        </NavLink>
        
        {role === "admin" && (
          <NavLink
            to="/inventario"
            className={({ isActive }) =>
              `hover:underline ${isActive ? "font-semibold text-neutral-900" : "text-neutral-600"}`
            }
          >
            Inventario
          </NavLink>
        )}
        
        <div className="ml-auto">
          <button
            onClick={logout}
            className="rounded bg-neutral-900 px-3 py-1 text-white hover:opacity-90 transition-opacity"
          >
            Salir
          </button>
        </div>
      </nav>
    </header>
  );
}
