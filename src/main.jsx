import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthFamiliaProvider, RequireFamilia } from "./lib/authFamilia.jsx";
import LayoutFamilia from "./components/LayoutFamilia.jsx";
import FamiliaLogin from "./pages/FamiliaLogin.jsx";
import FamiliaInicio from "./pages/FamiliaInicio.jsx";
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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthFamiliaProvider>
      <Router>
        <Routes>
          <Route path="/ingresar" element={<FamiliaLogin />} />
          <Route element={<RequireFamilia><LayoutFamilia /></RequireFamilia>}>
            <Route path="/" element={<FamiliaInicio />} />
          </Route>
        </Routes>
      </Router>
    </AuthFamiliaProvider>
  </StrictMode>
);
