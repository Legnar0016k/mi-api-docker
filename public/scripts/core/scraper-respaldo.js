async function obtenerTasasNivel0() {
    try {
        const urlRailway = 'https://tu-api-railway.app/api/tasas'; // CAMBIA ESTO POR TU URL
        const response = await fetch(urlRailway);
        const res = await response.json();

        if (res.success) {
            console.log("✅ Datos recibidos del Servidor Nivel 0:", res);
            // Pintamos en la interfaz (asegúrate que estos IDs existan en tu HTML)
            document.getElementById('price').innerText = res.usd.toFixed(2);
            if(document.getElementById('euro-price')) {
                document.getElementById('euro-price').innerText = res.eur.toFixed(2);
            }
        }
    } catch (error) {
        console.error("❌ Error conectando al Nivel 0:", error);
    }
}

// Lo ejecutamos de una vez para probar
document.addEventListener('DOMContentLoaded', obtenerTasasNivel0);