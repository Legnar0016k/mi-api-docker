/**
 * 📡 CONECTOR NIVEL 0 - ESTRATEGIA DE RESCATE DOLAR (Prioridad DolarApi)
 * Intenta Railway -> Si hay error o datos basura -> Rescata con DolarApi
 */
async function fetchTasa() {
    const priceElem = document.getElementById('price');
    const dateElem = document.getElementById('date');
    const sourceElem = document.getElementById('debug-source');
    const loader = document.getElementById('loader');
    const result = document.getElementById('result');
    // El euro se ignora por instrucción del usuario

    try {
        // 1. Intento con el servidor de Railway
        const response = await fetch('https://mi-api-docker-production.up.railway.app/api/tasas');
        
        if (!response.ok) throw new Error("Servidor Offline");

        const res = await response.json();

        // Validamos que los datos sean "claros" (que el USD sea mayor a 0)
        if (res.success && res.data && res.data.usd > 0) {
            if (priceElem) priceElem.innerText = res.data.usd.toFixed(2);
            if (sourceElem) sourceElem.innerText = "CONEXIÓN DIRECTA: BCV (RAILWAY)";
            console.log("✅ Tasa obtenida de Railway");
        } else {
            throw new Error("Datos no claros");
        }

    } catch (error) {
        // 2. PROTOCOLO DE RESPALDO: PRIORIDAD DOLARAPI
        console.warn(`⚠️ Fallo en Servidor (${error.message}). Activando DolarApi...`);
        
        try {
            const resBackup = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
            const dataBackup = await resBackup.json();

            if (dataBackup && dataBackup.promedio) {
                // Inyectamos el valor de DolarApi
                if (priceElem) priceElem.innerText = parseFloat(dataBackup.promedio).toFixed(2);
                if (sourceElem) sourceElem.innerText = "⚠️ MODO RESPALDO: DOLARAPI (BCV)";
                console.log("✅ Dólar rescatado exitosamente de DolarApi");
            }
        } catch (backupError) {
            console.error("❌ Error Crítico: Sin conexión a ninguna fuente.");
            if (sourceElem) sourceElem.innerText = "Error: Sin conexión a tasas";
            if (priceElem) priceElem.innerText = "0.00";
        }
    } finally {
        // 3. Finalización de la interfaz
        if (dateElem) dateElem.innerText = new Date().toLocaleTimeString();
        if (loader) loader.classList.add('hidden');
        if (result) result.classList.remove('hidden');
    }
}