async function fetchTasa() {
    const priceElem = document.getElementById('price');
    const euroElem = document.getElementById('euro-price');
    const loader = document.getElementById('loader');
    const result = document.getElementById('result');

    try {
        const url = 'https://mi-api-docker-production.up.railway.app/api/tasas'; 
        const response = await fetch(url);
        const res = await response.json();

        if (res.success && res.data) { // Verificamos que exista res.data
            if(loader) loader.classList.add('hidden');
            if(result) result.classList.remove('hidden');

            // USAMOS res.data.usd
            priceElem.innerText = res.data.usd ? res.data.usd.toFixed(2) : "--.--";
            euroElem.innerText = res.data.eur ? res.data.eur.toFixed(2) : "--.--";
            document.getElementById('date').innerText = new Date().toLocaleTimeString();
        }
    } catch (error) {
        console.error("❌ Error en el flujo Nivel 0:", error);
    }
}
// Esto hace que la función se dispare sola al cargar la página
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    fetchTasa();
} else {
    document.addEventListener('DOMContentLoaded', fetchTasa);
}
