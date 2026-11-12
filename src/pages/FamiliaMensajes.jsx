import { useEffect, useRef, useState } from "react";
import * as apiFamilia from "../lib/apiFamilia.js";
import { usePaciente } from "../lib/paciente.jsx";
import { fecha, hora, useData } from "../lib/util.js";
import { Loading, ErrorBox, Empty, Icon } from "../components/ui.jsx";

function Hilo({ patient, onLeido }) {
  const { data: mensajes, error, loading, reload } = useData(() => apiFamilia.getMensajes(patient.id), [patient.id]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const end = useRef(null);

  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [mensajes?.length]);
  useEffect(() => {
    if (mensajes?.some((m) => m.de === "profesional" && !m.leido)) {
      apiFamilia.marcarLeidos(patient.id).then(onLeido);
    }
  }, [mensajes, patient.id]);

  if (loading && !mensajes) return <Loading />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    try {
      await apiFamilia.enviarMensaje(patient.id, texto.trim());
      setTexto("");
      await reload();
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      {!mensajes.length ? (
        <Empty icon="mensaje" title="Todavía no hay mensajes">Escribile al equipo cuando quieras consultar algo sobre {patient.etiqueta}.</Empty>
      ) : (
        <ol className="chat" aria-live="polite">
          {mensajes.map((m) => (
            <li key={m.id} className={m.de}>
              <div className="bubble">{m.texto}</div>
              <small>{m.de === "profesional" && m.autor ? `${m.autor} · ` : ""}{fecha(m.fecha)} · {hora(m.fecha)}</small>
            </li>
          ))}
          <li className="end" ref={end} aria-hidden="true" />
        </ol>
      )}
      <p className="muted small center">Para urgencias, llamá al centro. Las respuestas por acá pueden demorar.</p>
      <form className="composer" onSubmit={enviar}>
        <label className="sr" htmlFor="msg">Escribir mensaje</label>
        <textarea
          id="msg" rows="1" value={texto} onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribí un mensaje…"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) enviar(e); }}
        />
        <button className="btn btn-acc round" disabled={!texto.trim() || enviando} aria-label="Enviar"><Icon name="enviar" size={20} /></button>
      </form>
    </>
  );
}

export default function FamiliaMensajes() {
  const { paciente, loading, error, reload } = usePaciente();

  return (
    <>
      <p className="familia-saludo"><span>Mensajes</span>Con el equipo de {paciente ? paciente.etiqueta : "tu hijo/a"}</p>
      {loading && !paciente && <Loading />}
      {error && <ErrorBox error={error} />}
      {paciente && <Hilo key={paciente.id} patient={paciente} onLeido={reload} />}
    </>
  );
}
