/**
 * 🧠 APP-LOADER (CENTRAL CORE)
 * El único punto de entrada para todos los módulos del sistema.
 */

const AppLoader = {
    // Definimos el orden de importancia (Jerarquía de carga)  
    modules: [

   
        // 1. UTILIDADES Y OBTENCIÓN (Los cimientos)
        //'public/scripts/core/scraper-respaldo.js', // Trae el dato del servidor

        // 2. PROCESAMIENTO Y VALIDACIÓN (La inteligencia)
        //'public/scripts/core/validador.js',        // Base original
        //'public/scripts/core/validador-pro.js',    // Lógica avanzada
        //'public/scripts/core/validador-ui.js',     // Conexión lógica-pantalla

        // 3. RENDERIZADO Y UI (Lo que el usuario ve)
        'public/scripts/ui/ui-render.js',
        'public/scripts/ui/ui-features.js',
        'public/scripts/ui/calc-logic.js', 

        // 4. CONTROL Y SUPERVISIÓN (Los directores de orquesta)
        // Se cargan al final para asegurar que todas las funciones anteriores ya existan
        //'public/scripts/core/supervisor.js',
        //'public/scripts/core/monitor-master.js',

        // 5. SISTEMAS DE EMERGENCIA
        'public/scripts/debug/recovery-logic.js',

        // 6. LOGICA PARA MANEJAR EL THEMA CLARO
        'public/scripts/core/theme-manager.js',

        
        

    ],

    // Módulos de prueba (Solo se cargan si estamos en modo debug)
    debugModules: [
        // 'fault-test.js',
        // 'chaos-and-recovery-test.js'
    ],

    

    init() {
        console.log("🚀 Iniciando sistema central...");
        const allToLoad = [...this.modules, ...this.debugModules];
        
        allToLoad.forEach(scriptName => {
            const script = document.createElement('script');
            script.src = `./${scriptName}`;
            script.async = false; // Mantiene el orden estricto de ejecución
            document.head.appendChild(script);
        });

        console.log(`📦 ${allToLoad.length} módulos inyectados correctamente.`);
    }
};

// Lógica de actualización automática
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
                // Cuando el nuevo SW esté instalado pero esperando
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('✨ Nueva versión detectada. Actualizando...');
                    
                    // Enviamos la orden al SW para que se active
                    newWorker.postMessage('SKIP_WAITING');
                }
            });
        });
    });

    // Este evento se dispara cuando el nuevo SW toma el control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            window.location.reload(); // Recarga la página automáticamente
            refreshing = true;
        }
    });
}



// Arrancamos el motor
AppLoader.init();