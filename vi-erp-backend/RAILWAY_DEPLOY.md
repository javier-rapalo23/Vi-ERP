# 🚀 Guía de Despliegue en Railway

Esta guía te ayudará a desplegar el backend de Vi-ERP en Railway con PostgreSQL.

## 📋 Prerrequisitos

- Cuenta en [Railway](https://railway.app)
- Repositorio Git con el código
- API Key de OpenAI (opcional, para reconocimiento de imágenes)

---

## 🗄️ Paso 1: Crear Base de Datos PostgreSQL

### Opción A: Desde Railway Dashboard

1. **Accede a Railway** → https://railway.app
2. **Crea un nuevo proyecto** → "New Project"
3. **Selecciona "Provision PostgreSQL"**
4. Railway creará automáticamente una base de datos PostgreSQL
5. Anota las credenciales que se generan automáticamente

### Opción B: Agregar PostgreSQL a proyecto existente

1. En tu proyecto de Railway
2. Click en **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway asignará automáticamente la variable `DATABASE_URL`

---

## 🔧 Paso 2: Configurar el Servicio de Backend

### Desde GitHub

1. En Railway, click **"+ New"** → **"GitHub Repo"**
2. Selecciona tu repositorio **Vi-ERP**
3. Railway detectará automáticamente que es un proyecto Node.js

### Configuración del Root Directory

Si tu backend está en una subcarpeta:
1. Ve a **Settings** del servicio
2. En **"Root Directory"** pon: `vi-erp-backend`
3. Guarda los cambios

---

## 🔐 Paso 3: Configurar Variables de Entorno

En la pestaña **"Variables"** de tu servicio, agrega:

### Variables Requeridas

```env
# Railway asigna automáticamente DATABASE_URL si tienes PostgreSQL en el mismo proyecto
# Si no, agrega manualmente:
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Secret (Genera uno seguro)
JWT_SECRET=tu_clave_jwt_super_segura_aqui_123456

# Puerto (Railway lo asigna automáticamente, pero puedes especificarlo)
PORT=3000

# Entorno
NODE_ENV=production
```

### Variables Opcionales

```env
# Solo si usas reconocimiento de imágenes con IA
OPENAI_API_KEY=sk-tu-api-key-de-openai
```

### 💡 Conectar Base de Datos Automáticamente

Railway permite referenciar variables entre servicios:

1. Click en la variable `DATABASE_URL`
2. Selecciona **"Reference"** → **"PostgreSQL Service"** → **`DATABASE_URL`**
3. Esto creará la referencia: `${{Postgres.DATABASE_URL}}`

---

## 🏗️ Paso 4: Configurar Build y Deploy

Railway detectará automáticamente los archivos de configuración:
- `railway.json` ✅ (ya creado)
- `nixpacks.toml` ✅ (ya creado)
- `Procfile` ✅ (ya creado)

### Verificar Configuración

En **Settings** → **Deploy**:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run migrate:deploy && npm start`

Estos comandos ejecutarán:
1. Instalación de dependencias
2. Generación del cliente Prisma
3. Compilación TypeScript
4. Migraciones de base de datos
5. Inicio del servidor

---

## 🚀 Paso 5: Hacer Deploy

### Primera vez

1. Railway iniciará el deploy automáticamente al detectar el repositorio
2. Monitorea los logs en la pestaña **"Deployments"**
3. Espera a que termine (puede tomar 2-5 minutos)

### Verificar que funcionó

Si todo está bien, verás en los logs:
```
🚀 Vi-ERP API running on port 3000
📚 Docs: http://...
```

---

## 🌐 Paso 6: Obtener URL Pública

1. Ve a **Settings** → **Networking**
2. Click en **"Generate Domain"**
3. Railway generará una URL como: `https://tu-proyecto.up.railway.app`
4. Copia esta URL para usarla en el frontend

---

## 🔄 Paso 7: Ejecutar Migraciones y Seed

### Opción A: Con Railway CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link al proyecto
railway link

# Ejecutar migraciones
railway run npm run migrate:deploy

# Ejecutar seed (opcional)
railway run npm run seed
```

### Opción B: Desde el Dashboard

Las migraciones se ejecutan automáticamente en cada deploy gracias al comando:
```bash
npm run migrate:deploy && npm start
```

---

## 🔗 Paso 8: Conectar Frontend

Actualiza la URL del backend en tu frontend:

**En `frontend/.env`:**

```env
VITE_API_URL=https://tu-proyecto.up.railway.app/api
```

---

## 📊 Monitoreo y Debugging

### Ver Logs en Tiempo Real

1. En Railway Dashboard → **"Deployments"**
2. Click en el deploy activo
3. Verás los logs en tiempo real

### Comandos Útiles

```bash
# Ver logs
railway logs

# Conectar a la base de datos
railway connect postgres

# Ejecutar comandos en el servidor
railway run <comando>

# Ver variables de entorno
railway variables
```

---

## ⚠️ Troubleshooting

### Error: "Cannot find module 'prisma'"

**Solución**: Asegúrate de que `prisma` está en `dependencies`, no solo en `devDependencies`.

### Error: "Database URL not found"

**Solución**: Verifica que `DATABASE_URL` está configurada en las variables de entorno.

### Error: "Port already in use"

**Solución**: Railway asigna el puerto automáticamente. Asegúrate de usar `process.env.PORT`.

### Las migraciones no se aplican

**Solución**: 
1. Verifica que el start command incluye `npm run migrate:deploy`
2. O ejecuta manualmente: `railway run npm run migrate:deploy`

---

## 🎯 Checklist Final

- [ ] PostgreSQL creado en Railway
- [ ] Servicio de backend creado y conectado al repo
- [ ] Variables de entorno configuradas (`DATABASE_URL`, `JWT_SECRET`)
- [ ] Build exitoso (verde en Deployments)
- [ ] Migraciones ejecutadas
- [ ] URL pública generada
- [ ] Frontend actualizado con la nueva URL
- [ ] Seed ejecutado (si es necesario)
- [ ] API funcionando (prueba con `GET /health`)

---

## 🔐 Seguridad Post-Deploy

1. **Cambia JWT_SECRET** a un valor seguro único
2. **No compartas** las variables de entorno en repositorios públicos
3. **Activa CORS** solo para tu dominio de frontend
4. **Revisa** los logs regularmente

---

## 💰 Costos

Railway ofrece:
- **Plan Free**: $5 de crédito gratis mensual
- **Plan Pro**: ~$5-20/mes dependiendo del uso

Para un proyecto pequeño/mediano, el plan Free suele ser suficiente.

---

## 📚 Recursos Adicionales

- [Railway Docs](https://docs.railway.app)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Prisma con Railway](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)

---

## ✅ ¡Listo!

Tu backend ahora está desplegado en Railway y listo para producción. 🎉

**URL de la API**: `https://tu-proyecto.up.railway.app`
**Docs**: `https://tu-proyecto.up.railway.app/docs`
