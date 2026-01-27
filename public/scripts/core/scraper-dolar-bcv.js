/**
 * NUEVA LÓGICA: SCRAPER DÓLAR BCV 💵
 * Este archivo es independiente para evitar conflictos.
 */
async function fetchDolarOficial() {
    try {
        // Llamamos a la ruta que configuramos en el servidor
        const response = await fetch('/tasa-bcv'); 
        const data = await response.json();

        if (data && data.success) {
            // Enviamos el resultado al validador
            return {
                tasa: data.tasa,
                fuente: data.fuente || 'BCV',
                timestamp: new Date().toLocaleTimeString()
            };
        }
        throw new Error("Datos de respuesta inválidos");
    } catch (error) {
        console.error("Error obteniendo Dólar BCV:", error);
        return null;
    }
}