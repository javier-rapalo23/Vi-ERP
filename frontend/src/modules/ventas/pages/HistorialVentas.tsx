import BackButton from "@/shared/components/BackButton";
import Loading from "@/shared/components/Loading";
import { useSettings } from "@/modules/mantenimientos/services/configuration.api";
import { getVentaFactura, useVentasHistorial, useSalesTotalsByPeriod, VENTAS_PAGE_LIMIT } from "../services/ventas.api";
import { useShiftHistory } from "../services/shifts.api";
import { useUsers } from "@/modules/mantenimientos/services/users.api";
import { useAuthStore } from "@/shared/store/auth.store";
import { ReceiptText, Package, DollarSign, TrendingUp, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function HistorialVentas() {
  const { data: settings = [] } = useSettings();
  const { data: periodTotals } = useSalesTotalsByPeriod();
  const { role, user } = useAuthStore();
  const isAdmin = role === "admin";
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
  const { data: users = [] } = useUsers();
  const { data: shiftHistory } = useShiftHistory(isAdmin ? selectedUserId : user?.id);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    customer: "",
    status: "",
    minAmount: "",
    maxAmount: "",
  });

  function updateFilter(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  const { data, isLoading, error } = useVentasHistorial({ ...filters, page });
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null);

  const currencySymbol = settings.find((s) => s.key === "MONEDA_SIMBOLO")?.value?.trim() || "$";

  function paymentMethodLabel(method?: "CASH" | "TRANSFER" | "CARD") {
    if (method === "TRANSFER") return "Transferencia";
    if (method === "CARD") return "Tarjeta";
    return "Efectivo";
  }

  function escapeHtml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  async function handleReprint(ventaId: number) {
    try {
      const data = await getVentaFactura(ventaId);
      const invoice = data.invoice;
      const isTicket = invoice.format === "TICKET";

      const printWindow = window.open("", "_blank", "width=900,height=700");
      if (!printWindow) {
        toast.error("No se pudo abrir la ventana de impresion");
        return;
      }

      const rows = invoice.lines
        .map(
          (line) => `
            <tr>
              <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${escapeHtml(line.productName)}</td>
              <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:center;">${escapeHtml(line.productCode || "-")}</td>
              <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:center;">${line.quantity}</td>
              <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;">${invoice.currency.symbol}${Number(line.unitPrice).toFixed(2)}</td>
              <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;">${invoice.currency.symbol}${Number(line.lineTotal).toFixed(2)}</td>
            </tr>
          `
        )
        .join("");

      const html = `
        <!doctype html>
        <html lang="es">
          <head>
            <meta charset="utf-8" />
            <title>Factura ${escapeHtml(invoice.invoiceNumber)}</title>
            <style>
              @page { size: ${isTicket ? "80mm auto" : "A4"}; margin: ${isTicket ? "8mm" : "16mm"}; }
              body { font-family: Arial, sans-serif; margin: ${isTicket ? "0" : "24px"}; color: #0f172a; max-width: ${isTicket ? "78mm" : "none"}; }
              h1 { margin: 0; font-size: 24px; }
              .muted { color: #475569; }
              .row { display: flex; justify-content: space-between; gap: 12px; margin-top: 8px; }
              table { width: 100%; border-collapse: collapse; margin-top: 16px; }
              .totals { margin-top: 16px; margin-left: ${isTicket ? "0" : "auto"}; width: ${isTicket ? "100%" : "320px"}; }
              .totals .line { display: flex; justify-content: space-between; padding: 4px 0; }
              .totals .strong { font-weight: 700; font-size: 18px; border-top: 1px solid #cbd5e1; margin-top: 6px; padding-top: 8px; }
            </style>
          </head>
          <body>
            <h1>${escapeHtml(invoice.company.name || "Vi-ERP")}</h1>
            ${invoice.company.rtn ? `<div class="muted">RTN: ${escapeHtml(invoice.company.rtn)}</div>` : ""}
            ${invoice.company.address ? `<div class="muted">${escapeHtml(invoice.company.address)}</div>` : ""}
            ${invoice.company.phone ? `<div class="muted">Tel: ${escapeHtml(invoice.company.phone)}</div>` : ""}
            ${invoice.fiscal?.cai ? `<div class="muted">CAI: ${escapeHtml(invoice.fiscal.cai)}</div>` : ""}
            ${invoice.fiscal?.validUntil ? `<div class="muted">Limite fiscal: ${new Date(invoice.fiscal.validUntil).toLocaleDateString("es-HN")}</div>` : ""}

            <div class="row" style="margin-top:16px;">
              <div>
                <div><strong>Factura:</strong> ${escapeHtml(invoice.invoiceNumber)}</div>
                <div><strong>Fecha:</strong> ${new Date(invoice.date).toLocaleString("es-HN")}</div>
              </div>
              <div>
                <div><strong>Cliente:</strong> ${escapeHtml(invoice.customer.name)}</div>
                ${invoice.customer.phone ? `<div><strong>Tel:</strong> ${escapeHtml(invoice.customer.phone)}</div>` : ""}
                ${invoice.customer.email ? `<div><strong>Email:</strong> ${escapeHtml(invoice.customer.email)}</div>` : ""}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="text-align:left;padding:8px;border-bottom:2px solid #0f172a;">Producto</th>
                  <th style="text-align:center;padding:8px;border-bottom:2px solid #0f172a;">Codigo</th>
                  <th style="text-align:center;padding:8px;border-bottom:2px solid #0f172a;">Cant.</th>
                  <th style="text-align:right;padding:8px;border-bottom:2px solid #0f172a;">Precio</th>
                  <th style="text-align:right;padding:8px;border-bottom:2px solid #0f172a;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>

            <div class="totals">
              <div class="line"><span>Subtotal</span><span>${invoice.currency.symbol}${Number(invoice.subtotal).toFixed(2)}</span></div>
              <div class="line"><span>${escapeHtml(invoice.tax.name)} (${invoice.tax.rate}%)</span><span>${invoice.currency.symbol}${Number(invoice.tax.amount).toFixed(2)}</span></div>
              <div class="line strong"><span>Total</span><span>${invoice.currency.symbol}${Number(invoice.total).toFixed(2)}</span></div>
              <div class="line"><span>Metodo de pago</span><span>${paymentMethodLabel(invoice.paymentMethod)}</span></div>
              <div class="line"><span>Moneda</span><span>${escapeHtml(invoice.currency.name)}</span></div>
            </div>
          </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "No se pudo reimprimir la factura");
    }
  }

  if (isLoading) return <Loading />;
  if (error || !data || !data.pagination) {
    return <p className="text-red-600 dark:text-red-400">Ocurrio un error al cargar el historial de ventas.</p>;
  }

  return (
    <div className="space-y-4">
      <BackButton to="/ventas" />

      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">Historial de Ventas</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Resumen total y detalle de ventas registradas</p>
      </div>

      {periodTotals && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400 font-semibold">Hoy</p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">{currencySymbol}{periodTotals.today.total.toFixed(2)}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{periodTotals.today.count} venta{periodTotals.today.count !== 1 ? "s" : ""}</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-400 dark:text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400 font-semibold">Esta semana</p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">{currencySymbol}{periodTotals.thisWeek.total.toFixed(2)}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{periodTotals.thisWeek.count} venta{periodTotals.thisWeek.count !== 1 ? "s" : ""}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-400 dark:text-green-500 opacity-50" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400 font-semibold">Este mes</p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">{currencySymbol}{periodTotals.thisMonth.total.toFixed(2)}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{periodTotals.thisMonth.count} venta{periodTotals.thisMonth.count !== 1 ? "s" : ""}</p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-400 dark:text-purple-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Arqueo y diferencias de caja</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Historial de turnos y diferencias por usuario</p>
          </div>
          {isAdmin && (
            <div className="w-full md:w-72">
              <label className="grid gap-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">Usuario</span>
                <select
                  value={selectedUserId ?? ""}
                  onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : undefined)}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">Turnos cerrados</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">{shiftHistory?.summary.closedShifts ?? 0}</p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">Monto esperado</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">{currencySymbol}{Number(shiftHistory?.summary.totalExpected ?? 0).toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">Monto cierre</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">{currencySymbol}{Number(shiftHistory?.summary.totalClosing ?? 0).toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">Diferencia neta</p>
            <p className={`text-xl font-semibold ${Number(shiftHistory?.summary.totalVariance ?? 0) < 0 ? "text-red-600 dark:text-red-400" : Number(shiftHistory?.summary.totalVariance ?? 0) > 0 ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400"}`}>
              {currencySymbol}{Number(shiftHistory?.summary.totalVariance ?? 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Usuario</th>
                <th className="px-3 py-2 text-left font-semibold">Apertura</th>
                <th className="px-3 py-2 text-left font-semibold">Cierre</th>
                <th className="px-3 py-2 text-right font-semibold">Esperado</th>
                <th className="px-3 py-2 text-right font-semibold">Diferencia</th>
                <th className="px-3 py-2 text-left font-semibold">Estado</th>
                <th className="px-3 py-2 text-left font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {(shiftHistory?.data ?? []).length > 0 ? (
                (shiftHistory?.data ?? []).map((shift) => (
                  <tr key={shift.id}>
                    <td className="px-3 py-2 text-slate-900 dark:text-slate-50">{shift.user?.name || `Usuario ${shift.userId}`}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{currencySymbol}{Number(shift.openingAmount || 0).toFixed(2)}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{shift.closingAmount !== undefined ? `${currencySymbol}${Number(shift.closingAmount).toFixed(2)}` : "-"}</td>
                    <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{currencySymbol}{Number(shift.expectedAmount || 0).toFixed(2)}</td>
                    <td className={`px-3 py-2 text-right font-medium ${Number(shift.variance || 0) < 0 ? "text-red-600 dark:text-red-400" : Number(shift.variance || 0) > 0 ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400"}`}>
                      {currencySymbol}{Number(shift.variance || 0).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{shift.status === "OPEN" ? "Abierto" : "Cerrado"}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{new Date(shift.openedAt).toLocaleString("es-HN")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-slate-500 dark:text-slate-400">No hay turnos para el usuario seleccionado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Fecha desde</span>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter("dateFrom", e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-3 py-2 text-sm"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Fecha hasta</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter("dateTo", e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-3 py-2 text-sm"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Cliente</span>
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={filters.customer}
              onChange={(e) => updateFilter("customer", e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-3 py-2 text-sm"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Estado</span>
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              <option value="PENDING">PENDIENTE</option>
              <option value="PARTIAL">PARCIAL</option>
              <option value="PAID">PAGADA</option>
              <option value="CANCELLED">CANCELADA</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Monto mínimo</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={filters.minAmount}
              onChange={(e) => updateFilter("minAmount", e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-3 py-2 text-sm"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Monto máximo</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={filters.maxAmount}
              onChange={(e) => updateFilter("maxAmount", e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              setFilters({ dateFrom: "", dateTo: "", customer: "", status: "", minAmount: "", maxAmount: "" });
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Ventas registradas</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-vixo-500" />
            {data.summary.totalSales}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Productos vendidos</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Package className="w-5 h-5 text-vixo-500" />
            {data.summary.totalItemsSold}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Total vendido</p>
          <p className="mt-1 text-2xl font-semibold text-vixo-700 dark:text-vixo-400 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {currencySymbol}{data.summary.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Factura</th>
              <th className="px-4 py-3 text-left font-semibold">Fecha</th>
              <th className="px-4 py-3 text-left font-semibold">Cliente</th>
              <th className="px-4 py-3 text-left font-semibold">Metodo</th>
              <th className="px-4 py-3 text-right font-semibold">Items</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
              <th className="px-4 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {data.data.length > 0 ? (
              data.data.map((venta) => {
                const isExpanded = expandedSaleId === venta.id;
                return (
                  <>
                    <tr key={`sale-${venta.id}`} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-50">{venta.invoiceNumber || `#${venta.id}`}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {new Date(venta.date).toLocaleString("es-HN")}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{venta.customer?.name || "Cliente"}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{paymentMethodLabel(venta.paymentMethod)}</td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                        {venta.details.reduce((acc, line) => acc + line.quantity, 0)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-50">
                        {currencySymbol}{Number(venta.total || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-3">
                          <button
                            onClick={() => setExpandedSaleId(isExpanded ? null : venta.id)}
                            className="text-vixo-600 hover:text-vixo-800 dark:text-vixo-400 dark:hover:text-vixo-600"
                          >
                            {isExpanded ? "Ocultar detalles" : "Ver detalles"}
                          </button>
                          <button
                            onClick={() => handleReprint(venta.id)}
                            className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                          >
                            Reimprimir
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr key={`details-${venta.id}`} className="bg-slate-50 dark:bg-slate-800/70">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                <tr>
                                  <th className="px-3 py-2 text-left font-semibold">Producto</th>
                                  <th className="px-3 py-2 text-left font-semibold">Código</th>
                                  <th className="px-3 py-2 text-right font-semibold">Cantidad</th>
                                  <th className="px-3 py-2 text-right font-semibold">Precio unitario</th>
                                  <th className="px-3 py-2 text-right font-semibold">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                                {venta.details.map((line) => (
                                  <tr key={line.id}>
                                    <td className="px-3 py-2 text-slate-900 dark:text-slate-50">{line.product?.name || "Producto"}</td>
                                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{line.product?.code || "-"}</td>
                                    <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{line.quantity}</td>
                                    <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">
                                      {currencySymbol}{Number(line.unitPrice || 0).toFixed(2)}
                                    </td>
                                    <td className="px-3 py-2 text-right font-medium text-slate-900 dark:text-slate-50">
                                      {currencySymbol}{Number(line.quantity * line.unitPrice).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  No hay ventas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      {data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Mostrando {((page - 1) * VENTAS_PAGE_LIMIT) + 1}–{Math.min(page * VENTAS_PAGE_LIMIT, data.pagination.total)} de {data.pagination.total} ventas
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-md p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
              {page} / {data.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page >= data.pagination.totalPages}
              className="rounded-md p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
