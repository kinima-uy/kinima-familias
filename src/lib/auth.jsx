import { createContext, useContext, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import * as api from "./api.js";

/* Sesión de la familia, separada por centro: entrar en un centro no da acceso a otro. */
const Ctx = createContext(null);
const KEY = (slug) => `kinima-familia-${slug}`;
const leer = (slug) => { try { return JSON.parse(sessionStorage.getItem(KEY(slug))); } catch { return null; } };
const guardar = (slug, v) => { try { v ? sessionStorage.setItem(KEY(slug), JSON.stringify(v)) : sessionStorage.removeItem(KEY(slug)); } catch { /* sin almacenamiento */ } };

export function AuthProvider({ children }) {
  const [sesiones, setSesiones] = useState({});
  const get = (slug) => sesiones[slug] ?? leer(slug);
  const entrar = async (slug, email, pass) => {
    const s = await api.login(slug, email, pass);
    const v = { ...s, hijoId: s.familia.hijos[0].id };
    setSesiones((x) => ({ ...x, [slug]: v })); guardar(slug, v); return v;
  };
  const salir = (slug) => { setSesiones((x) => ({ ...x, [slug]: null })); guardar(slug, null); };
  const elegirHijo = (slug, hijoId) => { const v = { ...get(slug), hijoId }; setSesiones((x) => ({ ...x, [slug]: v })); guardar(slug, v); };
  return <Ctx.Provider value={{ get, entrar, salir, elegirHijo }}>{children}</Ctx.Provider>;
}

export function useSesion() {
  const { centro } = useParams();
  const a = useContext(Ctx);
  const s = a.get(centro);
  return { sesion: s, familia: s?.familia, hijoId: s?.hijoId, hijo: s?.familia.hijos.find((h) => h.id === s?.hijoId),
    entrar: (e, p) => a.entrar(centro, e, p), salir: () => a.salir(centro), elegirHijo: (id) => a.elegirHijo(centro, id), slug: centro };
}

export function RequireFamilia({ children }) {
  const { sesion, slug } = useSesion();
  if (!sesion) return <Navigate to={`/${slug}`} replace />;
  return children;
}
