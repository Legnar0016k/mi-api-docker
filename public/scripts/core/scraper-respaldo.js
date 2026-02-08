/**
 * 📡 CONECTOR NIVEL 0
 * Enlace directo entre el Ninja Scraper (Railway) y la UI.
 */
async function fetchTasa() {
    const priceElem = document.getElementById('price');
    const euroElem = document.getElementById('euro-price');
    const dateElem = document.getElementById('date');
    const sourceElem = document.getElementById('debug-source');
    const loader = document.getElementById('loader');
    const result = document.getElementById('result');

    try {
        // SUSTITUYE CON TU URL REAL DE RAILWAY
        const url = 'https://mi-api-docker-production.up.railway.app/api/tasas'; 
        
        const response = await fetch(url);
        const res = await response.json();

        if (res.success && res.data) {
            // 1. Ocultar loader y mostrar interfaz
            if(loader) loader.classList.add('hidden');
            if(result) result.classList.remove('hidden');

            // 2. Inyectar datos con validación
            if(priceElem) priceElem.innerText = res.data.usd.toFixed(2);
            if(euroElem) euroElem.innerText = res.data.eur.toFixed(2);
            if(dateElem) dateElem.innerText = new Date().toLocaleTimeString();
            
            if(sourceElem) sourceElem.innerText = "CONEXIÓN DIRECTA: BCV OFICIAL";
            console.log("✅ Datos Nivel 0 cargados con éxito");
        }
    } catch (error) {
        console.error("❌ Error conectando a la API:", error);
        if(sourceElem) sourceElem.innerText = "Error: Servidor Offline";
        // Si falla, al menos mostramos la interfaz para que no se quede el loader infinito
        if(loader) loader.classList.add('hidden');
        if(result) result.classList.remove('hidden');
    }
}

// 🔥 AUTO-DISPARADOR: Ejecuta la carga apenas el script entra en memoria
if (document.readyState === 'complete') {
    fetchTasa();
} else {
    window.addEventListener('load', fetchTasa);
}

// Exponer globalmente para el botón Refresh
window.fetchTasa = fetchTasa;