/**
 * VALIDADOR DINÁMICO 🧠 - v3.8.5
 * Bloquea tasas basura (como el 551.36) comparándolas con DolarApi.
 */

const ValidadorTecnico = {
    UMBRAL: 0.05, // Solo aceptamos un 5% de diferencia (máxima rigurosidad)

    async esTasaValida(tasaPrincipal) {
        // 1. Validación de Rango Físico (Si no está entre 30 y 100, es basura seguro)
        if (tasaPrincipal < 30 || tasaPrincipal > 100) {
            console.error("Validador: Tasa fuera de rango lógico (30-100). RECHAZADA.");
            return false;
        }

        try {
            console.log("Validador: Consultando referencia dinámica de seguridad...");
            // Usamos un timeout corto para la referencia también
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 3000);

            const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', { signal: controller.signal });
            const data = await res.json();
            clearTimeout(id);

            const tasaRef = data.promedio || data.compra;
            if (!tasaRef) return false;

            const diferencia = Math.abs(tasaPrincipal - tasaRef) / tasaRef;
            const esValida = diferencia <= this.UMBRAL;

            console.log(`Validador: Ref ${tasaRef} vs Tuya ${tasaPrincipal}`);
            console.log(`Validador: Diferencia del ${(diferencia * 100).toFixed(2)}% - ${esValida ? 'ACEPTADA' : 'RECHAZADA'}`);

            return esValida;
        } catch (e) {
            console.warn("Validador: No se pudo conectar con la referencia. Usando filtro de rango.");
            // Si la referencia falla, confiamos en el rango 30-100
            return (tasaPrincipal > 30 && tasaPrincipal < 100);
        }
    }
};