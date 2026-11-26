import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthFamiliaProvider, RequireFamilia } from "./lib/authFamilia.jsx";
import { AuthCentroAdminProvider, RequireCentroAdmin } from "./lib/authCentroAdmin.jsx";
import { PacienteProvider } from "./lib/paciente.jsx";
import LayoutFamilia from "./components/LayoutFamilia.jsx";
import FamiliaLogin from "./pages/FamiliaLogin.jsx";
import FamiliaInicio from "./pages/FamiliaInicio.jsx";
import FamiliaMensajes from "./pages/FamiliaMensajes.jsx";
import FamiliaCentro from "./pages/FamiliaCentro.jsx";
import CentroAdminLogin from "./pages/CentroAdminLogin.jsx";
import CentroAdminPanel from "./pages/CentroAdminPanel.jsx";
import "./styles.css";

/* En la web publicada (familias.kinima.uy) se usa BrowserRouter. La vista previa usa MemoryRouter. */
const Router = import.meta.env.VITE_PREVIEW ? MemoryRouter : BrowserRouter;

/* App instalable (PWA): el manifest va acá (no en un <script> suelto de index.html) porque el CSP
   del backend solo permite scripts propios del bundle. */
const link = document.createElement("link");
link.rel = "manifest";
link.href = "/manifest-familia.webmanifest";
document.head.appendChild(link);
document.head.insertAdjacentHTML(
  "beforeend",
  '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Kinima">'
);

/* Service worker: habilita la instalación como PWA y las notificaciones push (ver
   src/lib/push.js y public/sw.js). En la vista previa (sin dominio propio) no hay beneficio y
   algunos entornos de preview no sirven /sw.js, así que solo se registra en la web publicada. */
if ("serviceWorker" in navigator && !import.meta.env.VITE_PREVIEW) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* si falla (navegador viejo, http sin TLS en desarrollo), la app sigue funcionando igual,
         solo sin notificaciones push ni instalación */
    });
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthFamiliaProvider>
      <AuthCentroAdminProvider>
        <Router>
          <Routes>
            <Route path="/ingresar" element={<FamiliaLogin />} />
            <Route element={<RequireFamilia><PacienteProvider><LayoutFamilia /></PacienteProvider></RequireFamilia>}>
              <Route path="/" element={<FamiliaInicio />} />
              <Route path="/mensajes" element={<FamiliaMensajes />} />
              <Route path="/centro" element={<FamiliaCentro />} />
            </Route>
            <Route path="/centro-admin/ingresar" element={<CentroAdminLogin />} />
            <Route path="/centro-admin" element={<RequireCentroAdmin><CentroAdminPanel /></RequireCentroAdmin>} />
          </Routes>
        </Router>
      </AuthCentroAdminProvider>
    </AuthFamiliaProvider>
  </StrictMode>
);
