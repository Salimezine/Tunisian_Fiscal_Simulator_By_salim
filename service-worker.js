const CACHE_NAME = 'fiscal-tn-v2026-1';
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

// Install Event - Cache Files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching all: app shell and content');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Fetch Event - Serve from Cache or Network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache Hit - Return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
