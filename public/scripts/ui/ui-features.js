/**
 * UI FEATURES & MODALS 🛠️
 * Lógica para el Euro y la Calculadora (Sin tocar el core)
 */

// [ui-features.js] - Sustituye la función fetchEuro por esta:
async function fetchEuro() {
    const euroElement = document.getElementById('euro-price');
    if (!euroElement) return;

    try {
        // Añadimos un timeout corto para que el Euro no bloquee el ancho de banda
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); 

        const response = await fetch('https://mi-api-docker-production.up.railway.app/api/euro', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Euro Offline');
        const data = await response.json();
        
        if (data.success) {
            euroElement.innerText = data.tasa.toFixed(2) + " €";
            euroElement.classList.add('text-blue-400'); // Un toque visual de "OK"
        }
    } catch (e) {
        // Prioridad Baja: Si falla el Euro, ponemos guiones y no bloqueamos nada
        console.warn("🔔 Info: Euro no disponible (Railway 502/Timeout)");
        euroElement.innerText = "--.-- €";
    }
}

// Lógica del Modal
function AbrirCalculadora() {
    document.getElementById('modal-calc').classList.remove('hidden');
}

function CerrarCalculadora() {
    document.getElementById('modal-calc').classList.add('hidden');
}

// Iniciar carga del Euro al abrir la app
window.addEventListener('load', fetchEuro);