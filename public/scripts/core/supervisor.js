/**
 * SUPERVISOR DE DATOS BCV
 * Se encarga de validar la coherencia de los precios y gestionar respaldos.
 */

const CONFIG = {
    API_PRIMARY: 'https://mi-api-docker-production.up.railway.app/tasa-bcv',
    API_FALLBACK: 'https://ve.dolarapi.com/v1/dolares/oficial', // Corregido a /dolares/
    LIMITS: {
        MIN: 300,  // Si baja de 300, algo anda mal
        MAX: 450  // Si sube de 450, es un salto sospechoso (ajustar según realidad)
    }
};


async function supervisorFetch() {
// ... dentro de supervisorFetch() en supervisor.js
try {
    console.log("Supervisor: Iniciando chequeo...");
    const response = await fetch(`${CONFIG.API_PRIMARY}?t=${new Date().getTime()}`);
    const data = await response.json();

    if (data.success) {
        const esValidaDinamicamente = await ValidadorTecnico.esTasaValida(data.tasa);

        if (esValidaDinamicamente) {
            console.log("Supervisor: API Principal validada ✅");
            actualizarUI(data.tasa, data.fecha || new Date().toLocaleTimeString(), data.fuente);
            
            // AGREGAR ESTO: Si es válida, salimos de la función aquí.
            return; 
        }
    }
    // Si llegamos aquí, es porque data.success fue false o no fue válida
    throw new Error("Tasa no válida o error en API");

} catch (error) {
    console.log("Supervisor: Fallo en Principal. Buscando respaldo...");
    // Aquí es donde entra DolarApi solo si lo de arriba falló
    await llamarRespaldo();
}
}
//==============================================================================
//Logica Antigua del SUPERVISOR.JS linea 103
//==============================================================================

async function llamarRespaldo() {
    try {
        const response = await fetch(CONFIG.API_FALLBACK);
        const data = await response.json();
        
        // DolarApi usa 'promedio' o 'compra'
        const tasaSegura = data.promedio || data.compra || data.venta;

      if (tasaSegura) {
        console.log("Supervisor: Respaldo DolarApi activado exitosamente 🛡️");
        // CAMBIA LA LÍNEA DE ABAJO:
        UIRenderer.actualizar(tasaSegura, "SWAP", true); // Enviamos el flag de respaldo
        }
        
        else {
            throw new Error("DolarApi no devolvió valores");
        }
    } catch (error) {
        console.error("Supervisor: TODO FALLÓ. Mostrando error en pantalla.");
        document.querySelector('#loader p').innerText = "ERROR TOTAL DE SEÑAL";
    }
}
//=============================================================================
function actualizarUI(tasa, fecha, fuenteReal) { // <-- Añadimos fuenteReal
    const loader = document.getElementById('loader');
    const result = document.getElementById('result');
    const priceElement = document.getElementById('price');
    const dateElement = document.getElementById('date');
    const sourceElem = document.getElementById('debug-source'); // <-- CAPTURAMOS EL ELEMENTO

    priceElement.innerText = tasa.toFixed(2);
    
    // Ahora mostramos la fuente REAL que envió el servidor
    if (sourceElem) {
        // Si no viene fuenteReal (por si acaso), ponemos un genérico
        const nombreFuente = fuenteReal || "Desconocida";
        sourceElem.innerText = `FUENTE: ${nombreFuente} (Vía Supervisor)`;
        sourceElem.classList.remove('hidden');
    }

    // Si la fecha tiene espacio (YYYY-MM-DD HH:MM:SS), saca solo la hora
    const horaFinal = fecha.includes(' ') ? fecha.split(' ')[1] : fecha;
    dateElement.innerText = horaFinal;

    loader.classList.add('hidden');
    result.classList.remove('hidden');
}

    // Exportar si fuera necesario, o simplemente usar globalmente
    window.fetchTasa = supervisorFetch;
    // Al final de supervisor.js
    window.onload = () => {
    setTimeout(supervisorFetch, 3000); // Dale 3 segundos al Monitor para que trabaje tranquilo
    };



//=Logica antigua del supervisro================================================================================
// async function supervisorFetch() {
//     const loader = document.getElementById('loader');
//     const result = document.getElementById('result');
//     // 1. Verificamos si ya hay una tasa válida puesta por monitor-master
//     const sourceElem = document.getElementById('debug-source');
//     if (sourceElem && sourceElem.innerText.includes('BCV_Oficial')) {
//         console.log("Supervisor: API Principal ya entregó datos. Monitoreo pasivo.");
//         return; // Detenemos el supervisor para que no pise el dato bueno
//     }
//     

//     try {
//         console.log("Supervisor: Iniciando chequeo...");
//         const response = await fetch(`${CONFIG.API_PRIMARY}?t=${new Date().getTime()}`);
//         const data = await response.json();

//         if (data.success) {
//             // SOLICITUD AL VALIDADOR DINÁMICO
//             const esValidaDinamicamente = await ValidadorTecnico.esTasaValida(data.tasa);

//             if (esValidaDinamicamente === true) {
//                 actualizarUI(data.tasa, data.fecha_consulta);
//             } 
//             else if (esValidaDinamicamente === false) {
//                 console.warn("Dato rechazado por el Validador Dinámico.");
//                 await llamarRespaldo();
//             }
//             else {
//                 // Si el validador falla (ej. DolarApi caído), usa tus límites manuales actuales
//                 if (data.tasa > CONFIG.LIMITS.MIN && data.tasa < CONFIG.LIMITS.MAX) {
//                     actualizarUI(data.tasa, data.fecha_consulta);
//                 } else {
//                     await llamarRespaldo();
//                 }
//             }
//         }
//     } catch (err) {
//         await llamarRespaldo();
//     }

//     // Crear un controlador para abortar si tarda mucho
// try {
//         console.log("Supervisor: Iniciando chequeo...");
//         const response = await fetch(`${CONFIG.API_PRIMARY}?t=${new Date().getTime()}`, {
//             signal: controller.signal 
//         });
        
//         clearTimeout(timeoutId);
//         const data = await response.json();

//         if (data.success && data.tasa > CONFIG.LIMITS.MIN && data.tasa < CONFIG.LIMITS.MAX) {
//             console.log("Supervisor: API Principal validada ✅");
//             actualizarUI(data.tasa, data.fecha_consulta);
//         } else {
//             console.warn("Supervisor: Dato incoherente. Saltando a respaldo...");
//             await llamarRespaldo();
//         }

//     } catch (err) {
//         clearTimeout(timeoutId);
//         console.error("Supervisor: API Principal lenta o caída. Usando respaldo...");
//         await llamarRespaldo();
//     }
    
    
//     try {
//         console.log("Supervisor: Iniciando chequeo en API Principal...");
//         const response = await fetch(`${CONFIG.API_PRIMARY}?t=${new Date().getTime()}`);
        
//         if (!response.ok) throw new Error("Servidor Railway Offline");
        
//         const data = await response.json();

//         // VALIDACIÓN: ¿El número tiene sentido?
//         if (data.success && data.tasa > CONFIG.LIMITS.MIN && data.tasa < CONFIG.LIMITS.MAX) {
//             console.log("Supervisor: API Principal validada ✅");
//             actualizarUI(data.tasa, data.fecha_consulta);
//         } else {
//             console.warn("Supervisor: ¡Dato loco detectado! Activando Plan B...");
//             await llamarRespaldo();
//         }

//     } catch (err) {
//         console.error("Supervisor: Fallo crítico en Principal. Buscando respaldo...");
//         await llamarRespaldo();
//     }
// }