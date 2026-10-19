import { useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../lib/api.js";
import { useCentro, useRecargarCentro, LogoCentro, temaVars } from "../lib/centro.jsx";
import { TEMAS } from "../data/centros.js";
import { Logo } from "../lib/brand.jsx";
import { Icon, Formas } from "../components/ui.jsx";
import { fecha } from "../lib/util.js";

/*
 * PANEL DEL CENTRO (demo). Es lo que usa el administrador de cada centro para adaptar la app a su centro,
 * como en Moodle. En el producto final vive dentro del portal profesional (portal.kinima.uy → "Mi centro"),
 * solo para administradores. Acá está para poder probar cómo cambia la app.
 */
const MODULOS = [["mensajes", "Mensajes con el equipo"], ["noticias", "Noticias"], ["eventos", "Eventos"], ["recursos", "Guías y recursos"], ["equipo", "Equipo"]];
const ETIQUETAS = ["Aviso", "Novedad", "Comunidad", "Bienvenida"];

export default function Panel() {
  const c = useCentro();
  const recargar = useRecargarCentro();
  const [f, setF] = useState({ nombre: c.nombre, nombreCorto: c.nombreCorto, bienvenida: c.bienvenida, tema: c.tema, iniciales: c.iniciales });
  const [guardado, setGuardado] = useState(false);
  const [n, setN] = useState({ titulo: "", resumen: "", etiqueta: "Aviso", fijada: false });
  const [pub, setPub] = useState("");

  const guardar = async (e) => { e.preventDefault(); await api.actualizarCentro(c.slug, f); recargar(); setGuardado(true); setTimeout(() => setGuardado(false), 2200); };
  const toggle = async (k) => { await api.actualizarCentro(c.slug, { modulos: { ...c.modulos, [k]: !c.modulos[k] } }); recargar(); };
  const subirLogo = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = async () => { await api.actualizarCentro(c.slug, { logo: r.result }); recargar(); };
    r.readAsDataURL(file);
  };
  const quitarLogo = async () => { await api.actualizarCentro(c.slug, { logo: null }); recargar(); };
  const publicar = async (e) => {
    e.preventDefault(); if (!n.titulo.trim() || !n.resumen.trim()) return;
    await api.publicarNoticia(c.slug, n); recargar(); setPub(n.titulo); setN({ titulo: "", resumen: "", etiqueta: "Aviso", fijada: false });
  };
  const borrar = async (id) => { await api.borrarNoticia(c.slug, id); recargar(); };
  const prev = { ...c, ...f };

  return (
    <div className="panel-screen">
      <header className="panel-top">
        <Logo height={26} />
        <span className="panel-tag">Panel del centro · demo</span>
        <Link className="btn btn-navy sm" to={`/${c.slug}`}>Ver la app <Icon name="flecha" size={16} /></Link>
      </header>
      <p className="panel-note"><Icon name="alerta" size={16} />En el producto final este panel va dentro del portal profesional, solo para quien administra el centro. Los cambios de esta demo se pierden al recargar.</p>

      <div className="panel-grid">
        <div className="panel-col">
          <form className="card stack" onSubmit={guardar}>
            <h2 className="card-h">Identidad del centro</h2>
            <label className="field"><span>Nombre</span><input value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></label>
            <div className="two">
              <label className="field"><span>Nombre corto (menú)</span><input value={f.nombreCorto} maxLength={14} onChange={(e) => setF({ ...f, nombreCorto: e.target.value })} /></label>
              <label className="field"><span>Iniciales</span><input value={f.iniciales} maxLength={3} onChange={(e) => setF({ ...f, iniciales: e.target.value.toUpperCase() })} /></label>
            </div>
            <div className="field"><span>Logo</span>
              <div className="logo-row">
                <LogoCentro centro={prev} size={56} />
                <label className="btn btn-line sm file"><input type="file" accept="image/*" onChange={subirLogo} />Subir imagen</label>
                {c.logo && <button type="button" className="link-btn" onClick={quitarLogo}>Quitar</button>}
              </div>
            </div>
            <fieldset className="field"><legend>Color de acento</legend>
              <div className="temas">
                {Object.entries(TEMAS).map(([k, t]) => (
                  <label key={k} className={f.tema === k ? "on" : ""}>
                    <input type="radio" name="tema" checked={f.tema === k} onChange={() => setF({ ...f, tema: k })} />
                    <span className="sw" style={{ background: t.acc }} aria-hidden="true" />{t.nombre}
                  </label>
                ))}
              </div>
              <small className="muted">Solo colores de la paleta Kinima, para que la app siga siendo accesible y reconocible.</small>
            </fieldset>
            <label className="field"><span>Mensaje de bienvenida</span><textarea rows="3" value={f.bienvenida} onChange={(e) => setF({ ...f, bienvenida: e.target.value })} /></label>
            <div className="row-end">{guardado && <span className="saved"><Icon name="ok" size={16} />Guardado</span>}<button className="btn btn-navy sm">Guardar cambios</button></div>
          </form>

          <section className="card stack">
            <h2 className="card-h">Secciones de la app</h2>
            <p className="muted small">Cada centro elige qué secciones ven sus familias.</p>
            {MODULOS.map(([k, t]) => (
              <label key={k} className="switch"><input type="checkbox" checked={!!c.modulos[k]} onChange={() => toggle(k)} /><span>{t}</span></label>
            ))}
          </section>
        </div>

        <div className="panel-col">
          <section className="card preview" style={temaVars(prev.tema)} aria-label="Vista previa">
            <p className="small-h muted">Así lo ven las familias</p>
            <div className="prev-phone">
              <div className="prev-top"><Formas variante="b" /><div className="prev-in"><LogoCentro centro={prev} size={48} /><b>{prev.nombre}</b><span>{prev.bienvenida}</span></div></div>
              <div className="prev-btn">Entrar</div>
            </div>
          </section>

          <form className="card stack" onSubmit={publicar}>
            <h2 className="card-h">Publicar una noticia</h2>
            <label className="field"><span>Título</span><input value={n.titulo} onChange={(e) => setN({ ...n, titulo: e.target.value })} placeholder="Ej.: Feriado el lunes" /></label>
            <label className="field"><span>Texto</span><textarea rows="3" value={n.resumen} onChange={(e) => setN({ ...n, resumen: e.target.value })} placeholder="Lo que necesitan saber las familias" /></label>
            <div className="two">
              <label className="field"><span>Etiqueta</span><select value={n.etiqueta} onChange={(e) => setN({ ...n, etiqueta: e.target.value })}>{ETIQUETAS.map((x) => <option key={x}>{x}</option>)}</select></label>
              <label className="switch top-pad"><input type="checkbox" checked={n.fijada} onChange={(e) => setN({ ...n, fijada: e.target.checked })} /><span>Destacar en el inicio</span></label>
            </div>
            <div className="row-end">{pub && <span className="saved"><Icon name="ok" size={16} />Publicada</span>}<button className="btn btn-navy sm" disabled={!n.titulo.trim() || !n.resumen.trim()}>Publicar</button></div>
            <ul className="news-admin">
              {c.noticias.map((x) => (
                <li key={x.id}><span><b>{x.titulo}</b><small className="muted">{x.etiqueta} · {fecha(x.fecha)}{x.fijada ? " · destacada" : ""}</small></span>
                  <button type="button" className="link-btn" onClick={() => borrar(x.id)}>Borrar</button></li>
              ))}
            </ul>
          </form>
        </div>
      </div>
    </div>
  );
}
