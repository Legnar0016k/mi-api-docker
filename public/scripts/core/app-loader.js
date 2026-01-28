/**
 * 🧠 APP-LOADER (CENTRAL CORE)
 * El único punto de entrada para todos los módulos del sistema.
 */

const AppLoader = {
    // Definimos el orden de importancia (Jerarquía de carga)  
    modules: [

   
        // 1. UTILIDADES Y OBTENCIÓN (Los cimientos)
        'public/scripts/core/scraper-respaldo.js', // Trae el dato del servidor

        // 2. PROCESAMIENTO Y VALIDACIÓN (La inteligencia)
        'public/scripts/core/validador.js',        // Base original
        'public/scripts/core/validador-pro.js',    // Lógica avanzada
        'public/scripts/core/validador-ui.js',     // Conexión lógica-pantalla

        // 3. RENDERIZADO Y UI (Lo que el usuario ve)
        'public/scripts/ui/ui-render.js',
        'public/scripts/ui/ui-features.js',
        'public/scripts/ui/calc-logic.js',

        // 4. CONTROL Y SUPERVISIÓN (Los directores de orquesta)
        // Se cargan al final para asegurar que todas las funciones anteriores ya existan
        'public/scripts/core/supervisor.js',
        'public/scripts/core/monitor-master.js',

        // 5. SISTEMAS DE EMERGENCIA
        'public/scripts/debug/recovery-logic.js',

        // 6. LOGICA PARA MANEJAR EL THEMA CLARO
        'public/scripts/core/theme-manager.js'

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


// // En app-loader.js, después de cargar tus módulos
// document.addEventListener('themeChanged', (event) => {
//     console.log('Tema cambiado a:', event.detail.theme);
    
//     // Si necesitas recargar algún dato o reinicializar componentes
//     // Por ejemplo, si usas gráficos que necesitan recolorearse
//     if (typeof supervisorFetch === 'function') {
//         supervisorFetch();
//     }
// });

// Arrancamos el motor
AppLoader.init();