/**
 * 🕵️ SCRAPER BCV - VERSIÓN INTELIGENTE v4.0.0
 * Trabajando en armonía con la Validación Dinámica del Servidor.
 */

const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const BCV_URL = "https://www.bcv.org.ve/";

// Agente para ignorar errores de certificados SSL (Típicos del BCV)
const agent = new https.Agent({  
  rejectUnauthorized: false
});

/**
 * Procesa la extracción de datos de la página del BCV
 * @param {string} divId - El ID del contenedor (#dolar o #euro)
 */
const getTasaFromBCV = async (divId) => {
    try {
        const response = await axios.get(BCV_URL, {
            httpsAgent: agent,
            timeout: 10000, // 10 segundos para dar margen a la red del BCV
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Cache-Control': 'no-cache'
            }
        });

        const $ = cheerio.load(response.data);
        
        // Buscamos el <strong> dentro del ID proporcionado (#euro o #dolar)
        const valorRaw = $(`#${divId} strong`).text().trim();

        if (valorRaw) {
            /**
             * LIMPIEZA QUIRÚRGICA:
             * 1. Quitamos puntos de miles (ej: 1.234,56 -> 1234,56)
             * 2. Cambiamos la coma decimal por punto (ej: 1234,56 -> 1234.56)
             * 3. Dejamos solo números y el punto decimal
             */
            const valorLimpio = valorRaw.replace(/\\./g, '').replace(',', '.').replace(/[^\\d.]/g, '');
            const num = parseFloat(valorLimpio);

            // VALIDACIÓN MÍNIMA: Solo verificamos que sea un número positivo.
            // La validación de mercado (si es 38 o 380) la hace ahora el server.js
            if (!isNaN(num) && num > 0) {
                console.log(`✅ [${divId.toUpperCase()}] Extraído: ${num}`);
                return num;
            } else {
                console.error(`❌ [${divId.toUpperCase()}] Formato inválido: ${valorRaw}`);
                return null;
            }
        }
        
        console.error(`❌ [${divId.toUpperCase()}] No se encontró el elemento en el HTML.`);
        return null;

    } catch (error) {
        console.error(`🚨 [${divId.toUpperCase()}] Error de conexión:`, error.message);
        return null;
    }
};

// Exportamos las funciones específicas
module.exports = {
    getDolarBCV: () => getTasaFromBCV('dolar'),
    getEuroBCV: () => getTasaFromBCV('euro')
};