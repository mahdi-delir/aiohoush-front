const ICON = "/pwa/icon-192.77fe40f0.png";
const BADGE = "/pwa/badge-96.813a6b09.png";
const DEFAULT_URL = "/dashboard/notifications";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "آیوهوش";
  const options = {
    body: data.body || "",
    icon: ICON,
    badge: BADGE,
    dir: "rtl",
    lang: "fa",
    tag: data.tag || undefined,
    vibrate: [100, 50, 100],
    data: { url: data.url || DEFAULT_URL },
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      self.clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clients) => clients.forEach((client) => client.postMessage({ type: "announcement" }))),
    ]),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const path = (event.notification.data && event.notification.data.url) || DEFAULT_URL;
  const target = new URL(path, self.location.origin);
  const url = target.origin === self.location.origin ? target.href : new URL(DEFAULT_URL, self.location.origin).href;

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of clients) {
        if (new URL(client.url).origin !== self.location.origin) continue;
        try {
          await client.focus();
          if ("navigate" in client) await client.navigate(url);
          return;
        } catch {}
      }
      await self.clients.openWindow(url);
    })(),
  );
});
