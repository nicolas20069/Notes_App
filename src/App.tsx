import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { markdownAtom, notesAtom, selectedNoteAtom } from "./state";
import ReactMarkdown from "react-markdown";
import toast, { Toaster } from "react-hot-toast";
import "./index.css";

function App() {
  const [markdown, setMarkdown] = useAtom(markdownAtom);
  const [notes, setNotes] = useAtom(notesAtom);
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);
  const [status, setStatus] = useState("");

  // 🗑️ Eliminar nota
  const handleDelete = (id: string) => {
    window.api.deleteNote(id);
    const updatedNotes = notes.filter((note) => note?.id !== id);
    setNotes(updatedNotes);

    if (selectedNote === id) {
      setSelectedNote('');
      setMarkdown('');
    }

    toast.success(" Nota eliminada correctamente.", {
      duration: 4000,
      icon: '🗑️',
    });
  };

  // 📥 Cargar notas al iniciar
  useEffect(() => {
    window.api.loadNotes().then((loadedNotes) => {
      const validNotes = Array.isArray(loadedNotes)
        ? loadedNotes.filter((note) => note && note.id && note.title)
        : [];

      setNotes(validNotes);

      if (validNotes.length > 0) {
        const firstNote = validNotes[0];
        setSelectedNote(firstNote.id);
        setMarkdown(firstNote.content);
      } else {
        setSelectedNote('');
        setMarkdown('');
      }
    });
  }, []);

  return (
    <div className="h-screen grid grid-cols-4 bg-gray-50 text-gray-800">
      <Toaster position="bottom-right" />

      {/* 🗂️ Panel lateral */}
      <div className="col-span-1 bg-gray-100 p-4 overflow-y-auto border-r">
        <h2 className="text-xl font-bold mb-4">Notas guardadas</h2>
        {Array.isArray(notes) && notes.length > 0 ? (
          notes
            .filter((note) => note && note.id)
            .map((note) => (
              <div
                key={note.id}
                className={`p-4 mb-4 rounded-lg shadow-md cursor-pointer transition-all ${selectedNote === note.id
                  ? "bg-blue-100 border border-blue-400"
                  : "bg-white"
                  }`}
                onClick={() => {
                  setSelectedNote(note.id);
                  setMarkdown(note.content);
                  toast(`✏️ Editando: ${note.title}`);
                }}
              >
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{note.date}</p>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNote(note.id);
                      setMarkdown(note.content);
                      toast(`✏️ Editando: ${note.title}`);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-500">No hay notas guardadas aún.</p>
        )}
      </div>

      {/* 📝 Editor */}
      <div className="col-span-2 p-6 bg-white">
        <h2 className="text-xl font-bold mb-4">Editor</h2>

        <button
          className="mb-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => {
            setSelectedNote('');
            setMarkdown('');
            toast("🆕 Nueva nota lista para escribir.");
          }}
        >
          ➕ Nueva nota
        </button>

        <textarea
          className="w-full h-[70%] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Escribe tu nota..."
        />

        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => {
            if (!markdown.trim()) {
              toast.error("⚠️ No puedes guardar una nota vacía.");
              return;
            }

            const title = markdown.split("\n")[0]?.slice(0, 30) || "Sin título";
            const date = new Date().toLocaleString();

            if (selectedNote) {
              const currentNote = notes.find((note) => note?.id === selectedNote);
              if (currentNote) {
                const updatedNote = { id: currentNote.id, title, content: markdown, date };
                window.api.editNote(updatedNote);
                setNotes(notes.map((note) =>
                  note?.id === selectedNote ? updatedNote : note
                ));
                toast.success("✅ Nota actualizada.");
                return;
              }
            }

            const newNote = { id: crypto.randomUUID(), title, content: markdown, date };
            window.api.saveNote(newNote);
            setNotes((prev) => [...prev, newNote]);
            setSelectedNote(newNote.id);
            toast.success("✅ Nota guardada.");
          }}
        >
          {selectedNote ? "Actualizar nota" : "Guardar nota"}
        </button>

        <button
          className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={() => {
            const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "notas.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          📤 Exportar notas
        </button>

        {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
      </div>

      {/* 👁️ Vista previa */}
      <div className="col-span-1 p-6 bg-gray-100 overflow-auto">
        <h2 className="text-xl font-bold mb-4">Vista previa</h2>
        <div className="prose max-w-none bg-white p-4 rounded-lg shadow-sm">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

console.log("app cargada");
export default App;