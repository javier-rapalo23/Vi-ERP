# Reconocimiento de Productos con IA 🤖

Esta funcionalidad permite escanear imágenes de productos y autocompletar los campos del formulario de compras usando GPT-4 Vision de OpenAI.

## 📋 Características

- **Reconocimiento inteligente**: Analiza imágenes de productos y extrae información relevante
- **Autocompletado**: Rellena automáticamente nombre, código, cantidad y precio
- **Búsqueda automática**: Busca el producto en el inventario por código o nombre
- **Interfaz intuitiva**: Botón "Escanear con IA" en el formulario de compras

## 🔧 Configuración

### 1. Instalar dependencias del backend

```bash
cd vi-erp-backend
npm install
```

Esto instalará la dependencia `openai` que se agregó al `package.json`.

### 2. Configurar API Key de OpenAI

Agrega tu API key de OpenAI al archivo `.env` del backend:

```env
OPENAI_API_KEY="sk-tu-api-key-aqui"
```

> 💡 **Obtener API Key**: Visita https://platform.openai.com/api-keys para crear una nueva API key.

### 3. Reiniciar el servidor del backend

```bash
npm run dev
```

## 📱 Uso

1. Ve al formulario de **Nueva Compra** (`/compras/nueva`)
2. Haz clic en el botón **"Escanear con IA"** (icono de cámara)
3. Selecciona una imagen del producto (formatos: JPG, PNG, WebP, etc.)
4. Espera mientras la IA analiza la imagen
5. Los campos se autocompletarán con la información detectada:
   - **Producto**: Se selecciona automáticamente si existe en el inventario
   - **Cantidad**: Extraída de la imagen (si está visible)
   - **Precio**: Extraído de la imagen (si está visible)

## 🎯 Casos de uso

### Funciona mejor con:
- Etiquetas de productos con código de barras
- Facturas o recibos con información del producto
- Imágenes de empaques con texto claro
- Capturas de pantalla de productos con descripción

### Limitaciones:
- Las imágenes deben ser claras y legibles
- Tamaño máximo: 5MB
- La precisión depende de la calidad de la imagen

## 🛠️ Arquitectura técnica

### Backend
- **Servicio**: `openaiService.ts` - Maneja la comunicación con GPT-4 Vision
- **Controlador**: `AIController.ts` - Procesa las peticiones HTTP
- **Ruta**: `POST /api/ai/analyze-product` - Endpoint protegido con autenticación

### Frontend
- **Servicio**: `ai.api.ts` - Hook de React Query para llamar al endpoint
- **Componente**: `PurchaseForm.tsx` - Integración del botón y lógica de autocompletado

## 🔒 Seguridad

- Requiere autenticación JWT
- Valida tipo y tamaño de archivo
- Manejo de errores robusto
- No almacena las imágenes en el servidor

## 💰 Costos

Esta funcionalidad usa GPT-4o de OpenAI:
- Costo aproximado: $0.0025 - $0.01 por imagen
- Depende del tamaño y complejidad de la imagen

## 🚀 Mejoras futuras

- [ ] Soporte para múltiples productos en una imagen
- [ ] Cache de productos analizados
- [ ] Modo offline con OCR local
- [ ] Soporte para códigos QR especializados
- [ ] Entrenamiento de modelo personalizado
