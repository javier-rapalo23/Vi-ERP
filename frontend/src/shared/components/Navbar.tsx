import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "@/shared/store/auth.store";
import { useThemeStore } from "@/shared/store/theme.store";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Monitor, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const { role, logout, token } = useAuthStore();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowThemeMenu(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (!token) return null;

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md transition-colors text-sm ${isActive
      ? 'text-vixo-700 dark:text-vixo-400 font-semibold bg-vixo-200 dark:bg-vixo-950'
      : 'text-slate-700 dark:text-slate-300 hover:text-vixo-600 dark:hover:text-vixo-400 hover:bg-vixo-50 dark:hover:bg-slate-800'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 rounded-md transition-colors text-base font-medium ${isActive
      ? 'text-vixo-700 dark:text-vixo-400 bg-vixo-200 dark:bg-vixo-950'
      : 'text-slate-700 dark:text-slate-300 hover:text-vixo-600 dark:hover:text-vixo-400 hover:bg-vixo-50 dark:hover:bg-slate-800'
    }`;

  return (
    <header className="border-b border-vixo-200 bg-vixo-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-colors">
      <nav className="container mx-auto flex items-center gap-4 p-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          {ThemeIcon === Sun ? (
            <img src="/Vixo Claro.svg" alt="Vixo" className="h-9 w-18" />
          ) : (
            <img src="/Vixo_Oscuro.svg" alt="Vixo" className="h-9 w-18" />
          )}
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
          <NavLink to="/pos" className={navLinkClass}>POS</NavLink>
          {role === "admin" && (
            <>
              <NavLink to="/inventario" className={navLinkClass}>Inventario</NavLink>
              <NavLink to="/compras" className={navLinkClass}>Compras</NavLink>
              <NavLink to="/mantenimientos" className={navLinkClass}>Mantenimientos</NavLink>
            </>
          )}
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Theme Selector */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="rounded-md p-2 text-slate-700 dark:text-slate-300 hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors"
              title="Cambiar tema"
            >
              <ThemeIcon className="w-5 h-5" />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => { setTheme('light'); setShowThemeMenu(false); }}
                  className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors ${theme === 'light' ? 'font-semibold text-vixo-600 dark:text-vixo-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <Sun className="w-4 h-4" /> Claro
                </button>
                <button
                  onClick={() => { setTheme('dark'); setShowThemeMenu(false); }}
                  className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors ${theme === 'dark' ? 'font-semibold text-vixo-600 dark:text-vixo-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <Moon className="w-4 h-4" /> Oscuro
                </button>
                <button
                  onClick={() => { setTheme('system'); setShowThemeMenu(false); }}
                  className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors ${theme === 'system' ? 'font-semibold text-vixo-600 dark:text-vixo-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <Monitor className="w-4 h-4" /> Sistema
                </button>
              </div>
            )}
          </div>

          {/* Logout — solo en desktop */}
          <button
            onClick={logout}
            className="hidden md:flex rounded-md bg-vixo-500 hover:bg-vixo-600 px-4 py-2 text-white transition-colors items-center gap-2 shadow-sm text-sm"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>

          {/* Hamburger — solo en móvil */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-md p-2 text-slate-700 dark:text-slate-300 hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors"
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-vixo-200 dark:border-slate-800 bg-vixo-100 dark:bg-slate-900 px-3 pb-3 space-y-1">
          <NavLink to="/dashboard" className={mobileNavLinkClass}>Dashboard</NavLink>
          <NavLink to="/pos" className={mobileNavLinkClass}>POS</NavLink>
          {role === "admin" && (
            <>
              <NavLink to="/inventario" className={mobileNavLinkClass}>Inventario</NavLink>
              <NavLink to="/compras" className={mobileNavLinkClass}>Compras</NavLink>
              <NavLink to="/mantenimientos" className={mobileNavLinkClass}>Mantenimientos</NavLink>
            </>
          )}
          <div className="pt-2 border-t border-vixo-200 dark:border-slate-800">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 rounded-md bg-vixo-500 hover:bg-vixo-600 px-4 py-3 text-white transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
