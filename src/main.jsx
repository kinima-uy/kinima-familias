import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, MemoryRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, RequireFamilia } from "./lib/auth.jsx";
import { CentroProvider } from "./lib/centro.jsx";
import { Cargando } from "./components/ui.jsx";
import Shell from "./components/Shell.jsx";
import Entrada from "./pages/Entrada.jsx";
import Login from "./pages/Login.jsx";
import Inicio from "./pages/Inicio.jsx";
import Progreso from "./pages/Progreso.jsx";
import Mensajes from "./pages/Mensajes.jsx";
import Centro, { Noticia } from "./pages/Centro.jsx";
import Perfil from "./pages/Perfil.jsx";
import Panel from "./pages/Panel.jsx";
import "./styles.css";

/* familias.kinima.uy/<centro>/...  → cada centro tiene su propio espacio dentro de la misma app. */
const Router = import.meta.env.VITE_PREVIEW ? MemoryRouter : BrowserRouter;
const NoCentro = () => <div className="screen entrada"><div className="entrada-in"><h1>No encontramos ese centro</h1><p className="muted">Revisá el link que te pasó tu centro.</p><Link className="btn btn-navy" to="/">Volver</Link></div></div>;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Entrada />} />
          <Route path="/:centro/*" element={
            <CentroProvider fallback={<Cargando />} error={() => <NoCentro />}>
              <Routes>
                <Route index element={<Login />} />
                <Route path="panel" element={<Panel />} />
                <Route element={<RequireFamilia><Shell /></RequireFamilia>}>
                  <Route path="inicio" element={<Inicio />} />
                  <Route path="progreso" element={<Progreso />} />
                  <Route path="mensajes" element={<Mensajes />} />
                  <Route path="centro" element={<Centro />} />
                  <Route path="centro/noticias/:id" element={<Noticia />} />
                  <Route path="perfil" element={<Perfil />} />
                  <Route path="*" element={<Navigate to="inicio" replace />} />
                </Route>
              </Routes>
            </CentroProvider>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
