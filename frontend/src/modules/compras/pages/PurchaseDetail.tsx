import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePurchase, useUpdatePurchaseStatus, useRegisterPayment } from "../services/purchases.api";
import { useSettings } from "@/modules/mantenimientos/services/configuration.api";
import Loading from "@/shared/components/Loading";
import BackButton from "@/shared/components/BackButton";
import { toast } from "sonner";
import { Save, X, CreditCard, RefreshCw } from "lucide-react";

const statusLabels = {
  PENDING:   { label: "Pendiente",  class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  PARTIAL:   { label: "Parcial",    class: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  PAID:      { label: "Pagado",     class: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  CANCELLED: { label: "Cancelado",  class: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

const paymentMethodLabels: Record<string, string> = {
  CASH:     "Efectivo",
  TRANSFER: "Transferencia",
  CARD:     "Tarjeta",
  CHECK:    "Cheque",
};

export default function PurchaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const purchaseId = parseInt(id ?? "0");

  const { data: purchase, isLoading, error } = usePurchase(purchaseId);
  const { data: settings } = useSettings();
  const updateStatusMutation = useUpdatePurchaseStatus();
  const registerPaymentMutation = useRegisterPayment();

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentReference, setPaymentReference] = useState("");
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const currencySymbol = settings?.find((s) => s.key === "MONEDA_SIMBOLO")?.value ?? "$";

  const fmt = (n: number) =>
    `${currencySymbol}${n.toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleRegisterPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }
    const balance = purchase?.accountsPayable?.balance ?? 0;
    if (amount > balance) {
      toast.error(`El monto no puede superar el saldo (${fmt(balance)})`);
      return;
    }
    try {
      await registerPaymentMutation.mutateAsync({
        purchaseId,
        data: { amount, paymentMethod, reference: paymentReference || undefined },
      });
      toast.success("Pago registrado exitosamente");
      setShowPaymentForm(false);
      setPaymentAmount("");
      setPaymentMethod("CASH");
      setPaymentReference("");
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Error al registrar pago");
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    try {
      await updateStatusMutation.mutateAsync({ id: purchaseId, status: newStatus });
      toast.success("Estado actualizado");
      setShowStatusForm(false);
      setNewStatus("");
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Error al actualizar estado");
    }
  };

  if (isLoading) return <Loading />;
  if (error || !purchase)
    return <p className="text-red-500 p-4">Error al cargar la compra.</p>;

  const ap = purchase.accountsPayable;
  const status = statusLabels[purchase.status];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <BackButton to="/compras/lista" />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Compra #{purchase.id}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {new Date(purchase.date).toLocaleDateString("es-HN", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${status.class}`}>
            {status.label}
          </span>
          {purchase.status !== "PAID" && purchase.status !== "CANCELLED" && (
            <button
              onClick={() => { setShowStatusForm(!showStatusForm); setShowPaymentForm(false); }}
              className="flex items-center gap-1 text-sm rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Estado
            </button>
          )}
          {ap && ap.balance > 0 && (
            <button
              onClick={() => { setShowPaymentForm(!showPaymentForm); setShowStatusForm(false); }}
              className="flex items-center gap-1 text-sm rounded-lg bg-vixo-500 hover:bg-vixo-600 px-3 py-1.5 text-white transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" /> Registrar pago
            </button>
          )}
        </div>
      </div>

      {/* Cambiar estado (inline) */}
      {showStatusForm && (
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm flex flex-wrap items-end gap-3">
          <label className="grid gap-1 flex-1 min-w-[160px]">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Nuevo estado</span>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-vixo-500"
            >
              <option value="">Seleccionar...</option>
              {Object.entries(statusLabels)
                .filter(([k]) => k !== purchase.status)
                .map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
            </select>
          </label>
          <button
            onClick={handleUpdateStatus}
            disabled={!newStatus || updateStatusMutation.isPending}
            className="rounded-lg bg-vixo-500 hover:bg-vixo-600 px-4 py-2 text-white text-sm disabled:opacity-50 flex items-center gap-1 transition-colors"
          >
            <Save className="w-4 h-4" />
            {updateStatusMutation.isPending ? "Guardando..." : "Guardar"}
          </button>
          <button
            onClick={() => setShowStatusForm(false)}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm flex items-center gap-1 transition-colors"
          >
            <X className="w-4 h-4" /> Cancelar
          </button>
        </div>
      )}

      {/* Registrar pago (inline) */}
      {showPaymentForm && (
        <div className="rounded-lg border border-vixo-200 dark:border-vixo-800 bg-vixo-50 dark:bg-vixo-950 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-vixo-800 dark:text-vixo-200 mb-3">Registrar Pago</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Monto (saldo: {fmt(ap?.balance ?? 0)})
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-vixo-500"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Método</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-vixo-500"
              >
                <option value="CASH">Efectivo</option>
                <option value="TRANSFER">Transferencia</option>
                <option value="CARD">Tarjeta</option>
                <option value="CHECK">Cheque</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Referencia</span>
              <input
                type="text"
                placeholder="Nº cheque, transferencia..."
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-vixo-500"
              />
            </label>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleRegisterPayment}
              disabled={registerPaymentMutation.isPending}
              className="rounded-lg bg-vixo-500 hover:bg-vixo-600 px-4 py-2 text-white text-sm disabled:opacity-50 flex items-center gap-1 transition-colors"
            >
              <Save className="w-4 h-4" />
              {registerPaymentMutation.isPending ? "Guardando..." : "Confirmar pago"}
            </button>
            <button
              onClick={() => setShowPaymentForm(false)}
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm flex items-center gap-1 transition-colors"
            >
              <X className="w-4 h-4" /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Info general */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Proveedor</p>
          <p className="font-semibold text-slate-900 dark:text-slate-50 mt-1">{purchase.supplier.name}</p>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Vencimiento</p>
          <p className="font-semibold text-slate-900 dark:text-slate-50 mt-1">
            {new Date(purchase.dueDate).toLocaleDateString("es-HN")}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total</p>
          <p className="text-xl font-bold text-vixo-600 dark:text-vixo-400 mt-1">{fmt(purchase.total)}</p>
        </div>
      </div>

      {/* Detalle de productos */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">Productos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-2 text-left">Código</th>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-right">Cantidad</th>
                <th className="px-4 py-2 text-right">Precio unit.</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {purchase.details.map((d) => (
                <tr key={d.id} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">{d.product.code}</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-slate-50">{d.product.name}</td>
                  <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{d.quantity}</td>
                  <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{fmt(d.unitPrice)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-50">
                    {fmt(d.quantity * d.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
              <tr>
                <td colSpan={4} className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                  Total
                </td>
                <td className="px-4 py-3 text-right font-bold text-vixo-600 dark:text-vixo-400">
                  {fmt(purchase.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Cuentas por pagar y pagos */}
      {ap && (
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">Cuenta por Pagar</h3>
          </div>

          {/* Resumen CxP */}
          <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-700">
            <div className="p-4 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-1">{fmt(ap.totalAmount)}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Pagado</p>
              <p className="text-lg font-bold text-vixo-600 dark:text-vixo-400 mt-1">{fmt(ap.paidAmount)}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Saldo</p>
              <p className={`text-lg font-bold mt-1 ${ap.balance > 0 ? "text-red-600 dark:text-red-400" : "text-vixo-600 dark:text-vixo-400"}`}>
                {fmt(ap.balance)}
              </p>
            </div>
          </div>

          {/* Historial de pagos */}
          {ap.payments && ap.payments.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700">
              <p className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Historial de pagos
              </p>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-2 text-left">Fecha</th>
                    <th className="px-4 py-2 text-left">Método</th>
                    <th className="px-4 py-2 text-left">Referencia</th>
                    <th className="px-4 py-2 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {ap.payments.map((p) => (
                    <tr key={p.id} className="border-t border-slate-100 dark:border-slate-700">
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {new Date(p.date).toLocaleDateString("es-HN")}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {paymentMethodLabels[p.paymentMethod] ?? p.paymentMethod}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {p.reference ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-vixo-600 dark:text-vixo-400">
                        {fmt(p.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {ap.payments?.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
              Sin pagos registrados
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2 pb-4">
        <button
          onClick={() => navigate("/compras/lista")}
          className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm transition-colors"
        >
          Volver a la lista
        </button>
      </div>
    </div>
  );
}
