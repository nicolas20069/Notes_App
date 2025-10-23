/// archivo principal, para poder recopilar y lanzar la App
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Use contextBridge
window.api.on("main-process-message", (message: string) => {
  console.log("Mensaje desde el proceso principal:", message);
});
