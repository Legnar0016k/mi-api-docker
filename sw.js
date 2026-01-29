const CACHE_NAME = 'bcv-monitor-v' + new Date().getTime(); // Esto genera un nombre único cada vez
const assets = [

    '/',           // Referencia a la raíz
    './index.html',  // El archivo en la raíz

    // Estilos
    './public/css/style1.css',
    './public/css/style2.css', 
    './public/css/style3.css',
    './public/css/theme-toggle.css',
  
    // Core (Sigue el mismo orden de tu app-loader)
    './public/scripts/core/app-loader.js',
    './public/scripts/core/theme-manager.js',
    './public/scripts/core/scraper-respaldo.js',
    './public/scripts/core/validador.js',
    './public/scripts/core/validador-pro.js',
    './public/scripts/core/validador-ui.js',
    './public/scripts/core/supervisor.js',
    './public/scripts/core/monitor-master.js',
  
    // UI
    './public/scripts/ui/ui-render.js',
    './public/scripts/ui/ui-features.js',
    './public/scripts/ui/calc-logic.js',
    
    // Otros
    './public/scripts/debug/recovery-logic.js',
    './manifest.json',
    './favicon.ico',
    './public/assets/icon-512.png'

];

// // Instalación (Logica antigua de instalacion)
// self.addEventListener('install', event => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
//     );
// });

// Instalación corregida con captura de errores
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('SW: Pre-cacheando archivos...');
            return cache.addAll(assets).catch(err => {
                console.error('SW: Error crítico en addAll. Revisa si falta algún archivo:', err);
            });
        })
    );
});

// Activación y limpieza de caches viejos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    );
});

// Estrategia: Red primero, si falla, usar cache
self.addEventListener('fetch', event => {
    // No cachear peticiones a la API para evitar conflictos de CORS en el SW
    if (event.request.url.includes('railway.app') || event.request.url.includes('dolarapi.com')) {
        return; 
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request) || new Response("Offline", { status: 503 });
        })
    );
});

// Al final de tu sw.js
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});