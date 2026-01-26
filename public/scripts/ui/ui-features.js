/**
 * UI FEATURES & MODALS 🛠️
 * Lógica para el Euro y la Calculadora (Sin tocar el core)
 */

async function fetchEuro() {
    const euroElement = document.getElementById('euro-price');
    try {
        // Asumiendo que tu API tiene el endpoint /api/euro que creamos
        const response = await fetch('https://mi-api-docker-production.up.railway.app/api/euro');
        const data = await response.json();
        
        if (data.success && euroElement) {
            euroElement.innerText = data.tasa.toFixed(2) + " €";
        }
    } catch (e) {
        console.error("Error cargando Euro:", e);
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