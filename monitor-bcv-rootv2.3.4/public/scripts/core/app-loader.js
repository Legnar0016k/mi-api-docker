/**
 * 🧠 APP-LOADER (CENTRAL CORE)
 * El único punto de entrada para todos los módulos del sistema.
 */
const AppLoader = {
    // Definimos el orden de importancia (Jerarquía de carga)  
    modules: [
        
        './scripts/core/validador.js',
        './scripts/ui/ui-render.js',
        './scripts/core/supervisor.js',
        './scripts/ui/ui-features.js',
        './scripts/ui/calc-logic.js',
        './scripts/debug/recovery-logic.js'
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

// Arrancamos el motor
AppLoader.init();