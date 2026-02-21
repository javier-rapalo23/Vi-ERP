# 🧩 Componentes Vixo - Ejemplos Listos para Usar

Componentes preconstruidos con la paleta Vixo Green. Copia y pega directamente.

---

## 🔘 Botones

### Primary Button
```tsx
export function VixoButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      className="bg-vixo-500 hover:bg-vixo-600 active:bg-vixo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </button>
  );
}
```

### Secondary Button (Amber)
```tsx
export function VixoButtonSecondary({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      className="bg-vixo-amber hover:bg-vixo-amber-dark text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200"
      {...props}
    >
      {children}
    </button>
  );
}
```

### Outline Button
```tsx
export function VixoButtonOutline({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      className="border-2 border-vixo-500 text-vixo-600 dark:text-vixo-400 hover:bg-vixo-50 dark:hover:bg-vixo-950 font-medium px-6 py-2.5 rounded-lg transition-colors duration-200"
      {...props}
    >
      {children}
    </button>
  );
}
```

### Ghost Button
```tsx
export function VixoButtonGhost({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      className="text-vixo-600 dark:text-vixo-400 hover:bg-vixo-50 dark:hover:bg-vixo-950 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## 💳 Cards

### Basic Card
```tsx
export function VixoCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
```

### Card con Acento Verde
```tsx
export function VixoCardAccent({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-vixo-500 rounded-lg p-6 shadow-sm">
      {children}
    </div>
  );
}
```

### Stat Card
```tsx
interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}

export function VixoStatCard({ label, value, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-2">{value}</p>
      {trend && (
        <span className={`inline-flex items-center gap-1 text-sm mt-2 ${
          trendUp ? 'text-vixo-600 dark:text-vixo-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
      )}
    </div>
  );
}

// Uso:
<VixoStatCard label="Ventas Hoy" value="$12,450" trend="23%" trendUp={true} />
```

### Card con Gradiente
```tsx
export function VixoCardGradient({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-vixo-500 to-vixo-700 text-white rounded-xl p-6 shadow-lg">
      {children}
    </div>
  );
}
```

---

## 🏷️ Badges

### Status Badge
```tsx
type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
}

export function VixoBadge({ variant = 'neutral', children, dot = false }: BadgeProps) {
  const variants = {
    success: 'bg-vixo-100 dark:bg-vixo-950 text-vixo-700 dark:text-vixo-400 border-vixo-200 dark:border-vixo-800',
    warning: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    error: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    info: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const dotColors = {
    success: 'bg-vixo-500',
    warning: 'bg-vixo-amber',
    error: 'bg-red-500',
    info: 'bg-vixo-blue',
    neutral: 'bg-slate-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}></span>}
      {children}
    </span>
  );
}

// Uso:
<VixoBadge variant="success" dot>Activo</VixoBadge>
<VixoBadge variant="warning">Pendiente</VixoBadge>
<VixoBadge variant="error">Error</VixoBadge>
```

### Premium Badge
```tsx
export function VixoBadgePremium() {
  return (
    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-vixo-purple to-vixo-purple-dark text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
      ✨ Premium
    </span>
  );
}
```

---

## 📝 Inputs

### Text Input
```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function VixoInput({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border ${
          error 
            ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
            : 'border-slate-200 dark:border-slate-800 focus:ring-vixo-500'
        } text-slate-900 dark:text-slate-50 rounded-lg focus:ring-2 focus:border-transparent transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
```

### Search Input
```tsx
export function VixoSearchInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <input
        type="search"
        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-50 rounded-lg focus:ring-2 focus:ring-vixo-500 focus:border-transparent transition-colors"
        placeholder="Buscar..."
        {...props}
      />
      <svg className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
}
```

---

## ⚠️ Alerts

### Alert Component
```tsx
type AlertVariant = 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title: string;
  message: string;
  onClose?: () => void;
}

export function VixoAlert({ variant, title, message, onClose }: AlertProps) {
  const variants = {
    success: {
      bg: 'bg-vixo-50 dark:bg-vixo-950',
      border: 'border-vixo-200 dark:border-vixo-800',
      icon: '✓',
      iconColor: 'text-vixo-600 dark:text-vixo-400',
      titleColor: 'text-vixo-800 dark:text-vixo-300',
      messageColor: 'text-vixo-700 dark:text-vixo-400',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950',
      border: 'border-amber-200 dark:border-amber-800',
      icon: '⚠',
      iconColor: 'text-vixo-amber',
      titleColor: 'text-amber-800 dark:text-amber-300',
      messageColor: 'text-amber-700 dark:text-amber-400',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950',
      border: 'border-red-200 dark:border-red-800',
      icon: '✕',
      iconColor: 'text-red-600 dark:text-red-400',
      titleColor: 'text-red-800 dark:text-red-300',
      messageColor: 'text-red-700 dark:text-red-400',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'ℹ',
      iconColor: 'text-vixo-blue',
      titleColor: 'text-blue-800 dark:text-blue-300',
      messageColor: 'text-blue-700 dark:text-blue-400',
    },
  };

  const config = variants[variant];

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <span className={`${config.iconColor} text-xl flex-shrink-0`}>{config.icon}</span>
        <div className="flex-1">
          <h4 className={`${config.titleColor} font-semibold`}>{title}</h4>
          <p className={`${config.messageColor} text-sm mt-1`}>{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

// Uso:
<VixoAlert 
  variant="success" 
  title="Operación exitosa" 
  message="El registro se guardó correctamente."
/>
```

---

## 📊 Progress & Loading

### Progress Bar
```tsx
interface ProgressProps {
  value: number; // 0-100
  variant?: 'default' | 'amber' | 'blue';
  showLabel?: boolean;
}

export function VixoProgress({ value, variant = 'default', showLabel = true }: ProgressProps) {
  const variants = {
    default: 'bg-vixo-500',
    amber: 'bg-vixo-amber',
    blue: 'bg-vixo-blue',
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Progreso</span>
          <span className="font-medium text-slate-900 dark:text-slate-50">{value}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full ${variants[variant]} transition-all duration-300 rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
```

### Loading Spinner
```tsx
export function VixoSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className={`${sizes[size]} border-vixo-200 dark:border-slate-700 border-t-vixo-500 rounded-full animate-spin`} />
  );
}
```

### Skeleton Loader
```tsx
export function VixoSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`} />
  );
}

// Uso:
<VixoSkeleton className="h-4 w-full" />
<VixoSkeleton className="h-20 w-full mt-2" />
```

---

## 🍞 Toast/Notification

```tsx
type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  variant: ToastVariant;
  message: string;
  onClose: () => void;
}

export function VixoToast({ variant, message, onClose }: ToastProps) {
  const variants = {
    success: 'bg-vixo-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-vixo-amber text-white',
    info: 'bg-vixo-blue text-white',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`${variants[variant]} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-up`}>
      <span className="text-xl">{icons[variant]}</span>
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={onClose} className="hover:opacity-80">✕</button>
    </div>
  );
}
```

---

## 📋 Table

```tsx
export function VixoTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="w-full">
        {children}
      </table>
    </div>
  );
}

export function VixoTableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-slate-100 dark:bg-slate-800">
      {children}
    </thead>
  );
}

export function VixoTableRow({ children, clickable = false }: { children: React.ReactNode; clickable?: boolean }) {
  return (
    <tr className={`border-b border-slate-200 dark:border-slate-800 ${
      clickable ? 'hover:bg-vixo-50 dark:hover:bg-vixo-950 cursor-pointer' : ''
    } transition-colors`}>
      {children}
    </tr>
  );
}

// Uso:
<VixoTable>
  <VixoTableHeader>
    <tr>
      <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Producto</th>
      <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Stock</th>
    </tr>
  </VixoTableHeader>
  <tbody>
    <VixoTableRow clickable>
      <td className="px-4 py-3 text-slate-900 dark:text-slate-50">Producto A</td>
      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
    </VixoTableRow>
  </tbody>
</VixoTable>
```

---

## 🎨 CSS Animations para Tailwind

Agrega esto a tu `tailwind.config.js`:

```js
theme: {
  extend: {
    keyframes: {
      'slide-up': {
        '0%': { transform: 'translateY(100%)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      'fade-in': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
    },
    animation: {
      'slide-up': 'slide-up 0.3s ease-out',
      'fade-in': 'fade-in 0.2s ease-out',
    },
  },
}
```
