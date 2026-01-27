/**
 * MONITOR MASTER 🚀
 * Orquestador de la nueva lógica de respaldo.
 */
async function iniciarMonitoreoRespaldo() {
    console.log("🔍 Iniciando ciclo de obtención con respaldo...");
    
    // 1. Llamamos al scraper de respaldo
    const resultado = await obtenerDolarConRespaldo();
    
    if (resultado) {
        // 2. Si hay datos, mandamos a actualizar la UI
        actualizarInterfazDolar(resultado);
    } else {
        console.error("❌ No se pudo obtener la tasa de ninguna fuente.");
        const sourceElem = document.getElementById('debug-source');
        if (sourceElem) sourceElem.innerText = "Error: Fuentes no disponibles";
    }
}

// Arrancar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Un pequeño delay de 300ms para asegurar que todos los scripts cargaron bien
    setTimeout(iniciarMonitoreoRespaldo, 300);
});