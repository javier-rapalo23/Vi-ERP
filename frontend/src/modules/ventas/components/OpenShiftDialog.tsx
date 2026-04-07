import { useState } from "react";
import { useOpenShift } from "../services/shifts.api";
import { toast } from "sonner";
import { DollarSign, X } from "lucide-react";

interface OpenShiftDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currencySymbol?: string;
}

export default function OpenShiftDialog({
  isOpen,
  onOpenChange,
  currencySymbol = "$",
}: OpenShiftDialogProps) {
  const [openingAmount, setOpeningAmount] = useState("0");
  const { mutate: openShift, isPending } = useOpenShift();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(openingAmount);

    if (isNaN(amount) || amount < 0) {
      toast.error("Ingresa un monto válido");
      return;
    }

    openShift(amount, {
      onSuccess: () => {
        toast.success("Turno abierto exitosamente");
        setOpeningAmount("0");
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.error || "Error al abrir el turno");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="rounded-xl bg-white dark:bg-slate-900 shadow-2xl w-full max-w-sm mx-4 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Abrir Turno de Caja
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
              Monto inicial de caja
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-700 dark:text-slate-300">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={openingAmount}
                onChange={(e) => setOpeningAmount(e.target.value)}
                placeholder="0.00"
                autoFocus
                disabled={isPending}
                className="w-full pl-8 pr-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-2xl font-bold text-slate-900 dark:text-slate-50 focus:outline-none focus:border-vixo-500 disabled:opacity-50"
              />
            </div>
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
              disabled={isPending}
              className="flex-1 rounded-lg bg-vixo-600 hover:bg-vixo-700 disabled:opacity-50 px-4 py-2 font-medium text-white flex items-center justify-center gap-2 transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              {isPending ? "Abriendo..." : "Abrir Caja"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
