import { useSettings, useUpdateSettings, type Setting } from "../services/configuration.api";
import BackButton from "@/shared/components/BackButton";
import Loading from "@/shared/components/Loading";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Building2, DollarSign, ReceiptText, Settings2, MonitorSmartphone } from "lucide-react";

type GroupedSettings = Record<string, Setting[]>;

const GROUP_META: Record<string, { label: string; Icon: React.ElementType }> = {
  EMPRESA:  { label: "Datos del negocio",  Icon: Building2 },
  MONEDA:   { label: "Moneda",              Icon: DollarSign },
  IMPUESTO: { label: "Impuesto",            Icon: ReceiptText },
  FACTURA:  { label: "Facturación",         Icon: Settings2 },
  SISTEMA:  { label: "Sistema",             Icon: MonitorSmartphone },
};

export default function ConfigurationPage() {
  const { data: settings, isLoading, error } = useSettings();
  const updateMutation = useUpdateSettings();

  // Estado local: copia editable de los valores
  const [values, setValues] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach((s) => (map[s.key] = s.value));
      setValues(map);
      setDirty(false);
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    if (!settings) return;
    const updates = settings.map((s) => ({ key: s.key, value: values[s.key] ?? s.value }));
    try {
      await updateMutation.mutateAsync(updates);
      toast.success("Configuración guardada exitosamente");
      setDirty(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Error al guardar la configuración");
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-500">Error al cargar la configuración.</p>;

  // Agrupar settings por group
  const grouped: GroupedSettings = {};
  (settings ?? []).forEach((s) => {
    const g = s.group ?? "OTRO";
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(s);
  });

  const groupOrder = ["EMPRESA", "MONEDA", "IMPUESTO", "FACTURA", "SISTEMA"];
  const sortedGroups = [
    ...groupOrder.filter((g) => grouped[g]),
    ...Object.keys(grouped).filter((g) => !groupOrder.includes(g)),
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <BackButton to="/mantenimientos" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-50">Configuración</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Parámetros generales del sistema
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!dirty || updateMutation.isPending}
          className="flex items-center gap-2 rounded-md bg-vixo-500 hover:bg-vixo-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-white transition-colors shadow-sm text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      {sortedGroups.map((group) => {
        const meta = GROUP_META[group] ?? { label: group, Icon: Settings2 };
        const { Icon, label } = meta;
        return (
          <section
            key={group}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm overflow-hidden"
          >
            {/* Header del grupo */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="h-9 w-9 rounded-lg bg-vixo-100 dark:bg-vixo-950 flex items-center justify-center text-vixo-600 dark:text-vixo-400">
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-50">{label}</h2>
            </div>

            {/* Campos */}
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {grouped[group].map((setting) => (
                <div
                  key={setting.key}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-6 py-4 items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{setting.name}</p>
                    {setting.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{setting.description}</p>
                    )}
                  </div>
                  <input
                    type="text"
                    value={values[setting.key] ?? ""}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
                    placeholder={`Ej: ${setting.name}`}
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Botón flotante móvil para guardar */}
      {dirty && (
        <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-vixo-500 hover:bg-vixo-600 disabled:opacity-50 px-4 py-3 text-white text-sm font-semibold shadow-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      )}
    </div>
  );
}
