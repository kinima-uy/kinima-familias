/*
 * Capa de datos de la app de familias. Hoy usa DATOS DE PRUEBA; después cada función pasa a ser un fetch
 * a la API central, siempre "dentro" de un centro:  GET /centros/:slug , GET /centros/:slug/familia/hoy , etc.
 * La API es la que garantiza que una familia solo ve datos de su centro y de sus hijos.
 */
import { CENTROS as CENTROS_INICIALES } from "../data/centros.js";
const CENTROS = structuredClone(CENTROS_INICIALES);
import { FAMILIAS } from "../data/familias.js";

export const USING_MOCK = true;
const DEMO_PASSWORD = "kinima2026";
const db = { familias: structuredClone(FAMILIAS) };
const wait = (v, ms = 200) => new Promise((r) => setTimeout(() => r(structuredClone(v)), ms));
const fail = (m, ms = 350) => new Promise((_, rej) => setTimeout(() => rej(new Error(m)), ms));

export const getCentros = () => wait(Object.values(CENTROS).map(({ slug, nombre, ciudad, tema, iniciales, logo }) => ({ slug, nombre, ciudad, tema, iniciales, logo })), 100);
export function getCentro(slug) {
  const c = CENTROS[slug];
  return c ? wait(c, 120) : fail("No encontramos ese centro.");
}

export function login(slug, email, password) {
  const f = db.familias.find((x) => x.centro === slug && x.email === email.trim().toLowerCase());
  if (!f || password !== DEMO_PASSWORD) return fail("El mail o la contraseña no son correctos para este centro.");
  return wait({ token: "demo", familia: { email: f.email, nombre: f.nombre, centro: slug, hijos: f.hijos.map((h) => ({ id: h.id, nombre: h.nombre, edad: h.edad, color: h.color })) } }, 450);
}

const fam = (slug, email) => db.familias.find((x) => x.centro === slug && x.email === email);
const mismoDia = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

export function getHijo(slug, email, hijoId) {
  const h = fam(slug, email)?.hijos.find((x) => x.id === hijoId);
  if (!h) return fail("No encontramos estos datos.");
  const ses = [...h.sesiones].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const hoySes = ses.filter((s) => mismoDia(s.fecha, Date.now()));
  const semana = [...Array(7)].map((_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - d.getDay() + 1 + i - (d.getDay() === 0 ? 7 : 0)); return d; });
  const dias = semana.map((d) => ({ fecha: d.toISOString(), toca: h.rutina.dias.includes(d.getDay()), jugo: ses.some((s) => mismoDia(s.fecha, d)) }));
  let racha = 0; { const d = new Date(); if (!ses.some((s) => mismoDia(s.fecha, d))) d.setDate(d.getDate() - 1); while (ses.some((s) => mismoDia(s.fecha, d))) { racha++; d.setDate(d.getDate() - 1); } }
  const ult = ses.slice(0, 3), prev = ses.slice(3, 6);
  const avg = (a) => a.reduce((t, s) => t + s.aciertos / s.objetivos, 0) / (a.length || 1);
  return wait({
    ...h,
    hoy: { toca: h.rutina.dias.includes(new Date().getDay()), jugo: hoySes.length > 0, sesion: hoySes[0] || null },
    semana: dias, racha,
    minutosMes: ses.filter((s) => new Date(s.fecha).getMonth() === new Date().getMonth()).reduce((t, s) => t + s.minutos, 0),
    sesionesTotal: ses.length,
    mejorando: prev.length ? avg(ult) >= avg(prev) : null,
    sesiones: ses,
    logros: logros(ses, racha, dias),
  });
}

function logros(ses, racha, dias) {
  return [
    { id: "primera", t: "Primera partida", d: "Jugó su primera sesión", ok: ses.length >= 1, forma: "estrella" },
    { id: "racha3", t: "3 días seguidos", d: "Jugó tres días sin cortar", ok: racha >= 3 || ses.length >= 6, forma: "rayo" },
    { id: "semana", t: "Semana completa", d: "Cumplió todos los días de la rutina", ok: dias.filter((x) => x.toca).every((x) => x.jugo || new Date(x.fecha) > new Date()), forma: "sol" },
    { id: "diez", t: "10 partidas", d: "Ya jugó 10 veces", ok: ses.length >= 10, forma: "corazon" },
    { id: "veinte", t: "20 partidas", d: "Jugó 20 veces", ok: ses.length >= 20, forma: "flor" },
  ];
}

export function registrarAnimo(slug, email, hijoId, sesionId, animo) {
  const s = fam(slug, email).hijos.find((x) => x.id === hijoId).sesiones.find((x) => x.id === sesionId);
  s.animo = animo;
  return wait({ ok: true }, 250);
}

export function enviarMensaje(slug, email, hijoId, texto) {
  const h = fam(slug, email).hijos.find((x) => x.id === hijoId);
  const m = { id: `m${Date.now()}`, de: "familia", autor: "Vos", texto, fecha: new Date().toISOString() };
  h.mensajes.push(m);
  return wait(m, 300);
}

/* ---------- panel del centro (lo usa el administrador de cada centro) ---------- */
export function actualizarCentro(slug, cambios) {
  Object.assign(CENTROS[slug], cambios);
  return wait(CENTROS[slug], 250);
}
export function publicarNoticia(slug, { titulo, resumen, cuerpo, etiqueta, fijada }) {
  const c = CENTROS[slug];
  if (fijada) c.noticias.forEach((n) => { n.fijada = false; });
  const n = { id: `n${Date.now()}`, titulo, resumen, cuerpo: cuerpo || resumen, etiqueta, fijada, fecha: new Date().toISOString() };
  c.noticias.unshift(n);
  return wait(n, 300);
}
export function borrarNoticia(slug, id) {
  CENTROS[slug].noticias = CENTROS[slug].noticias.filter((n) => n.id !== id);
  return wait({ ok: true }, 150);
}
