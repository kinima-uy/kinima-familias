import * as apiFamilia from "../lib/apiFamilia.js";
import { usePaciente } from "../lib/paciente.jsx";
import { fecha, useData } from "../lib/util.js";
import { Loading, ErrorBox, Empty, Icon } from "../components/ui.jsx";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const CHIP = { Aviso: "t-coral", Novedad: "t-teal", Comunidad: "t-yellow", Bienvenida: "t-teal" };
/* Ícono + tono por categoría, para que la noticia se reconozca de un vistazo (no solo por color/texto). */
const CAT_ICON = { Aviso: ["alerta", "coral"], Novedad: ["idea", "teal"], Comunidad: ["equipo", "yellow"], Bienvenida: ["ok", "teal"] };

function Noticia({ n }) {
  const [ic, tono] = CAT_ICON[n.etiqueta] || ["noticia", "teal"];
  return (
    <article className="centro-noticia">
      <span className={`centro-noticia-ico tono-${tono}`}><Icon name={ic} size={22} /></span>
      <div className="centro-noticia-body">
        <div className="centro-noticia-head">
          <span className={`pill ${CHIP[n.etiqueta] || "t-teal"}`}>{n.etiqueta}</span>
          {n.fijada && <span className="pill-fijada"><Icon name="alerta" size={13} style={{ color: "var(--coraltx)" }} />Fijado</span>}
        </div>
        <h3>{n.titulo}</h3>
        <p>{n.cuerpo}</p>
        <small className="muted">{fecha(n.fecha, { day: "numeric", month: "long" })}</small>
      </div>
    </article>
  );
}

function Evento({ e }) {
  const d = new Date(e.fecha);
  return (
    <div className="f-sesion">
      <span className="f-dia" style={{ background: "var(--tint-teal)", color: "var(--tealtx)" }}>
        {DIAS[d.getDay()]}<br />{d.getDate()}
      </span>
      <div className="f-sesion-mid">
        <b>{e.titulo}</b>
        <small>{e.lugar ? `${e.lugar} · ` : ""}{fecha(e.fecha, { day: "numeric", month: "long" })}</small>
      </div>
    </div>
  );
}

export default function FamiliaCentro() {
  const { paciente } = usePaciente();
  const { data: centro, error, loading } = useData(() => (paciente ? apiFamilia.getCentro(paciente.id) : null), [paciente?.id]);

  if (loading && !centro) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  if (!centro) return null;

  return (
    <>
      <div className="centro-cabecera">
        {centro.logoUrl && <img className="centro-logo" src={centro.logoUrl} alt={`Logo de ${centro.nombre}`} />}
        <p className="familia-saludo"><span>Tu centro</span>{centro.nombre}</p>
      </div>
      {centro.bienvenida && <p className="centro-bienvenida">{centro.bienvenida}</p>}

      {/* "Para contarle a tu hijo/a": lo que la familia comparte o explica al niño/a — noticias y próximos eventos,
          separado de los datos prácticos del centro, que son para el adulto. */}
      <section>
        <p className="eyebrow eyebrow-hijo">Para contarle a tu hijo/a</p>
        {!centro.noticias.length && <Empty icon="mensaje" title="Todavía no hay noticias publicadas" />}
        {!!centro.noticias.length && (
          <div className="centro-noticias">
            {centro.noticias.map((n) => <Noticia key={n.id} n={n} />)}
          </div>
        )}
      </section>

      {!!centro.eventos.length && (
        <section>
          <p className="eyebrow eyebrow-hijo">Próximos eventos</p>
          <div className="f-sesiones">
            {centro.eventos.map((e) => <Evento key={e.id} e={e} />)}
          </div>
        </section>
      )}

      {(centro.direccion || centro.telefono || centro.whatsapp || centro.emailContacto) && (
        <section className="centro-para-vos">
          <p className="eyebrow">Para vos · datos del centro</p>
          <div className="centro-contacto">
            {centro.direccion && <p><Icon name="casa" size={16} style={{ color: "var(--muted)" }} />{centro.direccion}</p>}
            {centro.horarios && <p className="muted"><Icon name="reloj" size={16} />{centro.horarios}</p>}
            {(centro.telefono || centro.whatsapp) && (
              <p>
                <Icon name="mensaje" size={16} style={{ color: "var(--muted)" }} />
                {centro.telefono ? `Tel: ${centro.telefono}` : ""}{centro.telefono && centro.whatsapp ? " · " : ""}{centro.whatsapp ? `WhatsApp: ${centro.whatsapp}` : ""}
              </p>
            )}
            {centro.emailContacto && <p><Icon name="enviar" size={16} style={{ color: "var(--muted)" }} />{centro.emailContacto}</p>}
          </div>
        </section>
      )}
    </>
  );
}
