/**
 * 🛡️ CENTINELA DE RECUPERACIÓN PRO (V4.0) - NÚCLEO AUTÓNOMO
 * Validación dinámica mediante comparación con Terceros (DolarApi).
 */

(function() {
    let recoveryAttempts = 0;
    const MARGEN_TOLERANCIA = 0.10; // 10% de diferencia permitida

    const Centinela = {
        // 1. Obtiene la "Verdad de Mercado" en tiempo real
        async obtenerReferenciaDinamica() {
            try {
                const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
                const data = await res.json();
                return data.promedio || data.compra || null;
            } catch (e) {
                console.error("🛡️ Centinela: Imposible contactar referencia externa.");
                return null;
            }
        },

        async verificarSaludVisual() {
            const priceLabel = document.getElementById('price');
            const statusLabel = document.getElementById('sync-status');
            if (!priceLabel) return;

            const precioUI = parseFloat(priceLabel.innerText.replace(',', '.'));
            const refMercado = await this.obtenerReferenciaDinamica();

            if (!refMercado) return; // Si no hay internet para la ref, no juzgamos

            // 2. CÁLCULO DE LÍMITES DINÁMICOS
            const minAceptable = refMercado * (1 - MARGEN_TOLERANCIA);
            const maxAceptable = refMercado * (1 + MARGEN_TOLERANCIA);

            // 3. EVALUACIÓN DE ANOMALÍAS
            const esPrecioLoco = precioUI > 0 && (precioUI < minAceptable || precioUI > maxAceptable);
            const estaVacio = priceLabel.innerText.includes('--');
            const esEstadoFallo = statusLabel && statusLabel.innerText.includes('FAIL');

            if (esPrecioLoco || estaVacio || esEstadoFallo) {
                const causa = esPrecioLoco ? `Precio UI (${precioUI}) fuera de rango mercado (${minAceptable.toFixed(2)}-${maxAceptable.toFixed(2)})` : "Fallo de carga";
                this.ejecutarProtocoloRecuperacion(causa);
            }
        },

        async ejecutarProtocoloRecuperacion(motivo) {
            recoveryAttempts++;
            console.warn(`🚨 Centinela Autónomo: Actuando por: ${motivo}`);
            
            // Limpieza de estados
            localStorage.removeItem('cache_tasa_bcv_usd');
            
            // Re-activación de arterias
            if (typeof supervisorFetch === 'function') supervisorFetch();
            if (typeof fetchEuro === 'function') fetchEuro();
        },

        iniciarVigilancia() {
            console.log("🛡️ Centinela V4.0: Vigilancia basada en referencia dinámica activa.");
            // Chequeo cada 30 segundos (más relajado para no saturar APIs)
            setInterval(() => this.verificarSaludVisual(), 30000);
        }
    };

    window.addEventListener('load', () => Centinela.iniciarVigilancia());
})();