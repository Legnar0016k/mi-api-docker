/**
 * 🛡️ CENTINELA DE RECUPERACIÓN PRO (V2.0) - "sistema inmunologico del programa monitor del dolar"
 * Basado en la arquitectura del CHANGELOG v3.7.0
 */

(function() {
    let recoveryAttempts = 0;
    const CONFIG = {
        MAX_WAIT: 60000,    // 1 minuto máximo
        BASE_WAIT: 5000,    // 5 segundos base
        OFFLINE_MODE: !navigator.onLine
    };

    console.log("🛡️ Centinela Pro: Iniciando protocolos de defensa activa...");

    const checkHealth = async () => {
        const statusLabel = document.getElementById('sync-status');
        const isOffline = !navigator.onLine;

        // 1. DETECCIÓN DE DESCONEXIÓN FÍSICA
        if (isOffline) {
            console.warn("🛡️ Centinela: Detectada pérdida de internet local. Pausando intentos...");
            return; 
        }

        // 2. DETECCIÓN DE SINCRO FAIL (El "Estado de Emergencia")
        if (statusLabel && (statusLabel.innerText.includes('FAIL') || statusLabel.innerText.includes('ERROR'))) {
            recoveryAttempts++;
            
            console.log(`🚀 Centinela: Ejecutando Protocolo de Recuperación #${recoveryAttempts}`);

            try {
                // ACCIÓN 1: Forzar limpieza de caché si llevamos muchos fallos
                if (recoveryAttempts > 5) {
                    console.log("🛡️ Centinela: Demasiados fallos. Purgando caché del SW...");
                    if ('caches' in window) {
                        const keys = await caches.keys();
                        keys.forEach(key => caches.delete(key));
                    }
                }

                // ACCIÓN 2: Llamada al sistema central (Supervisor)
                // Usamos la lógica del app-loader para re-disparar el motor
                if (typeof window.supervisorFetch === 'function') {
                    await window.supervisorFetch();
                } else if (typeof window.fetchTasa === 'function') {
                    await window.fetchTasa();
                }

                // Si llegamos aquí y el status cambió, éxito
                if (!statusLabel.innerText.includes('FAIL')) {
                    console.log("✅ Centinela: ¡Sistema restaurado! Reiniciando contadores.");
                    recoveryAttempts = 0;
                }

            } catch (error) {
                console.error("❌ Centinela: Intento fallido. El enemigo persiste.");
            }
        }

        // 3. CÁLCULO DE REINTENTO (Backoff Algorítmico)
        const nextWait = Math.min(CONFIG.BASE_WAIT * Math.pow(1.2, recoveryAttempts), CONFIG.MAX_WAIT);
        setTimeout(checkHealth, nextWait);
    };

    // Escuchar cuando internet vuelve para actuar de inmediato
    window.addEventListener('online', () => {
        console.log("🌐 Centinela: ¡Internet detectado! Forzando reconexión inmediata...");
        recoveryAttempts = 0;
        checkHealth();
    });

    // Inicio del ciclo
    setTimeout(checkHealth, CONFIG.BASE_WAIT);
})();

// Se inhabilita toda la logica para dar paso a una nueva actualizacion 28/01/2026
/**
 * MONITOR - MÓDULO DE AUTO-RECUPERACIÓN (V1.0)
 * Objetivo: Restaurar la conexión automáticamente tras un SINCRO FAIL.
 * Integridad: No modifica el código fuente original.
 */

// (function() {
//     let recoveryAttempts = 0;
//     const MAX_INTERVAL = 30000; // Máximo esperar 30 segundos entre intentos
//     const BASE_INTERVAL = 5000;  // Empezar intentando cada 5 segundos

//     console.log("🛡️ Centinela de Recuperación: Activo y vigilando...");

//     const attemptReconnection = async () => {
//         // Solo actuamos si el sistema está en estado de fallo total
//         // Asumimos que su renderer o supervisor marca el estado en el DOM o variable global
//         const statusLabel = document.getElementById('sync-status'); // Ajuste según su ID real
        
//         if (statusLabel && statusLabel.innerText.includes('FAIL')) {
//             recoveryAttempts++;
//             console.warn(`🔄 Intento de recuperación #${recoveryAttempts}...`);

//             try {
//                 // Llamamos a la función de carga original que ya existe en su supervisor.js
//                 if (typeof window.fetchTasa === 'function') {
//                     await window.fetchTasa();
                    
//                     // Si llegamos aquí sin error, el sistema debería haber vuelto a OK
//                     console.log("✅ ¡Conexión restaurada con éxito!");
//                     recoveryAttempts = 0; // Reiniciar contador
//                 }
//             } catch (error) {
//                 console.error("❌ Fallo en el intento de reconexión. Reintentando...");
//             }
//         }

//         // Calcular el próximo intervalo (Backoff algorítmico)
//         const nextWait = Math.min(BASE_INTERVAL * Math.pow(1.5, recoveryAttempts), MAX_INTERVAL);
//         setTimeout(attemptReconnection, nextWait);
//     };

//     // Iniciamos el ciclo de vigilancia
//     setTimeout(attemptReconnection, BASE_INTERVAL);
// })();