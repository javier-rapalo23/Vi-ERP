# 🧱 Vi-ERP Backend

## 🧭 Introducción

**Vi-ERP** es un sistema ERP modular diseñado con una arquitectura limpia (Clean Architecture) y un enfoque moderno basado en Node.js, Express, Prisma ORM y PostgreSQL. Este backend proporciona una API REST escalable y mantenible para gestionar diferentes módulos de un ERP.

## 🧩 Arquitectura

El proyecto sigue los principios de **Clean Architecture**, separando las responsabilidades en capas bien definidas:

```
┌────────────────────────────┐
│ Presentation Layer         │ → Controladores / Rutas
└──────────────┬─────────────┘
               │
┌──────────────▼─────────────┐
│ Application Layer          │ → UseCases (lógica de negocio)
└──────────────┬─────────────┘
               │
┌──────────────▼─────────────┐
│ Domain Layer               │ → Entidades, interfaces de repositorios
└──────────────┬─────────────┘
               │
┌──────────────▼─────────────┐
│ Infrastructure Layer       │ → Prisma, JWT, logs, servicios externos
└────────────────────────────┘
```

## 📁 Estructura del Proyecto

```
vi-erp-backend/
├── src/
│   ├── core/                    # Capa de dominio
│   │   ├── entities/            # Entidades del negocio
│   │   ├── repositories/        # Interfaces de repositorios
│   │   └── valueObjects/        # Objetos de valor
│   │
│   ├── application/             # Capa de aplicación
│   │   ├── useCases/            # Casos de uso
│   │   └── dto/                 # Data Transfer Objects
│   │
│   ├── infrastructure/          # Capa de infraestructura
│   │   ├── database/
│   │   │   ├── client.ts        # Cliente de Prisma
│   │   │   ├── repositories/    # Implementaciones de repositorios
│   │   │   └── mappers/         # Mapeadores de datos
│   │   ├── auth/                # JWT y autenticación
│   │   ├── middlewares/         # Middlewares Express
│   │   └── services/            # Servicios externos
│   │
│   ├── presentation/            # Capa de presentación
│   │   ├── routes/              # Rutas Express
│   │   ├── controllers/         # Controladores
│   │   └── validators/          # Validaciones Zod
│   │
│   ├── config/                  # Configuración
│   │   ├── env.ts               # Variables de entorno
│   │   └── logger.ts            # Winston logger
│   │
│   └── server.ts                # Punto de entrada
│
├── prisma/
│   └── schema.prisma            # Esquema de base de datos
│
├── logs/                        # Archivos de logs
├── .env                         # Variables de entorno (no versionado)
├── .env.example                 # Ejemplo de variables de entorno
├── package.json
└── tsconfig.json
```

## 🧰 Stack Tecnológico

| Componente | Tecnología |
|-------------|-------------|
| **Lenguaje** | TypeScript (Node.js 20+) |
| **Framework HTTP** | Express |
| **ORM** | Prisma |
| **Base de datos** | PostgreSQL |
| **Validaciones** | Zod |
| **Autenticación** | JWT |
| **Documentación API** | Swagger |
| **Logs** | Winston |
| **Gestión de entornos** | dotenv |

## 🚀 Instalación y Configuración

### 1️⃣ Prerrequisitos

- Node.js 18+ instalado
- PostgreSQL 12+ instalado y ejecutándose
- npm o yarn

### 2️⃣ Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd vi-erp-backend
```

### 3️⃣ Instalar dependencias

```bash
npm install --legacy-peer-deps
```

### 4️⃣ Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
DATABASE_URL="postgresql://postgres:12345@localhost:5432/vi_erp?schema=public"
JWT_SECRET="clave_super_segura_cambiar_en_produccion"
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

### 5️⃣ Configurar la base de datos

Primero, crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE vi_erp;
```

Luego, genera el cliente de Prisma:

```bash
npx prisma generate
```

Y ejecuta las migraciones:
```

### 6️⃣ Iniciar el servidor

**Modo desarrollo** (con hot-reload):
```bash
npm run dev
```

**Modo producción**:
```bash
npm run build
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 Documentación de la API

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

🔗 **http://localhost:3000/docs**

## 🛠️ Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con hot-reload |
| `npm run build` | Compila el proyecto TypeScript a JavaScript |
| `npm start` | Inicia el servidor en modo producción |
| `npm run migrate` | Ejecuta las migraciones de Prisma |
| `npm run studio` | Abre Prisma Studio para visualizar la base de datos |

## 🧪 Endpoints Disponibles

### Ventas

#### POST `/api/ventas`
Registra una nueva venta.

**Request Body:**
```json
{
  "clienteId": 1,
  "productos": [
    {
      "id": 1,
      "cantidad": 2,
      "precio": 100.50
    }
  ]
}
```

**Response:**
```json
{
  "message": "Venta registrada",
  "data": {
    "id": 1,
    "clienteId": 1,
    "total": 201.00,
    "fecha": "2025-11-06T05:18:31.000Z",
    "detalles": [...]
  }
}
```

## 🧩 Módulos Planeados

| Módulo | Entidades | Casos de uso |
|--------|-----------|--------------|
| **Inventario** | Producto, Movimiento | RegistrarEntrada, RegistrarSalida |
| **Ventas** ✅ | Venta, DetalleVenta, Cliente | RegistrarVenta, ObtenerVentas |
| **Compras** | Compra, Proveedor | RegistrarCompra, ListarCompras |
| **Empleados** | Empleado, Rol | CrearEmpleado, CalcularSalario |
| **Contabilidad** | Asiento, Cuenta | RegistrarAsiento, BalanceGeneral |

## 🔒 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación. Los endpoints protegidos requieren el header:

```
Authorization: Bearer <token>
```

## 📊 Base de Datos

### Modelos Principales

- **Cliente**: Información de clientes
- **Producto**: Catálogo de productos
- **Venta**: Registro de ventas
- **VentaDetalle**: Detalle de productos por venta

Para explorar la base de datos visualmente:

```bash
npm run studio
```

Esto abrirá Prisma Studio en `http://localhost:5555`

## 🧰 Herramientas Recomendadas

### Extensiones de VS Code
- Prisma (Prisma ORM)
- ESLint
- Prettier
- REST Client / Thunder Client
- GitLens

### Cliente API
- Postman
- Insomnia
- Thunder Client (VS Code)
- cURL

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté ejecutándose
- Confirma que las credenciales en `.env` sean correctas
- Asegúrate de que la base de datos `vi_erp` exista

### Error: "Prisma Client not found"
- Ejecuta `npx prisma generate`

### Error de dependencias
- Intenta instalar con: `npm install --legacy-peer-deps`

## 📝 Convenciones de Código

- **Naming**: camelCase para variables y funciones, PascalCase para clases
- **Imports**: Utiliza rutas absolutas desde `src/`
- **Tipos**: Siempre define tipos explícitos en TypeScript
- **Errores**: Usa el logger Winston en lugar de `console.log`

## 🚀 Roadmap

- [x] Setup inicial del proyecto
- [x] Módulo de Ventas básico
- [x] Documentación con Swagger
- [ ] Autenticación completa con JWT
- [ ] Módulo de Inventario
- [ ] Módulo de Compras
- [ ] Tests unitarios y de integración
- [ ] Docker y Docker Compose
- [ ] CI/CD con GitHub Actions

## 👥 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es educativo y modular, diseñado como base para ERP escalables con Node.js y PostgreSQL. Puedes expandirlo, adaptarlo o integrarlo con React, Blazor o Angular sin romper la arquitectura.

---

**Desarrollado con ❤️ usando Clean Architecture**