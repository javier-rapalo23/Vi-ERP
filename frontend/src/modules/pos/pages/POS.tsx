import { useState, useRef, useEffect } from "react";
import { useRegistrarVenta } from "../services/pos.api";
import { useSettings } from "@/modules/mantenimientos/services/configuration.api";
import { useClientes } from "@/modules/ventas/services/clientes.api";
import { useCurrentShift } from "@/modules/ventas/services/shifts.api";
import ShiftStatusCard from "@/modules/ventas/components/ShiftStatusCard";
import OpenShiftDialog from "@/modules/ventas/components/OpenShiftDialog";
import CloseShiftDialog from "@/modules/ventas/components/CloseShiftDialog";
import { toast } from "sonner";
import api from "@/shared/api/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, User, ChevronDown } from "lucide-react";

type Item = {
  id: number;
  cantidad: number;
  price: number;
  name: string;
  code?: string;
  barcode?: string | null;
  stock?: number;
};

type InvoiceItem = {
  productId: number;
  name: string;
  code?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type InvoiceData = {
  saleId: number;
  invoiceNumber: string;
  invoiceFormat: "TICKET" | "PDF";
  date: string;
  paymentMethod: "CASH" | "TRANSFER" | "CARD";
  customerName: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  companyName: string;
  companyRtn?: string;
  companyAddress?: string;
  companyPhone?: string;
  fiscalCai?: string;
  fiscalValidUntil?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxName: string;
  taxRate: number;
  taxAmount: number;
  total: number;
  currencySymbol: string;
  currencyName: string;
};

export default function POS() {
  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const [lastInvoice, setLastInvoice] = useState<InvoiceData | null>(null);
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "TRANSFER" | "CARD">("CASH");
  const [openShiftDialogOpen, setOpenShiftDialogOpen] = useState(false);
  const [closeShiftDialogOpen, setCloseShiftDialogOpen] = useState(false);
  const customerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const registrar = useRegistrarVenta();
  const { data: settings = [] } = useSettings();
  const { data: clientes = [], isLoading: isLoadingClientes } = useClientes();
  const { data: currentShift, isLoading: isLoadingShift } = useCurrentShift();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (customerRef.current && !customerRef.current.contains(e.target as Node)) {
        setCustomerDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cargar productos reales desde la API
  const { data: productos = [], isLoading, isError, refetch: refetchProductos } = useQuery<Item[], Error>({
    queryKey: ["productos"],
    queryFn: async () => {
      const res = await api.get("/productos");
      // Mapear a Item con cantidad por defecto 1 y validar campos
      return (res.data || [])
        .filter((p: any) => p && p.id && p.name && typeof p.price === 'number')
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          code: String(p.code || ""),
          barcode: p.barcode ? String(p.barcode) : null,
          price: p.price,
          cantidad: 1,
          stock: Number(p.stock ?? p.cantidad ?? 0),
        } as Item));
    },
  });

  const total = items.reduce((acc, i) => acc + i.cantidad * i.price, 0);

  const settingsMap = settings.reduce<Record<string, string>>((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});

  const taxName = settingsMap.IMPUESTO_NOMBRE?.trim() || "ISV";
  const rawTaxRate = Number(settingsMap.IMPUESTO_TASA);
  const taxRate = Number.isFinite(rawTaxRate) ? rawTaxRate : 15;
  const taxDecimal = taxRate / 100;
  const taxAmount = total * taxDecimal;
  const grandTotal = total + taxAmount;

  const currencySymbol = settingsMap.MONEDA_SIMBOLO?.trim() || "$";
  const currencyName = settingsMap.MONEDA_NOMBRE?.trim() || "Dolar";
  const selectedCustomer = clientes.find((cliente) => cliente.id === selectedCustomerId) ?? null;

  function getInCartQty(productId: number) {
    return items.find((item) => item.id === productId)?.cantidad ?? 0;
  }

  function getAvailableStock(product: Item) {
    if (typeof product.stock !== "number") return Number.POSITIVE_INFINITY;
    return Math.max(0, product.stock - getInCartQty(product.id));
  }

  function addProduct(p: Item) {
    if (getAvailableStock(p) <= 0) {
      toast.error(`Sin stock disponible para ${p.name}`);
      return;
    }

    setItems((s) => {
      const found = s.find((x) => x.id === p.id);
      if (found) {
        return s.map((x) => (x.id === p.id ? { ...x, cantidad: x.cantidad + 1 } : x));
      }
      return [...s, { ...p }];
    });
  }

  function addByBarcode() {
    const normalizedCode = barcodeQuery.trim().toLowerCase();

    if (!normalizedCode) {
      toast.error("Ingresa o escanea un código de barras");
      return;
    }

    const found = (productos as Item[]).find((p) => {
      const barcodeValue = String(p.barcode || "").trim().toLowerCase();
      const productCodeValue = String(p.code || "").trim().toLowerCase();
      return barcodeValue === normalizedCode || productCodeValue === normalizedCode;
    });

    if (!found) {
      toast.error("No se encontró un producto con ese código");
      return;
    }

    addProduct(found);
    setBarcodeQuery("");
  }

  function updateQty(index: number, qty: number) {
    if (qty <= 0) return removeItem(index);

    const item = items[index];
    const maxQty = typeof item?.stock === "number" ? item.stock : Number.POSITIVE_INFINITY;
    const safeQty = Math.min(qty, maxQty);

    if (qty > maxQty) {
      toast.error(`Stock maximo para ${item.name}: ${maxQty}`);
    }

    setItems((s) => s.map((it, i) => (i === index ? { ...it, cantidad: safeQty } : it)));
  }

  function removeItem(index: number) {
    setItems((s) => s.filter((_, i) => i !== index));
  }

  function escapeHtml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function paymentMethodLabel(method: "CASH" | "TRANSFER" | "CARD") {
    if (method === "TRANSFER") return "Transferencia";
    if (method === "CARD") return "Tarjeta";
    return "Efectivo";
  }

  function printInvoice(invoice: InvoiceData) {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      toast.error("No se pudo abrir la ventana de impresión");
      return;
    }

    const invoiceRows = invoice.items
      .map(
        (item) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${escapeHtml(item.name)}</td>
            <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:center;">${escapeHtml(item.code || "-")}</td>
            <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:center;">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;">${invoice.currencySymbol}${item.unitPrice.toFixed(2)}</td>
            <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;">${invoice.currencySymbol}${item.lineTotal.toFixed(2)}</td>
          </tr>
        `
      )
      .join("");

    const companyName = invoice.companyName;
    const companyAddress = invoice.companyAddress || "";
    const companyPhone = invoice.companyPhone || "";
    const isTicket = invoice.invoiceFormat === "TICKET";

    const printContent = `
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
          <h1>${escapeHtml(companyName)}</h1>
          ${invoice.companyRtn ? `<div class="muted">RTN: ${escapeHtml(invoice.companyRtn)}</div>` : ""}
          ${companyAddress ? `<div class="muted">${escapeHtml(companyAddress)}</div>` : ""}
          ${companyPhone ? `<div class="muted">Tel: ${escapeHtml(companyPhone)}</div>` : ""}
          ${invoice.fiscalCai ? `<div class="muted">CAI: ${escapeHtml(invoice.fiscalCai)}</div>` : ""}
          ${invoice.fiscalValidUntil ? `<div class="muted">Limite fiscal: ${new Date(invoice.fiscalValidUntil).toLocaleDateString("es-HN")}</div>` : ""}

          <div class="row" style="margin-top:16px;">
            <div>
              <div><strong>Factura:</strong> ${escapeHtml(invoice.invoiceNumber)}</div>
              <div><strong>Fecha:</strong> ${new Date(invoice.date).toLocaleString("es-HN")}</div>
            </div>
            <div>
              <div><strong>Cliente:</strong> ${escapeHtml(invoice.customerName)}</div>
              ${invoice.customerPhone ? `<div><strong>Tel:</strong> ${escapeHtml(invoice.customerPhone)}</div>` : ""}
              ${invoice.customerEmail ? `<div><strong>Email:</strong> ${escapeHtml(invoice.customerEmail)}</div>` : ""}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="text-align:left;padding:8px;border-bottom:2px solid #0f172a;">Producto</th>
                <th style="text-align:center;padding:8px;border-bottom:2px solid #0f172a;">Código</th>
                <th style="text-align:center;padding:8px;border-bottom:2px solid #0f172a;">Cant.</th>
                <th style="text-align:right;padding:8px;border-bottom:2px solid #0f172a;">Precio</th>
                <th style="text-align:right;padding:8px;border-bottom:2px solid #0f172a;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceRows}
            </tbody>
          </table>

          <div class="totals">
            <div class="line"><span>Subtotal</span><span>${invoice.currencySymbol}${invoice.subtotal.toFixed(2)}</span></div>
            <div class="line"><span>${escapeHtml(invoice.taxName)} (${invoice.taxRate}%)</span><span>${invoice.currencySymbol}${invoice.taxAmount.toFixed(2)}</span></div>
            <div class="line strong"><span>Total</span><span>${invoice.currencySymbol}${invoice.total.toFixed(2)}</span></div>
            <div class="line"><span>Metodo de pago</span><span>${paymentMethodLabel(invoice.paymentMethod)}</span></div>
            <div class="line"><span>Moneda</span><span>${escapeHtml(invoice.currencyName)}</span></div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  async function cobrar() {
    if (items.length === 0) {
      toast.error("Agrega al menos un producto");
      return;
    }

    if (!selectedCustomer) {
      toast.error("Selecciona un cliente para registrar la venta");
      return;
    }

    try {
      const cartSnapshot = [...items];

      // Revalidar stock al momento de cobrar con datos frescos del servidor.
      const latestProductsResponse = await refetchProductos();
      const latestProducts = (latestProductsResponse.data || []) as Item[];
      const latestStockByProduct = new Map<number, number>(
        latestProducts.map((product) => [product.id, Number(product.stock ?? 0)])
      );

      for (const cartItem of cartSnapshot) {
        const latestStock = latestStockByProduct.get(cartItem.id);

        if (latestStock === undefined) {
          toast.error(`El producto ${cartItem.name} ya no esta disponible.`);
          await queryClient.invalidateQueries({ queryKey: ["productos"] });
          return;
        }

        if (cartItem.cantidad > latestStock) {
          toast.error(
            `Stock insuficiente para ${cartItem.name}. Disponible: ${latestStock}, solicitado: ${cartItem.cantidad}.`
          );
          await queryClient.invalidateQueries({ queryKey: ["productos"] });
          return;
        }
      }

      const payload = {
        customerId: selectedCustomer.id,
        paymentMethod,
        products: items.map((it) => ({ id: it.id, quantity: it.cantidad, price: it.price })),
      };

      const response = await registrar.mutateAsync(payload);
      const saleData = response?.data;
      const snapshot = saleData?.invoiceSnapshot;

      const invoiceItems: InvoiceItem[] = cartSnapshot.map((item) => ({
        productId: item.id,
        name: item.name,
        code: item.code,
        quantity: item.cantidad,
        unitPrice: item.price,
        lineTotal: item.cantidad * item.price,
      }));

      const subtotal = invoiceItems.reduce((acc, current) => acc + current.lineTotal, 0);
      const computedTax = subtotal * taxDecimal;
      const computedTotal = subtotal + computedTax;

      const invoice: InvoiceData = {
        saleId: saleData?.id ?? Date.now(),
        invoiceNumber: String(saleData?.invoiceNumber || `#${saleData?.id ?? Date.now()}`),
        invoiceFormat: snapshot?.format === "PDF" ? "PDF" : "TICKET",
        date: saleData?.date ?? new Date().toISOString(),
        paymentMethod: snapshot?.paymentMethod || saleData?.paymentMethod || paymentMethod,
        customerName: selectedCustomer.name,
        customerPhone: selectedCustomer.phone,
        customerEmail: selectedCustomer.email,
        companyName: snapshot?.company?.name || settingsMap.EMPRESA_NOMBRE?.trim() || "Vi-ERP",
        companyRtn: snapshot?.company?.rtn || settingsMap.EMPRESA_RTN?.trim() || "",
        companyAddress: snapshot?.company?.address || settingsMap.EMPRESA_DIRECCION?.trim() || "",
        companyPhone: snapshot?.company?.phone || settingsMap.EMPRESA_TELEFONO?.trim() || "",
        fiscalCai: snapshot?.fiscal?.cai || settingsMap.FACTURA_CAI?.trim() || "",
        fiscalValidUntil: snapshot?.fiscal?.validUntil || settingsMap.FACTURA_FECHA_LIMITE?.trim() || "",
        items: invoiceItems,
        subtotal,
        taxName: snapshot?.tax?.name || taxName,
        taxRate: typeof snapshot?.tax?.rate === "number" ? snapshot.tax.rate : taxRate,
        taxAmount: typeof snapshot?.tax?.amount === "number" ? snapshot.tax.amount : computedTax,
        total: typeof snapshot?.total === "number" ? snapshot.total : saleData?.total ?? computedTotal,
        currencySymbol: snapshot?.currency?.symbol || currencySymbol,
        currencyName: snapshot?.currency?.name || currencyName,
      };

      setLastInvoice(invoice);
      toast.success("Venta registrada exitosamente");
      setItems([]);
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al registrar venta");
    }
  }

  const filtered = (productos as Item[]).filter(
    (p) => p.name?.toLowerCase().includes(query.toLowerCase()) || query.trim() === ""
  );
  const normalizedCustomerQuery = customerQuery.trim().toLowerCase();
  const filteredCustomers = clientes.filter((cliente) => {
    if (!normalizedCustomerQuery) return true;

    return [cliente.name, cliente.phone, cliente.email]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalizedCustomerQuery));
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-50">Punto de Venta</h1>

      </div>
        <ShiftStatusCard
          shift={currentShift}
          isLoading={isLoadingShift}
          onOpenClick={() => setOpenShiftDialogOpen(true)}
          onCloseClick={() => setCloseShiftDialogOpen(true)}
          currencySymbol={currencySymbol}
        />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 shadow-sm">

          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Ingresar producto</p>
          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              value={barcodeQuery}
              onChange={(e) => setBarcodeQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addByBarcode();
                }
              }}
              placeholder="Escanear o ingresar código de barras"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
              aria-label="Código de barras"
            />
            <button
              type="button"
              onClick={addByBarcode}
              className="rounded-lg bg-vixo-500 hover:bg-vixo-600 px-3 py-2 text-white font-medium transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-50 mb-3">
            <User className="w-4 h-4 text-vixo-600 dark:text-vixo-400" />
            <p className="text-sm font-medium">Cliente de la venta</p>
          </div>

          <div className="relative" ref={customerRef}>
            <div
              className={`flex items-center justify-between rounded-lg border bg-white dark:bg-slate-800 px-3 py-2 cursor-pointer transition-colors ${customerDropdownOpen
                ? "border-vixo-500 ring-2 ring-vixo-500"
                : "border-slate-300 dark:border-slate-700 hover:border-vixo-400 dark:hover:border-vixo-600"
                }`}
              onClick={() => {
                setCustomerDropdownOpen((prev) => !prev);
                if (!customerDropdownOpen) setCustomerQuery("");
              }}
            >
              {selectedCustomer ? (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-slate-50 truncate">{selectedCustomer.name}</p>
                  {(selectedCustomer.phone || selectedCustomer.email) && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {selectedCustomer.phone || selectedCustomer.email}
                    </p>
                  )}
                </div>
              ) : (
                <span className="text-slate-400 dark:text-slate-500 text-sm">
                  {isLoadingClientes ? "Cargando clientes..." : "Selecciona un cliente"}
                </span>
              )}
              <div className="flex items-center gap-2 ml-2 shrink-0">
                {selectedCustomer && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCustomerId(null);
                      setCustomerQuery("");
                      setCustomerDropdownOpen(false);
                    }}
                    className="text-xs font-medium text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    Quitar
                  </button>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${customerDropdownOpen ? "rotate-180" : ""}`} />
              </div>
            </div>

            {customerDropdownOpen && (
              <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
                <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      autoFocus
                      value={customerQuery}
                      onChange={(e) => setCustomerQuery(e.target.value)}
                      placeholder="Buscar por nombre, teléfono o email"
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-vixo-500 transition-colors"
                    />
                  </div>
                </div>
                <ul className="max-h-52 overflow-y-auto py-1">
                  {filteredCustomers.length === 0 ? (
                    <li className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">No se encontraron clientes</li>
                  ) : (
                    filteredCustomers.map((cliente) => (
                      <li key={cliente.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCustomerId(cliente.id);
                            setCustomerDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-vixo-50 dark:hover:bg-vixo-950/40 transition-colors ${selectedCustomerId === cliente.id ? "bg-vixo-50 dark:bg-vixo-950/40" : ""
                            }`}
                        >
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{cliente.name}</p>
                          {(cliente.phone || cliente.email) && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {cliente.phone || cliente.email}
                            </p>
                          )}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product list */}
        <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-4">Productos</h3>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Buscar producto</p>
          <div className="flex mb-3 flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
                aria-label="Buscar producto"
              />
            </div>
            <button
              onClick={() => setQuery("")}
              className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Limpiar
            </button>
          </div>
          {isLoading ? (
            <div className="text-slate-700 dark:text-slate-300">Cargando productos...</div>
          ) : isError ? (
            <div className="text-red-600 dark:text-red-400">Error al cargar productos</div>
          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {filtered.map((p) => {
                const availableStock = getAvailableStock(p);
                const hasStock = availableStock > 0;

                return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-vixo-300 dark:hover:border-vixo-700 transition-all">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-50">{p.name || 'Sin nombre'}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Cod. producto: {p.code || 'N/A'} · Cod. barras: {p.barcode || 'N/A'}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Precio: {currencySymbol}{p.price?.toFixed(2) ?? '0.00'} - Stock disponible: {Number.isFinite(availableStock) ? availableStock : '-'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addProduct(p)}
                      disabled={!hasStock}
                      className="rounded-lg bg-vixo-500 hover:bg-vixo-600 px-3 py-1.5 text-white font-medium transition-colors flex items-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Agregar ${p.name || 'producto'}`}
                    >
                      <Plus className="w-4 h-4" />
                      {hasStock ? 'Añadir' : 'Sin stock'}
                    </button>
                  </div>
                </div>
                );
              })}
              {filtered.length === 0 && <div className="text-slate-700 dark:text-slate-300">No hay productos que coincidan.</div>}
            </div>
          )}
        </div>

        {/* Cart */}
        <aside className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito
          </h3>

          <div className="mb-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Cliente</p>
            <p className="mt-1 font-medium text-slate-900 dark:text-slate-50">
              {selectedCustomer?.name || "Selecciona un cliente"}
            </p>
            {(selectedCustomer?.phone || selectedCustomer?.email) && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {selectedCustomer.phone || selectedCustomer.email}
              </p>
            )}
          </div>

          {items.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">No hay productos en el carrito</p>
          ) : (
            <ul className="space-y-3">
              {items.map((it, idx) => (
                <li key={it.id} className="flex items-center justify-between">
                  <div className="max-w-[55%]">
                    <div className="font-medium text-slate-900 dark:text-slate-50">{it.name || 'Sin nombre'}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{currencySymbol}{it.price?.toFixed(2) ?? '0.00'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(idx, it.cantidad - 1)}
                      className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label={`Disminuir cantidad de ${it.name || 'producto'}`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      value={it.cantidad}
                      onChange={(e) => updateQty(idx, Number(e.target.value))}
                      className="w-16 text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 p-1 focus:ring-2 focus:ring-vixo-500"
                      min={1}
                      aria-label={`Cantidad de ${it.name || 'producto'}`}
                    />
                    <button
                      onClick={() => updateQty(idx, it.cantidad + 1)}
                      className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label={`Aumentar cantidad de ${it.name || 'producto'}`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(idx)}
                      className="ml-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      aria-label={`Eliminar ${it.name || 'producto'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-slate-200 dark:border-slate-800 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>Subtotal</span>
              <span>{currencySymbol}{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>{taxName} ({taxRate}%)</span>
              <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-slate-50 text-lg">
              <span>Total</span>
              <span>{currencySymbol}{grandTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Moneda: {currencyName}</p>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Metodo de pago</p>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as "CASH" | "TRANSFER" | "CARD")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-3 py-2 text-sm"
              >
                <option value="CASH">Efectivo</option>
                <option value="TRANSFER">Transferencia</option>
                <option value="CARD">Tarjeta</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={cobrar}
                disabled={registrar.isPending || !selectedCustomer}
                className="flex-1 rounded-lg bg-vixo-500 hover:bg-vixo-600 active:bg-vixo-700 px-4 py-2.5 text-white font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                {registrar.isPending ? "Procesando..." : "Cobrar"}
              </button>
              {lastInvoice && (
                <button
                  onClick={() => printInvoice(lastInvoice)}
                  className="rounded-lg border border-vixo-500 px-4 py-2.5 text-vixo-600 dark:text-vixo-400 hover:bg-vixo-50 dark:hover:bg-vixo-950/40 transition-colors"
                  type="button"
                >
                  Imprimir factura
                </button>
              )}
              <button
                onClick={() => setItems([])}
                className="rounded-lg border border-red-500 dark:border-red-600 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>
      
        <OpenShiftDialog
          isOpen={openShiftDialogOpen}
          onOpenChange={setOpenShiftDialogOpen}
          currencySymbol={currencySymbol}
        />
      
        <CloseShiftDialog
          isOpen={closeShiftDialogOpen}
          onOpenChange={setCloseShiftDialogOpen}
          shift={currentShift || null}
          currencySymbol={currencySymbol}
        />
    </div>
  );
}
