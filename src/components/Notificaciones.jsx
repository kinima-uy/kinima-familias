import { useEffect, useState } from "react";
import { Icon } from "./ui.jsx";
import { soportaPush, estadoPush, activarPush, desactivarPush } from "../lib/push.js";

/* Botón de la barra superior para prender/apagar los avisos push (ejercicio nuevo, eventos del
   centro, recordatorio diario). Si el navegador no soporta push (ej. Safari fuera de la app
   instalada en iOS viejo) no se muestra nada. */
export default function Notificaciones() {
  const [estado, setEstado] = useState(null); // null mientras se chequea, o ver estadoPush()
  const [cambiando, setCambiando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let vivo = true;
    if (!soportaPush()) { setEstado("no-soportado"); return; }
    estadoPush().then((e) => vivo && setEstado(e));
    return () => { vivo = false; };
  }, []);

  if (estado === null || estado === "no-soportado") return null;

  const suscripto = estado === "suscripto";

  const alTocar = async () => {
    setError(null);
    setCambiando(true);
    try {
      if (suscripto) { await desactivarPush(); setEstado("disponible"); }
      else { await activarPush(); setEstado("suscripto"); }
    } catch (e) {
      setError(e.message || "No se pudo cambiar las notificaciones.");
      setEstado(await estadoPush());
    } finally {
      setCambiando(false);
    }
  };

  const titulo = estado === "denegado"
    ? "Notificaciones bloqueadas en el navegador"
    : suscripto ? "Apagar notificaciones" : "Activar notificaciones";

  return (
    <span className="notif-toggle">
      <button
        className="icon-btn"
        onClick={alTocar}
        disabled={cambiando || estado === "denegado"}
        aria-pressed={suscripto}
        aria-label={titulo}
        title={titulo}
      >
        <Icon name="campana" style={{ opacity: suscripto ? 1 : 0.45 }} />
      </button>
      {error && <span className="notif-toggle-error" role="alert">{error}</span>}
    </span>
  );
}
