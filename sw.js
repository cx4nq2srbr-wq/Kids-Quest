const CACHE_NAME = 'quest-log-v1.0.6 '; // Increment this to force an update!
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Force the new service worker to take over immediately
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});

// Listen for a request from index.html for the version name
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.source.postMessage({
      type: 'VERSION_INFO',
      version: CACHE_NAME // This sends back 'quest-log-v1.0.4' (or whatever you named it)
    });
  }
});