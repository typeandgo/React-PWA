/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-globals */

var CACHE_STATIC_NAME = 'static-v3';
var STATIC_FILES = [
  '/',
  '/index.html',
  '/fallback',
  '/static/js/bundle.js',
  '/static/js/0.chunk.js',
  '/static/js/main.chunk.js',
  'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500&display=swap',
  '/manifest.json',
  '/favicon.ico',
  '/images/icons/favicon-16x16.png',
  '/images/icons/favicon-32x32.png',
  '/images/icons/favicon-96x96.png',
  '/images/icons/apple-icon-57x57.png',
  '/images/icons/apple-icon-60x60.png',
  '/images/icons/apple-icon-72x72.png',
  '/images/icons/apple-icon-76x76.png',
  '/images/icons/apple-icon-114x114.png',
  '/images/icons/apple-icon-120x120.png',
  '/images/icons/apple-icon-144x144.png',
  '/images/icons/apple-icon-152x152.png',
  '/images/icons/apple-icon-180x180.png',
  '/images/icons/android-icon-192x192.png',
  '/images/icons/ms-icon-144x144.png',
  '/images/icons/icon-48x48.png',
  '/images/icons/icon-96x96.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-256x256.png',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-512x512.png'
];

self.addEventListener('install', function(event) {
  console.log('[SW] Installing service worker...');

  // STATIC CACHING (App Shell Caching)
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
          console.log('[SW] Precaching app shell...');
          cache.addAll(STATIC_FILES);
      })
  )
});

self.addEventListener('activate', function(event) {
  console.log('[SW] Activating service worker...');

  return self.clients.claim();
});

// STRATEGY: Cahce with Network Fallback
self.addEventListener('fetch', function(event) {
  // console.log('[SW] Fetching something...', event);
  
  event.respondWith(
    // Retrieve data from cache if available
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          // Return from cahce
          return response;
        } else {
          // Return from network
          return fetch(event.request);
        }
      })
  );
});
