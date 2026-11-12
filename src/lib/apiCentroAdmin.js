/*
 * Conexión con la API central para la cuenta de administración de centro (ver docs/contrato-api.md,
 * sección "Centros (multi-tenant)"). Es un tipo de cuenta aparte de familia/profesional: solo
 * administra el contenido de SU centro (noticias, eventos, info), nunca pacientes ni rutinas.
 */
const API = ["localhost", "127.0.0.1"].includes(location.hostname) ? "/api/v1/centro-admin" : "https://api.kinima.uy/api/v1/centro-admin";
const KEY = "kinima-centro-admin-token";
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
    window.dispatchEvent(new Event("kinima:centro-admin-sesion-vencida"));
  }
  if (!res.ok) throw Object.assign(new Error(data?.error?.message || "Algo salió mal en el servidor."), { status: res.status, code: data?.error?.code });
  return data;
}

export async function entrar(email, password) {
  const r = await req("/auth/login", { method: "POST", body: { email: email.trim(), password } });
  guardarToken(r.accessToken);
  return r.centroAdmin;
}
export const salir = () => guardarToken(null);
export const hayToken = () => !!token;

export async function getCentro() {
  const { centro, noticias, eventos } = await req("/centro");
  return {
    nombre: centro.nombre, nombreCorto: centro.nombreCorto, tema: centro.tema, bienvenida: centro.bienvenida,
    ciudad: centro.ciudad, direccion: centro.direccion, horarios: centro.horarios, telefono: centro.telefono,
    whatsapp: centro.whatsapp, emailContacto: centro.emailContacto,
    noticias: noticias.map((n) => ({ id: n.id, etiqueta: n.etiqueta, titulo: n.titulo, cuerpo: n.cuerpo, fijada: n.fijada, fecha: n.fecha })),
    eventos: eventos.map((e) => ({ id: e.id, titulo: e.titulo, lugar: e.lugar, detalle: e.detalle, fecha: e.fecha })),
  };
}
export async function actualizarCentro(campos) {
  await req("/centro", { method: "PATCH", body: campos });
  return { ok: true };
}
export async function publicarNoticia(noticia) {
  const { noticia: n } = await req("/noticias", { method: "POST", body: noticia });
  return n;
}
export async function borrarNoticia(id) {
  await req(`/noticias/${id}`, { method: "DELETE" });
  return { ok: true };
}
export async function crearEvento(evento) {
  const { evento: e } = await req("/eventos", { method: "POST", body: evento });
  return e;
}
export async function borrarEvento(id) {
  await req(`/eventos/${id}`, { method: "DELETE" });
  return { ok: true };
}
