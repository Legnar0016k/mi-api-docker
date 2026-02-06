/**
 * UI FEATURES & MODALS 🛠️ - v4.0.0
 * Lógica para el Euro y la Calculadora con Respaldo Inteligente.
 */

async function fetchEuro() {
    const euroElement = document.getElementById('euro-price');
    if (!euroElement) return;

    // Aumentamos ligeramente el margen de espera para Railway
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
        // 1. Intentamos obtener el dato validado de nuestro servidor
        const response = await fetch('https://mi-api-docker-production.up.railway.app/api/euro', { 
            signal: controller.signal 
        });

        if (!response.ok) throw new Error('Railway Offline/503');

        const data = await response.json();
        if (data.success) {
            // Usamos el UIRenderer para mantener consistencia visual
            UIRenderer.actualizarEuro(data.tasa, data.fuente !== 'BCV_Oficial');
            return;
        }
    } catch (e) {
        console.warn("🔔 Euro: Servidor principal no responde. Activando rescate local...");
        
        try {
            // 2. RESCATE LOCAL: Si nuestro server falla, el cliente consulta DolarApi directamente
            const res = await fetch('https://ve.dolarapi.com/v1/dolares/euro');
            const data = await res.json();
            
            const tasaRescate = data.promedio || data.compra;
            if (tasaRescate) {
                // Marcamos como "Respaldo" (true) para que la UI lo indique
                UIRenderer.actualizarEuro(tasaRescate, true);
                console.log("✅ Euro: Rescate local completado con éxito.");
            }
        } catch (err) {
            console.error("🚨 Euro: Fallo total de todas las fuentes.");
            euroElement.innerText = "--.-- €";
        }
    } finally {
        clearTimeout(timeoutId);
    }
}

// Funciones de la calculadora se mantienen igual...
window.addEventListener('load', fetchEuro);