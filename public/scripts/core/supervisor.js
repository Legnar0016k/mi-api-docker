/**
 * SUPERVISOR DE DATOS BCV - v3.8.5
 * Gestiona el ciclo de vida de la tasa y activa respaldos por lentitud o error.
 */

const CONFIG_SUPERVISOR = {
    API_PRIMARY: 'https://mi-api-docker-production.up.railway.app/tasa-bcv',
    API_FALLBACK: 'https://ve.dolarapi.com/v1/dolares/oficial',
    TIMEOUT_MS: 4000 // 4 segundos máximo para Railway
};

async function supervisorFetch() {
    console.log("Supervisor: Iniciando chequeo de alta disponibilidad...");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG_SUPERVISOR.TIMEOUT_MS);

    try {
        // Intentamos obtener la tasa de Railway (Fuente Principal)
        const response = await fetch(`${CONFIG_SUPERVISOR.API_PRIMARY}?t=${Date.now()}`, {
            signal: controller.signal
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        clearTimeout(timeoutId);

        if (data.success) {
            // Pasamos el dato por el Validador Técnico (El filtro del 5%)
            const esValida = await ValidadorTecnico.esTasaValida(data.tasa);

            if (esValida) {
                console.log("Supervisor: Fuente principal validada ✅");
                UIRenderer.actualizar(data.tasa, data.fecha || new Date().toLocaleTimeString(), false);
                return;
            }
        }
        throw new Error("Dato inválido o inconsistente");

    } catch (err) {
        clearTimeout(timeoutId);
        const motivo = err.name === 'AbortError' ? 'Tiempo de espera agotado (502/Lento)' : err.message;
        console.warn(`🚀 Supervisor: Error en Principal (${motivo}). Activando Respaldo...`);
        await llamarRespaldo();
    }
}

async function llamarRespaldo() {
    try {
        const res = await fetch(CONFIG_SUPERVISOR.API_FALLBACK);
        const data = await res.json();
        const tasaRespaldo = data.promedio || data.compra;
        
        console.log("Supervisor: Respaldo DolarApi activado exitosamente 🛡️");
        UIRenderer.actualizar(tasaRespaldo, new Date().toLocaleTimeString(), true);
    } catch (e) {
        console.error("Supervisor: Fallo total de todas las fuentes.");
        UIRenderer.mostrarFalloTotal();
    }
}

// Iniciar supervisión
setTimeout(supervisorFetch, 500);