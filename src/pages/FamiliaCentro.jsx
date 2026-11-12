import * as apiFamilia from "../lib/apiFamilia.js";
import { usePaciente } from "../lib/paciente.jsx";
import { fecha, useData } from "../lib/util.js";
import { Loading, ErrorBox, Empty, Icon } from "../components/ui.jsx";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const CHIP = { Aviso: "t-coral", Novedad: "t-teal", Comunidad: "t-yellow", Bienvenida: "t-teal" };

function Noticia({ n }) {
  return (
    <article className="centro-noticia">
      <div className="centro-noticia-head">
        <span className={`pill ${CHIP[n.etiqueta] || "t-teal"}`}>{n.etiqueta}</span>
        {n.fijada && <Icon name="alerta" size={16} style={{ color: "var(--coraltx)" }} />}
      </div>
      <h3>{n.titulo}</h3>
      <p>{n.cuerpo}</p>
      <small className="muted">{fecha(n.fecha, { day: "numeric", month: "long" })}</small>
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
      <p className="familia-saludo"><span>Tu centro</span>{centro.nombre}</p>
      {centro.bienvenida && <p className="centro-bienvenida">{centro.bienvenida}</p>}

      <section>
        <p className="eyebrow">Noticias</p>
        {!centro.noticias.length && <Empty icon="mensaje" title="Todavía no hay noticias publicadas" />}
        {!!centro.noticias.length && (
          <div className="centro-noticias">
            {centro.noticias.map((n) => <Noticia key={n.id} n={n} />)}
          </div>
        )}
      </section>

      {!!centro.eventos.length && (
        <section>
          <p className="eyebrow">Próximos eventos</p>
          <div className="f-sesiones">
            {centro.eventos.map((e) => <Evento key={e.id} e={e} />)}
          </div>
        </section>
      )}

      {(centro.direccion || centro.telefono || centro.whatsapp || centro.emailContacto) && (
        <section className="centro-contacto">
          <p className="eyebrow">Contacto</p>
          {centro.direccion && <p>{centro.direccion}</p>}
          {centro.horarios && <p className="muted">{centro.horarios}</p>}
          {centro.telefono && <p>Tel: {centro.telefono}</p>}
          {centro.whatsapp && <p>WhatsApp: {centro.whatsapp}</p>}
          {centro.emailContacto && <p>{centro.emailContacto}</p>}
        </section>
      )}
    </>
  );
}
