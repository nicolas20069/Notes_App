import { useEffect } from "react";
import { useAtom } from "jotai";
import { markdownAtom } from "./state"; // Estado global para el contenido Markdown
import ReactMarkdown from "react-markdown"; // Renderiza Markdown como HTML
import "./index.css"; // Tailwind y estilos base

function App() {
  const [markdown, setMarkdown] = useAtom(markdownAtom); // Hook para leer y actualizar el contenido

  useEffect(() =>{
    window.ipcRenderer.loadNote().then((note: string) => {
      setMarkdown(note);
    })
  }, [])
  return (
    <div className="h-screen grid grid-cols-2">
      {/* Editor de Markdown */}
      <div className="p-4 bg-white border-r">
        <h2 className="text-xl font-bold mb-2">Editor</h2>
        <textarea
          className="w-full h-[80%] p-2 border rounded resize-none"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder= "Escribe tu nota..."
        />
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => window.ipcRenderer.saveNote(markdown)}
        >
          Guardar nota
        </button>
      </div>

      {/* Vista previa Markdown */}
      <div className="p-4 bg-gray-100 overflow-auto">
        <h2 className="text-xl font-bold mb-2">Vista previa</h2>
        <div className="prose max-w-none">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default App;
