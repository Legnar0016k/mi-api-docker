/**
 * 📡 CONECTOR NIVEL 0
 * Se conecta a la nueva API y actualiza la UI directamente.
 */
async function fetchTasa() {
    const loader = document.getElementById('loader');
    const result = document.getElementById('result');
    const priceElem = document.getElementById('price');
    const euroElem = document.getElementById('euro-price');
    const dateElem = document.getElementById('date');
    const sourceElem = document.getElementById('debug-source');

    try {
        // 1. URL de tu nueva API en Railway
        const url = 'https://mi-api-docker-production.up.railway.app/api/tasas'; 
        
        const response = await fetch(url);
        const res = await response.json();

        if (res.success) {
            // 2. Ocultar loader y mostrar resultados
            if(loader) loader.classList.add('hidden');
            if(result) result.classList.remove('hidden');

            // 3. Inyectar datos del Dólar y Euro
            priceElem.innerText = res.usd.toFixed(2);
            euroElem.innerText = res.eur.toFixed(2);
            dateElem.innerText = new Date().toLocaleTimeString();
            sourceElem.innerText = "CONEXIÓN DIRECTA: BCV OFICIAL";
            
            console.log("✅ Datos Nivel 0 cargados:", res);
        }
    } catch (error) {
        console.error("❌ Error en el flujo Nivel 0:", error);
        if(sourceElem) sourceElem.innerText = "Error: Servidor no disponible";
    }
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', fetchTasa);