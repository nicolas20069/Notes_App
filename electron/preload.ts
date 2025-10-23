import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  // Escucha eventos enviados desde el proceso principal
  on(channel: string, callback: (data: unknown) => void): void {
    ipcRenderer.on(channel, (_event, data) => callback(data));
  },

  // Guarda una nueva nota
  saveNote(note: {
    id: string;
    title: string;
    content: string;
    date: string;
  }): void {
    ipcRenderer.send("save-note", note);
  },

  // Carga una nota individual
  loadNote(id: string): Promise<unknown> {
    return ipcRenderer.invoke("load-note", id);
  },

  // Carga todas las notas
  loadNotes(): Promise<
    Array<{ id: string; title: string; content: string; date: string }>
  > {
    return ipcRenderer.invoke("load-notes");
  },

  // Edita una nota existente
  editNote(note: {
    id: string;
    title: string;
    content: string;
    date: string;
  }): void {
    ipcRenderer.send("edit-note", note);
  },

  // Elimina una nota por ID
  deleteNote(id: string): void {
    ipcRenderer.send("delete-note", id);
  },
});
