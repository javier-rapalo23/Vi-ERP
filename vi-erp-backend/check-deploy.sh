#!/bin/bash

# Script de verificación pre-deploy para Railway
echo "🔍 Verificando configuración para Railway..."

# Verificar que existe package.json
if [ ! -f "package.json" ]; then
    echo "❌ No se encontró package.json"
    exit 1
fi
echo "✅ package.json encontrado"

# Verificar que existe prisma schema
if [ ! -f "src/infrastructure/database/prisma/schema.prisma" ]; then
    echo "❌ No se encontró schema.prisma"
    exit 1
fi
echo "✅ schema.prisma encontrado"

# Verificar que existe tsconfig
if [ ! -f "tsconfig.json" ]; then
    echo "❌ No se encontró tsconfig.json"
    exit 1
fi
echo "✅ tsconfig.json encontrado"

# Verificar scripts necesarios
echo "📦 Verificando scripts de package.json..."
if grep -q '"build"' package.json && grep -q '"start"' package.json; then
    echo "✅ Scripts de build y start encontrados"
else
    echo "❌ Faltan scripts necesarios en package.json"
    exit 1
fi

# Verificar archivos de configuración de Railway
if [ -f "railway.json" ]; then
    echo "✅ railway.json encontrado"
else
    echo "⚠️  railway.json no encontrado (opcional)"
fi

if [ -f "nixpacks.toml" ]; then
    echo "✅ nixpacks.toml encontrado"
else
    echo "⚠️  nixpacks.toml no encontrado (opcional)"
fi

# Verificar que no hay .env en el repo
if [ -f ".env" ] && ! grep -q ".env" .gitignore; then
    echo "⚠️  ADVERTENCIA: .env existe y puede no estar en .gitignore"
    echo "   Asegúrate de no subir variables de entorno sensibles al repositorio"
fi

echo ""
echo "✅ Verificación completada!"
echo ""
echo "📋 Checklist antes de hacer deploy:"
echo "  1. Commit y push de todos los cambios"
echo "  2. Crear base de datos PostgreSQL en Railway"
echo "  3. Configurar variables de entorno en Railway:"
echo "     - DATABASE_URL (referencia desde Postgres)"
echo "     - JWT_SECRET (genera una clave segura)"
echo "     - FRONTEND_URL (URL de tu frontend)"
echo "     - OPENAI_API_KEY (si usas IA)"
echo "  4. Conectar repositorio en Railway"
echo "  5. Establecer Root Directory: vi-erp-backend"
echo "  6. Deploy automático se iniciará"
echo ""
echo "📚 Consulta RAILWAY_DEPLOY.md para más detalles"
