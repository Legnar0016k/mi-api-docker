/**
 * SISOV MONITOR - PRUEBA DE RESILIENCIA DINÁMICA 🧪
 * Objetivo: Sabotaje temporal seguido de auto-recuperación.
 */

(function() {
    const backupFetch = window.fetch; // Guardamos el fetch real
    console.warn("💀 [FASE 1] INICIANDO CAOS: El sistema va a fallar ahora...");

    // 1. Sabotaje: Bloqueamos la red globalmente
    window.fetch = function() {
        return Promise.reject(new TypeError("Red Saboteada para Test de Resiliencia"));
    };

    // 2. Cronómetro de Recuperación: El sabotaje dura solo 15 segundos
    setTimeout(() => {
        console.log("♻️ [FASE 2] CESANDO SABOTAJE: Restaurando acceso a red...");
        
        // Restauramos el fetch original
        window.fetch = backupFetch;
        
        console.log("⏳ Esperando que el Centinela de Recuperación haga su trabajo...");
    }, 15000); 

})();