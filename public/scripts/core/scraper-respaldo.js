//Este manejará la lógica de ir a buscar el dólar al servidor.

async function obtenerDolarConRespaldo() {
    try {
        // SUSTITUYE 'tu-app.railway.app' por tu URL real de Railway
        const urlRailway = 'https://mi-api-docker-production.up.railway.app/tasa-bcv'; 
        
        console.log("📡 Conectando con Railway...");
        const response = await fetch(urlRailway);
        const data = await response.json();
        
        if (data && data.success) {
            return {
                valor: data.tasa,
                origen: data.fuente || 'Respaldo'
            };
        }
        return null;
    } catch (error) {
        console.error("❌ Error de conexión con Railway:", error);
        return null;
    }
}