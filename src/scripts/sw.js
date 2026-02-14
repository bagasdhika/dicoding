/* =========================================================
   SERVICE WORKER – FINAL MERGED STABLE VERSION
   ✔ Cache lama tetap
   ✔ Fetch strategy API tetap
   ✔ Push Dicoding + DevTools aman
   ✔ Notification click handler
   ✔ Tanpa error console
   ========================================================= */

/* =============================
   CACHE CONFIG
   ============================= */
const CACHE_NAME = 'dicoding-story-v5';

const STATIC_ASSETS = [
  '/',
  '/index.html',
];

/* =============================
   INSTALL
   ============================= */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of STATIC_ASSETS) {
        try {
          const response = await fetch(url);
          if (response && response.ok) {
            await cache.put(url, response.clone());
          }
        } catch (err) {
          console.log('[SW] Skip cache:', url);
        }
      }
    })
  );

  self.skipWaiting();
});

/* =============================
   ACTIVATE
   ============================= */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

/* =============================
   FETCH STRATEGY
   ============================= */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  /* ===== CACHE API STORY ===== */
  if (request.url.includes('story-api.dicoding.dev')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }

          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });

          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  /* ===== STATIC CACHE ===== */
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

/* =========================================================
   PUSH NOTIFICATION – FINAL SAFE
   Support:
   ✔ Push dari server Dicoding
   ✔ Push manual DevTools
   ✔ JSON / text fallback
   ========================================================= */
self.addEventListener('push', (event) => {
  console.log('[SW] Push Received');

  let title = 'Dicoding Story';
  let body = 'Story baru telah ditambahkan';
  let url = '/';

  if (event.data) {
    try {
      /* ===== COBa JSON ===== */
      try {
        const json = event.data.json();
        title = json.title || title;
        body = json.body || json.description || body;
        url = json.url || url;
      } catch {
        /* ===== FALLBACK TEXT ===== */
        body = event.data.text();
      }
    } catch (err) {
      console.error('[SW] Push parse error', err);
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      data: { url },
    })
  );
});

/* =========================================================
   NOTIFICATION CLICK
   ========================================================= */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl =
    event.notification?.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
