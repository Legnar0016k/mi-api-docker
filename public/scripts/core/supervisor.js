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
    try {
        const response = await fetch(`${CONFIG.API_PRIMARY}?t=${Date.now()}`);
        if (!response.ok) throw new Error("Railway 502/503");

        const data = await response.json();

        // El Supervisor ahora delega la inteligencia al ValidadorTecnico
        const esValida = await ValidadorTecnico.esTasaValida(data.tasa);

        if (data.success && esValida) {
            UIRenderer.actualizar(data.tasa, "BCV Oficial", false);
        } else {
            throw new Error("Dato invalidado por seguridad");
        }
    } catch (err) {
        console.error("🚀 Supervisor: Fallo detectado. Usando Columna Antisísmica (DolarApi)...");
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