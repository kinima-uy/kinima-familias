/*
 * Conexión con la API central de Kinima para la app de familias (ver docs/contrato-api.md, sección
 * "Operación de la familia"). Mismo dominio que el portal, pero con su propio token: una familia
 * nunca puede usar su sesión para entrar a rutas de profesional/admin, ni al revés.
 */
/* El backend ahora vive en su propio dominio (api.kinima.uy), separado de esta app.
   En localhost seguimos pegándole a la API local para poder desarrollar sin desplegar. */
const API = ["localhost", "127.0.0.1"].includes(location.hostname) ? "/api/v1/family" : "https://api.kinima.uy/api/v1/family";
const KEY = "kinima-familia-token";
let token = (() => { try { return sessionStorage.getItem(KEY); } catch { return null; } })();
const guardarToken = (t) => { token = t; try { t ? sessionStorage.setItem(KEY, t) : sessionStorage.removeItem(KEY); } catch { /* sin almacenamiento */ } };

async function req(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(API + path, {
      method,
      headers: { ...(body ? { "content-type": "application/json" } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No pudimos conectar con el servidor. Revisá tu conexión e intentá de nuevo.");
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && path !== "/auth/login") {
    guardarToken(null);
    window.dispatchEvent(new Event("kinima:familia-sesion-vencida"));
  }
  if (!res.ok) throw Object.assign(new Error(data?.error?.message || "Algo salió mal en el servidor."), { status: res.status, code: data?.error?.code });
  return data;
}

export async function entrar(email, password) {
  const r = await req("/auth/login", { method: "POST", body: { email: email.trim(), password } });
  guardarToken(r.accessToken);
  return r.family;
}
export const salir = () => guardarToken(null);
export const hayToken = () => !!token;

export async function getPacientes() {
  const { patients } = await req("/patients");
  return patients.map((p) => ({ id: p.id, codigo: p.localCode, etiqueta: p.displayLabel, sinLeer: p.sinLeer || 0 }));
}
export async function getAsignacion(patientId) {
  const { assignment } = await req(`/patients/${patientId}/assignment`);
  return assignment;
}
export async function getSesiones(patientId, limit = 50) {
  const { sessions } = await req(`/patients/${patientId}/sessions?limit=${limit}`);
  return sessions;
}
export async function getMensajes(patientId) {
  const { messages } = await req(`/patients/${patientId}/messages`);
  return messages.map((m) => ({ id: m.id, de: m.de, texto: m.texto, fecha: m.fecha, leido: m.leido, autor: m.autor }));
}
export async function enviarMensaje(patientId, texto) {
  const { mensaje } = await req(`/patients/${patientId}/messages`, { method: "POST", body: { texto } });
  return { id: mensaje.id, de: mensaje.de, texto: mensaje.texto, fecha: mensaje.fecha, leido: mensaje.leido, autor: mensaje.autor };
}
export async function marcarLeidos(patientId) {
  await req(`/patients/${patientId}/messages/read`, { method: "POST" });
  return { ok: true };
}
export async function getCentro(patientId) {
  const { centro, noticias, eventos } = await req(`/patients/${patientId}/centro`);
  return {
    slug: centro.slug, nombre: centro.nombre, nombreCorto: centro.nombreCorto, tema: centro.tema,
    logoUrl: centro.logoUrl, ciudad: centro.ciudad, bienvenida: centro.bienvenida, direccion: centro.direccion,
    horarios: centro.horarios, telefono: centro.telefono, whatsapp: centro.whatsapp, emailContacto: centro.emailContacto,
    noticias: noticias.map((n) => ({ id: n.id, etiqueta: n.etiqueta, titulo: n.titulo, cuerpo: n.cuerpo, fijada: n.fijada, fecha: n.fecha })),
    eventos: eventos.map((e) => ({ id: e.id, titulo: e.titulo, lugar: e.lugar, detalle: e.detalle, fecha: e.fecha })),
  };
}
