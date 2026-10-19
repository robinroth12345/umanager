// Lehrerpult – Offline-Unterstützung: hält die App-Datei im Zwischenspeicher,
// damit sie auch ohne Internet (z. B. in der Sporthalle) startet.
// Nur erfolgreiche Antworten werden gespeichert: Ist die Seite einmal nicht erreichbar
// (z. B. Netlify pausiert), startet die zuletzt funktionierende Version aus dem Speicher.
const CACHE = 'lehrerpult-v8';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/ics/') || url.pathname.endsWith('version.json')) return;
  const fromCache = () => caches.match(req, { ignoreSearch: true }).then(m => m || caches.match('./'));
  e.respondWith(
    fetch(req).then(res => {
      if (!res.ok || (req.mode === 'navigate' && !/text\/html/.test(res.headers.get('content-type') || ''))) return fromCache().then(m => m || res);
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => fromCache())
  );
});
