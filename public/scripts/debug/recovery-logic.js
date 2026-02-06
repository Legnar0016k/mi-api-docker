/**
 * 🛡️ CENTINELA DE RECUPERACIÓN PRO (V2.1)
 * Detecta estados críticos y fuerza el reinicio del supervisor.
 */

(function() {
    let recoveryAttempts = 0;
    
    const Centinela = {
        verificarSaludVisual() {
            const statusLabel = document.getElementById('sync-status');
            const priceLabel = document.getElementById('price');
            
            if (!statusLabel || !priceLabel) return;

            const esFallo = statusLabel.innerText.includes('FAIL') || statusLabel.innerText.includes('ERROR');
            const precioBasura = parseFloat(priceLabel.innerText) > 100;

            if (esFallo || precioBasura) {
                recoveryAttempts++;
                console.warn(`🛡️ Centinela: Anomalía detectada (Intento ${recoveryAttempts}). Reiniciando Supervisor...`);
                
                // Limpiamos caché de sesión para forzar descarga limpia
                localStorage.removeItem('cache_tasa_bcv_usd');
                
                // Llamamos a la función global del supervisor
                if (typeof supervisorFetch === 'function') {
                    supervisorFetch();
                }
            }
        },

        iniciarVigilancia() {
            console.log("🛡️ Centinela Pro: Vigilancia activa contra errores 502 y tasas locas.");
            // Chequeo de salud cada 15 segundos
            setInterval(() => this.verificarSaludVisual(), 15000);
        }
    };

    document.addEventListener('DOMContentLoaded', () => Centinela.iniciarVigilancia());
})();