/**
 * UI RENDERER 🎨
 * Maneja exclusivamente los cambios visuales y estados de sincronización.
 */

const UIRenderer = {
    actualizar(tasa, fecha, esRespaldo = false) {
        const priceElement = document.getElementById('price');
        const dateElement = document.getElementById('date');
        const syncStatus = document.getElementById('sync-status');
        const loader = document.getElementById('loader');
        const result = document.getElementById('result');

        if (priceElement && dateElement) {
            priceElement.innerText = tasa.toFixed(2);
            const horaFinal = fecha.includes(' ') ? fecha.split(' ')[1] : fecha;
            dateElement.innerText = horaFinal;
        }

        if (syncStatus) {
            if (esRespaldo) {
                syncStatus.innerText = "SINCRO SWAP";
                syncStatus.className = "text-orange-400 text-[11px] mono font-bold";
            } else {
                syncStatus.innerText = "SINCRO OK";
                syncStatus.className = "text-emerald-400 text-[11px] mono font-bold";
            }
        }

        if (loader) loader.classList.add('hidden');
        if (result) result.classList.remove('hidden');
    },


    actualizarEuro(tasa, esRespaldo = false) {
        const euroElement = document.getElementById('euro-price');
        if (euroElement) {
            euroElement.innerText = `${tasa.toFixed(2)} €`;
            // Indicador visual: Naranja para respaldo, verde para principal
            euroElement.style.color = esRespaldo ? '#fb923c' : '#10b981'; 
            console.log(`📊 UI: Euro actualizado (${esRespaldo ? 'Respaldo' : 'Oficial'})`);
        }
    },

    mostrarFalloTotal() {
        const syncStatus = document.getElementById('sync-status');
        const loaderText = document.querySelector('#loader p');

        if (syncStatus) {
            syncStatus.innerText = "SINCRO FAIL";
            syncStatus.className = "text-red-500 text-[11px] mono font-bold";
        }
        if (loaderText) {
            loaderText.innerText = "ERROR CRÍTICO";
        }
    }
};

// Alias global para mantener compatibilidad si lo necesitas
window.actualizarUI = UIRenderer.actualizar;
window.mostrarFalloTotal = UIRenderer.mostrarFalloTotal;