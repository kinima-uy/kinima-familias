import { useState } from "react";
import { Icon } from "./ui.jsx";

/* Tutoriales de uso de Kinima. Cada paso puede tener "foto" (ruta en /public/ayuda/) para cuando
   haya una foto o gif real; mientras no exista, se muestra un espacio marcado para completar después. */
const TUTORIALES = [
  {
    id: "enchufar",
    icono: "consola",
    titulo: "Cómo enchufar Kinima",
    resumen: "Poner en marcha la consola por primera vez",
    pasos: [
      { titulo: "Conectá el cable", texto: "Enchufá el cable de alimentación a la consola de Kinima." },
      { titulo: "Buscá una toma cerca de la tele", texto: "La consola tiene que quedar cerca de la tele, con el cable HDMI ya conectado." },
      { titulo: "Esperá que encienda", texto: "La luz de la consola se enciende y en la tele aparece la pantalla de inicio de Kinima." },
    ],
  },
  {
    id: "conectar",
    icono: "wifi",
    titulo: "Cómo conectarlo",
    resumen: "Conectar la consola a internet y verificar que esté en línea",
    pasos: [
      { titulo: "Conectá la consola al wifi", texto: "Seguí las instrucciones en la pantalla de la tele para elegir la red y poner la contraseña." },
      { titulo: "Esperá la confirmación", texto: "Cuando queda conectada, la pantalla lo confirma." },
      { titulo: "Revisá el estado desde la app", texto: "En el panel del centro, la consola figura \"En línea\" cuando está todo conectado correctamente." },
    ],
  },
  {
    id: "mensajes",
    icono: "mensaje",
    titulo: "Cómo enviar mensajes",
    resumen: "Escribirle al equipo profesional desde la app",
    pasos: [
      { titulo: "Abrí Mensajes", texto: "Tocá el ícono de Mensajes en el menú de abajo." },
      { titulo: "Escribí tu mensaje", texto: "Usá el cuadro de texto de abajo de todo y escribí lo que querés consultar." },
      { titulo: "Enviá y esperá la respuesta", texto: "Tocá el botón de enviar. Las respuestas del equipo pueden demorar; para algo urgente, llamá directamente al centro." },
    ],
  },
  {
    id: "sesion",
    icono: "play",
    titulo: "Cómo empezar una sesión",
    resumen: "Jugar la rutina asignada por el profesional",
    pasos: [
      { titulo: "Mirá \"Hoy toca\"", texto: "En el Inicio de la app aparece la rutina que el profesional asignó para hoy." },
      { titulo: "Empezá desde la consola", texto: "Frente a la tele, seguí las instrucciones en pantalla para arrancar el juego." },
      { titulo: "Jugá la sesión completa", texto: "La cámara sigue el movimiento y guía el juego; al terminar, se guarda sola." },
    ],
  },
  {
    id: "anterior",
    icono: "reloj",
    titulo: "Cómo ver lo anterior",
    resumen: "Revisar las sesiones ya jugadas",
    pasos: [
      { titulo: "Abrí Inicio", texto: "Es la primera pantalla de la app, con el ícono de casa." },
      { titulo: "Buscá \"Cómo le fue\"", texto: "Ahí aparece la lista de sesiones jugadas, con fecha, duración y aciertos." },
      { titulo: "Tocá una sesión", texto: "El ícono de cada sesión indica si se completó entera o quedó a mitad de camino." },
    ],
  },
  {
    id: "local",
    icono: "objetivo",
    titulo: "Cómo jugar sin rutina asignada",
    resumen: "Para cuando no hay ejercicio asignado, o ya se completaron todos",
    pasos: [
      { titulo: "Elegí jugar libre", texto: "Desde la consola, se puede jugar sin esperar una rutina nueva del profesional." },
      { titulo: "Practicá a tu ritmo", texto: "Sirve para seguir practicando mientras llega una nueva asignación." },
      { titulo: "La próxima rutina avisa sola", texto: "Apenas el profesional asigne una rutina nueva, va a aparecer en \"Hoy toca\"." },
    ],
  },
];

function PasoFoto() {
  return <div className="ayuda-foto-slot"><Icon name="plantilla" size={20} />Espacio para foto o gif</div>;
}

function Tutorial({ t, onVolver }) {
  return (
    <div className="ayuda-detalle">
      <button className="ayuda-volver" onClick={onVolver}><Icon name="atras" size={18} />Todos los tutoriales</button>
      <div className="ayuda-detalle-head">
        <span className="ayuda-ico-grande"><Icon name={t.icono} size={26} /></span>
        <h3>{t.titulo}</h3>
      </div>
      <ol className="ayuda-pasos">
        {t.pasos.map((p, i) => (
          <li key={i}>
            <span className="ayuda-paso-num">{i + 1}</span>
            <div className="ayuda-paso-body">
              <b>{p.titulo}</b>
              <p>{p.texto}</p>
              <PasoFoto />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Ayuda() {
  const [abierto, setAbierto] = useState(false);
  const [actual, setActual] = useState(null);

  const cerrar = () => { setAbierto(false); setActual(null); };

  return (
    <>
      <button className="ayuda-fab" onClick={() => setAbierto(true)} aria-label="Ayuda y tutoriales">
        <Icon name="pregunta" size={26} />
      </button>

      {abierto && (
        <div className="ayuda-overlay" role="dialog" aria-label="Ayuda y tutoriales">
          <div className="ayuda-sheet">
            <div className="ayuda-sheet-head">
              <p className="eyebrow">Ayuda</p>
              <button className="icon-btn" onClick={cerrar} aria-label="Cerrar"><Icon name="cerrar" size={20} /></button>
            </div>

            {!actual ? (
              <div className="ayuda-lista">
                {TUTORIALES.map((t) => (
                  <button key={t.id} className="ayuda-item" onClick={() => setActual(t.id)}>
                    <span className="ayuda-ico"><Icon name={t.icono} size={20} /></span>
                    <span className="ayuda-item-txt">
                      <b>{t.titulo}</b>
                      <small>{t.resumen}</small>
                    </span>
                    <Icon name="flecha" size={16} style={{ color: "var(--muted)" }} />
                  </button>
                ))}
              </div>
            ) : (
              <Tutorial t={TUTORIALES.find((t) => t.id === actual)} onVolver={() => setActual(null)} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
