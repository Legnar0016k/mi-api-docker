/**
 * UI FEATURES & MODALS 🛠️
 * Lógica para el Euro y la Calculadora (Sin tocar el core)
 */

// [ui-features.js] - Sustituye la función fetchEuro por esta:
async function fetchEuro() {
    const euroElement = document.getElementById('euro-price');
    if (!euroElement) return;

    // CREAMOS UN TEMPORIZADOR DE ABORTO (MÁXIMO 2 SEGUNDOS)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); 

    try {
        const response = await fetch('https://mi-api-docker-production.up.railway.app/api/euro', {
            signal: controller.signal // Conectamos el temporizador a la petición
        });

        clearTimeout(timeoutId); // Si responde rápido, cancelamos el aborto

        if (!response.ok) throw new Error('Servidor inestable');
        
        const data = await response.json();
        if (data.success) {
            euroElement.innerText = data.tasa.toFixed(2) + " €";
        }
    } catch (e) {
        // Si hay un 502, un timeout o cualquier error, salimos de inmediato
        // Sin console.error pesado, solo un aviso silencioso
        euroElement.innerText = "--.-- €";
        
        if (e.name === 'AbortError') {
            console.warn("🔔 Euro: Petición cancelada por lentitud (Railway 502)");
        }
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