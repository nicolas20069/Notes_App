import Store from "electron-store";

import { app, BrowserWindow, ipcMain } from "electron";
// Importa las APIs principales de Electron: `app` para controlar el ciclo de vida de la app, y `BrowserWindow` para crear ventanas.

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
// Estas utilidades permiten trabajar con rutas en proyectos ESM. `createRequire` permite usar `require()` en módulos ES.

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Simula `__dirname` en ESM, ya que no está disponible por defecto. Esto es útil para construir rutas absolutas.

// Define la raíz del proyecto como variable de entorno. Se usa para construir rutas más adelante.
process.env.APP_ROOT = path.join(__dirname, "..");


export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
// Esta variable se define automáticamente por Vite en modo desarrollo. Si existe, se usa para cargar el frontend desde el servidor local.

export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
// Rutas de los archivos compilados: `dist-electron` para el proceso principal, `dist` para el frontend React.

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;
// Define la ruta pública para íconos y otros assets. En desarrollo usa `/public`, en producción usa `/dist`.

let win: BrowserWindow | null;
// Variable global para guardar la ventana principal.

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    // Ícono de la ventana, útil para mostrar en la barra de tareas.

    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      // Carga el script `preload.mjs` que expone APIs seguras al frontend.
    },
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
    // Envía un mensaje al frontend cuando la ventana termina de cargar. Útil para pruebas o sincronización.
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    // En desarrollo, carga el frontend desde el servidor de Vite.
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
    // En producción, carga el archivo HTML compilado.
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

const store = new Store();
// Canal para guardar una nota
ipcMain.on("save-note", (event, noteContent: string) => {
  store.set("note", noteContent);
  console.log("Nota Guardada:", noteContent);
});

