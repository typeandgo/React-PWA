/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-globals */

var CACHE_STATIC_NAME = 'static-v3';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';
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
var MAX_CACHE_ITEMS = 20;

function isInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
    // console.log('matched ', string);
    cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
    cachePath = string; // store the full request (for CDNs)
  }
  return array.indexOf(cachePath) > -1;
};

function trimCache(cacheName, maxItems) {
  caches.open(cacheName)
    .then(function(cache) {
      return cache.keys()
        .then(function(keys) {
          if (keys.length > maxItems) {
            cache.delete(keys[0])
              .then(trimCache(cacheName, maxItems));
          };
        });
    });
};

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

  // DELETE OLD CACHES
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[SW] Removing old cache: ', key);
            return caches.delete(key)
          }
        }));
      })
  );

  return self.clients.claim();
});

// STRATEGY: BOTH: 1- Cache then Network / 2- Cache Only / 3- Cahce with Network fallback
self.addEventListener('fetch', function(event) {
  var apiUrl = 'http://localhost:3004/posts';

  // 1- Cahce then Network
  if (event.request.url.indexOf(apiUrl) > -1) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
        .then(function(cache) {
          return fetch(event.request)
            .then(function(res) {
              trimCache(CACHE_DYNAMIC_NAME, MAX_CACHE_ITEMS);
              cache.put(event.request.url, res.clone());
              return res;
            });
        })
    );
  } 

  // 2- Cache Only
  else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(
      caches.match(event.request)
    );
  }

  // 3- Cache with Network fallback
  else {
    event.respondWith(
      // Retrieve data from cache if available
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            // Return from cahce
            return response;
          } else {
            // Return from network
            return fetch(event.request)

              // DYNAMIC CACHING
              // Cache every fetched data not list in static cache
              .then(function(res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function(cache) {
                    trimCache(CACHE_DYNAMIC_NAME, MAX_CACHE_ITEMS);
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              })
              .catch(function(err) {
                console.log('Fetch error: ', err);
                return caches.open(CACHE_STATIC_NAME)
                  .then(function(cache) {
                    if (event.request.headers.get('accept').includes('text/html')) {
                      return cache.match('/fallback');
                    };
                  });
              });
          };
      })
    );
  };
});


// STRATEGY: Cahce Only
// Dangerous for dynamic content site
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// });

// STRATEGY: Network Only
// Normal behavior (don't cache anything)
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//   );
// });

// STRATEGY: Cahce with Network Fallback
// self.addEventListener('fetch', function(event) {
//   // console.log('[SW] Fetching something...', event);
//   event.respondWith(

//     // Retrieve data from cache if available
//     caches.match(event.request)
//       .then(function(response) {
//         if (response) {
//           // Return from cahce
//           return response;
//         } else {
//           // Return from network
//           return fetch(event.request)

//             // DYNAMIC CACHING
//             // Cache every fetched data not list in static cache
//             .then(function(res) {
//               return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//             })
//             .catch(function(err) {
//               console.log('Fetch error: ', err);
//               return caches.open(CACHE_STATIC_NAME)
//                 .then(function(cache) {
//                   return cache.match('/fallback');
//                 })
//             })
//         }
//       })
//   );
// });

// STRATEGY: Network with cache fallback (Network first with dynamic caching)
// Firstly request data from network
// If request fails, return data from cache
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function(res) {
//         return caches.open(CACHE_DYNAMIC_NAME)
//             .then(function(cache) {
//               cache.put(event.request.url, res.clone());
//               return res;
//             })
//       })
//       .catch(function(err) {
//         return caches.match(event.request);
//       })    
//   );
// });