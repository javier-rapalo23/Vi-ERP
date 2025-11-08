import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "@/shared/store/auth.store";

export default function Navbar() {
  const { role, logout, token } = useAuthStore();

  if (!token) return null;

  return (
  <header className="border-b border-beige-arena bg-marfil shadow-sm">
      <nav className="container mx-auto flex items-center gap-6 p-3">
        <Link to="/" className="flex items-center gap-3">
          <img src="/vi-logo.svg" alt="Vi-ERP" className="h-8 w-8" />
          <span className="text-lg font-semibold text-gris-piedra">Vi-ERP</span>
        </Link>

        <div className="flex items-center gap-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-2 py-1 rounded-md ${isActive ? 'text-oliva font-semibold bg-marfil' : 'text-gris-piedra hover:text-oliva'}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/pos"
            className={({ isActive }) =>
              `px-2 py-1 rounded-md ${isActive ? 'text-oliva font-semibold bg-marfil' : 'text-gris-piedra hover:text-oliva'}`
            }
          >
            POS
          </NavLink>

          {role === "admin" && (
            <NavLink
              to="/inventario"
              className={({ isActive }) =>
                `px-2 py-1 rounded-md ${isActive ? 'text-oliva font-semibold bg-marfil' : 'text-gris-piedra hover:text-oliva'}`
              }
            >
              Inventario
            </NavLink>
          )}
        </div>

        <div className="ml-auto">
          <button
            onClick={logout}
            className="rounded-md bg-oliva px-3 py-1 text-marfil hover:opacity-95 transition"
          >
            Salir
          </button>
        </div>
      </nav>
    </header>
  );
}
