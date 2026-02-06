/**
 * VALIDADOR DINÁMICO 🧠 - v3.8.5
 * Bloquea tasas basura (como el 551.36) comparándolas con DolarApi.
 */

const ValidadorTecnico = {
    UMBRAL: 0.05, // Solo aceptamos un 5% de diferencia (máxima rigurosidad)
    LIMITES_SEGURIDAD: { MIN: 300, MAX: 600 },

    async esTasaValida(tasaPrincipal) {
        // Validación 1: Rango Numérico Físico
        if (tasaPrincipal < this.LIMITES_SEGURIDAD.MIN || tasaPrincipal > this.LIMITES_SEGURIDAD.MAX) {
            console.error(`Validador: Tasa ${tasaPrincipal} fuera de rango (${this.LIMITES_SEGURIDAD.MIN}-${this.LIMITES_SEGURIDAD.MAX}). RECHAZADA.`);
            return false;
        }

        try {
            console.log("Validador: Consultando referencia dinámica...");
            const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
            const data = await res.json();
            const tasaRef = data.promedio || data.compra;

            if (!tasaRef) return true; // Si falla la referencia, confiamos en el rango físico

            const diferencia = Math.abs(tasaPrincipal - tasaRef) / tasaRef;
            const esValida = diferencia <= this.UMBRAL;

            console.log(`Validador: Ref ${tasaRef} vs Tuya ${tasaPrincipal} (${(diferencia * 100).toFixed(2)}%)`);
            return esValida;
        } catch (e) {
            return true; // En caso de error de red, permitimos el paso si está en el rango MIN/MAX
        }
    }
};