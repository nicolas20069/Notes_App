import { ipcRenderer, contextBridge } from "electron";
// `ipcRenderer` permite enviar mensajes al proceso principal.
// `contextBridge` permite exponer funciones al frontend sin romper el aislamiento.

// Expone un objeto llamado `ipcRenderer` en `window`, accesible desde React.
contextBridge.exposeInMainWorld("ipcRenderer", {
  // Permite escuchar eventos desde el proceso principal. Ejemplo: `window.ipcRenderer.on('note-saved', callback)`
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },

  // Permite dejar de escuchar eventos.
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },

  // Envía mensajes al proceso principal. Ejemplo: `window.ipcRenderer.send('save-note', note)`
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },

  // Envía mensajes y espera una respuesta. Ideal para operaciones asincrónicas como leer archivos o guardar notas.
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // Guarda la nota echa 
  saveNote(note: string){
    ipcRenderer.send('save-note', note);
  },

  // devuleve la ultima nota
  loadNote(){
    return ipcRenderer.invoke('load-note')
  }
});
