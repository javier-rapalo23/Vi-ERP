# 🎨 Vi-ERP Frontend - Guía Completa

## ✅ Configuración Completada

El frontend de Vi-ERP ha sido configurado exitosamente con las siguientes características:

### 🧱 Stack Implementado
- ✅ React 18 + TypeScript
- ✅ Vite como build tool
- ✅ Tailwind CSS para estilos
- ✅ TanStack Query para manejo de datos
- ✅ Zustand para estado global (autenticación)
- ✅ React Hook Form + Zod para formularios
- ✅ React Router v6 para ruteo
- ✅ Axios con interceptores JWT
- ✅ Sonner para notificaciones toast

### 📦 Módulos Implementados

#### 1. **Autenticación (Auth)**
- ✅ Página de Login con validación
- ✅ Manejo de JWT
- ✅ Store de autenticación con Zustand
- ✅ Redirección automática

#### 2. **Dashboard**
- ✅ Vista principal del sistema
- ✅ Cards con información resumida
- ✅ Bienvenida personalizada

#### 3. **Inventario (Solo Admin)**
- ✅ Listado de productos con tabla
- ✅ Formulario de creación de productos
- ✅ Validación con Zod
- ✅ Integración con API

#### 4. **POS (Admin y Cajero)**
- ✅ Punto de venta simplificado
- ✅ Gestión de carrito de compras
- ✅ Cálculo automático de totales
- ✅ Registro de ventas

### 🔐 Sistema de Rutas Protegidas

Las rutas están protegidas por roles:

- **Dashboard**: admin, user, cajero
- **POS**: admin, cajero
- **Inventario**: admin únicamente

### 🚀 Servidor de Desarrollo

El frontend está ejecutándose en:
- **URL**: http://localhost:5173/
- **Hot Reload**: Activado
- **DevTools**: React Query DevTools disponible

### 📡 Integración con Backend

- **API Base URL**: http://localhost:3000/api (configurable en .env)
- **Autenticación**: JWT en header `Authorization: Bearer <token>`
- **Interceptores**: Manejo automático de 401 (logout)

## 🎯 Próximos Pasos

Para continuar desarrollando el frontend:

### 1. Completar Módulos Pendientes

```bash
# Módulos por implementar:
- Ventas (listar ventas, detalle)
- Compras (registrar compras)
- Empleados (CRUD)
- Contabilidad (reportes, balance)
```

### 2. Mejorar el Dashboard

- Agregar gráficos (Recharts)
- KPIs en tiempo real
- Resumen de ventas del día
- Productos más vendidos

### 3. Mejorar el POS

- Buscador de productos
- Escaneo de códigos de barras
- Gestión de clientes
- Impresión de tickets
- Métodos de pago

### 4. Agregar Funcionalidades

- [ ] Exportar datos a CSV/Excel
- [ ] Reportes PDF
- [ ] Notificaciones en tiempo real
- [ ] Tema oscuro
- [ ] Internacionalización (i18n)

## 📝 Guía de Uso

### Iniciar el Proyecto

```bash
# 1. Ir a la carpeta del frontend
cd d:\Proyectos\POS\frontend

# 2. Instalar dependencias (si no lo has hecho)
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

### Acceder a la Aplicación

1. Abre tu navegador en http://localhost:5173/
2. Serás redirigido a `/login`
3. Inicia sesión con credenciales válidas
4. Explora el sistema

### Estructura de Archivos Creados

```
frontend/src/
├── app/
│   ├── App.tsx              # Componente principal
│   ├── router.tsx           # Configuración de rutas
│   ├── providers.tsx        # Providers (Query, Toaster)
│   └── index.css            # Estilos globales Tailwind
│
├── shared/
│   ├── api/
│   │   ├── axios.ts         # Cliente HTTP
│   │   └── queryClient.ts   # React Query config
│   ├── components/
│   │   ├── Loading.tsx      # Spinner de carga
│   │   └── Navbar.tsx       # Navegación
│   ├── hooks/
│   │   └── useAuthGuard.tsx # Protección de rutas
│   └── store/
│       └── auth.store.ts    # Estado de autenticación
│
└── modules/
    ├── auth/
    │   ├── pages/Login.tsx
    │   └── services/auth.api.ts
    ├── dashboard/
    │   └── pages/Dashboard.tsx
    ├── inventario/
    │   ├── pages/ProductosList.tsx
    │   ├── pages/ProductoForm.tsx
    │   └── services/productos.api.ts
    └── pos/
        ├── pages/POS.tsx
        └── services/pos.api.ts
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Producción
npm run build            # Compilar para producción
npm run preview          # Vista previa de build

# Calidad de código
npm run lint             # Ejecutar ESLint
```

## 🐛 Solución de Problemas

### El frontend no se conecta al backend

**Problema**: Error de conexión a la API

**Solución**:
1. Verifica que el backend esté ejecutándose en `http://localhost:3000`
2. Confirma que la variable `VITE_API_URL` en `.env` sea correcta
3. Verifica que CORS esté habilitado en el backend

### Estilos de Tailwind no se aplican

**Problema**: Los estilos no se ven

**Solución**:
1. Verifica que `tailwind.config.js` esté configurado
2. Confirma que `@tailwind` esté en `src/app/index.css`
3. Reinicia el servidor de desarrollo (`npm run dev`)

### Error de tipos TypeScript

**Problema**: Errores de tipos al compilar

**Solución**:
1. Verifica que todas las dependencias estén instaladas
2. Ejecuta `npm install` nuevamente
3. Revisa que los imports tengan el alias `@/` correctamente

## 🎨 Personalización

### Cambiar colores

Edita `tailwind.config.js`:

```js
export default {
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#4a4a4a',
      },
    },
  },
};
```

### Agregar nuevo módulo

1. Crea la carpeta en `src/modules/nuevo-modulo/`
2. Agrega páginas en `pages/`
3. Crea servicios en `services/`
4. Actualiza el router en `src/app/router.tsx`
5. Agrega el link en `Navbar.tsx` si es necesario

## 📚 Recursos y Documentación

- [Guía Técnica Frontend](c:\Users\javie\Downloads\Vi-ERP_Guia_Tecnica_Frontend.md)
- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand)

## ✨ Características Implementadas

### Autenticación JWT
- Login con validación
- Almacenamiento seguro en localStorage
- Logout automático en errores 401
- Protección de rutas por roles

### Gestión de Estado
- **Zustand**: Auth state (token, role, user)
- **React Query**: Todos los datos del servidor
- **Local State**: Estado de componentes con useState

### Validación de Formularios
- React Hook Form para manejo de formularios
- Zod para schemas de validación
- Mensajes de error personalizados

### Notificaciones
- Toasts con Sonner
- Notificaciones de éxito y error
- Posición y estilos personalizables

---

**¡El frontend de Vi-ERP está listo para usar! 🎉**

Para cualquier duda, consulta la guía técnica o la documentación de las tecnologías utilizadas.
