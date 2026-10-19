import { useEffect, useRef, useState } from "react";
import * as api from "../lib/api.js";
import { useSesion } from "../lib/auth.jsx";
import { useData, fecha, hora } from "../lib/util.js";
import { Icon, Cargando } from "../components/ui.jsx";

export default function Mensajes() {
  const { familia, hijoId, slug } = useSesion();
  const { data: h } = useData(() => api.getHijo(slug, familia.email, hijoId), [hijoId]);
  const [lista, setLista] = useState([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const end = useRef(null);
  useEffect(() => { if (h) setLista(h.mensajes); }, [h]);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [lista.length]);
  if (!h) return <Cargando />;
  const enviar = async (e) => {
    e.preventDefault(); if (!texto.trim()) return;
    setEnviando(true); const m = await api.enviarMensaje(slug, familia.email, h.id, texto.trim());
    setLista((l) => [...l, m]); setTexto(""); setEnviando(false);
  };
  return (
    <div className="page chat-page">
      <header className="chat-head">
        <span className="av-pro" aria-hidden="true">{h.profesional.nombre[0]}</span>
        <div><h1>{h.profesional.nombre}</h1><p className="muted small">{h.profesional.rol} de {h.nombre}</p></div>
      </header>
      <ol className="chat" aria-live="polite">
        {lista.map((m) => (
          <li key={m.id} className={m.de}>
            <div className="bubble">{m.texto}</div>
            <small>{fecha(m.fecha)} · {hora(m.fecha)}</small>
          </li>
        ))}
        <li ref={end} aria-hidden="true" />
      </ol>
      <p className="muted small center">Para urgencias, llamá al centro. Las respuestas pueden demorar.</p>
      <form className="composer" onSubmit={enviar}>
        <label className="sr" htmlFor="msg">Escribir mensaje</label>
        <textarea id="msg" rows="1" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={`Escribile a ${h.profesional.nombre}…`}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) enviar(e); }} />
        <button className="btn btn-acc round" disabled={!texto.trim() || enviando} aria-label="Enviar"><Icon name="enviar" size={20} /></button>
      </form>
    </div>
  );
}
