//Este manejará la lógica de ir a buscar el dólar al servidor.

async function obtenerDolarConRespaldo() {
    try {
        const response = await fetch('/tasa-bcv');
        const data = await response.json();
        
        if (data && data.success) {
            return {
                valor: data.tasa,
                origen: data.fuente || 'Desconocido'
            };
        }
        return null;
    } catch (error) {
        console.error("Error en scraper-respaldo:", error);
        return null;
    }
}