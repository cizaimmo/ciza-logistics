const CACHE_NAME = "ciza-logistics-v1";

const urlsToCache = [
  "/ciza-logistics/admin/admin-parcel.html",
  "/ciza-logistics/admin/admin-command.html",
  "/ciza-logistics/admin/admin-drivers.html",
  "/ciza-logistics/admin/admin-driver-payments.html",
  "/ciza-logistics/admin/internal-messages.html",
  "/ciza-logistics/admin/calendar.html",
  "/ciza-logistics/admin/bureau.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
