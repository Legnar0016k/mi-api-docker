const CACHE_NAME = 'bcv-monitor-v' + new Date().getTime(); // Esto genera un nombre único cada vez
const assets = [
  '/',           // Referencia a la raíz
  'index.html',  // El archivo en la raíz
  'public/assets/manifest.json',
  'public/assets/icon-512.png'
];

// Instalación
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
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