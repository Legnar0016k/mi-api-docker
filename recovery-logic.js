/**
 * MONITOR - MÓDULO DE AUTO-RECUPERACIÓN (V1.0)
 * Objetivo: Restaurar la conexión automáticamente tras un SINCRO FAIL.
 * Integridad: No modifica el código fuente original.
 */

(function() {
    let recoveryAttempts = 0;
    const MAX_INTERVAL = 30000; // Máximo esperar 30 segundos entre intentos
    const BASE_INTERVAL = 5000;  // Empezar intentando cada 5 segundos

    console.log("🛡️ Centinela de Recuperación: Activo y vigilando...");

    const attemptReconnection = async () => {
        // Solo actuamos si el sistema está en estado de fallo total
        // Asumimos que su renderer o supervisor marca el estado en el DOM o variable global
        const statusLabel = document.getElementById('sync-status'); // Ajuste según su ID real
        
        if (statusLabel && statusLabel.innerText.includes('FAIL')) {
            recoveryAttempts++;
            console.warn(`🔄 Intento de recuperación #${recoveryAttempts}...`);

            try {
                // Llamamos a la función de carga original que ya existe en su supervisor.js
                if (typeof window.fetchTasa === 'function') {
                    await window.fetchTasa();
                    
                    // Si llegamos aquí sin error, el sistema debería haber vuelto a OK
                    console.log("✅ ¡Conexión restaurada con éxito!");
                    recoveryAttempts = 0; // Reiniciar contador
                }
            } catch (error) {
                console.error("❌ Fallo en el intento de reconexión. Reintentando...");
            }
        }

        // Calcular el próximo intervalo (Backoff algorítmico)
        const nextWait = Math.min(BASE_INTERVAL * Math.pow(1.5, recoveryAttempts), MAX_INTERVAL);
        setTimeout(attemptReconnection, nextWait);
    };

    // Iniciamos el ciclo de vigilancia
    setTimeout(attemptReconnection, BASE_INTERVAL);
})();