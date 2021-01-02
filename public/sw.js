/* eslint-disable no-restricted-globals */

self.addEventListener('install', function(event) {
  console.log('[SW] Installing service worker...');
});

self.addEventListener('activate', function(event) {
  console.log('[SW] Activating service worker...');
  return self.clients.claim();
});
