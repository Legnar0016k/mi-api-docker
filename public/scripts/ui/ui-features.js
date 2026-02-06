/**
 * UI FEATURES & MODALS 🛠️ - v3.8.5
 */

async function fetchEuro() {
    const euroElement = document.getElementById('euro-price');
    if (!euroElement) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
        const response = await fetch('https://mi-api-docker-production.up.railway.app/api/euro', { signal: controller.signal });
        if (!response.ok) throw new Error('Railway Offline');
        const data = await response.json();
        if (data.success) {
            UIRenderer.actualizarEuro(data.tasa, false);
            return;
        }
    } catch (e) {
        console.warn("🔔 Euro: Activando respaldo...");
        try {
            // CORRECCIÓN DE ENDPOINT: /v1/dolares/euro
            const res = await fetch('https://ve.dolarapi.com/v1/dolares/euro');
            const data = await res.json();
            if (data.promedio || data.compra) {
                UIRenderer.actualizarEuro(data.promedio || data.compra, true);
            }
        } catch (err) {
            euroElement.innerText = "Error €";
        }
    } finally {
        clearTimeout(timeoutId);
    }
}

// Funciones de la calculadora se mantienen igual...
window.addEventListener('load', fetchEuro);