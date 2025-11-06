# 🧱 Vi-ERP – Guía Técnica Backend (Clean Architecture + Node.js + PostgreSQL)

## 🧭 Introducción

**Vi-ERP** es un sistema ERP modular diseñado con una arquitectura limpia (Clean Architecture) y un enfoque moderno basado en Node.js, Express, Prisma ORM y PostgreSQL.  
Este documento guía paso a paso la estructura, configuración y flujo interno del backend.

---

## 🧩 Objetivo técnico

Construir una API modular, mantenible y escalable que sirva como núcleo del sistema ERP, con las siguientes características:

- Clean Architecture (separación total de capas)
- Base de datos PostgreSQL con Prisma ORM
- Casos de uso (Use Cases) para la lógica de negocio
- Validación de datos con Zod
- Autenticación con JWT
- Documentación con Swagger
- Modularidad por dominio (ventas, inventario, compras, contabilidad, empleados)

---

## 🧠 Arquitectura general

### Capas principales

┌────────────────────────────┐
│ Presentation Layer │ → Controladores / Rutas
└──────────────┬─────────────┘
│
┌──────────────▼─────────────┐
│ Application Layer │ → UseCases (lógica de negocio)
└──────────────┬─────────────┘
│
┌──────────────▼─────────────┐
│ Domain Layer │ → Entidades, interfaces de repositorios
└──────────────┬─────────────┘
│
┌──────────────▼─────────────┐
│ Infrastructure Layer │ → Prisma, JWT, logs, servicios externos
└────────────────────────────┘

yaml
Copiar código

---

## ⚙️ Estructura de carpetas

/Vi-ERP
├── /src
│ ├── /core
│ │ ├── /entities
│ │ ├── /repositories
│ │ └── /valueObjects
│ │
│ ├── /application
│ │ ├── /useCases
│ │ └── /dto
│ │
│ ├── /infrastructure
│ │ ├── /database
│ │ │ ├── prisma/
│ │ │ ├── repositories/
│ │ │ └── mappers/
│ │ ├── /auth
│ │ ├── /middlewares
│ │ └── /services
│ │
│ ├── /presentation
│ │ ├── /routes
│ │ ├── /controllers
│ │ └── /validators
│ │
│ ├── /config
│ │ ├── env.ts
│ │ └── logger.ts
│ │
│ └── server.ts
│
├── package.json
├── tsconfig.json
└── .env

yaml
Copiar código

---

## 🧰 Stack principal

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

---

## 🚀 Configuración inicial

### 1️⃣ Crear el proyecto

```bash
mkdir Vi-ERP
cd Vi-ERP
npm init -y
npm i express zod jsonwebtoken bcrypt dotenv cors swagger-ui-express winston
npm i -D typescript ts-node-dev @types/express @types/jsonwebtoken @types/cors @types/node
npx tsc --init
2️⃣ Instalar Prisma y PostgreSQL
bash
Copiar código
npm i prisma @prisma/client
npx prisma init
.env

env
Copiar código
DATABASE_URL="postgresql://postgres:12345@localhost:5432/vi_erp?schema=public"
JWT_SECRET="clave_super_segura"
PORT=3000
3️⃣ Crear estructura de carpetas
bash
Copiar código
mkdir -p src/{core/{entities,repositories,valueObjects},application/{useCases,dto},infrastructure/{database/{prisma,repositories,mappers},auth,middlewares,services},presentation/{routes,controllers,validators},config}
🧩 Prisma – modelo inicial
/src/infrastructure/database/prisma/schema.prisma

prisma
Copiar código
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Producto {
  id       Int      @id @default(autoincrement())
  nombre   String
  codigo   String   @unique
  precio   Float
  costo    Float
  stock    Int      @default(0)
  createdAt DateTime @default(now())
}

model Cliente {
  id       Int      @id @default(autoincrement())
  nombre   String
  telefono String?
}

model Venta {
  id         Int      @id @default(autoincrement())
  clienteId  Int
  total      Float
  fecha      DateTime @default(now())
  cliente    Cliente  @relation(fields: [clienteId], references: [id])
  detalles   VentaDetalle[]
}

model VentaDetalle {
  id           Int      @id @default(autoincrement())
  ventaId      Int
  productoId   Int
  cantidad     Int
  precioUnit   Float
  venta        Venta     @relation(fields: [ventaId], references: [id])
  producto     Producto  @relation(fields: [productoId], references: [id])
}
bash
Copiar código
npx prisma migrate dev --name init
🧠 Ejemplo de flujo completo – Caso de uso RegistrarVenta
🧱 Entidad (Dominio)
/src/core/entities/Venta.ts

ts
Copiar código
export class Venta {
  constructor(
    public clienteId: number,
    public productos: { id: number; cantidad: number; precio: number }[]
  ) {}

  calcularTotal(): number {
    return this.productos.reduce((acc, p) => acc + p.cantidad * p.precio, 0);
  }
}
📘 Repositorio (Interfaz)
/src/core/repositories/IVentaRepository.ts

ts
Copiar código
import { Venta } from "../entities/Venta";

export interface IVentaRepository {
  create(venta: Venta): Promise<any>;
}
🧩 Implementación concreta
/src/infrastructure/database/repositories/VentaRepository.ts

ts
Copiar código
import { prisma } from "../prisma/client";
import { IVentaRepository } from "../../../core/repositories/IVentaRepository";
import { Venta } from "../../../core/entities/Venta";

export class VentaRepository implements IVentaRepository {
  async create(venta: Venta) {
    const total = venta.calcularTotal();
    return prisma.venta.create({
      data: {
        clienteId: venta.clienteId,
        total,
        detalles: {
          createMany: {
            data: venta.productos.map(p => ({
              productoId: p.id,
              cantidad: p.cantidad,
              precioUnit: p.precio,
            })),
          },
        },
      },
      include: { detalles: true },
    });
  }
}
⚙️ Caso de uso (Application)
/src/application/useCases/ventas/RegistrarVentaUseCase.ts

ts
Copiar código
import { VentaRepository } from "../../../infrastructure/database/repositories/VentaRepository";
import { Venta } from "../../../core/entities/Venta";

export class RegistrarVentaUseCase {
  constructor(private ventaRepo = new VentaRepository()) {}

  async execute(data: { clienteId: number; productos: any[] }) {
    const venta = new Venta(data.clienteId, data.productos);
    return await this.ventaRepo.create(venta);
  }
}
🌐 Controlador (Presentation)
/src/presentation/controllers/VentaController.ts

ts
Copiar código
import { Request, Response } from "express";
import { RegistrarVentaUseCase } from "../../application/useCases/ventas/RegistrarVentaUseCase";

export const crearVenta = async (req: Request, res: Response) => {
  try {
    const useCase = new RegistrarVentaUseCase();
    const result = await useCase.execute(req.body);
    res.status(201).json({ message: "Venta registrada", data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
🛣️ Ruta Express
/src/presentation/routes/ventaRoutes.ts

ts
Copiar código
import { Router } from "express";
import { crearVenta } from "../controllers/VentaController";

const router = Router();
router.post("/", crearVenta);

export default router;
🚀 Servidor principal
/src/server.ts

ts
Copiar código
import express from "express";
import cors from "cors";
import ventaRoutes from "./presentation/routes/ventaRoutes";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ventas", ventaRoutes);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Vi-ERP API running on port ${process.env.PORT}`)
);
🔐 Autenticación (JWT)
/src/infrastructure/auth/jwt.ts

ts
Copiar código
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generarToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "8h" });
}

export function verificarToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
/src/infrastructure/middlewares/authMiddleware.ts

ts
Copiar código
import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../auth/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = verificarToken(token);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Token inválido" });
  }
}
📊 Swagger (documentación)
/src/presentation/routes/swagger.ts

ts
Copiar código
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Vi-ERP API", version: "1.0.0" },
  },
  apis: ["./src/presentation/routes/*.ts"],
};

const swaggerSpec = swaggerJsDoc(options);
export { swaggerSpec, swaggerUi };
Agregar en server.ts:

ts
Copiar código
import { swaggerSpec, swaggerUi } from "./presentation/routes/swagger";
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
🧩 Módulos iniciales recomendados
Módulo	Entidades	Casos de uso
Inventario	Producto, Movimiento	RegistrarEntrada, RegistrarSalida
Ventas	Venta, DetalleVenta, Cliente	RegistrarVenta, ObtenerVentas, DetalleVenta
Compras	Compra, Proveedor	RegistrarCompra, ListarCompras
Empleados	Empleado, Rol	CrearEmpleado, CalcularSalario
Contabilidad	Asiento, Cuenta	RegistrarAsiento, BalanceGeneral

🧰 Extensiones recomendadas para VS Code
Prisma (Prisma ORM)

REST Client o Thunder Client

ESLint + Prettier

GitLens

Docker (opcional)

Code Runner o RunJS

Material Icon Theme

🧩 Scripts recomendados
package.json

json
Copiar código
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "migrate": "prisma migrate dev",
    "studio": "prisma studio"
  }
}
🧭 Roadmap Backend
Etapa	Meta
✅ 1. Setup	Configurar entorno, DB, ORM y servidor
🚧 2. Autenticación	Usuarios, roles, JWT
🚧 3. Módulo Ventas	Endpoints CRUD + validación Zod
🚧 4. Módulo Inventario	Movimientos automáticos
🚧 5. Compras + Contabilidad	Integraciones y reportes
⏳ 6. Dashboard	Endpoints resumen para frontend

🧩 Licencia
Proyecto educativo y modular, diseñado como base para ERP escalables con Node.js y PostgreSQL.
Puedes expandirlo, adaptarlo o integrarlo con React, Blazor o Angular sin romper la arquitectura.