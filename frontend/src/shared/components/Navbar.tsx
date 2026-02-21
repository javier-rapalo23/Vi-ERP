import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "@/shared/store/auth.store";
import { useThemeStore } from "@/shared/store/theme.store";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Monitor, LogOut } from "lucide-react";

export default function Navbar() {
  const { role, logout, token } = useAuthStore();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowThemeMenu(false);
      }
    }

    if (showThemeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showThemeMenu]);

  if (!token) return null;

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
  <header className="border-b border-vixo-200 bg-vixo-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-colors">
      <nav className="container mx-auto flex items-center gap-6 p-3">
        <Link to="/" className="flex items-center gap-3">
        {ThemeIcon === Sun ? (
          <img src="/Vixo Claro.svg" alt="Vixo" className="h-10 w-20" />
        ) : (
          <img src="/Vixo_Oscuro.svg" alt="Vixo" className="h-10 w-20" />
        )}
        </Link>

        <div className="flex items-center gap-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md transition-colors ${isActive ? 'text-vixo-700 dark:text-vixo-400 font-semibold bg-vixo-200 dark:bg-vixo-950' : 'text-slate-700 dark:text-slate-300 hover:text-vixo-600 dark:hover:text-vixo-400 hover:bg-vixo-50 dark:hover:bg-slate-800'}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/pos"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md transition-colors ${isActive ? 'text-vixo-700 dark:text-vixo-400 font-semibold bg-vixo-200 dark:bg-vixo-950' : 'text-slate-700 dark:text-slate-300 hover:text-vixo-600 dark:hover:text-vixo-400 hover:bg-vixo-50 dark:hover:bg-slate-800'}`
            }
          >
            POS
          </NavLink>

          {role === "admin" && (
            <>
              <NavLink
                to="/inventario"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-colors ${isActive ? 'text-vixo-700 dark:text-vixo-400 font-semibold bg-vixo-200 dark:bg-vixo-950' : 'text-slate-700 dark:text-slate-300 hover:text-vixo-600 dark:hover:text-vixo-400 hover:bg-vixo-50 dark:hover:bg-slate-800'}`
                }
              >
                Inventario
              </NavLink>
              
              <NavLink
                to="/compras"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-colors ${isActive ? 'text-vixo-700 dark:text-vixo-400 font-semibold bg-vixo-200 dark:bg-vixo-950' : 'text-slate-700 dark:text-slate-300 hover:text-vixo-600 dark:hover:text-vixo-400 hover:bg-vixo-50 dark:hover:bg-slate-800'}`
                }
              >
                Compras
              </NavLink>
              
              <NavLink
                to="/mantenimientos"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-colors ${isActive ? 'text-vixo-700 dark:text-vixo-400 font-semibold bg-vixo-200 dark:bg-vixo-950' : 'text-slate-700 dark:text-slate-300 hover:text-vixo-600 dark:hover:text-vixo-400 hover:bg-vixo-50 dark:hover:bg-slate-800'}`
                }
              >
                Mantenimientos
              </NavLink>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Theme Selector */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="rounded-md px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors"
              title="Cambiar tema"
            >
              <ThemeIcon className="w-5 h-5" />
            </button>
            
            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    setTheme('light');
                    setShowThemeMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors ${theme === 'light' ? 'font-semibold text-vixo-600 dark:text-vixo-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <Sun className="w-4 h-4" /> Claro
                </button>
                <button
                  onClick={() => {
                    setTheme('dark');
                    setShowThemeMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors ${theme === 'dark' ? 'font-semibold text-vixo-600 dark:text-vixo-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <Moon className="w-4 h-4" /> Oscuro
                </button>
                <button
                  onClick={() => {
                    setTheme('system');
                    setShowThemeMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-vixo-50 dark:hover:bg-slate-800 transition-colors ${theme === 'system' ? 'font-semibold text-vixo-600 dark:text-vixo-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <Monitor className="w-4 h-4" /> Sistema
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={logout}
            className="rounded-md bg-vixo-500 hover:bg-vixo-600 px-4 py-2 text-white transition-colors flex items-center gap-2 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </nav>
    </header>
  );
}
