import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useCentro, LogoCentro } from "../lib/centro.jsx";
import { useSesion } from "../lib/auth.jsx";
import { USING_MOCK } from "../lib/api.js";
import { Icon } from "./ui.jsx";

const COLORES = { coral: "var(--coral)", yellow: "var(--yellow)", teal: "var(--teal)" };

export default function Shell() {
  const centro = useCentro();
  const { familia, hijo, elegirHijo, slug } = useSesion();
  const loc = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);
  const tabs = [
    ["inicio", "Inicio", "inicio"],
    ["progreso", "Progreso", "progreso"],
    ...(centro.modulos.mensajes ? [["mensajes", "Mensajes", "mensajes"]] : []),
    ["centro", centro.nombreCorto, "centro"],
  ];
  return (
    <div className="screen app">
      <header className="top">
        <NavLink to={`/${slug}/centro`} className="top-centro" aria-label={`Ir a ${centro.nombre}`}><LogoCentro centro={centro} size={36} /><span>{centro.nombreCorto}</span></NavLink>
        {familia.hijos.length > 1 ? (
          <div className="hijos" role="group" aria-label="Elegir hijo o hija">
            {familia.hijos.map((h) => (
              <button key={h.id} type="button" aria-pressed={h.id === hijo.id} onClick={() => elegirHijo(h.id)} style={{ "--c": COLORES[h.color] }}>
                <span className="av" aria-hidden="true">{h.nombre[0]}</span>{h.nombre}
              </button>
            ))}
          </div>
        ) : <span className="hijo-uno"><span className="av" style={{ "--c": COLORES[hijo.color] }} aria-hidden="true">{hijo.nombre[0]}</span>{hijo.nombre}</span>}
        <NavLink to={`/${slug}/perfil`} className="icon-btn" aria-label="Mi cuenta"><Icon name="usuario" /></NavLink>
      </header>
      {USING_MOCK && <p className="demo-band">Versión de diseño con datos de prueba</p>}
      <main className="main"><Outlet /></main>
      <nav className="tabbar" aria-label="Secciones">
        {tabs.map(([to, t, i]) => <NavLink key={to} to={`/${slug}/${to}`}><Icon name={i} /><span>{t}</span></NavLink>)}
      </nav>
    </div>
  );
}
