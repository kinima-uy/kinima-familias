import { useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../lib/api.js";
import { useCentro } from "../lib/centro.jsx";
import { useSesion } from "../lib/auth.jsx";
import { useData, saludo, fecha, hora, haceCuanto } from "../lib/util.js";
import { Icon, Carita, ANIMOS, AnilloSemana, Formas, Cargando } from "../components/ui.jsx";

export default function Inicio() {
  const centro = useCentro();
  const { familia, hijoId, slug } = useSesion();
  const { data: h, reload } = useData(() => api.getHijo(slug, familia.email, hijoId), [hijoId]);
  const [guardado, setGuardado] = useState(null);
  if (!h) return <Cargando />;

  const ses = h.hoy.sesion;
  const marcar = async (animo) => { setGuardado(animo); await api.registrarAnimo(slug, familia.email, h.id, ses.id, animo); reload(); };
  const jugados = h.semana.filter((d) => d.toca && d.jugo).length, tocan = h.semana.filter((d) => d.toca).length;
  const ultimoPro = [...h.mensajes].reverse().find((m) => m.de === "profesional");
  const fijada = centro.modulos.noticias && (centro.noticias.find((n) => n.fijada) || centro.noticias[0]);
  const evento = centro.modulos.eventos && centro.eventos.find((e) => new Date(e.fecha) > new Date());
  const totalMin = h.rutina.bloques.reduce((t, b) => t + b.minutos, 0);

  return (
    <div className="page">
      <p className="hola">{saludo()}, {familia.nombre.replace("Familia de ", "familia de ")}</p>

      {/* HOY */}
      <section className={`hoy ${h.hoy.jugo ? "hoy-ok" : h.hoy.toca ? "hoy-toca" : "hoy-libre"}`} aria-labelledby="hoy-h">
        <Formas variante="c" />
        {h.hoy.jugo ? (
          <>
            <p className="eyebrow">Hoy</p>
            <h1 id="hoy-h">¡{h.nombre} ya jugó hoy!</h1>
            <p>{ses.minutos} minutos · {hora(ses.fecha)}</p>
            {!ses.animo ? (
              <div className="checkin">
                <h2>¿Cómo se sintió?</h2>
                <div className="caritas" role="group" aria-label={`¿Cómo se sintió ${h.nombre}?`}>
                  {ANIMOS.map((a) => (
                    <button key={a.id} type="button" onClick={() => marcar(a.id)} aria-pressed={guardado === a.id}>
                      <Carita animo={a.id} size={58} /><span>{a.t}</span>
                    </button>
                  ))}
                </div>
                <small>Lo ve {h.profesional.nombre}, para ajustar la rutina.</small>
              </div>
            ) : (
              <div className="checkin-ok">
                <Carita animo={ses.animo} size={52} />
                <p><b>Se sintió: {ANIMOS.find((a) => a.id === ses.animo).t.toLowerCase()}</b><br />¡Gracias por contarnos! {ses.animo === "dolor" && <>Si querés, escribile a {h.profesional.nombre}.</>}</p>
              </div>
            )}
          </>
        ) : h.hoy.toca ? (
          <>
            <p className="eyebrow">Rutina de hoy · {totalMin} min</p>
            <h1 id="hoy-h">Hoy toca jugar con {h.nombre}</h1>
            <ol className="bloques">
              {h.rutina.bloques.map((b, i) => (
                <li key={i}><span className="bnum">{i + 1}</span><span><b>{b.titulo}</b><small>{b.detalle} · {b.minutos} min</small></span></li>
              ))}
            </ol>
            <p className="hoy-tip"><Icon name="tele" size={20} />Prendé la tele y el dispositivo Kinima: la rutina ya está cargada.</p>
          </>
        ) : (
          <>
            <p className="eyebrow">Hoy</p>
            <h1 id="hoy-h">Día de descanso</h1>
            <p>Hoy no hay rutina. ¡Mañana seguimos jugando!</p>
          </>
        )}
      </section>

      {/* SEMANA */}
      <Link to={`/${slug}/progreso`} className="card semana-card">
        <AnilloSemana dias={h.semana} size={118}><b>{jugados}<small>/{tocan}</small></b><span>días</span></AnilloSemana>
        <div>
          <p className="eyebrow">Esta semana</p>
          <h2>{jugados >= tocan ? "¡Semana completa!" : jugados ? `Lleva ${jugados} de ${tocan} días` : "Arranca la semana"}</h2>
          {h.racha > 1 && <p className="racha"><Icon name="fuego" size={18} />{h.racha} días seguidos</p>}
          <span className="link">Ver progreso <Icon name="flecha" size={16} /></span>
        </div>
      </Link>

      {/* MENSAJE */}
      {centro.modulos.mensajes && ultimoPro && (
        <Link to={`/${slug}/mensajes`} className="card msg-card">
          <span className="av-pro" aria-hidden="true">{h.profesional.nombre[0]}</span>
          <div><p className="small-h">{h.profesional.nombre} · {h.profesional.rol} <span className="muted">· {haceCuanto(ultimoPro.fecha)}</span></p><p className="clamp">{ultimoPro.texto}</p></div>
        </Link>
      )}

      {/* DEL CENTRO */}
      {(fijada || evento) && (
        <section aria-labelledby="del-centro">
          <h2 id="del-centro" className="sec-h">Novedades de {centro.nombreCorto}</h2>
          <div className="stack">
            {fijada && (
              <Link to={`/${slug}/centro/noticias/${fijada.id}`} className="card news-card">
                <span className="tag">{fijada.etiqueta}</span>
                <h3>{fijada.titulo}</h3>
                <p className="muted">{fijada.resumen}</p>
              </Link>
            )}
            {evento && (
              <Link to={`/${slug}/centro`} className="card event-card">
                <span className="date-chip"><b>{new Date(evento.fecha).getDate()}</b><small>{fecha(evento.fecha, { month: "short" })}</small></span>
                <div><h3>{evento.titulo}</h3><p className="muted small">{hora(evento.fecha)} · {evento.lugar}</p></div>
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
