# Variables de Entorno para Railway

## Copia estas variables en la pestaña "Variables" de tu servicio en Railway

# ========================================
# REQUERIDAS
# ========================================

# Base de datos - Usar referencia al servicio de PostgreSQL
# En Railway: Click en la variable → "Add Reference" → Selecciona Postgres → DATABASE_URL
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Secret - Genera una clave segura única
# Puedes generar una con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=cambiar_por_clave_segura_generada_aleatoriamente

# URL del Frontend (para CORS)
# Ejemplo: https://tu-frontend.vercel.app
FRONTEND_URL=https://tu-dominio-frontend.com

# Entorno (Railway lo configura automáticamente como production)
NODE_ENV=production

# ========================================
# OPCIONALES
# ========================================

# OpenAI API Key - Solo si usas reconocimiento de imágenes con IA
# Obtén tu key en: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-tu-api-key-aqui

# Puerto - Railway lo asigna automáticamente, normalmente no necesitas configurarlo
# PORT=3000

# ========================================
# NOTAS IMPORTANTES
# ========================================

# 1. DATABASE_URL se configura automáticamente si tienes PostgreSQL en el mismo proyecto
#    Solo usa la referencia: ${{Postgres.DATABASE_URL}}

# 2. Nunca compartas estas variables en repositorios públicos o capturas de pantalla

# 3. Para generar un JWT_SECRET seguro en Railway CLI:
#    railway run node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Railway permite agregar múltiples FRONTEND_URLs separándolas por comas:
#    FRONTEND_URL=https://app.com,https://admin.app.com

# ========================================
# VERIFICACIÓN
# ========================================

# Después de configurar las variables, verifica el deploy:
# 1. Revisa los logs para errores
# 2. Prueba el endpoint: https://tu-proyecto.up.railway.app/health
# 3. Revisa la documentación: https://tu-proyecto.up.railway.app/docs
