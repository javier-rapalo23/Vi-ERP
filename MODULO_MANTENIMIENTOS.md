# Módulo de Mantenimientos - Vi-ERP

## Resumen

Se ha creado exitosamente el módulo de **Mantenimientos** que incluye la gestión completa de:
- ✅ **Usuarios**
- ✅ **Roles**
- ✅ **Permisos**
- ✅ **Asignaciones** (usuarios-roles y roles-permisos)

## Archivos Creados

### Backend

#### Repositorios
- `vi-erp-backend/src/infrastructure/database/repositories/RoleRepository.ts`
- `vi-erp-backend/src/infrastructure/database/repositories/PermissionRepository.ts`
- `vi-erp-backend/src/infrastructure/database/repositories/UserRoleRepository.ts`

#### Controladores
- `vi-erp-backend/src/presentation/controllers/RoleController.ts`
- `vi-erp-backend/src/presentation/controllers/PermissionController.ts`
- `vi-erp-backend/src/presentation/controllers/UserController.ts`

#### Rutas
- `vi-erp-backend/src/presentation/routes/roleRoutes.ts`
- `vi-erp-backend/src/presentation/routes/permissionRoutes.ts`
- `vi-erp-backend/src/presentation/routes/userRoutes.ts`

#### Modificados
- `vi-erp-backend/src/server.ts` - Agregadas las rutas de mantenimientos

### Frontend

#### Servicios API
- `frontend/src/modules/mantenimientos/services/users.api.ts`
- `frontend/src/modules/mantenimientos/services/roles.api.ts`
- `frontend/src/modules/mantenimientos/services/permissions.api.ts`

#### Páginas
- `frontend/src/modules/mantenimientos/pages/MantenimientosIndex.tsx`
- `frontend/src/modules/mantenimientos/pages/UsersList.tsx`
- `frontend/src/modules/mantenimientos/pages/UserForm.tsx`
- `frontend/src/modules/mantenimientos/pages/RolesList.tsx`
- `frontend/src/modules/mantenimientos/pages/RoleForm.tsx`
- `frontend/src/modules/mantenimientos/pages/PermissionsList.tsx`
- `frontend/src/modules/mantenimientos/pages/PermissionForm.tsx`

#### Modificados
- `frontend/src/app/router.tsx` - Agregadas las rutas de mantenimientos
- `frontend/src/shared/components/Navbar.tsx` - Agregado enlace a Mantenimientos

## Endpoints API

### Usuarios
- `GET /api/users` - Listar usuarios con roles
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario
- `POST /api/users/:id/roles` - Asignar roles a usuario

### Roles
- `GET /api/roles` - Listar roles con permisos
- `GET /api/roles/:id` - Obtener rol por ID
- `POST /api/roles` - Crear rol
- `PUT /api/roles/:id` - Actualizar rol
- `DELETE /api/roles/:id` - Eliminar rol (soft delete)
- `POST /api/roles/:id/permissions` - Asignar permisos a rol

### Permisos
- `GET /api/permissions` - Listar permisos
- `GET /api/permissions/:id` - Obtener permiso por ID
- `POST /api/permissions` - Crear permiso
- `PUT /api/permissions/:id` - Actualizar permiso
- `DELETE /api/permissions/:id` - Eliminar permiso

## Rutas Frontend

- `/mantenimientos` - Página principal de mantenimientos
- `/mantenimientos/usuarios` - Listado de usuarios
- `/mantenimientos/usuarios/nuevo` - Crear usuario
- `/mantenimientos/usuarios/:id/editar` - Editar usuario
- `/mantenimientos/roles` - Listado de roles
- `/mantenimientos/roles/nuevo` - Crear rol
- `/mantenimientos/roles/:id/editar` - Editar rol
- `/mantenimientos/permisos` - Listado de permisos
- `/mantenimientos/permisos/nuevo` - Crear permiso
- `/mantenimientos/permisos/:id/editar` - Editar permiso

## Características Implementadas

### Usuarios
- ✅ CRUD completo de usuarios
- ✅ Asignación múltiple de roles
- ✅ Hash de contraseñas con bcrypt
- ✅ Validación de email único
- ✅ Estado activo/inactivo
- ✅ Visualización de roles asignados

### Roles
- ✅ CRUD completo de roles
- ✅ Asignación múltiple de permisos
- ✅ Descripción opcional
- ✅ Soft delete (desactivación)
- ✅ Visualización de permisos asignados

### Permisos
- ✅ CRUD completo de permisos
- ✅ Descripción opcional
- ✅ Nombre único

## Notas Importantes

1. **Base de datos**: El schema de Prisma ya incluía las tablas necesarias (User, Role, Permission, UserRole, RolePermission)

2. **Protección**: Todas las rutas de mantenimientos están protegidas y solo accesibles para usuarios con rol "admin"

3. **Modo oscuro**: Todas las páginas del módulo son compatibles con el tema oscuro

4. **Validación**: Se utiliza Zod para validación en formularios

5. **Toast notifications**: Se muestran notificaciones de éxito/error en todas las operaciones

## Próximos Pasos Sugeridos

1. Ejecutar migraciones de Prisma si es necesario
2. Probar los endpoints del backend
3. Crear algunos permisos iniciales
4. Crear roles con permisos asignados
5. Crear usuarios y asignarles roles

## Comandos Útiles

```bash
# Backend
cd vi-erp-backend
npm run dev

# Frontend
cd frontend
npm run dev
```
