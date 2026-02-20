/**
 * 📡 CONECTOR NIVEL 0 - ULTRA VELOZ
 * Prioridad: Railway (Timeout 1s) -> Backup: DolarApi (Instantáneo)
 */
async function fetchTasa() {
    const priceElem = document.getElementById('price');
    const dateElem = document.getElementById('date');
    const sourceElem = document.getElementById('debug-source');
    const loader = document.getElementById('loader');
    const result = document.getElementById('result');

    // --- CONFIGURACIÓN DE CRONÓMETRO (1 SEGUNDO) ---
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); 

    try {
        console.log("⏱️ Intentando Railway (Límite 1s)...");
        
        // Pasamos el 'signal' al fetch para poder abortarlo
        const response = await fetch('https://mi-api-docker-production.up.railway.app/api/tasas', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId); // Si responde a tiempo, cancelamos el cronómetro

        if (!response.ok) throw new Error("Offline");
        const res = await response.json();
        
        if (res.success && res.data && res.data.usd > 0) {
            if (priceElem) priceElem.innerText = res.data.usd.toFixed(2);
            if (sourceElem) sourceElem.innerText = "CONEXIÓN DIRECTA: RAILWAY";
        } else {
            throw new Error("Data Error");
        }

    } catch (error) {
        clearTimeout(timeoutId); // Limpiamos el cronómetro también en caso de error
        
        const motivo = error.name === 'AbortError' ? "Tiempo Agotado (1s)" : "Error de Red";
        console.warn(`⚠️ Saltando a DolarApi. Motivo: ${motivo}`);
        
        try {
            // Rescate instantáneo
            const resBackup = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
            const data = await resBackup.json();

            if (data && data.promedio) {
                if (priceElem) priceElem.innerText = parseFloat(data.promedio).toFixed(2);
                if (sourceElem) sourceElem.innerText = "⚠️ MODO RESPALDO: DOLARAPI";
                console.log("✅ Rescate completado en milisegundos.");
            }
        } catch (backupError) {
            if (sourceElem) sourceElem.innerText = "Error Crítico: Sin conexión";
            if (priceElem) priceElem.innerText = "0.00";
        }
    } finally {
        if (dateElem) dateElem.innerText = new Date().toLocaleTimeString();
        if (loader) loader.classList.add('hidden');
        if (result) result.classList.remove('hidden');
    }
}