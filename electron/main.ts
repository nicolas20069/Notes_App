import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Store from "electron-store";

//" Corrige __dirname para entornos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//" Instancia de almacenamiento local
const store = new Store();

//" Crea la ventana principal
function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: join(__dirname, "preload.js"), // Carga el bridge seguro
    },
  });

  //" Carga el HTML generado por Vite
  win.loadFile(join(__dirname, "../dist-renderer/index.html"));
}

//" Guarda una nueva nota
ipcMain.on("save-note", (_event, note) => {
  if (!note || !note.id || !note.title) return;

  const notes = store.get("notes") || [];
  const filtered = (notes as any[]).filter((n) => n && n.id);
  store.set("notes", [...filtered, note]);

  console.log(" 👍 Nota guardada:", note);
});

//" Edita una nota existente
ipcMain.on("edit-note", (_event, updatedNote) => {
  const notes = store.get("notes") || [];
  const filtered = (notes as any[]).filter((n) => n && n.id);
  const newNotes = filtered.map((note) =>
    note.id === updatedNote.id ? updatedNote : note
  );
  store.set("notes", newNotes);

  console.log("✏️ Nota actualizada:", updatedNote);
});

//" Elimina una nota por ID
ipcMain.on("delete-note", (_event, id) => {
  const notes = store.get("notes") || [];
  const filtered = (notes as any[]).filter((note) => note && note.id !== id);
  store.set("notes", filtered);

  console.log("🗑️ Nota eliminada:", id);
});

//" Carga todas las notas válidas
ipcMain.handle("load-notes", () => {
  const notes = store.get("notes");
  const validNotes = Array.isArray(notes)
    ? notes.filter((note) => note && note.id && note.content)
    : [];

  console.log("📥 Notas cargadas:", validNotes.length);
  return validNotes;
});

//" Inicia la app cuando esté lista
app.whenReady().then(createWindow);
