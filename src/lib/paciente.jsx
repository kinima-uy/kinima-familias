import { createContext, useContext, useEffect, useState } from "react";
import * as apiFamilia from "./apiFamilia.js";
import { useData } from "./util.js";

/* Qué hijo/a está viendo la familia ahora mismo: una sola fuente de verdad, compartida
   entre Inicio y Mensajes (y cualquier pantalla futura), para que el selector viva una
   sola vez en el layout y no se pierda al cambiar de página. */
const KEY = "kinima-familia-paciente";
const PacienteCtx = createContext(null);

export function PacienteProvider({ children }) {
  const { data: pacientes, error, loading, reload } = useData(() => apiFamilia.getPacientes(), []);
  const [actual, setActual] = useState(() => { try { return sessionStorage.getItem(KEY); } catch { return null; } });

  useEffect(() => {
    if (!pacientes?.length) return;
    if (!actual || !pacientes.some((p) => p.id === actual)) setActual(pacientes[0].id);
  }, [pacientes, actual]);

  useEffect(() => { try { actual ? sessionStorage.setItem(KEY, actual) : sessionStorage.removeItem(KEY); } catch { /* sin almacenamiento */ } }, [actual]);

  const paciente = pacientes?.find((p) => p.id === actual) || null;
  const totalSinLeer = pacientes?.reduce((t, p) => t + (p.sinLeer || 0), 0) || 0;

  return (
    <PacienteCtx.Provider value={{ pacientes, paciente, actual, setActual, loading, error, reload, totalSinLeer }}>
      {children}
    </PacienteCtx.Provider>
  );
}

export const usePaciente = () => useContext(PacienteCtx);
