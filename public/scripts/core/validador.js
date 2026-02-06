/**
 * VALIDADOR DINÁMICO 🧠
 * Solo calcula si un número es aceptable comparado con la referencia.
 */

const ValidadorTecnico = {
    // Bajamos el umbral al 5% para ser más estrictos con la fuente principal
    UMBRAL: 0.05, 

    async esTasaValida(tasaPrincipal) {
        try {
            console.log("Validador: Consultando referencia dinámica...");
            const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
            const data = await res.json();
            const tasaRef = data.promedio || data.compra;

            if (!tasaRef) return false;

            const diferencia = Math.abs(tasaPrincipal - tasaRef) / tasaRef;
            
            // Si la diferencia es mayor al 5%, rechazamos CUALQUIER cosa que diga Railway
            const esValida = diferencia <= this.UMBRAL;

            console.log(`Validador: Ref ${tasaRef} vs Tuya ${tasaPrincipal}`);
            console.log(`Validador: Diferencia del ${(diferencia * 100).toFixed(2)}% - ${esValida ? 'ACEPTADA' : 'RECHAZADA'}`);

            return esValida;
        } catch (e) {
            // Si DolarApi (referencia) falla, por seguridad rechazamos si es un número loco
            return (tasaPrincipal > 30 && tasaPrincipal < 50); 
        }
    }
};