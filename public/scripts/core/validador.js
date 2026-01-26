/**
 * VALIDADOR DINÁMICO 🧠
 * Solo calcula si un número es aceptable comparado con la referencia.
 */

const ValidadorTecnico = {
    UMBRAL: 0.10, // 10% de tolerancia

    async esTasaValida(tasaPrincipal) {
        try {
            console.log("Validador: Consultando referencia dinámica...");
            const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
            const data = await res.json();
            const tasaRef = data.promedio || data.compra;

            if (!tasaRef) return false;

            const diferencia = Math.abs(tasaPrincipal - tasaRef) / tasaRef;
            const esValida = diferencia <= this.UMBRAL;

            console.log(`Validador: Ref ${tasaRef} vs Tuya ${tasaPrincipal}`);
            console.log(`Validador: Diferencia del ${(diferencia * 100).toFixed(2)}% - ${esValida ? 'ACEPTADA' : 'RECHAZADA'}`);

            return esValida;
        } catch (e) {
            console.error("Validador: Error en referencia, se usará el límite manual por seguridad.");
            return null; // Indica que no se pudo validar dinámicamente
        }
    }
};