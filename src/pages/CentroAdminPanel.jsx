import { useState } from "react";
import * as apiCentroAdmin from "../lib/apiCentroAdmin.js";
import { useAuthCentroAdmin } from "../lib/authCentroAdmin.jsx";
import { TEMAS } from "../data/centros.js";
import { Logo } from "../lib/brand.jsx";
import { Loading, ErrorBox, PageHead, Icon } from "../components/ui.jsx";
import { fecha, useData } from "../lib/util.js";

const ETIQUETAS = ["Aviso", "Novedad", "Comunidad", "Bienvenida"];
const CHIP = { Aviso: "t-coral", Novedad: "t-teal", Comunidad: "t-yellow", Bienvenida: "t-teal" };

function isoLocal(date) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function FormCentro({ centro, onGuardado }) {
  const [f, setF] = useState({
    nombre: centro.nombre, nombreCorto: centro.nombreCorto, tema: centro.tema, bienvenida: centro.bienvenida || "",
    direccion: centro.direccion || "", horarios: centro.horarios || "", telefono: centro.telefono || "", whatsapp: centro.whatsapp || "", emailContacto: centro.emailContacto || "",
  });
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const guardar = async (e) => {
    e.preventDefault(); setGuardando(true);
    try { await apiCentroAdmin.actualizarCentro(f); setGuardado(true); setTimeout(() => setGuardado(false), 2200); onGuardado(); }
    finally { setGuardando(false); }
  };

  return (
    <form className="card stack" onSubmit={guardar}>
      <h2 className="card-h">Identidad del centro</h2>
      <label className="field"><span>Nombre</span><input value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></label>
      <label className="field"><span>Nombre corto</span><input value={f.nombreCorto} maxLength={40} onChange={(e) => setF({ ...f, nombreCorto: e.target.value })} /></label>
      <fieldset className="field"><legend>Color de acento</legend>
        <div className="temas">
          {Object.entries(TEMAS).map(([k, t]) => (
            <label key={k} className={f.tema === k ? "on" : ""}>
              <input type="radio" name="tema" checked={f.tema === k} onChange={() => setF({ ...f, tema: k })} />
              <span className="sw" style={{ background: t.acc }} aria-hidden="true" />{t.nombre}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field"><span>Mensaje de bienvenida</span><textarea rows="3" value={f.bienvenida} onChange={(e) => setF({ ...f, bienvenida: e.target.value })} /></label>
      <h2 className="card-h">Contacto</h2>
      <label className="field"><span>Dirección</span><input value={f.direccion} onChange={(e) => setF({ ...f, direccion: e.target.value })} /></label>
      <label className="field"><span>Horarios</span><input value={f.horarios} onChange={(e) => setF({ ...f, horarios: e.target.value })} placeholder="Lunes a viernes · 8:00 a 19:00" /></label>
      <label className="field"><span>Teléfono</span><input value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} /></label>
      <label className="field"><span>WhatsApp</span><input value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} /></label>
      <label className="field"><span>Mail de contacto</span><input type="email" value={f.emailContacto} onChange={(e) => setF({ ...f, emailContacto: e.target.value })} /></label>
      <div className="row-end">{guardado && <span className="saved"><Icon name="ok" size={16} />Guardado</span>}<button className="btn btn-navy sm" disabled={guardando}>Guardar cambios</button></div>
    </form>
  );
}

function PanelNoticias({ noticias, onCambio }) {
  const [n, setN] = useState({ titulo: "", cuerpo: "", etiqueta: "Aviso", fijada: false });
  const [pub, setPub] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const publicar = async (e) => {
    e.preventDefault(); if (!n.titulo.trim() || !n.cuerpo.trim()) return;
    setEnviando(true);
    try { await apiCentroAdmin.publicarNoticia(n); setPub(true); setTimeout(() => setPub(false), 2200); setN({ titulo: "", cuerpo: "", etiqueta: "Aviso", fijada: false }); await onCambio(); }
    finally { setEnviando(false); }
  };
  const borrar = async (id) => { await apiCentroAdmin.borrarNoticia(id); await onCambio(); };

  return (
    <form className="card stack" onSubmit={publicar}>
      <h2 className="card-h">Publicar una noticia</h2>
      <label className="field"><span>Título</span><input value={n.titulo} onChange={(e) => setN({ ...n, titulo: e.target.value })} placeholder="Ej.: Cambio de horario el viernes" /></label>
      <label className="field"><span>Texto</span><textarea rows="3" value={n.cuerpo} onChange={(e) => setN({ ...n, cuerpo: e.target.value })} placeholder="Lo que necesitan saber las familias" /></label>
      <div className="two">
        <label className="field"><span>Etiqueta</span><select value={n.etiqueta} onChange={(e) => setN({ ...n, etiqueta: e.target.value })}>{ETIQUETAS.map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="field"><span>&nbsp;</span><label className="chk"><input type="checkbox" checked={n.fijada} onChange={(e) => setN({ ...n, fijada: e.target.checked })} />Destacar</label></label>
      </div>
      <div className="row-end">{pub && <span className="saved"><Icon name="ok" size={16} />Publicada</span>}<button className="btn btn-navy sm" disabled={!n.titulo.trim() || !n.cuerpo.trim() || enviando}>Publicar</button></div>
      <ul className="admin-list">
        {!noticias.length && <li className="muted small">Todavía no publicaste ninguna noticia.</li>}
        {noticias.map((x) => (
          <li key={x.id}>
            <span><span className={`pill ${CHIP[x.etiqueta] || "t-teal"}`}>{x.etiqueta}</span> <b>{x.titulo}</b><small className="muted">{fecha(x.fecha)}{x.fijada ? " · destacada" : ""}</small></span>
            <button type="button" className="link-btn" onClick={() => borrar(x.id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </form>
  );
}

function PanelEventos({ eventos, onCambio }) {
  const [e, setE] = useState({ titulo: "", lugar: "", detalle: "", fecha: "" });
  const [creado, setCreado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const crear = async (ev) => {
    ev.preventDefault(); if (!e.titulo.trim() || !e.fecha) return;
    setEnviando(true);
    try { await apiCentroAdmin.crearEvento({ ...e, fecha: new Date(e.fecha).toISOString() }); setCreado(true); setTimeout(() => setCreado(false), 2200); setE({ titulo: "", lugar: "", detalle: "", fecha: "" }); await onCambio(); }
    finally { setEnviando(false); }
  };
  const borrar = async (id) => { await apiCentroAdmin.borrarEvento(id); await onCambio(); };

  return (
    <form className="card stack" onSubmit={crear}>
      <h2 className="card-h">Calendario de actividades</h2>
      <label className="field"><span>Título</span><input value={e.titulo} onChange={(ev) => setE({ ...e, titulo: ev.target.value })} placeholder="Ej.: Taller para familias" /></label>
      <div className="two">
        <label className="field"><span>Fecha y hora</span><input type="datetime-local" value={e.fecha} onChange={(ev) => setE({ ...e, fecha: ev.target.value })} /></label>
        <label className="field"><span>Lugar</span><input value={e.lugar} onChange={(ev) => setE({ ...e, lugar: ev.target.value })} /></label>
      </div>
      <label className="field"><span>Detalle (opcional)</span><textarea rows="2" value={e.detalle} onChange={(ev) => setE({ ...e, detalle: ev.target.value })} /></label>
      <div className="row-end">{creado && <span className="saved"><Icon name="ok" size={16} />Creado</span>}<button className="btn btn-navy sm" disabled={!e.titulo.trim() || !e.fecha || enviando}>Agregar al calendario</button></div>
      <ul className="admin-list">
        {!eventos.length && <li className="muted small">No hay próximos eventos.</li>}
        {eventos.map((x) => (
          <li key={x.id}>
            <span><b>{x.titulo}</b><small className="muted">{fecha(x.fecha, { day: "numeric", month: "long" })}{x.lugar ? ` · ${x.lugar}` : ""}</small></span>
            <button type="button" className="link-btn" onClick={() => borrar(x.id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </form>
  );
}

export default function CentroAdminPanel() {
  const { centroAdmin, salir } = useAuthCentroAdmin();
  const { data: centro, error, loading, reload } = useData(() => apiCentroAdmin.getCentro(), []);

  if (loading && !centro) return <Loading />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  if (!centro) return null;

  return (
    <div className="panel-screen">
      <header className="panel-top">
        <Logo height={26} />
        <span className="panel-tag">Panel del centro · {centroAdmin?.displayName}</span>
        <button className="btn btn-line sm" onClick={salir}>Cerrar sesión</button>
      </header>
      <PageHead eyebrow="Panel del centro" title={centro.nombre} />
      <div className="panel-grid">
        <div className="panel-col"><FormCentro centro={centro} onGuardado={reload} /></div>
        <div className="panel-col">
          <PanelNoticias noticias={centro.noticias} onCambio={reload} />
          <PanelEventos eventos={centro.eventos} onCambio={reload} />
        </div>
      </div>
    </div>
  );
}
