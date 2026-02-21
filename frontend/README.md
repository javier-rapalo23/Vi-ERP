# 🟢 Vixo - Sistema de Gestión Comercial

Frontend del sistema Vixo construido con React + TypeScript + Vite.

## 🎨 Identidad de Marca

**Color Principal:** Vixo Green (`#22C55E`) - Un verde vibrante que representa crecimiento y eficiencia.

### 📚 Recursos de Diseño:
- **[VIXO_COLORS.md](./VIXO_COLORS.md)** - Guía completa de paleta de colores, estados, y ejemplos de uso
- **[VIXO_COMPONENTS_EXAMPLES.md](./VIXO_COMPONENTS_EXAMPLES.md)** - Componentes listos para copiar/pegar

### Paleta Rápida:
```tsx
// Verde Primary (escala completa 50-950)
bg-vixo-500 → #22C55E (Primary)
bg-vixo-600 → #16A34A (Hover)

// Acentos
bg-vixo-amber → #F59E0B (Promociones)
bg-vixo-blue → #3B82F6 (Info)
bg-vixo-purple → #A855F7 (Premium)
```

## 🚀 Stack Tecnológico

- **React 18** con TypeScript
- **Vite** - Build tool ultrarrápido
- **TailwindCSS** - Styling con clases utilitarias
- **React Query** - Gestión de estado del servidor
- **Zustand** - Gestión de estado cliente
- **React Router** - Enrutamiento

## 📦 Instalación

```bash
npm install
```

## 🔧 Desarrollo

```bash
npm run dev
```

## 🏗️ Build de Producción

```bash
npm run build
```

---

## ⚙️ Configuración Técnica

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
