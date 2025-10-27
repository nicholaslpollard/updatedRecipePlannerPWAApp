const CACHE_NAME = 'recipe-planner-v1';

// Cacheable assets for offline use
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/pages/about.html',
    '/pages/all-recipes.html',
    '/pages/add-recipe.html',
    '/pages/recipe.html',
    '/pages/buy-list.html',
    '/pages/offline.html',  // Offline page
    '/css/style.css',
    '/js/navbar.js',
    '/js/add-recipe.js',
    '/js/all-recipes.js',
    '/js/recipe.js',
    '/js/buy-list.js',
    '/manifest.json',
    '/saved-recipes.json',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();  // Skip waiting to activate the new service worker immediately
});

// Activate the service worker and remove old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);  // Delete old caches
                    }
                })
            );
        })
    );
    self.clients.claim();  // Claim control over the clients immediately
});

// Fetch event - serve cached resources or network if online
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedRes) => {
            if (cachedRes) return cachedRes;

            return fetch(event.request)
                .then((networkRes) => {
                    if (event.request.url.endsWith('saved-recipes.json')) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkRes.clone());
                        });
                    }
                    return networkRes;
                })
                .catch(() => {
                    if (event.request.headers.get('accept')?.includes('text/html')) {
                        return caches.match('/pages/offline.html');  // Show offline page if HTML request fails
                    }

                    // Handle fetching of saved-recipes.json while offline
                    if (event.request.url.endsWith('saved-recipes.json')) {
                        return caches.match(event.request);  // Serve cached JSON if available
                    }
                });
        })
    );
});
