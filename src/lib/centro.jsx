/* Contexto del centro (tenant): carga la configuración del centro según la dirección
   (familias.kinima.uy/<centro>) y aplica su color de acento sobre el diseño de Kinima. */
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as api from "./api.js";
import { TEMAS } from "../data/centros.js";

const Ctx = createContext(null);
const Refresh = createContext(() => {});
export const useCentro = () => useContext(Ctx);
export const useRecargarCentro = () => useContext(Refresh);

export function temaVars(tema) {
  const t = TEMAS[tema] || TEMAS.teal;
  return { "--acc": t.acc, "--acc-soft": t.soft, "--acc-text": t.text };
}

export function CentroProvider({ children, fallback, error }) {
  const { centro: slug } = useParams();
  const [state, set] = useState({ centro: null, error: null });
  const [v, setV] = useState(0);
  useEffect(() => {
    let ok = true;
    if (!v) set({ centro: null, error: null });
    api.getCentro(slug).then((c) => ok && set({ centro: c, error: null })).catch((e) => ok && set({ centro: null, error: e }));
    return () => { ok = false; };
  }, [slug, v]);
  useEffect(() => {
    if (!state.centro) return;
    const vars = temaVars(state.centro.tema);
    Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    document.title = `${state.centro.nombreCorto} · Kinima Familias`;
  }, [state.centro]);
  if (state.error) return error(state.error);
  if (!state.centro) return fallback;
  return <Refresh.Provider value={() => setV((x) => x + 1)}><Ctx.Provider value={state.centro}>{children}</Ctx.Provider></Refresh.Provider>;
}

/* Logo del centro: la imagen que sube el centro o, si no tiene, sus iniciales en su color. */
export function LogoCentro({ centro, size = 44 }) {
  const t = TEMAS[centro.tema] || TEMAS.teal;
  if (centro.logo) return <img src={centro.logo} alt={centro.nombre} style={{ width: size, height: size, borderRadius: size / 3, objectFit: "cover" }} />;
  return (
    <span className="logo-centro" style={{ width: size, height: size, background: t.acc, color: centro.tema === "amarillo" ? "#19324A" : "#fff", fontSize: size * 0.38 }} aria-hidden="true">
      {centro.iniciales}
    </span>
  );
}
