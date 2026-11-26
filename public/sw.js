/*
 * Service worker de la app de familias: habilita que sea instalable (PWA) y recibe las
 * notificaciones push que manda la API (ejercicio nuevo, evento del centro, recordatorio diario).
 * No cachea rutas ni datos: familias.kinima.uy siempre se sirve online, así que no hace falta
 * un modo offline todavía (ver src/lib/push.js para la suscripción).
 */
self.addEventListener("install", () => { self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(self.clients.claim()); });

self.addEventListener("push", (event) => {
  let data = { title: "Kinima", body: "Tenés una novedad." };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch { /* si no viene JSON, se usa el mensaje genérico */ }

  const url = data.url || "/";
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: data.tag,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    (async () => {
      const clientsList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const existing = clientsList.find((c) => new URL(c.url).origin === self.location.origin);
      if (existing) {
        existing.navigate(url).catch(() => {});
        return existing.focus();
      }
      return self.clients.openWindow(url);
    })()
  );
});
