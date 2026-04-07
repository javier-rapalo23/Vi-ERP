import { useState } from "react";
import { useCloseShift, type Shift } from "../services/shifts.api";
import { toast } from "sonner";
import { X, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";

interface CloseShiftDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shift: Shift | null;
  currencySymbol?: string;
}

export default function CloseShiftDialog({
  isOpen,
  onOpenChange,
  shift,
  currencySymbol = "$",
}: CloseShiftDialogProps) {
  const [closingAmount, setClosingAmount] = useState("");
  const [notes, setNotes] = useState("");
  const { mutate: closeShift, isPending } = useCloseShift();

  if (!shift || !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(closingAmount);

    if (isNaN(amount) || amount < 0) {
      toast.error("Ingresa un monto válido");
      return;
    }

    closeShift(
      {
        shiftId: shift.id,
        closingAmount: amount,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Turno cerrado exitosamente");
          setClosingAmount("");
          setNotes("");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.error || "Error al cerrar el turno");
        },
      }
    );
  };

  // Calculate expected amount based on existing sales in shift
  const totalSales = shift.sales?.reduce((acc, sale) => acc + Number(sale.total || 0), 0) || 0;
  const expectedAmount = shift.openingAmount + totalSales;
  const closingAmountNum = parseFloat(closingAmount) || 0;
  const variance = closingAmountNum - expectedAmount;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="rounded-xl bg-white dark:bg-slate-900 shadow-2xl w-full max-w-md mx-4 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Cerrar Turno de Caja
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="space-y-2">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">Monto de apertura</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {currencySymbol}{shift.openingAmount.toFixed(2)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">Ventas del turno</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {currencySymbol}{totalSales.toFixed(2)}
            </p>
          </div>

          <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
            <p className="text-xs text-green-600 dark:text-green-400">
              Monto esperado (apertura + ventas)
            </p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {currencySymbol}{expectedAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2 block">
              Monto recaudado en caja
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-700 dark:text-slate-300">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={closingAmount}
                onChange={(e) => setClosingAmount(e.target.value)}
                placeholder="0.00"
                autoFocus
                disabled={isPending}
                className="w-full pl-8 pr-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xl font-bold text-slate-900 dark:text-slate-50 focus:outline-none focus:border-vixo-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Variance indicator */}
          {closingAmountNum > 0 && (
            <div
              className={`rounded-lg border p-4 flex items-start gap-3 ${
                variance === 0
                  ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                  : variance > 0
                    ? "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20"
                    : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="mt-0.5">
                {variance === 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : variance > 0 ? (
                  <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    variance === 0
                      ? "text-green-700 dark:text-green-300"
                      : variance > 0
                        ? "text-orange-700 dark:text-orange-300"
                        : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {variance === 0
                    ? "Cuadratura perfecta"
                    : variance > 0
                      ? "Sobrante"
                      : "Faltante"}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    variance === 0
                      ? "text-green-700 dark:text-green-300"
                      : variance > 0
                        ? "text-orange-700 dark:text-orange-300"
                        : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {currencySymbol}{Math.abs(variance).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2 block">
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Diferencia por..., Transacción pendiente..."
              disabled={isPending}
              rows={3}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-vixo-500 disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || closingAmountNum === 0}
              className="flex-1 rounded-lg bg-vixo-600 hover:bg-vixo-700 disabled:opacity-50 px-4 py-2 font-medium text-white flex items-center justify-center gap-2 transition-colors"
            >
              {isPending ? "Cerrando..." : "Cerrar Turno"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
