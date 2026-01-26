/**
 * 🧠 APP-LOADER (CENTRAL CORE)
 * El único punto de entrada para todos los módulos del sistema.
 */
const AppLoader = {
    // Definimos el orden de importancia (Jerarquía de carga)  
    modules: [
     
     //supervisor general del sistema   
    'public/scripts/core/supervisor.js',
     //compara apis para evitar resultados incoherente    
    'public/scripts/core/validador.js',
     //logica de renderisado de la aplicacion   
    'public/scripts/ui/ui-render.js',
     // sistema de recuperacion en dado caso que todo falle   
    'public/scripts/core/recovery-logic.js',
    
    'public/scripts/ui/ui-features.js',
     // logica de la culculadora   
    'public/scripts/ui/calc-logic.js'

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