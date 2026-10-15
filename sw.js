const APP_SCOPE = new URL('./', self.location.href).href;
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('push', event => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch (_) { payload = { body: event.data ? event.data.text() : '' }; }
  const title = payload.title || 'Hasini’s Diet Care';
  const options = {
    body: payload.body || 'You have a new client message.',
    icon: new URL('./icons/hasini-icon-192.png', APP_SCOPE).href,
    badge: new URL('./icons/hasini-icon-192.png', APP_SCOPE).href,
    tag: payload.tag || 'hasini-new-client-message',
    renotify: true,
    data: { url: payload.url || new URL('./admin.html', APP_SCOPE).href }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || './admin.html', APP_SCOPE).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if ('focus' in client && client.url.startsWith(APP_SCOPE)) {
        await client.navigate(target);
        return client.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(target);
  })());
});
