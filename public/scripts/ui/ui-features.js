/**
 * UI FEATURES & MODALS 🛠️ - v3.8.5
 */

async function fetchEuro() {
    const euroElement = document.getElementById('euro-price');
    if (!euroElement) return;

    const CONFIG_EURO = {
        PRIMARY: 'https://mi-api-docker-production.up.railway.app/api/euro',
        FALLBACK: 'https://ve.dolarapi.com/v1/euros/oficial', // Fuente de respaldo
        TIMEOUT_MS: 3500 // 3.5 segundos para abortar Railway
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG_EURO.TIMEOUT_MS);

    try {
        // Intento 1: Railway (Tu API)
        const response = await fetch(`${CONFIG_EURO.PRIMARY}?t=${Date.now()}`, {
            signal: controller.signal
        });

        if (!response.ok) throw new Error('Railway Offline');
        
        const data = await response.json();
        clearTimeout(timeoutId);

        if (data.success) {
            UIRenderer.actualizarEuro(data.tasa, false);
            return;
        }
        throw new Error('Data Inválida');

    } catch (e) {
        clearTimeout(timeoutId);
        console.warn("🔔 Euro: Railway no responde. Activando respaldo DolarApi...");
        
        // Intento 2: Respaldo (DolarApi)
        try {
            const res = await fetch(CONFIG_EURO.FALLBACK);
            const data = await res.json();
            const tasaEuro = data.promedio || data.compra;
            
            if (tasaEuro) {
                console.log("✅ Euro: Respaldo activado con éxito.");
                UIRenderer.actualizarEuro(tasaEuro, true);
            }
        } catch (err) {
            console.error("❌ Euro: Fallo total de fuentes.");
            euroElement.innerText = "--.-- €";
        }
    }
}

// Funciones de la calculadora se mantienen igual...
window.addEventListener('load', fetchEuro);