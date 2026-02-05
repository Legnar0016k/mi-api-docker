/** logica nueva 05/02/2026
/**
 * 💾 SISTEMA DE CACHÉ DE TASAS
 * Optimiza el consumo de recursos de Railway (USD)
 */
const RateCache = {
    set(key, data, expirationInMinutes = 120) {
        const item = {
            value: data,
            expiry: Date.now() + (expirationInMinutes * 60 * 1000),
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    get(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        const item = JSON.parse(itemStr);
        if (Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    }
};

async function obtenerDolarConRespaldo() {
    try {
        // 1. Intentar obtener del caché local primero
        const cached = RateCache.get('cache_tasa_bcv_usd');
        if (cached) {
            console.log("⚡ Usando tasa Dólar desde caché (Ahorro de API)");
            return cached;
        }

        const urlRailway = 'https://mi-api-docker-production.up.railway.app/tasa-bcv'; 
        
        console.log("📡 Conectando con Railway por nueva tasa...");
        const response = await fetch(urlRailway);
        const data = await response.json();
        
        if (data && data.success) {
            const resultado = {
                valor: data.tasa,
                origen: data.fuente || 'Respaldo'
            };

            // 2. Guardar en caché por 2 horas (120 min)
            RateCache.set('cache_tasa_bcv_usd', resultado, 120);
            return resultado;
        }
        return null;
    } catch (error) {
        console.error("❌ Error de conexión con Railway:", error);
        return null;
    }
}
//logica anterior 05/02/2026
//Este manejará la lógica de ir a buscar el dólar al servidor.

// async function obtenerDolarConRespaldo() {
//     try {
//         // SUSTITUYE 'tu-app.railway.app' por tu URL real de Railway
//         const urlRailway = 'https://mi-api-docker-production.up.railway.app/tasa-bcv'; 
        
//         console.log("📡 Conectando con Railway...");
//         const response = await fetch(urlRailway);
//         const data = await response.json();
        
//         if (data && data.success) {
//             return {
//                 valor: data.tasa,
//                 origen: data.fuente || 'Respaldo'
//             };
//         }
//         return null;
//     } catch (error) {
//         console.error("❌ Error de conexión con Railway:", error);
//         return null;
//     }
// }