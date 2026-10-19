import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCentro, LogoCentro } from "../lib/centro.jsx";
import { useSesion } from "../lib/auth.jsx";
import { Logo } from "../lib/brand.jsx";
import { Icon } from "../components/ui.jsx";

export default function Perfil() {
  const c = useCentro();
  const { familia, salir, slug } = useSesion();
  const nav = useNavigate();
  const [rec, setRec] = useState(true);
  const [horaRec, setHoraRec] = useState("18:00");
  return (
    <div className="page">
      <h1 className="page-h">Mi cuenta</h1>
      <section className="card">
        <p className="small-h">{familia.nombre}</p>
        <p className="muted">{familia.email}</p>
        <ul className="hijos-list">
          {familia.hijos.map((h) => <li key={h.id}><span className="av" style={{ "--c": `var(--${h.color})` }} aria-hidden="true">{h.nombre[0]}</span>{h.nombre} · {h.edad} años</li>)}
        </ul>
      </section>
      <section className="card">
        <h2 className="card-h"><Icon name="campana" size={20} />Recordatorio diario</h2>
        <label className="switch"><input type="checkbox" checked={rec} onChange={(e) => setRec(e.target.checked)} /><span>Avisarme los días que toca jugar</span></label>
        {rec && <label className="field"><span>Hora</span><input type="time" value={horaRec} onChange={(e) => setHoraRec(e.target.value)} /></label>}
      </section>
      <section className="card mi-centro">
        <LogoCentro centro={c} size={44} />
        <div><b>{c.nombre}</b><small className="muted">Tu centro</small></div>
        <Link className="link-btn" to={`/${slug}/centro`}>Ver</Link>
      </section>
      <button className="btn btn-line btn-block" onClick={() => { salir(); nav(`/${slug}`); }}><Icon name="salir" size={18} />Cerrar sesión</button>
      <div className="powered"><span>Kinima Familias</span><Logo height={20} /></div>
    </div>
  );
}
