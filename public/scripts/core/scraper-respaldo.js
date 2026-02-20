/**
 * 📡 CONECTOR NIVEL 0 - VERSIÓN ESTABLE
 * Fuente principal: Exchangerate-API (datos oficiales BCV integrados)
 * Plan de contingencia: DolarAPI y fallback hardcodeado
 */

// Valores de respaldo duro basados en los datos que proporcionaste
const FALLBACK_VALUES = {
    usd: 402.33,
    eur: 472.83,
    source: "⚠️ MODO OFFLINE (DATOS ESTÁTICOS)"
};

async function fetchTasa() {
    // Elementos del DOM
    const priceElem = document.getElementById('price');
    const sourceElem = document.getElementById('debug-source');
    const loader = document.getElementById('loader');
    const result = document.getElementById('result');
    const euroElem = document.getElementById('euro-price');
    const dateElem = document.getElementById('date');

    // Función única para mostrar datos en la UI
    const mostrarDatos = (usd, eur, source) => {
        if (priceElem) priceElem.innerText = usd.toFixed(2);
        if (euroElem) euroElem.innerText = eur.toFixed(2) + ' €';
        if (sourceElem) sourceElem.innerText = source;
        if (dateElem) dateElem.innerText = new Date().toLocaleTimeString();
        
        if (loader) loader.classList.add('hidden');
        if (result) result.classList.remove('hidden');
        
        console.log(`✅ Éxito: USD ${usd.toFixed(2)} Bs | EUR ${eur.toFixed(2)} Bs | ${source}`);
    };

    // --- Timeout de seguridad (1.5 segundos) ---
    const safetyTimeout = setTimeout(() => {
        console.warn("⏰ Timeout de seguridad: Mostrando fallback");
        mostrarDatos(
            FALLBACK_VALUES.usd,
            FALLBACK_VALUES.eur,
            FALLBACK_VALUES.source
        );
    }, 1500);

    // --- 1. FUENTE PRINCIPAL: Exchangerate-API (la más completa) ---
    try {
        console.log("🌐 Intentando con Exchangerate-API...");
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        // Verificamos que los datos existan
        if (data && data.rates) {
            // Los valores vienen directamente en el objeto 'rates'
            // USD siempre es 1, pero necesitamos el valor en VES
            const usdVes = data.rates.VES; // Tasa USD a VES
            const eurVes = data.rates.VES / data.rates.EUR; // Tasa EUR a VES usando la lógica correcta
            
            // También podrías obtener otras monedas si las necesitas
            console.log("💰 Datos crudos:", {
                usd_ves: usdVes,
                eur_usd: data.rates.EUR,
                eur_ves: eurVes
            });
            
            if (usdVes && usdVes > 0) {
                clearTimeout(safetyTimeout);
                mostrarDatos(
                    usdVes,                 // USD en Bs
                    eurVes,                 // EUR en Bs (calculado correctamente)
                    `API (BCV: ${new Date(data.date).toLocaleDateString()})`
                );
                return;
            }
        }
        throw new Error("Datos de VES no encontrados en exchangerate");
        
    } catch (error) {
        console.log("⚠️ Exchangerate-API falló:", error.message);
    }

    // --- 2. PLAN B: DolarAPI (si exchangerate falla) ---
    try {
        console.log("🔄 Intentando con DolarAPI...");
        const dolarRes = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        const dolarData = await dolarRes.json();
        
        if (dolarData && dolarData.promedio) {
            const usdValue = dolarData.promedio;
            // Estimación del euro (basado en datos históricos ~17.5% más que el dólar)
            const euroValue = usdValue * 1.175;
            
            clearTimeout(safetyTimeout);
            mostrarDatos(
                usdValue,
                euroValue,
                "DOLARAPI (EURO ESTIMADO)"
            );
            return;
        }
    } catch (error) {
        console.log("⚠️ DolarAPI falló:", error.message);
    }

    // --- 3. PLAN C: TODO FALLÓ - Usar fallback ---
    clearTimeout(safetyTimeout);
    mostrarDatos(
        FALLBACK_VALUES.usd,
        FALLBACK_VALUES.eur,
        FALLBACK_VALUES.source
    );
}

// --- Auto-ejecutar al cargar la página ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => fetchTasa());
} else {
    fetchTasa();
}

// --- Exponer función para el botón de refresh manual ---
window.refreshTasa = fetchTasa;