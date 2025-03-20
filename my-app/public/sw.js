const CACHE_NAME = 'ai-clone-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png',
  '/icons/apple-touch-icon.png',
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});