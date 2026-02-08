/**
 * 🛠️ SERVICE WORKER - NIVEL 0 (Sincronizado)
 * Optimizado para el nuevo Ninja Scraper y estructura minimalista.
 */

const VERSION = 'v3.8.0-ninja'; // Versión manual para control de caché
const CACHE_NAME = `bcv-monitor-cache-${VERSION}`;

// Lista de activos esenciales (SÓLO lo que existe físicamente ahora)
const assets = [
    '/',
    'index.html',
    'app-loader.js',
    'sw.js',
    
    // Estilos (Verifica que las rutas coincidan con tu index.html)
    './public/styles/style1.css',
    './public/styles/style2.css',
    './public/styles/style3.css',
    './public/styles/theme-toggle.css',
    './public/styles/history.css',
  
    // Scripts Core
    './public/scripts/core/app-loader.js',
    './public/scripts/core/theme-manager.js',
    './public/scripts/core/scraper-respaldo.js', // El nuevo conector
  
    // Scripts UI
    './public/scripts/ui/ui-features.js',
    './public/scripts/ui/calc-logic.js',
    './public/scripts/ui/history-charts.js',
    
    // Assets
    './public/assets/manifest.json',
    './public/assets/icon-512.png'
];

// 1. INSTALACIÓN: Pre-cache de archivos estáticos
self.addEventListener('install', event => {
    self.skipWaiting(); // Fuerza la activación inmediata
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('📦 SW: Almacenando activos de Nivel 0...');
            return cache.addAll(assets).catch(err => {
                console.error('❌ SW: Error en pre-cache (revisa si falta un archivo):', err);
            });
        })
    );
});

// 2. ACTIVACIÓN: Limpieza de versiones antiguas
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    );
    console.log('🚀 SW: Sistema de caché actualizado a Nivel 0');
});

// 3. ESTRATEGIA DE PETICIÓN (FETCH)
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // EXCEPCIÓN CRÍTICA: No cachear nunca la API de Railway ni CDNs externos
    // Esto evita errores de CORS y asegura datos siempre frescos.
    if (
        url.hostname.includes('railway.app') || 
        url.hostname.includes('bcv.org.ve') ||
        url.hostname.includes('jsdelivr.net') ||
        url.hostname.includes('tailwindcss.com')
    ) {
        return; // Deja que el navegador maneje la red directamente
    }

    // Estrategia: Cache First, Fallback to Network para archivos locales
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(fetchRes => {
                // Opcional: Cachear dinámicamente nuevos archivos locales
                return fetchRes;
            });
        }).catch(() => {
            // Si el usuario está offline y pide una página, devolver el index.html
            if (event.request.mode === 'navigate') {
                return caches.match('index.html');
            }
        })
    );
});

// Escuchar mensajes del frontend para actualizar
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});