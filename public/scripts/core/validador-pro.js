/**
 * VALIDADOR PRO - Maneja múltiples fuentes y actualiza la UI
 */
function procesarTasaDolar(resultado) {
    const priceDisplay = document.getElementById('price');
    const sourceDisplay = document.getElementById('debug-source'); // El que usaremos para pruebas

    if (resultado && resultado.tasa) {
        // Actualizar precio principal
        priceDisplay.innerText = parseFloat(resultado.tasa).toFixed(2);
        
        // Mostrar fuente (Solo para tus pruebas)
        if (sourceDisplay) {
            sourceDisplay.innerText = `Origen: ${resultado.fuente} (${resultado.timestamp})`;
            sourceDisplay.classList.remove('hidden');
        }
        
        console.log(`✅ Tasa actualizada vía ${resultado.fuente}`);
    }
}