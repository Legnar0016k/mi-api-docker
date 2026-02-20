/**
 * 📡 CONECTOR NIVEL 0 - VERSIÓN FINAL
 * Muestra "--.--" cuando no hay datos + alerta visual parpadeante
 */

async function fetchTasa() {
    // Elementos del DOM
    const priceElem = document.getElementById('price');
    const sourceElem = document.getElementById('debug-source');
    const loader = document.getElementById('loader');
    const result = document.getElementById('result');
    const euroElem = document.getElementById('euro-price');
    const dateElem = document.getElementById('date');
    const syncStatus = document.getElementById('sync-status');

    // Función para mostrar SIN DATOS (modo offline)
    const mostrarSinDatos = () => {
        if (priceElem) priceElem.innerText = '--.--';
        if (euroElem) euroElem.innerText = '--.-- €';
        if (sourceElem) sourceElem.innerText = '🔴 SIN CONEXIÓN-!!!FALLA INMINENTE, ESTAMOS TRABAJANDO PARA RESTABLECER LA CONEXION LO Mas PRONTO POSIBLE...';
        if (dateElem) dateElem.innerText = new Date().toLocaleTimeString();
        
        // Sincro status en ROJO PARPADEANTE
        if (syncStatus) {
            syncStatus.innerText = 'SIN DATOS';
            syncStatus.className = 'text-red-500 text-[11px] mono font-bold animate-pulse';
        }
        
        // Euro también en rojo parpadeante si quieres
        if (euroElem) {
            euroElem.className = 'text-red-500 text-[11px] mono animate-pulse';
        }
        
        if (loader) loader.classList.add('hidden');
        if (result) result.classList.remove('hidden');
        
        console.warn('⚠️ MODO OFFLINE - Mostrando "--.--"');
    };

    // Timeout de seguridad (2 segundos) - activa modo offline
    const safetyTimeout = setTimeout(() => {
        console.warn('⏰ Timeout: Activando modo offline');
        mostrarSinDatos();
    }, 2000);

    // --- 1. FUENTE PRINCIPAL: Exchangerate-API ---
    try {
        console.log("🌐 Intentando con Exchangerate-API...");
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        if (data && data.rates && data.rates.VES && data.rates.EUR) {
            const usdVes = data.rates.VES;
            const eurVes = usdVes / data.rates.EUR; // Fórmula correcta
            
            clearTimeout(safetyTimeout);
            
            // Mostrar datos NORMALES
            if (priceElem) priceElem.innerText = usdVes.toFixed(2);
            if (euroElem) {
                euroElem.innerText = eurVes.toFixed(2) + ' €';
                euroElem.className = 'text-slate-300 text-[11px] mono'; // Color normal
            }
            if (sourceElem) sourceElem.innerText = `sincronizado...🌐(${data.date})`;
            if (dateElem) dateElem.innerText = new Date().toLocaleTimeString();
            if (syncStatus) {
                syncStatus.innerText = 'SINCRO OK';
                syncStatus.className = 'text-emerald-400 text-[11px] mono font-bold';
            }
            
            if (loader) loader.classList.add('hidden');
            if (result) result.classList.remove('hidden');
            
            console.log(`✅ USD ${usdVes.toFixed(2)} Bs | EUR ${eurVes.toFixed(2)} Bs`);
            return;
        }
        throw new Error("Datos incompletos");
        
    } catch (error) {
        console.log("⚠️ Exchangerate falló:", error.message);
    }

    // --- 2. PLAN B: DolarAPI ---
    try {
        console.log("🔄 Intentando con DolarAPI...");
        const dolarRes = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        const dolarData = await dolarRes.json();
        
        if (dolarData && dolarData.promedio) {
            const usdValue = dolarData.promedio;
            
            // Intentar obtener euro de exchangerate como complemento
            try {
                const euroRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const euroData = await euroRes.json();
                
                if (euroData && euroData.rates && euroData.rates.EUR) {
                    const eurValue = usdValue / euroData.rates.EUR;
                    
                    clearTimeout(safetyTimeout);
                    
                    if (priceElem) priceElem.innerText = usdValue.toFixed(2);
                    if (euroElem) {
                        euroElem.innerText = eurValue.toFixed(2) + ' €';
                        euroElem.className = 'text-slate-300 text-[11px] mono';
                    }
                    if (sourceElem) sourceElem.innerText = 'INTERMITENCIA EN LA CONEXION (EURO Y DOLAR ESTIMADOS)...CONSULTE LA PAGINA DEL BCV PARA DATOS OFICIALES';
                    if (dateElem) dateElem.innerText = new Date().toLocaleTimeString();
                    if (syncStatus) {
                        syncStatus.innerText = 'SINCRO OK';
                        syncStatus.className = 'text-emerald-400 text-[11px] mono font-bold';
                    }
                    
                    if (loader) loader.classList.add('hidden');
                    if (result) result.classList.remove('hidden');
                    
                    console.log(`✅ USD ${usdValue.toFixed(2)} Bs | EUR ${eurValue.toFixed(2)} Bs`);
                    return;
                }
            } catch (e) {
                // Si no hay euro, mostrar solo USD
                clearTimeout(safetyTimeout);
                
                if (priceElem) priceElem.innerText = usdValue.toFixed(2);
                if (euroElem) {
                    euroElem.innerText = '--.-- €';
                    euroElem.className = 'text-slate-300 text-[11px] mono';
                }
                if (sourceElem) sourceElem.innerText = 'INTERMITENCIA EN LA CONEXION (SIN EURO)/DOLAR ESTIMADO...CONSULTE LA PAGINA DEL BCV PARA DATOS OFICIALES';
                if (dateElem) dateElem.innerText = new Date().toLocaleTimeString();
                if (syncStatus) {
                    syncStatus.innerText = 'SINCRO PARCIAL';
                    syncStatus.className = 'text-yellow-400 text-[11px] mono font-bold';
                }
                
                if (loader) loader.classList.add('hidden');
                if (result) result.classList.remove('hidden');
                
                console.log(`⚠️ Solo USD: ${usdValue.toFixed(2)} Bs`);
                return;
            }
        }
    } catch (error) {
        console.log("⚠️ DolarAPI falló:", error.message);
    }

    // --- 3. TODO FALLÓ - Modo offline con parpadeo ---
    clearTimeout(safetyTimeout);
    mostrarSinDatos();
}

// Agregar estilos CSS para el parpadeo si no existen
const style = document.createElement('style');
style.textContent = `
    @keyframes urgentPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
    .animate-pulse {
        animation: urgentPulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
`;
document.head.appendChild(style);

// Auto-ejecutar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => fetchTasa());
} else {
    fetchTasa();
}

// Refresh manual
window.refreshTasa = fetchTasa;