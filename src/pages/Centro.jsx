import { Link, useParams } from "react-router-dom";
import { useCentro, LogoCentro } from "../lib/centro.jsx";
import { useSesion } from "../lib/auth.jsx";
import { fecha, hora } from "../lib/util.js";
import { Icon, Formas } from "../components/ui.jsx";

/* "Mi centro": todo lo que carga y actualiza cada centro desde su panel. */
export default function Centro() {
  const c = useCentro();
  const { slug } = useSesion();
  const proximos = c.eventos.filter((e) => new Date(e.fecha) > new Date());
  const tel = (n) => n.replace(/[^\d+]/g, "");
  return (
    <div className="page">
      <section className="centro-hero">
        <Formas variante="d" />
        <LogoCentro centro={c} size={72} />
        <h1>{c.nombre}</h1>
        <p>{c.bienvenida}</p>
      </section>

      <div className="contact-row">
        {c.info.telefono && <a className="contact" href={`tel:${tel(c.info.telefono)}`}><Icon name="telefono" /><span>Llamar</span></a>}
        {c.info.whatsapp && <a className="contact" href={`https://wa.me/${tel(c.info.whatsapp).replace("+", "")}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" /><span>WhatsApp</span></a>}
        {c.info.email && <a className="contact" href={`mailto:${c.info.email}`}><Icon name="mail" /><span>Mail</span></a>}
        <a className="contact" href={`https://maps.google.com/?q=${encodeURIComponent(c.info.direccion)}`} target="_blank" rel="noopener noreferrer"><Icon name="pin" /><span>Cómo llegar</span></a>
      </div>

      {c.modulos.noticias && c.noticias.length > 0 && (
        <section aria-labelledby="not-h">
          <h2 id="not-h" className="sec-h">Noticias</h2>
          <ul className="stack">
            {c.noticias.map((n) => (
              <li key={n.id}>
                <Link to={`/${slug}/centro/noticias/${n.id}`} className="card news-card">
                  <div className="row"><span className="tag">{n.etiqueta}</span><small className="muted">{fecha(n.fecha)}</small></div>
                  <h3>{n.titulo}</h3><p className="muted">{n.resumen}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {c.modulos.eventos && proximos.length > 0 && (
        <section aria-labelledby="ev-h">
          <h2 id="ev-h" className="sec-h">Próximos eventos</h2>
          <ul className="stack">
            {proximos.map((e) => (
              <li key={e.id} className="card event-card">
                <span className="date-chip"><b>{new Date(e.fecha).getDate()}</b><small>{fecha(e.fecha, { month: "short" })}</small></span>
                <div><h3>{e.titulo}</h3><p className="muted small">{fecha(e.fecha, { weekday: "long" })} · {hora(e.fecha)} · {e.lugar}</p><p className="small">{e.detalle}</p></div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {c.modulos.recursos && c.recursos.length > 0 && (
        <section aria-labelledby="rec-h">
          <h2 id="rec-h" className="sec-h">Guías y recursos</h2>
          <ul className="recursos">
            {c.recursos.map((r) => (
              <li key={r.id}><button type="button" className="card recurso">
                <span className={`rec-ico rec-${r.tipo}`} aria-hidden="true"><Icon name={r.tipo === "video" ? "play" : r.tipo === "pdf" ? "doc" : "libro"} /></span>
                <span><b>{r.titulo}</b><small>{r.tipo === "video" ? "Video" : r.tipo === "pdf" ? "PDF" : "Guía"} · {r.descripcion}</small></span>
              </button></li>
            ))}
          </ul>
        </section>
      )}

      <section className="card" aria-labelledby="info-h">
        <h2 id="info-h" className="card-h">Horarios y dirección</h2>
        <ul className="info">
          {c.info.horarios.map((h) => <li key={h}><Icon name="reloj" size={18} />{h}</li>)}
          <li><Icon name="pin" size={18} />{c.info.direccion}</li>
        </ul>
      </section>

      {c.modulos.equipo && (
        <section aria-labelledby="eq-h">
          <h2 id="eq-h" className="sec-h">Equipo</h2>
          <ul className="equipo">
            {c.equipo.map((p) => <li key={p.nombre}><span className="av-pro" aria-hidden="true">{p.nombre[0]}</span><b>{p.nombre}</b><small>{p.rol}</small></li>)}
          </ul>
        </section>
      )}
    </div>
  );
}

export function Noticia() {
  const c = useCentro();
  const { slug } = useSesion();
  const { id } = useParams();
  const n = c.noticias.find((x) => x.id === id);
  if (!n) return <div className="page"><p>No encontramos esa noticia.</p></div>;
  return (
    <article className="page noticia">
      <Link className="back" to={`/${slug}/centro`}><Icon name="atras" size={18} />{c.nombreCorto}</Link>
      <div className="row"><span className="tag">{n.etiqueta}</span><small className="muted">{fecha(n.fecha, { day: "numeric", month: "long" })}</small></div>
      <h1>{n.titulo}</h1>
      {n.cuerpo.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
      <p className="muted small firma"><LogoCentro centro={c} size={24} /> Publicado por {c.nombre}</p>
    </article>
  );
}
