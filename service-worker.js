// service-worker.js

const CACHE_NAME = 'recipe-planner-v1';

// cache for offline use
const ASSETS_TO_CACHE = [
    '/',                        // index.html
    '/index.html',
    '/pages/about.html',
    '/pages/all-recipes.html',
    '/pages/add-recipe.html',
    '/pages/recipe.html',
    '/pages/buy-list.html',
    '/pages/offline.html',       // Offline page
    '/css/style.css',

    // .js files
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

// Cache all during installation
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
    self.skipWaiting(); // activate worker
});

// Remove old caches on activation
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME) // Filter out current cache
                    .map(key => caches.delete(key))   // Delete old caches
            )
        )
    );
    self.clients.claim(); 
});


// Cache-first with offline support
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedRes => {
            if (cachedRes) return cachedRes;

            return fetch(event.request)
                .then(networkRes => {
                    // Cache saved-recipes.json for offline use
                    if (event.request.url.endsWith('saved-recipes.json')) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, networkRes.clone());
                        });
                    }
                    return networkRes;
                })
                .catch(() => {
                    // Offline for HTML pages
                    if (event.request.headers.get('accept')?.includes('text/html')) {
                        return caches.match('/pages/offline.html');
                    }
                    // Offline for saved-recipes.json
                    if (event.request.url.endsWith('saved-recipes.json')) {
                        return caches.match(event.request);
                    }
                });
        })
    );
});

// Update cached recipes from page scripts
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'UPDATE_RECIPES' && Array.isArray(event.data.recipes)) {
        caches.open(CACHE_NAME).then(cache => {
            const response = new Response(JSON.stringify(event.data.recipes), {
                headers: { 'Content-Type': 'application/json' }
            });
            cache.put('/saved-recipes.json', response);
            console.log('[Service Worker] saved-recipes.json cache updated via message');
        });
    }
});
