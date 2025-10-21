"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  // Permite escuchar eventos desde el proceso principal. Ejemplo: `window.ipcRenderer.on('note-saved', callback)`
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  // Permite dejar de escuchar eventos.
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  // Envía mensajes al proceso principal. Ejemplo: `window.ipcRenderer.send('save-note', note)`
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  // Envía mensajes y espera una respuesta. Ideal para operaciones asincrónicas como leer archivos o guardar notas.
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  saveNote(note) {
    electron.ipcRenderer.send("save-note", note);
  }
});
