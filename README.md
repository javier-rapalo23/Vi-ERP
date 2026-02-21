# 🟢 Vixo - Sistema de Gestión Comercial

Sistema modular de gestión comercial que integra POS, inventario, compras, ventas y contabilidad.

## 📦 Proyectos

- `frontend/` - Vite + React + TypeScript + Tailwind + TanStack Query + Zustand
- `vi-erp-backend/` - Node.js + Express + Prisma + PostgreSQL + Zod + JWT + Swagger

---

## 🎨 Identidad de Marca

**Vixo Green** - Color principal: `#22C55E`  
Un verde vibrante que representa crecimiento, eficiencia y confianza.

### Paleta de Colores
- **Light Mode**: Fondos claros con máxima legibilidad (slate-50, white)
- **Dark Mode**: Azul pizarra profundo sin negro puro (slate-950, slate-900)

Ver guía completa: [frontend/VIXO_COLORS.md](frontend/VIXO_COLORS.md)

---

## 🧭 Visión General

Vixo está diseñado para ser extensible por dominios. El backend implementa capas bien separadas (Presentation, Application, Domain, Infrastructure). El frontend consume la API y provee interfaces para autenticación, dashboard, inventario y punto de venta (POS) con un diseño moderno y adaptativo.

---
## 🧱 Arquitectura Backend (Clean Architecture)
Capas principales:
- Presentation: Rutas, controladores, validación (Zod), Swagger.
- Application: Casos de uso (UseCases) que coordinan lógica de negocio.
- Domain (Core): Entidades, interfaces de repositorio, Value Objects.
- Infrastructure: Prisma client, repositorios concretos, auth JWT, servicios externos, logging.

### Entidades clave:
- Producto (Inventario)
- Cliente
- Venta y VentaDetalle

### Caso de uso ejemplo
`RegistrarVentaUseCase` crea una venta calculando el total y persistiendo detalles.

---
## 🖥️ Frontend
Stack:
- Vite + React + TypeScript
- Tailwind CSS (paleta Vixo Green con modo claro/oscuro)
- TanStack Query (data fetching / cache)
- Axios (cliente HTTP con interceptor JWT)
- Zustand (estado: autenticación, tema)
- React Router v6 (navegación)
- React Hook Form + Zod (formularios y validación)
- Sonner (notificaciones toast)

### Módulos principales
- Auth (Login con mock API)
- Dashboard (métricas y layout base)
- Inventario (Listado y formulario de productos)
- POS (Carrito interactivo, búsqueda de productos, resumen con IVA)

---
## 📂 Estructura Principal
```
/ (root)
├── requerimiento.md (Guía técnica backend)
├── README.md (este archivo)
├── frontend/
│   ├── src/
│   │   ├── modules/{auth,dashboard,inventario,pos}
│   │   ├── shared/{api,components,hooks,store}
│   │   └── styles/
│   └── public/
└── vi-erp-backend/
    ├── src/
    │   ├── core/{entities,repositories,valueObjects}
    │   ├── application/{useCases,dto}
    │   ├── infrastructure/{database,auth,middlewares,services}
    │   ├── presentation/{routes,controllers,validators}
    │   ├── config/
    │   └── server.ts
    ├── prisma/{schema.prisma,migrations,seed.ts}
```

---
## ⚙️ Requisitos Previos
- Node.js 18+ (ideal 20+)
- PostgreSQL en local (DB: `vi_erp`)
- Yarn o npm (ejemplos usarán npm)

---
## 🔐 Variables de Entorno
Backend (`vi-erp-backend/.env`):
```
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/vi_erp?schema=public"
JWT_SECRET="clave_super_segura"
PORT=3000
```
Frontend (`frontend/.env`):
```
VITE_API_URL=http://localhost:3000/api
```

---
## 🚀 Puesta en Marcha
### 1. Instalar dependencias
```powershell
cd vi-erp-backend
npm install
cd ../frontend
npm install
```

### 2. Migrar y seed de la base de datos
```powershell
cd vi-erp-backend
npm run migrate
npm run seed
```

### 3. Levantar backend
```powershell
cd vi-erp-backend
npm run dev
```
Accesos:
- API base: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`

### 4. Levantar frontend
En otra terminal:
```powershell
cd frontend
npm run dev
```
Frontend: `http://localhost:5173`

---
## 🌐 Endpoints Principales (Backend)
- `POST /api/auth/login` (mock login)
- `GET /api/productos` (lista productos)
- `POST /api/ventas` (registrar venta: { clienteId, productos[] })
- `GET /health` (salud del servidor)

Ejemplo `POST /api/ventas`:
```json
{
  "clienteId": 1,
  "productos": [
    { "id": 1, "cantidad": 2, "precio": 99.99 },
    { "id": 3, "cantidad": 1, "precio": 15.50 }
  ]
}
```

---
## 🛒 Flujo POS (Frontend)
1. Se obtienen productos reales vía `GET /api/productos`.
2. Usuario busca y agrega al carrito.
3. Puede editar cantidades (validación mínima > 0).
4. Subtotal + IVA (18%) + Total se recalculan al vuelo.
5. Al "Cobrar" se envía `POST /api/ventas` con `{ id, cantidad, precio }` por línea.
6. Toast de éxito y vaciado del carrito.

---
## 🔍 Estado y Autenticación
- El token JWT (mock) se almacena en Zustand y se inyecta vía interceptores Axios.
- Respuesta de login incluye token y rol de usuario.
- Al recibir 401 el interceptor fuerza logout y redirige a `/login`.

---
## 🧪 Pruebas Rápidas
Ver `frontend/QUICK_TESTS.md` para pasos y credenciales mock.

Checklist de verificación:
- Login funciona y guarda token.
- Listado de productos carga (revisa red en DevTools).
- Añadir productos al carrito refleja total correctamente.
- Venta se registra (200/201) y muestra toast de éxito.

---
## 🛠️ Desarrollo y Extensión
Recomendaciones para próximas iteraciones:
- Persistencia real de usuarios y roles (reemplazar mock login).
- Manejo de stock en ventas (disminuir stock automáticamente).
- Dashboard con métricas reales (usar endpoints agregados).
- Módulos adicionales: Compras, Contabilidad, Empleados.
- Pruebas unitarias (Jest) para casos de uso y lógica de POS.

---
## 🧭 Roadmap (Resumen)
| Etapa | Estado | Descripción |
|-------|--------|-------------|
| Setup | ✅ | Estructura, DB, migraciones, seed |
| Autenticación | 🚧 | Mock implementado, falta persistencia real |
| Ventas | 🚧 | Endpoint registrar y POS básico operativo |
| Inventario | 🚧 | CRUD productos listo, falta movimientos |
| Dashboard | 🚧 | Layout base, faltan datos reales |
| Extensiones | ⏳ | Compras, Contabilidad, Empleados |

---
## 📄 Licencia / Uso
Proyecto educativo y base para sistemas ERP modulares con Node.js y React. Puedes expandirlo libremente.

---
## 🤝 Contribuir
1. Crear rama feature.
2. Implementar cambios manteniendo capas.
3. Agregar test si aplica.
4. Pull Request con descripción clara.

---
## ❓ Troubleshooting Rápido
| Problema | Posible Causa | Solución |
|----------|---------------|----------|
| 3000 ocupado | Proceso previo | Finalizar proceso (Task Manager) y reiniciar `npm run dev` |
| Error Prisma | DB vacía / URL incorrecta | Revisar `.env` y ejecutar migraciones y seed |
| 401 constante | Token expirado / no enviado | Revisar interceptor y renovar login |
| Productos vacíos | Seed no corrido | Ejecutar `npm run seed` en backend |

---
## 📬 Contacto
Agrega tus datos de autor en `vi-erp-backend/package.json` si deseas publicar o distribuir.

---
¡Listo! Este README resume ambos proyectos y su flujo básico.
