/*
 * Suscripción a notificaciones push para la app de familias. Requiere el Service Worker
 * (public/sw.js, registrado en main.jsx) y la clave pública VAPID que entrega la API
 * (ver docs/contrato-api.md, "Notificaciones push" en kinima-central).
 */
import * as apiFamilia from "./apiFamilia.js";

export const soportaPush = () =>
  "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

function base64UrlABytes(base64Url) {
  const base64 = (base64Url + "=".repeat((4 - (base64Url.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

/* Estado actual: "no-soportado" | "denegado" | "suscripto" | "disponible" (soportado, permiso
   todavía no pedido o concedido pero sin suscripción activa, p. ej. tras limpiar datos). */
export async function estadoPush() {
  if (!soportaPush()) return "no-soportado";
  if (Notification.permission === "denied") return "denegado";
  const registro = await navigator.serviceWorker.getRegistration();
  const suscripcion = await registro?.pushManager.getSubscription();
  return suscripcion ? "suscripto" : "disponible";
}

export async function activarPush() {
  if (!soportaPush()) throw new Error("Este navegador no soporta notificaciones push.");
  const permiso = await Notification.requestPermission();
  if (permiso !== "granted") throw new Error("No diste permiso para las notificaciones.");

  const registro = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  const { publicKey } = await apiFamilia.getPushPublicKey();
  if (!publicKey) throw new Error("El servidor todavía no tiene configuradas las notificaciones push.");

  let suscripcion = await registro.pushManager.getSubscription();
  if (!suscripcion) {
    suscripcion = await registro.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlABytes(publicKey),
    });
  }
  await apiFamilia.suscribirPush(suscripcion.toJSON());
  return suscripcion;
}

export async function desactivarPush() {
  const registro = await navigator.serviceWorker.getRegistration();
  const suscripcion = await registro?.pushManager.getSubscription();
  if (!suscripcion) return;
  const endpoint = suscripcion.endpoint;
  await suscripcion.unsubscribe().catch(() => {});
  await apiFamilia.cancelarPush(endpoint).catch(() => {});
}
