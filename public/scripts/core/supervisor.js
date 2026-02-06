/**
 * SUPERVISOR DE DATOS BCV - v4.0.0
 * Coordinador de salud de datos con validación cruzada.
 */

const CONFIG_SUPERVISOR = {
    API_PRIMARY: 'https://mi-api-docker-production.up.railway.app/tasa-bcv',
    API_FALLBACK: 'https://ve.dolarapi.com/v1/dolares/oficial',
    TIMEOUT_MS: 6000 // Aumentamos a 6s para dar margen a la validación del server
};

async function supervisorFetch() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG_SUPERVISOR.TIMEOUT_MS);

    try {
        console.log("Supervisor: Iniciando chequeo en API Principal...");
        const response = await fetch(`${CONFIG_SUPERVISOR.API_PRIMARY}?t=${Date.now()}`, {
            signal: controller.signal
        });
        
        if (!response.ok) throw new Error(`Railway Error: ${response.status}`);

        const data = await response.json();

        // 🧠 DELEGACIÓN DE INTELIGENCIA:
        // Ahora confiamos en que el server ya validó, pero hacemos un último check visual
        if (data.success && data.tasa > 0) {
            console.log("✅ Supervisor: Dato validado por el servidor.");
            UIRenderer.actualizar(data.tasa, "BCV Oficial", data.fuente !== 'BCV_Oficial');
        } else {
            throw new Error("Servidor entregó dato no válido");
        }

    } catch (err) {
        if (err.name === 'AbortError') {
            console.warn("⚠️ Supervisor: Railway demasiado lento. Activando respaldo...");
        } else {
            console.error("🚀 Supervisor: Fallo de conexión. Usando DolarApi...");
        }
        await llamarRespaldo();
    } finally {
        clearTimeout(timeoutId);
    }
}

async function llamarRespaldo() {
    try {
        const res = await fetch(CONFIG_SUPERVISOR.API_FALLBACK);
        const data = await res.json();
        const tasaRespaldo = data.promedio || data.compra;
        
        if (tasaRespaldo) {
            console.log("🛡️ Supervisor: Respaldo activado exitosamente.");
            // Marcamos como respaldo (true) para activar el color naranja en la UI
            UIRenderer.actualizar(tasaRespaldo, "DolarApi (Respaldo)", true);
        }
    } catch (err) {
        console.error("🚨 Supervisor: Fallo total. El sistema inmunológico actuará.");
        UIRenderer.mostrarFalloTotal();
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    supervisorFetch();
    // Re-verificar cada 10 minutos
    setInterval(supervisorFetch, 600000);
});