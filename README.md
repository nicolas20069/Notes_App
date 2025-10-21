# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list



///////////////////////////////////////////////////////////////////////////

TECNOLOGIAS USADAS:
- Electron + React + TypeScript + Tailwind + Jotai



🧱 Estructura base del proyecto:

Actividad-Note-App/
├── src/                  ← React + TS frontend
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
├── electron/             ← Lógica de Electron
│   ├── main.ts           ← Crea ventana
│   ├── preload.ts        ← Comunicación segura
├── tailwind.config.cjs
├── postcss.config.cjs
├── package.json

* se instalo "npm install electron-store" para que este paquete guarde datos en un archivo JSON local. 
* - ipcMain.on(...): Escucha mensajes desde el frontend
- 'save-note': Nombre del canal que usaremos desde React
- noteContent: El contenido que se envía desde el editor
- store.set(...): Guarda la nota en disco bajo la clave 'note'




☣️ PROBLEMAS PRESENTES Y OBSERVACIONES:

- En el video se usa contextlsolation: false, pero ahora Electron exige contextlsolation: true por seguridad. (Asegurarse de usar preload.ts para exponer APIs seguras del renderer).

- Problema para inciar Tailwind al usar "npx tailwindcss init -p", este problema ocurre por un cambio importante en Tailwind CSS v4.x, que ya no incluye el CLI tradicional (tailwindcss/lib/cli.js). Por eso npx tailwindcss init -p y el intento de ejecutar el CLI directamente fallan.

🧠 ¿Qué está pasando?
Tailwind v4 se ha rediseñado para funcionar principalmente como un plugin de PostCSS, y ya no expone el CLI como antes. Por eso no puedes usar npx tailwindcss init -p ni acceder a lib/cli.js.

- el proyecto al usar "type:module" en el package.json, hace que los archivos .js se interpreten como modulos ES, es por eso que no se puede usar module.exports, ya que es propio de CommonJS.
Por lo tanto se requieren reenombrar algunos archivos, ejemplo:  tailwind.config.js  --> tailwind.config.cjs


 