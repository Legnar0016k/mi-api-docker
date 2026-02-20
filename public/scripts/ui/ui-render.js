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
            euroElement.innerText = `${parseFloat(tasa).toFixed(2)} €`;
            // Si es de respaldo lo ponemos en un tono ámbar/naranja
            euroElement.style.color = esRespaldo ? '#fb923c' : ''; 
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
    },

    // Inicializar eventos del aviso legal
    initLegalModal() {
        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cerrarAvisoLegal();
            }
        });

        // Cerrar al hacer click fuera del modal (opcional)
        const modal = document.getElementById('modal-legal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.cerrarAvisoLegal();
                }
            });
        }
    },

    abrirAvisoLegal() {
        const modal = document.getElementById('modal-legal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            // Prevenir scroll del body
            document.body.style.overflow = 'hidden';
        }
    },

    cerrarAvisoLegal() {
        const modal = document.getElementById('modal-legal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            // Restaurar scroll del body
            document.body.style.overflow = '';
        }
    }
};

// Inicializar eventos cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIRenderer.initLegalModal());
} else {
    UIRenderer.initLegalModal();
}

// Alias global para mantener compatibilidad
window.actualizarUI = UIRenderer.actualizar.bind(UIRenderer);
window.mostrarFalloTotal = UIRenderer.mostrarFalloTotal.bind(UIRenderer);
window.abrirAvisoLegal = UIRenderer.abrirAvisoLegal.bind(UIRenderer);
window.cerrarAvisoLegal = UIRenderer.cerrarAvisoLegal.bind(UIRenderer);