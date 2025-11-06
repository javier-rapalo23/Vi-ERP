# 🚀 Vi-ERP - Instrucciones de Configuración Completa

Este documento te guía paso a paso para completar la configuración del proyecto Vi-ERP Backend.

## 📋 Prerrequisitos

Asegúrate de tener instalado:

- ✅ Node.js 18+ ([descargar](https://nodejs.org/))
- ✅ PostgreSQL 12+ ([descargar](https://www.postgresql.org/download/))
- ✅ Git ([descargar](https://git-scm.com/))
- ✅ Editor de código (VS Code recomendado)

## 🔧 Pasos de Configuración

### 1️⃣ Verificar la instalación de Node.js y npm

Abre PowerShell y ejecuta:

```powershell
node --version
npm --version
```

Deberías ver las versiones instaladas.

### 2️⃣ Configurar PostgreSQL

#### Opción A: Usando pgAdmin o interfaz gráfica

1. Abre pgAdmin
2. Conéctate a tu servidor PostgreSQL
3. Clic derecho en "Databases" → "Create" → "Database"
4. Nombre: `vi_erp`
5. Clic en "Save"

#### Opción B: Usando línea de comandos

```powershell
# Conectarse a PostgreSQL (ajusta la ruta según tu instalación)
psql -U postgres

# Dentro de psql:
CREATE DATABASE vi_erp;

# Verificar que se creó:
\l

# Salir:
\q
```

### 3️⃣ Configurar el archivo .env

El archivo `.env` ya está creado en la raíz del proyecto. Verifica y ajusta las credenciales:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/vi_erp?schema=public"
JWT_SECRET="clave_super_segura_cambiar_en_produccion"
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

**⚠️ IMPORTANTE:** Reemplaza `TU_PASSWORD` con la contraseña real de tu usuario PostgreSQL.

### 4️⃣ Ejecutar las migraciones de Prisma

Esto creará las tablas en la base de datos:

```powershell
cd d:\Proyectos\POS\vi-erp-backend
npx prisma migrate dev --name init
```

**Salida esperada:**
```
✔ Generated Prisma Client
✔ The migration has been applied
```

### 5️⃣ Poblar la base de datos con datos de ejemplo (OPCIONAL)

Ejecuta el script de seed para agregar clientes y productos de prueba:

```powershell
npm run seed
```

**Salida esperada:**
```
🌱 Iniciando seed de la base de datos...
✅ Datos anteriores eliminados
✅ 5 clientes creados
✅ 10 productos creados
✅ 2 ventas de ejemplo creadas
🎉 Seed completado exitosamente!
```

### 6️⃣ Iniciar el servidor

```powershell
npm run dev
```

**Salida esperada:**
```
[INFO] ts-node-dev ver. 1.1.8
{"level":"info","message":"🚀 Vi-ERP API corriendo en puerto 3000"}
{"level":"info","message":"📚 Documentación disponible en http://localhost:3000/docs"}
🚀 Vi-ERP API running on port 3000
📚 Docs: http://localhost:3000/docs
```

### 7️⃣ Verificar que todo funciona

Abre tu navegador y accede a:

- **Health Check:** http://localhost:3000/health
- **Documentación Swagger:** http://localhost:3000/docs

Deberías ver:
- Health Check: `{"status":"ok","timestamp":"..."}`
- Swagger: Interfaz interactiva de documentación

## 🧪 Probar la API

### Opción 1: Usando Swagger UI

1. Abre http://localhost:3000/docs
2. Expande el endpoint `POST /api/ventas`
3. Clic en "Try it out"
4. Modifica el JSON de ejemplo
5. Clic en "Execute"

### Opción 2: Usando el archivo test-api.http

Si tienes la extensión **REST Client** en VS Code:

1. Abre el archivo `test-api.http`
2. Haz clic en "Send Request" sobre cualquier petición
3. Verás la respuesta en el panel derecho

### Opción 3: Usando cURL (PowerShell)

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:3000/health"

# Crear una venta
$body = @{
    clienteId = 1
    productos = @(
        @{
            id = 1
            cantidad = 1
            precio = 1299.99
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/ventas" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Opción 4: Usando Postman

1. Abre Postman
2. Crea una nueva petición POST
3. URL: `http://localhost:3000/api/ventas`
4. Headers: `Content-Type: application/json`
5. Body (raw, JSON):
```json
{
  "clienteId": 1,
  "productos": [
    {
      "id": 1,
      "cantidad": 1,
      "precio": 1299.99
    }
  ]
}
```

## 🔍 Explorar la Base de Datos

### Opción 1: Prisma Studio (Recomendado)

```powershell
npm run studio
```

Se abrirá automáticamente en http://localhost:5555

Aquí puedes:
- Ver todos los registros
- Editar datos
- Crear nuevos registros
- Eliminar registros

### Opción 2: pgAdmin

1. Abre pgAdmin
2. Navega a: Servers → PostgreSQL → Databases → vi_erp → Schemas → public → Tables
3. Clic derecho en una tabla → "View/Edit Data" → "All Rows"

### Opción 3: Línea de comandos

```powershell
psql -U postgres -d vi_erp

# Dentro de psql:
SELECT * FROM "Cliente";
SELECT * FROM "Producto";
SELECT * FROM "Venta";
```

## 🛠️ Comandos Útiles

```powershell
# Iniciar servidor en desarrollo
npm run dev

# Compilar TypeScript a JavaScript
npm run build

# Iniciar en producción
npm start

# Ver base de datos en interfaz gráfica
npm run studio

# Ejecutar migraciones
npm run migrate

# Poblar base de datos con datos de prueba
npm run seed

# Resetear base de datos y volver a poblar
npm run db:reset

# Generar cliente de Prisma después de cambios en schema
npx prisma generate

# Ver logs en tiempo real
Get-Content -Path "logs\combined.log" -Wait
```

## 📊 Estructura de una Venta

Una venta se crea con el siguiente formato:

```json
{
  "clienteId": 1,          // ID del cliente (debe existir)
  "productos": [
    {
      "id": 1,             // ID del producto (debe existir)
      "cantidad": 2,       // Cantidad vendida (positivo)
      "precio": 100.50     // Precio unitario (positivo)
    }
  ]
}
```

El sistema automáticamente:
- ✅ Calcula el total de la venta
- ✅ Registra la fecha/hora actual
- ✅ Crea los detalles de venta
- ✅ Valida que los datos sean correctos

## 🐛 Solución de Problemas Comunes

### Error: "Cannot connect to database"

**Causa:** PostgreSQL no está ejecutándose o credenciales incorrectas.

**Solución:**
1. Verifica que PostgreSQL esté ejecutándose (Servicios de Windows)
2. Verifica las credenciales en `.env`
3. Intenta conectarte manualmente con pgAdmin

### Error: "Prisma Client not found"

**Causa:** El cliente de Prisma no se ha generado.

**Solución:**
```powershell
npx prisma generate
```

### Error: "Port 3000 already in use"

**Causa:** Otro proceso está usando el puerto 3000.

**Solución 1 - Cambiar puerto:**
```env
# En .env
PORT=3001
```

**Solución 2 - Detener el otro proceso:**
```powershell
# Encontrar el proceso
netstat -ano | findstr :3000

# Detener el proceso (reemplaza PID con el número mostrado)
taskkill /PID <PID> /F
```

### Error al ejecutar migrations: "relation already exists"

**Causa:** Las tablas ya existen en la base de datos.

**Solución:**
```powershell
# Opción 1: Resetear la base de datos
npm run db:reset

# Opción 2: Eliminar y recrear la base de datos
psql -U postgres
DROP DATABASE vi_erp;
CREATE DATABASE vi_erp;
\q

# Luego ejecutar las migraciones
npx prisma migrate dev --name init
```

## 🎯 Próximos Pasos

Una vez que todo esté funcionando:

1. ✅ **Explora la API** con Swagger
2. ✅ **Crea algunas ventas** de prueba
3. ✅ **Revisa los logs** en `logs/combined.log`
4. ✅ **Estudia el código** siguiendo la arquitectura limpia
5. ✅ **Agrega nuevos endpoints** (productos, clientes, etc.)
6. ✅ **Implementa autenticación** con JWT
7. ✅ **Agrega tests** unitarios y de integración

## 📚 Recursos Adicionales

- [Documentación de Prisma](https://www.prisma.io/docs/)
- [Express.js](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Validation](https://zod.dev/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 💬 ¿Necesitas Ayuda?

Si encuentras problemas:

1. Revisa los **logs** en `logs/combined.log`
2. Verifica los **errores en consola**
3. Consulta la sección de **Solución de Problemas** arriba
4. Revisa la **documentación** de las tecnologías usadas

---

**¡Buena suerte con tu proyecto Vi-ERP! 🚀**
