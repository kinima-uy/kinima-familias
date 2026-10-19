import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../lib/brand.jsx";
import { useData } from "../lib/util.js";
import * as api from "../lib/api.js";
import { LogoCentro, temaVars } from "../lib/centro.jsx";
import { Formas, Icon } from "../components/ui.jsx";

/* familias.kinima.uy — entrada general. Normalmente cada familia entra directo con el link de su centro
   (familias.kinima.uy/crecer); esta pantalla sirve si llega sin él. */
export default function Entrada() {
  const { data: centros } = useData(api.getCentros);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();
  const ir = (e) => {
    e.preventDefault();
    const c = codigo.trim().toLowerCase();
    if (!c) return setError("Escribí el código que te dio tu centro.");
    if (!centros?.some((x) => x.slug === c)) return setError("No encontramos un centro con ese código.");
    nav(`/${c}`);
  };
  return (
    <div className="screen entrada">
      <Formas />
      <div className="entrada-in">
        <Logo height={34} />
        <h1>Tu espacio para seguir <em>jugando</em> en casa.</h1>
        <p className="muted">La app de Kinima para familias. Entrá con el código de tu centro.</p>
        <form onSubmit={ir} className="stack" noValidate>
          <label className="field"><span>Código del centro</span>
            <input value={codigo} onChange={(e) => { setCodigo(e.target.value); setError(""); }} placeholder="Ej.: crecer" autoCapitalize="none" aria-invalid={!!error} />
          </label>
          {error && <p className="error" role="alert"><Icon name="alerta" size={16} />{error}</p>}
          <button className="btn btn-navy btn-block">Continuar <Icon name="flecha" size={18} /></button>
        </form>
        {centros && (
          <div className="demo-centros">
            <p className="small-h">Centros de prueba</p>
            {centros.map((c) => (
              <Link key={c.slug} to={`/${c.slug}`} className="centro-pick" style={temaVars(c.tema)}>
                <LogoCentro centro={c} size={40} />
                <span><b>{c.nombre}</b><small>{c.ciudad} · código “{c.slug}”</small></span>
                <Icon name="flecha" size={18} />
              </Link>
            ))}
            <p className="muted small">¿Sos de un centro? Probá cómo se adapta la app: {centros.map((c, i) => <span key={c.slug}>{i ? " · " : ""}<Link to={`/${c.slug}/panel`}>panel de {c.nombre}</Link></span>)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
