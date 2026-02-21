import { Link } from "react-router-dom";
import { Users, Shield, KeyRound } from "lucide-react";

export default function MantenimientosIndex() {
  const modules = [
    {
      title: "Usuarios",
      description: "Gestión de usuarios del sistema",
      link: "/mantenimientos/usuarios",
      Icon: Users,
    },
    {
      title: "Roles",
      description: "Gestión de roles y permisos",
      link: "/mantenimientos/roles",
      Icon: Shield,
    },
    {
      title: "Permisos",
      description: "Gestión de permisos del sistema",
      link: "/mantenimientos/permisos",
      Icon: KeyRound,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">Mantenimientos</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Gestión de usuarios, roles y permisos del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <Link
            key={module.link}
            to={module.link}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-vixo-300 dark:hover:border-vixo-700 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-lg bg-vixo-100 dark:bg-vixo-950 flex items-center justify-center text-vixo-600 dark:text-vixo-400 group-hover:bg-vixo-200 dark:group-hover:bg-vixo-900 transition-colors">
                <module.Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">{module.title}</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
