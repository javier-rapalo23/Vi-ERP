import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePurchase } from "../services/purchases.api";
import { useSuppliers } from "../services/suppliers.api";
import { useProductos } from "@/modules/inventario/services/productos.api";
import { useAnalyzeProductImage } from "@/shared/services/ai.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loading from "@/shared/components/Loading";
import { Save, X, Plus, Trash2, Camera, Loader2 } from "lucide-react";

const schema = z.object({
  supplierId: z.number().min(1, "Selecciona un proveedor"),
  dueDate: z.string().min(1, "La fecha de vencimiento es requerida"),
});

type FormValues = z.infer<typeof schema>;

type PurchaseDetail = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export default function PurchaseForm() {
  const navigate = useNavigate();
  const [details, setDetails] = useState<PurchaseDetail[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useSuppliers();
  const { data: products = [], isLoading: isLoadingProducts } = useProductos();
  const createMutation = useCreatePurchase();
  const analyzeImageMutation = useAnalyzeProductImage();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5MB");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Convertir imagen a base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        try {
          const productInfo = await analyzeImageMutation.mutateAsync(base64String);

          // Buscar producto por nombre o código
          let foundProduct = null;
          if (productInfo.codigo) {
            foundProduct = products.find(
              (p) => p.code?.toLowerCase() === productInfo.codigo?.toLowerCase()
            );
          }
          if (!foundProduct && productInfo.nombre) {
            foundProduct = products.find((p) =>
              p.name?.toLowerCase().includes(productInfo.nombre.toLowerCase())
            );
          }

          // Autocompletar campos
          if (foundProduct) {
            setSelectedProductId(foundProduct.id);
            setUnitPrice(productInfo.precio || foundProduct.cost || foundProduct.price);
            setQuantity(productInfo.cantidad || 1);
            toast.success(`Producto identificado: ${foundProduct.name}`);
          } else {
            // Si no se encuentra el producto, mostrar la información detectada
            toast.info(
              `Producto detectado: ${productInfo.nombre}. No se encontró en el inventario.`,
              { duration: 5000 }
            );
            if (productInfo.precio) setUnitPrice(productInfo.precio);
            if (productInfo.cantidad) setQuantity(productInfo.cantidad);
          }
        } catch (error: any) {
          toast.error(error?.response?.data?.error || "Error al analizar la imagen");
        } finally {
          setIsAnalyzing(false);
          // Limpiar el input para permitir subir la misma imagen nuevamente
          event.target.value = "";
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Error al procesar la imagen");
      setIsAnalyzing(false);
    }
  };

  const addDetail = () => {
    if (!selectedProductId) {
      toast.error("Selecciona un producto");
      return;
    }
    if (quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }
    if (unitPrice <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const exists = details.find((d) => d.productId === selectedProductId);
    if (exists) {
      toast.error("Este producto ya está agregado");
      return;
    }

    setDetails([
      ...details,
      {
        productId: selectedProductId,
        productName: product.name || 'Sin nombre',
        quantity,
        unitPrice,
      },
    ]);

    setSelectedProductId(0);
    setQuantity(1);
    setUnitPrice(0);
  };

  const removeDetail = (productId: number) => {
    setDetails(details.filter((d) => d.productId !== productId));
  };

  const calculateTotal = () => {
    return details.reduce((sum, d) => sum + d.quantity * d.unitPrice, 0);
  };

  const onSubmit = async (values: FormValues) => {
    if (details.length === 0) {
      toast.error("Agrega al menos un producto");
      return;
    }

    try {
      const total = calculateTotal();
      await createMutation.mutateAsync({
        supplierId: values.supplierId,
        total,
        dueDate: values.dueDate,
        details: details.map((d) => ({
          productId: d.productId,
          quantity: d.quantity,
          unitPrice: d.unitPrice,
        })),
      });
      toast.success("Compra creada exitosamente");
      navigate("/compras");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al crear compra");
    }
  };

  if (isLoadingSuppliers || isLoadingProducts) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Nueva Compra</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Información general */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Información General
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Proveedor *</span>
                <select
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
                  {...register("supplierId", { valueAsNumber: true })}
                >
                  <option value="">Seleccionar...</option>
                  {suppliers.filter((s) => s.isActive).map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                {errors.supplierId && <small className="text-red-500">{String(errors.supplierId.message)}</small>}
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Fecha de Vencimiento *
                </span>
                <input
                  type="date"
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
                  {...register("dueDate")}
                />
                {errors.dueDate && <small className="text-red-500">{String(errors.dueDate.message)}</small>}
              </label>
            </div>
          </div>

          {/* Agregar productos */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Agregar Productos
              </h3>
              
              {/* Botón para analizar imagen con IA */}
              <div className="relative">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isAnalyzing}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-vixo-500 text-vixo-600 dark:text-vixo-400 hover:bg-vixo-50 dark:hover:bg-vixo-950 transition-colors cursor-pointer ${
                    isAnalyzing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-medium">Analizando...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span className="text-sm font-medium">Escanear con IA</span>
                    </>
                  )}
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <span className="md:col-span-2 text-sm font-medium text-slate-700 dark:text-slate-300">Producto</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cantidad</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Precio</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                value={selectedProductId}
                onChange={(e) => {
                  const id = parseInt(e.target.value);
                  setSelectedProductId(id);
                  const product = products.find((p) => p.id === id);
                  if (product) {
                    setUnitPrice(product.cost || product.price || 0);
                  }
                }}
                className="md:col-span-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
              >
                <option value="">Seleccionar producto...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name || 'Sin nombre'} - Stock: {product.stock ?? 0}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Cantidad"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
              />

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Precio"
                  min="0"
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                  className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={addDetail}
                  className="rounded-lg bg-vixo-500 hover:bg-vixo-600 px-3 py-2 text-white transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Lista de productos */}
          {details.length > 0 && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                Productos ({details.length})
              </h3>

              <div className="space-y-2">
                {details.map((detail) => (
                  <div
                    key={detail.productId}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-vixo-300 dark:hover:border-vixo-700 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-slate-50">
                        {detail.productName}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        {detail.quantity} x ${detail.unitPrice.toFixed(2)} = $
                        {(detail.quantity * detail.unitPrice).toFixed(2)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDetail(detail.productId)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-lg font-bold text-slate-900 dark:text-slate-50">
                  <span>Total:</span>
                  <span className="text-vixo-600 dark:text-vixo-400">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting || details.length === 0}
              className="rounded-lg bg-vixo-500 hover:bg-vixo-600 active:bg-vixo-700 px-4 py-2 text-white font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Guardando..." : "Guardar Compra"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/compras")}
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
