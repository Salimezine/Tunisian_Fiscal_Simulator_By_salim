const CACHE_NAME = 'fiscal-tn-v2026-5';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './ai-chat-styles.css',
    './ai-chat-widget.css',
    './print.css',
    './isaas_logo.jpg',
    './irpp.js',
    './is.js',
    './tva.js',
    './isf.js',
    './rs.js',
    './auto-entrepreneur.js',
    './conseiller.js',
    './assistant.js',
    './comparative.js',
    './wizard.js',
    './main.js',
    './dashboard.js',
    './avantages.js',
    './export-service.js',
    './legal-references.js',
    './ai-config.js',
    './ai-service.js',
    './calculation-context.js',
    './mode-manager.js',
    './rule-engine.js',
    './audit-mode-ui.js',
    './verify_calc.js',
    './is_algo_2026_strict.js',
    './i18n-data.js'
];

// Install Event - Cache Files & Force Activate
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Force new SW to activate immediately
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching all: app shell and content');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Fetch Event - Network First, Cache Fallback
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Update cache with fresh response
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Network failed, fall back to cache (offline support)
                return caches.match(event.request);
            })
    );
});

// Activate Event - Clean old caches & claim clients
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim(); // Take control of all open tabs
        })
    );
});
