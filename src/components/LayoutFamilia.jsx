import { NavLink, Outlet } from "react-router-dom";
import { Logo } from "../lib/brand.jsx";
import { useAuthFamilia } from "../lib/authFamilia.jsx";
import { usePaciente } from "../lib/paciente.jsx";
import { Icon } from "./ui.jsx";

/* Selector de hijo/a: solo aparece si la familia tiene más de uno vinculado. Vive acá (no en
   cada página) para que el hijo elegido se mantenga al cambiar de Inicio a Mensajes. */
function SelectorHijos() {
  const { pacientes, actual, setActual } = usePaciente();
  if (!pacientes || pacientes.length < 2) return null;
  return (
    <div className="familia-tabs familia-tabs-top" role="tablist" aria-label="Elegir hijo/a">
      {pacientes.map((p) => (
        <button key={p.id} role="tab" aria-selected={actual === p.id} onClick={() => setActual(p.id)}>
          {p.etiqueta}
          {p.sinLeer > 0 && <span className="badge">{p.sinLeer}</span>}
        </button>
      ))}
    </div>
  );
}

export default function LayoutFamilia() {
  const { salir } = useAuthFamilia();
  const { totalSinLeer } = usePaciente();

  return (
    <div className="app app-familia">
      <a className="skip" href="#main">Saltar al contenido</a>
      <header className="topbar">
        <Logo height={24} />
        <span className="sb-tag">App para familias</span>
        <button className="icon-btn" onClick={salir} aria-label="Cerrar sesión" title="Cerrar sesión"><Icon name="salir" /></button>
      </header>
      <SelectorHijos />
      <main id="main" tabIndex="-1" className="familia-main">
        <Outlet />
      </main>
      <nav className="familia-nav" aria-label="Navegación principal">
        <NavLink to="/" end>
          <Icon name="casa" size={22} />
          <span>Inicio</span>
        </NavLink>
        <NavLink to="/mensajes">
          <Icon name="mensaje" size={22} />
          <span>Mensajes</span>
          {totalSinLeer > 0 && <span className="badge familia-nav-badge">{totalSinLeer > 9 ? "9+" : totalSinLeer}</span>}
        </NavLink>
        <NavLink to="/centro">
          <Icon name="noticia" size={22} />
          <span>Centro</span>
        </NavLink>
      </nav>
    </div>
  );
}
