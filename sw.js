/**
 * 🛠️ SERVICE WORKER - NIVEL 0 (VERSIÓN 4.0.0)
 * Estrategia: Network First para scripts y datos.
 */

const VERSION = 'v4.0.0-final';
const CACHE_NAME = `bcv-monitor-cache-${VERSION}`;

const assets = [
    //LOGICA
    '/',
    'index.html',
    'public/scripts/core/app-loader.js',
    'public/scripts/core/scraper-respaldo.js',
    'public/scripts/ui/calc-logic.js',
    'public/scripts/core/theme-manager.js',
    'public/scripts/ui/ui-render.js',
    'public/assets/manifest.json',
    'public/scripts/ui/history.chart.js',
    //STYLOS
    'public/styles/estilosdeavisolegal.css',
    'public/styles/history.css',
    'public/styles/theme-toggle.css',
    'public/styles/style1.css',
    'public/styles/style2.css',
    'public/styles/style3.css',
    'public/assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // EXCEPCIONES: No cachear nunca la API de Railway ni CDNs
    if (url.hostname.includes('railway.app') || url.hostname.includes('tailwindcss.com')) {
        return;
    }

    // ESTRATEGIA: Network First para archivos de lógica (.js) y navegación
    // Esto evita que se quede "pegado" el cargando eterno.
    if (event.request.mode === 'navigate' || url.pathname.endsWith('.js')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
    } else {
        // Cache First para el resto (CSS, Imágenes)
        event.respondWith(
            caches.match(event.request).then(res => res || fetch(event.request))
        );
    }
});

self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') self.skipWaiting();
});