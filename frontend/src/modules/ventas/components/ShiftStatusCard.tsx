import type { Shift } from "../services/shifts.api";
import { Clock, AlertCircle } from "lucide-react";

interface ShiftStatusCardProps {
  shift: Shift | null | undefined;
  isLoading?: boolean;
  onOpenClick?: () => void;
  onCloseClick?: () => void;
  currencySymbol?: string;
}

export default function ShiftStatusCard({
  shift,
  isLoading = false,
  onOpenClick,
  onCloseClick,
  currencySymbol = "$",
}: ShiftStatusCardProps) {

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 shadow-sm animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 shadow-sm flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-100">
              No hay turno abierto
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Abre un turno para comenzar a vender
            </p>
          </div>
        </div>
        <button
          onClick={onOpenClick}
          className="rounded-lg bg-amber-600 hover:bg-amber-700 px-4 py-2 text-sm font-medium text-white whitespace-nowrap transition-colors"
        >
          Abrir Caja
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-sm font-semibold text-green-700 dark:text-green-300">
            Turno Abierto
          </p>
        </div>
        <button
          onClick={onCloseClick}
          className="rounded-lg bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-medium text-white transition-colors"
        >
          Cerrar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-green-600 dark:text-green-400">Monto de apertura</p>
          <p className="text-lg font-bold text-green-900 dark:text-green-100">
            {currencySymbol}{shift.openingAmount.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-green-600 dark:text-green-400">Hora de inicio</p>
          <p className="text-sm font-medium text-green-900 dark:text-green-100 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(shift.openedAt).toLocaleTimeString("es-HN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
