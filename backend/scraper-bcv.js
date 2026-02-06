// [scraper-bcv.js] - Versión Blindada v3.8.8
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const BCV_URL = "https://www.bcv.org.ve/";

// Agente para ignorar errores de certificados SSL (Típicos del BCV)
const agent = new https.Agent({  
  rejectUnauthorized: false
});

const getTasaFromBCV = async (divId) => {
    try {
        const response = await axios.get(BCV_URL, {
            httpsAgent: agent,
            timeout: 10000, // 10 segundos máximo de espera
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
            // LIMPIEZA QUIRÚRGICA:
            // 1. Quitamos puntos de miles (si existen)
            // 2. Cambiamos la coma decimal por punto (Ej: 449,85 -> 449.85)
            // 3. Dejamos solo números y el punto decimal
            const valorLimpio = valorRaw.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '');
            const num = parseFloat(valorLimpio);

            if (!isNaN(num) && num > 0) {
                console.log(`✅ [${divId.toUpperCase()}] Extraído con éxito: ${num}`);
                return num;
            }
        }
        
        console.error(`⚠️ El selector #${divId} strong no devolvió datos válidos.`);
        return null;

    } catch (error) {
        console.error(`❌ Error en Scraper (${divId}):`, error.message);
        return null;
    }
};

module.exports = {
    getDolarBCV: () => getTasaFromBCV('dolar'),
    getEuroBCV: () => getTasaFromBCV('euro')
};