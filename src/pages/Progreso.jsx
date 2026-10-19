import * as api from "../lib/api.js";
import { useSesion } from "../lib/auth.jsx";
import { useData, fecha } from "../lib/util.js";
import { COLORS } from "../lib/brand.jsx";
import { Icon, AnilloSemana, Insignia, Carita, Cargando } from "../components/ui.jsx";

/* Progreso pensado para familias: constancia y logros, sin puntajes que generen presión. */
export default function Progreso() {
  const { familia, hijoId, slug } = useSesion();
  const { data: h } = useData(() => api.getHijo(slug, familia.email, hijoId), [hijoId]);
  if (!h) return <Cargando />;
  const jugados = h.semana.filter((d) => d.toca && d.jugo).length, tocan = h.semana.filter((d) => d.toca).length;
  const colores = [COLORS.yellow, COLORS.teal, COLORS.coral, COLORS.yellow, COLORS.teal];

  /* Calendario del mes */
  const now = new Date(), y = now.getFullYear(), m = now.getMonth();
  const first = new Date(y, m, 1), diasMes = new Date(y, m + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  const jugoDia = (d) => h.sesiones.some((s) => { const x = new Date(s.fecha); return x.getDate() === d && x.getMonth() === m && x.getFullYear() === y; });

  return (
    <div className="page">
      <h1 className="page-h">Progreso de {h.nombre}</h1>

      <section className="card prog-hero">
        <AnilloSemana dias={h.semana} size={170}><b>{jugados}<small>/{tocan}</small></b><span>días esta semana</span></AnilloSemana>
        <div className="week-days" aria-label="Días de esta semana">
          {h.semana.map((d) => (
            <span key={d.fecha} className={`${d.jugo ? "on" : ""} ${d.toca ? "" : "rest"} ${new Date(d.fecha).toDateString() === new Date().toDateString() ? "today" : ""}`}
              aria-label={`${fecha(d.fecha, { weekday: "long" })}: ${d.jugo ? "jugó" : d.toca ? "no jugó" : "descanso"}`}>
              {fecha(d.fecha, { weekday: "narrow" })}
            </span>
          ))}
        </div>
      </section>

      <div className="mini-stats">
        <div className="mini t-yellow"><Icon name="fuego" /><b>{h.racha}</b><span>días seguidos</span></div>
        <div className="mini t-teal"><Icon name="reloj" /><b>{h.minutosMes}</b><span>minutos este mes</span></div>
        <div className="mini t-coral"><Icon name="tele" /><b>{h.sesionesTotal}</b><span>partidas en total</span></div>
      </div>

      {h.mejorando != null && (
        <p className={`note ${h.mejorando ? "note-ok" : ""}`}>
          {h.mejorando ? <>¡{h.nombre} viene alcanzando cada vez más objetivos! 🎉</> : <>Estos días le costó un poco más. Es normal: lo importante es seguir jugando.</>}
        </p>
      )}

      <section aria-labelledby="logros-h">
        <h2 id="logros-h" className="sec-h">Logros</h2>
        <ul className="logros">
          {h.logros.map((l, i) => (
            <li key={l.id} className={l.ok ? "ok" : ""}>
              <Insignia forma={l.forma} ok={l.ok} color={colores[i]} size={58} />
              <b>{l.t}</b><small>{l.ok ? l.d : "Todavía no"}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="mes-h">
        <h2 id="mes-h" className="card-h">{fecha(now.toISOString(), { month: "long" })}</h2>
        <div className="cal" role="grid" aria-label="Días que jugó este mes">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <span key={i} className="cal-h" aria-hidden="true">{d}</span>)}
          {[...Array(offset)].map((_, i) => <span key={`e${i}`} />)}
          {[...Array(diasMes)].map((_, i) => {
            const d = i + 1, j = jugoDia(d), hoy = d === now.getDate();
            return <span key={d} className={`cal-d ${j ? "on" : ""} ${hoy ? "today" : ""}`} aria-label={`${d}: ${j ? "jugó" : "sin partida"}`}>{d}</span>;
          })}
        </div>
      </section>

      <section className="card" aria-labelledby="sintio-h">
        <h2 id="sintio-h" className="card-h">Cómo se sintió</h2>
        <ul className="sintio">
          {h.sesiones.filter((s) => s.animo).slice(0, 5).map((s) => (
            <li key={s.id}><Carita animo={s.animo} size={36} /><span>{fecha(s.fecha, { weekday: "long", day: "numeric" })}</span></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
