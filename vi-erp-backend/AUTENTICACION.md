# Sistema de Autenticación - Vi-ERP

## Cambios Implementados

Se ha migrado el sistema de autenticación de usuarios mock a una implementación real con base de datos.

### Arquitectura

El sistema sigue los principios de Clean Architecture:

1. **Core/Entities** (`Usuario.ts`)
   - Define la entidad Usuario con validaciones de negocio
   - Validación de email, contraseña y roles
   - Métodos para activar/desactivar usuarios

2. **Core/Repositories** (`IUsuarioRepository.ts`)
   - Interfaz que define el contrato del repositorio
   - Operaciones CRUD básicas

3. **Infrastructure** (`UsuarioRepository.ts`)
   - Implementación concreta usando Prisma
   - Mapeo entre la base de datos y las entidades de dominio

4. **Application/UseCases** (`AutenticarUsuarioUseCase.ts`)
   - Lógica de negocio para autenticación
   - Verificación de contraseñas con bcrypt
   - Validación de usuarios activos

5. **Presentation/Controllers** (`AuthController.ts`)
   - Manejo de requests/responses HTTP
   - Generación de tokens JWT
   - Logging de eventos

## Configuración Inicial

### 1. Ejecutar Migraciones

```bash
npm run migrate
```

### 2. Ejecutar Seed

Para crear usuarios de prueba en la base de datos:

```bash
npm run seed
```

Este comando creará los siguientes usuarios:

| Email               | Password   | Role   |
|---------------------|------------|--------|
| admin@vierp.com     | admin123   | admin  |
| cajero@vierp.com    | cajero123  | cajero |
| usuario@vierp.com   | user123    | user   |

### 3. Probar el Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "admin@vierp.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin",
  "user": {
    "id": 1,
    "email": "admin@vierp.com",
    "nombre": "Administrador"
  }
}
```

## Seguridad

- ✅ Las contraseñas se almacenan hasheadas con bcrypt (factor de 10)
- ✅ Autenticación basada en JWT
- ✅ Validación de usuarios activos
- ✅ Mensajes de error genéricos para evitar enumeración de usuarios
- ✅ Logging de eventos de autenticación

## Próximos Pasos

Para mejorar aún más la seguridad:

1. Implementar límite de intentos fallidos
2. Agregar autenticación de dos factores (2FA)
3. Implementar refresh tokens
4. Agregar expiración configurable de tokens
5. Implementar sistema de recuperación de contraseña

## Notas Importantes

- Las contraseñas deben tener al menos 6 caracteres
- Los usuarios inactivos no pueden iniciar sesión
- Los tokens JWT incluyen el ID y el rol del usuario
