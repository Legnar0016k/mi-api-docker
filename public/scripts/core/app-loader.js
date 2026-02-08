/**
 * 🧠 APP-LOADER (CENTRAL CORE) - NIVEL 0
 * El único punto de entrada optimizado para la nueva arquitectura.
 */

const AppLoader = {
    // Jerarquía de carga simplificada
    modules: [
        // 1. OBTENCIÓN DE DATOS (Cimientos)
        'public/scripts/core/scraper-respaldo.js', 

        // 2. INTERFAZ Y FUNCIONES (Módulos activos)
        //'public/scripts/ui/ui-features.js',
        'public/scripts/ui/calc-logic.js', 
        //'public/scripts/ui/history-charts.js',

        // 3. ESTÉTICA Y SEGURIDAD
        'public/scripts/core/theme-manager.js',
    ],

    init() {
        console.log("🚀 Iniciando sistema central Nivel 0...");
        
        this.modules.forEach(scriptName => {
            const script = document.createElement('script');
            script.src = `./${scriptName}`;
            script.async = false; // Mantiene el orden de ejecución
            document.head.appendChild(script);
        });

        console.log(`📦 ${this.modules.length} módulos esenciales inyectados.`);
    }
};

// --- GESTIÓN DE PWA Y ACTUALIZACIONES ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('✨ Nueva versión detectada. Actualizando...');
                    newWorker.postMessage('SKIP_WAITING');
                }
            });
        });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            window.location.reload();
            refreshing = true;
        }
    });
}

// Arrancamos el motor
AppLoader.init();