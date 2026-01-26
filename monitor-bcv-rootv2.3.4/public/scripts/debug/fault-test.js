// /**
//  * FAULT-TEST.JS 🧪
//  * Úsalo solo para pruebas. Corrompe la URL principal para forzar el SWAP.
//  */
// console.warn("⚠️ MODO DE PRUEBA: Forzando error en API Principal...");

// if (typeof CONFIG !== 'undefined') {
//     // Cambiamos la URL por una que de error 404
//     CONFIG.API_PRIMARY = 'https://mi-api-docker-production.up.railway.app/error-test';
//     console.log("🛠️ CONFIG.API_PRIMARY redirigida a ruta inexistente.");
// } else {
//     console.error("❌ No se encontró el objeto CONFIG. Asegúrate de cargar este script después de supervisor.js");
// }
//]=====================================================================================
/**
 * ⚠️ PROTOCOLO DE CAOS TOTAL - MONITOR BCV 🧪
 * Objetivo: Forzar el estado SINCRO FAIL (Rojo) y validar manejo de excepciones.
 */

(function() {
    console.warn("💀 SISTEMA EN MODO DE FALLA TOTAL: Iniciando sabotaje...");

    if (typeof CONFIG !== 'undefined') {
        // 1. Bloqueo de API Principal (Railway)
        CONFIG.API_PRIMARY = 'https://mi-api-docker-production.up.railway.app/force-error-404';
        
        // 2. Bloqueo de API de Respaldo (DolarApi)
        CONFIG.API_SECONDARY = 'https://dolarapi.com/v1/dolares/ruta-inexistente';
        
        // 3. Corrupción de Endpoints de Euro
        CONFIG.API_EURO = 'https://error-service.local/null';

        console.log("🚫 Endpoints de red: ELIMINADOS");
    } else {
        console.error("❌ Error Crítico: No se encontró el objeto CONFIG para sabotear.");
    }

    // 4. Sabotaje del Fetch Global
    // Esto evita que cualquier petición salga del navegador
    window.fetch = function() {
        return Promise.reject(new TypeError("Simulated Network Catastrophe (SISOV-DEBUG)"));
    };

    // 5. Corrupción del Validador
    if (window.Validador) {
        window.Validador.consultarReferencia = () => Promise.reject("Sabotaje de Peritaje");
    }

    console.warn("🚨 EL SISTEMA DEBE MARCAR: SINCRO FAIL");
})();