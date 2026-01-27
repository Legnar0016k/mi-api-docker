function actualizarInterfazDolar(datos) {
    const priceElem = document.getElementById('price');
    const sourceElem = document.getElementById('debug-source');

    if (datos && datos.valor) {
        // Actualizamos el precio
        priceElem.innerText = parseFloat(datos.valor).toFixed(2);
        
        // Actualizamos la fuente
        if (sourceElem) {
            sourceElem.innerText = `FUENTE: ${datos.origen}`;
            console.log(`✅ UI Actualizada desde: ${datos.origen}`);
        }
    }
}