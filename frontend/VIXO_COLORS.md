# 🎨 Guía de Colores Vixo

## Color de Identidad: Vixo Green

El verde corona de Vixo. Úsalo para resaltar elementos importantes sin cansar la vista.

### Escala Completa de Vixo Green

```css
vixo-50   #F0FDF4  → bg-vixo-50  (fondos muy sutiles)
vixo-100  #DCFCE7  → bg-vixo-100 (fondos suaves)
vixo-200  #BBF7D0  → bg-vixo-200 (fondos claros)
vixo-300  #86EFAC  → bg-vixo-300 (bordes, separadores)
vixo-400  #4ADE80  → bg-vixo-400 (hovers claros)
vixo-500  #22C55E  → bg-vixo-500 ⭐ PRIMARY
vixo-600  #16A34A  → bg-vixo-600 (hovers oscuros)
vixo-700  #15803D  → bg-vixo-700 (estados activos)
vixo-800  #166534  → bg-vixo-800 (texto sobre fondos claros)
vixo-900  #14532D  → bg-vixo-900 (textos muy oscuros)
vixo-950  #052E16  → bg-vixo-950 (casi negro verde)
```

También: `bg-vixo` → default al primary (#22C55E)

### Ejemplos de Uso:
```tsx
// Botón principal
<button className="bg-vixo-500 hover:bg-vixo-600 text-white">
  Acción Principal
</button>

// Badge sutil
<span className="bg-vixo-100 text-vixo-800 px-2 py-1 rounded">
  Activo
</span>

// Badge en dark mode
<span className="bg-vixo-950 text-vixo-400 dark:bg-vixo-950 dark:text-vixo-400">
  Premium
</span>
```

---

## 🎨 Colores de Acento

### Amber/Orange (CTAs Secundarios, Alertas)

```css
vixo-amber-light    #FCD34D → bg-vixo-amber-light
vixo-amber          #F59E0B → bg-vixo-amber (DEFAULT)
vixo-amber-dark     #D97706 → bg-vixo-amber-dark
```

**Uso:** Botones secundarios, promociones, alertas de atención

```tsx
<button className="bg-vixo-amber hover:bg-vixo-amber-dark text-white">
  Ver Promoción
</button>
```

### Blue (Información)

```css
vixo-blue-light     #60A5FA → bg-vixo-blue-light
vixo-blue           #3B82F6 → bg-vixo-blue (DEFAULT)
vixo-blue-dark      #2563EB → bg-vixo-blue-dark
```

**Uso:** Notificaciones informativas, links, badges informativos

```tsx
<div className="bg-vixo-blue-light/10 border border-vixo-blue-light text-vixo-blue-dark p-4 rounded">
  <p>💡 Información importante</p>
</div>
```

### Purple (Premium/Pro)

```css
vixo-purple-light   #C084FC → bg-vixo-purple-light
vixo-purple         #A855F7 → bg-vixo-purple (DEFAULT)
vixo-purple-dark    #9333EA → bg-vixo-purple-dark
```

**Uso:** Funciones premium, características especiales

```tsx
<span className="bg-gradient-to-r from-vixo-purple to-vixo-purple-dark text-white px-3 py-1 rounded-full text-xs font-bold">
  PRO
</span>
```

---

## ⚠️ Colores de Estado

```tsx
// Success (Verde Vixo)
className="text-vixo-500 bg-vixo-50 border-vixo-200"

// Warning (Amber)
className="text-vixo-amber-dark bg-amber-50 border-amber-200"

// Error (Rojo)
className="text-red-600 bg-red-50 border-red-200"

// Info (Blue)
className="text-vixo-blue-dark bg-blue-50 border-vixo-blue-light"
```

---

## 🌞 Modo Claro (Light Mode)

Máxima legibilidad con sensación de amplitud.

| Elemento | Color | Tailwind | Uso |
|----------|-------|----------|-----|
| **Fondo Principal** | `#FFFFFF` | `bg-white` | Fondo de página |
| **Cards/Paneles** | `#F8FAFC` | `bg-slate-50` | Cards, modales, sidebars |
| **Texto Primario** | `#0F172A` | `text-slate-900` | Títulos, texto principal |
| **Texto Secundario** | `#64748B` | `text-slate-500` | Subtítulos, labels |
| **Bordes** | `#E2E8F0` | `border-slate-200` | Divisores, bordes de inputs |

### Ejemplo:
```tsx
<div className="bg-white">
  <div className="bg-slate-50 border border-slate-200 p-4">
    <h2 className="text-slate-900">Título</h2>
    <p className="text-slate-500">Descripción secundaria</p>
  </div>
</div>
```

---

## 🌙 Modo Oscuro (Dark Mode)

Azul pizarra profundo para elegancia sin cansar la vista. Evita negro puro.

| Elemento | Color | Tailwind | Uso |
|----------|-------|----------|-----|
| **Fondo Principal** | `#020617` | `bg-slate-950` | Fondo de página |
| **Cards/Paneles** | `#0F172A` | `bg-slate-900` | Cards, modales, sidebars |
| **Texto Primario** | `#F8FAFC` | `text-slate-50` | Títulos, texto principal |
| **Texto Secundario** | `#94A3B8` | `text-slate-400` | Subtítulos, labels |
| **Bordes** | `#1E293B` | `border-slate-800` | Divisores, bordes de inputs |

### Ejemplo:
```tsx
<div className="dark:bg-slate-950">
  <div className="dark:bg-slate-900 dark:border-slate-800 border p-4">
    <h2 className="dark:text-slate-50">Título</h2>
    <p className="dark:text-slate-400">Descripción secundaria</p>
  </div>
</div>
```

---

## 💡 Componente Adaptativo (Light + Dark)

Combina ambos modos para que se adapte automáticamente:

```tsx
<div className="bg-white dark:bg-slate-950">
  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
    <h1 className="text-slate-900 dark:text-slate-50 text-2xl font-bold">
      Panel de Control
    </h1>
    <p className="text-slate-500 dark:text-slate-400 mt-2">
      Estadísticas del día
    </p>
    
    <button className="mt-4 bg-vixo-primary hover:bg-vixo-dark text-white px-4 py-2 rounded">
      Ver Reporte
    </button>
  </div>
</div>
```

---

## 🎯 Casos de Uso Comunes

### Botón Principal
```tsx
<button className="bg-vixo-500 hover:bg-vixo-600 active:bg-vixo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow">
  Guardar
</button>
```

### Botón Secundario (Amber)
```tsx
<button className="bg-vixo-amber hover:bg-vixo-amber-dark text-white font-medium px-4 py-2 rounded-lg transition-colors">
  Promoción Especial
</button>
```

### Botón Terciario
```tsx
<button className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 hover:bg-slate-300 dark:hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">
  Cancelar
</button>
```

### Botón de Solo Texto
```tsx
<button className="text-vixo-600 hover:text-vixo-700 dark:text-vixo-400 dark:hover:text-vixo-300 font-medium px-2 py-1">
  Ver más →
</button>
```

### Input/Form
```tsx
<input 
  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-50 rounded-lg focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
  placeholder="Ingrese valor..."
/>
```

### Card con Acento
```tsx
<div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-vixo-500 rounded-lg p-6 shadow-sm">
  <h3 className="text-slate-900 dark:text-slate-50 font-semibold flex items-center gap-2">
    <span className="w-2 h-2 bg-vixo-500 rounded-full"></span>
    Título Destacado
  </h3>
  <p className="text-slate-500 dark:text-slate-400 mt-2">Contenido importante...</p>
</div>
```

### Badge de Estado Activo
```tsx
<span className="inline-flex items-center gap-1.5 bg-vixo-100 dark:bg-vixo-950 text-vixo-700 dark:text-vixo-400 px-2.5 py-1 rounded-full text-sm font-medium">
  <span className="w-1.5 h-1.5 bg-vixo-500 rounded-full"></span>
  Activo
</span>
```

### Badge Premium (Purple)
```tsx
<span className="inline-flex items-center bg-gradient-to-r from-vixo-purple to-vixo-purple-dark text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
  ✨ Premium
</span>
```

### Alert Success
```tsx
<div className="bg-vixo-50 dark:bg-vixo-950 border border-vixo-200 dark:border-vixo-800 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <span className="text-vixo-600 dark:text-vixo-400 text-xl">✓</span>
    <div>
      <h4 className="text-vixo-800 dark:text-vixo-300 font-semibold">Operación exitosa</h4>
      <p className="text-vixo-700 dark:text-vixo-400 text-sm mt-1">El registro se guardó correctamente.</p>
    </div>
  </div>
</div>
```

### Alert Info (Blue)
```tsx
<div className="bg-blue-50 dark:bg-blue-950 border border-vixo-blue-light dark:border-blue-800 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <span className="text-vixo-blue text-xl">ℹ</span>
    <div>
      <h4 className="text-vixo-blue-dark dark:text-vixo-blue-light font-semibold">Información</h4>
      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">Recuerda guardar los cambios.</p>
    </div>
  </div>
</div>
```

### Alert Warning (Amber)
```tsx
<div className="bg-amber-50 dark:bg-amber-950 border border-vixo-amber-light dark:border-amber-800 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <span className="text-vixo-amber text-xl">⚠</span>
    <div>
      <h4 className="text-vixo-amber-dark dark:text-vixo-amber-light font-semibold">Advertencia</h4>
      <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">Stock bajo: quedan 3 unidades.</p>
    </div>
  </div>
</div>
```

### Card con Gradiente
```tsx
<div className="bg-gradient-to-br from-vixo-500 to-vixo-700 text-white rounded-xl p-6 shadow-lg">
  <h2 className="text-2xl font-bold mb-2">Ventas del Día</h2>
  <p className="text-5xl font-bold text-vixo-100">$12,450</p>
  <p className="text-vixo-200 mt-2">↑ 23% vs ayer</p>
</div>
```

### Tabla con Hover
```tsx
<table className="w-full">
  <thead className="bg-slate-100 dark:bg-slate-800">
    <tr>
      <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Producto</th>
      <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Stock</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-vixo-50 dark:hover:bg-vixo-950 transition-colors">
      <td className="px-4 py-3 text-slate-900 dark:text-slate-50">Producto A</td>
      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
    </tr>
  </tbody>
</table>
```

---

## ⚡ Tips de Implementación

### 1. Jerarquía de Colores
```tsx
// Acciones primarias → Vixo Green
<button className="bg-vixo-500 hover:bg-vixo-600">Guardar</button>

// Acciones secundarias/promocionales → Amber
<button className="bg-vixo-amber hover:bg-vixo-amber-dark">Ver Oferta</button>

// Acciones terciarias → Gris
<button className="bg-slate-200 hover:bg-slate-300">Cancelar</button>

// Acciones destructivas → Rojo
<button className="bg-red-500 hover:bg-red-600">Eliminar</button>
```

### 2. Fondos Sutiles con Opacidad
```tsx
// Fondo sutil del color primary
<div className="bg-vixo-500/10 border border-vixo-500/20">
  Contenido destacado
</div>

// Hover sutil
<div className="hover:bg-vixo-500/5 transition-colors">
  Item clickeable
</div>
```

### 3. Gradientes Modernos
```tsx
// Gradiente principal
className="bg-gradient-to-r from-vixo-500 to-vixo-600"

// Gradiente con acento
className="bg-gradient-to-br from-vixo-500 via-vixo-600 to-vixo-purple"

// Gradiente sutil para fondos
className="bg-gradient-to-b from-white to-vixo-50 dark:from-slate-950 dark:to-slate-900"
```

### 4. Contraste y Accesibilidad
```tsx
// ✅ BIEN - Alto contraste
<div className="bg-vixo-500 text-white">Texto legible</div>
<div className="bg-vixo-100 text-vixo-900">También legible</div>

// ❌ MAL - Bajo contraste
<div className="bg-vixo-300 text-vixo-400">Difícil de leer</div>
```

### 5. Dark Mode Automático
```tsx
// Componente que se adapta automáticamente
<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
  <h1 className="text-slate-900 dark:text-slate-50">Título</h1>
  <p className="text-slate-600 dark:text-slate-400">Descripción</p>
</div>
```

### 6. Transiciones Suaves
```tsx
// Siempre agrega transiciones a elementos interactivos
className="transition-colors duration-200"
className="transition-all duration-300"

// Para escalas
className="hover:scale-105 transition-transform"
```

### 7. Sombras con Color
```tsx
// Sombra con tinte verde
className="shadow-vixo-500/20 shadow-lg"

// Sombra en hover
className="hover:shadow-vixo-500/30 hover:shadow-xl transition-shadow"
```

### 8. Indicadores de Estado
```tsx
// Punto de estado (online, activo, etc)
<span className="relative">
  <span className="absolute -top-1 -right-1 w-3 h-3 bg-vixo-500 rounded-full border-2 border-white dark:border-slate-900"></span>
  Usuario
</span>

// Pulso animado
<span className="relative">
  <span className="absolute inset-0 bg-vixo-500 rounded-full animate-ping"></span>
  <span className="relative w-3 h-3 bg-vixo-500 rounded-full block"></span>
</span>
```

### 9. Borders Sutiles
```tsx
// Border sutil que se ve bien en ambos modos
className="border border-slate-200/50 dark:border-slate-800/50"

// Border con acento
className="border-l-4 border-vixo-500"
```

### 10. Skeleton Loaders
```tsx
<div className="animate-pulse space-y-3">
  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
</div>
```

---

## 🎨 Paleta de Referencias Rápidas

### Vixo Green Scale
| Nombre | Hex | Uso Principal |
|--------|-----|---------------|
| vixo-50 | #F0FDF4 | Fondos muy sutiles, alerts success |
| vixo-100 | #DCFCE7 | Fondos suaves, hover states |
| vixo-500 | #22C55E | **PRIMARY** - Botones, acciones principales |
| vixo-600 | #16A34A | Hover de botones primarios |
| vixo-800 | #166534 | Texto sobre fondos claros |

### Acentos
| Color | Hex | Uso |
|-------|-----|-----|
| Amber | #F59E0B | CTAs secundarios, promociones |
| Blue | #3B82F6 | Info, notificaciones |
| Purple | #A855F7 | Premium, features especiales |

### Light/Dark Mode
| Elemento | Light | Dark |
|----------|-------|------|
| Fondo | white | slate-950 |
| Card | slate-50 | slate-900 |
| Texto | slate-900 | slate-50 |
| Secundario | slate-500 | slate-400 |
| Border | slate-200 | slate-800 |

---

## 📱 Ejemplo de Página Completa

```tsx
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="bg-vixo-500 text-white px-6 py-4 shadow-lg">
        <h1 className="text-2xl font-bold">Vixo Dashboard</h1>
      </header>

      {/* Content */}
      <main className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ventas Hoy</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-2">$12,450</p>
            <span className="inline-flex items-center gap-1 text-vixo-600 dark:text-vixo-400 text-sm mt-2">
              ↑ 23%
            </span>
          </div>

          {/* Card 2 - Con Gradiente */}
          <div className="bg-gradient-to-br from-vixo-500 to-vixo-600 text-white rounded-xl p-6">
            <h3 className="text-vixo-100 text-sm font-medium">Productos Activos</h3>
            <p className="text-3xl font-bold mt-2">1,234</p>
            <button className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Ver Inventario
            </button>
          </div>

          {/* Card 3 - Accent Color */}
          <div className="bg-vixo-amber/10 border border-vixo-amber/20 rounded-xl p-6">
            <h3 className="text-vixo-amber-dark text-sm font-medium">Alertas</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-2">5</p>
            <span className="text-vixo-amber-dark text-sm">Stock bajo en productos</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="bg-vixo-500 hover:bg-vixo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md">
            Nueva Venta
          </button>
          <button className="bg-vixo-amber hover:bg-vixo-amber-dark text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Ver Promociones
          </button>
          <button className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 hover:bg-slate-300 dark:hover:bg-slate-700 px-6 py-3 rounded-lg font-medium transition-colors">
            Reportes
          </button>
        </div>
      </main>
    </div>
  );
}
```
