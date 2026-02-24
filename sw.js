const CACHE_NAME = "ciza-logistics-v2";

const CORE_ASSETS = [
  "/ciza-logistics/admin/admin-parcel.html"
];

// INSTALL
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS);
    })
  );
});

// ACTIVATE (supprime anciens caches)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH STRATEGY
self.addEventListener("fetch", event => {

  // Ne pas interférer avec Firebase / API
  if (event.request.url.includes("firestore") ||
      event.request.url.includes("firebase") ||
      event.request.url.includes("googleapis")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
