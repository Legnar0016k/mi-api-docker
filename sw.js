//*********************************************************************** */
const CACHE_NAME = 'bcv-monitor-v' + new Date().getTime(); // Esto genera un nombre único cada vez
const assets = [

    '/',           // Referencia a la raíz
    'index.html',  // El archivo en la raíz

    // Estilos
    './public/css/style1.css',
    './public/css/style2.css',
    './public/css/style3.css',
    './public/css/history.css',
  
    // Core (Sigue el mismo orden de tu app-loader)
    './public/scripts/core/app-loader.js',
    './public/scripts/core/theme-manager.js',
    //'./public/scripts/core/scraper-respaldo.js',
    //'./public/scripts/core/validador.js',
    //'./public/scripts/core/validador-pro.js',
    //'./public/scripts/core/validador-ui.js',
    //'./public/scripts/core/supervisor.js',
    './public/scripts/core/monitor-master.js',
  
    // UI
    './public/scripts/ui/ui-render.js',
    './public/scripts/ui/ui-features.js',
    './public/scripts/ui/calc-logic.js',
    './public/scripts/ui/history-charts.js', // Agregado explícitamente
    
    // Otros
    './public/scripts/debug/recovery-logic.js',
    './public/assets/manifest.json',
    './public/assets/icon-512.png'

];
//*********************************************************************** */
// // Instalación (Logica antigua de instalacion)
// self.addEventListener('install', event => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
//     );
// });
//*********************************************************************** */
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
//*********************************************************************** */
// Activación y limpieza de caches viejos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    );
});
//*********************************************************************** */
// Estrategia: Red primero, si falla, usar cache
self.addEventListener('fetch', event => {
    // PRIORIDAD: No tocar peticiones de API. Dejar que el navegador las maneje 
    // directamente para evitar que el SW bloquee los headers de CORS.
    if (
        event.request.url.includes('railway.app') || 
        event.request.url.includes('dolarapi.com') ||
        event.request.url.includes('jsdelivr.net') // Chart.js CDN
    ) {
        return; 
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            // Retorna cache, si no existe va a la red
            return response || fetch(event.request);
        }).catch(() => {
            // Si todo falla (offline total)
            if (event.request.mode === 'navigate') {
                return caches.match('index.html');
            }
        })
    );
});

// Al final de tu sw.js*****************************************************
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
//*********************************************************************** */