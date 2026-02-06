// Scraper robusto para BCV - v3.8.3
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const BCV_URL = "https://www.bcv.org.ve/";

// Agente para ignorar errores de certificados SSL del BCV
const agent = new https.Agent({  
  rejectUnauthorized: false
});

const getTasaFromBCV = async (divId) => {
    try {
        const response = await axios.get(BCV_URL, {
            httpsAgent: agent,
            timeout: 7000, // No esperar más de 7 segundos a nivel de red
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Cache-Control': 'no-cache'
            }
        });

        const $ = cheerio.load(response.data);
        const valorRaw = $(`#${divId} strong`).text().trim();

        if (valorRaw) {
            // SANEAMIENTO DE RAÍZ:
            // 1. Eliminamos puntos de miles (ej: 1.234,56 -> 1234,56)
            // 2. Cambiamos coma decimal por punto (ej: 1234,56 -> 1234.56)
            // 3. Filtramos para dejar solo dígitos y el punto
            const valorLimpio = valorRaw.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '');
            const num = parseFloat(valorLimpio);

            // Filtro de seguridad: Descarta si no es un número o si es un valor absurdo (ej: 500)
            if (!isNaN(num) && num > 10 && num < 100) {
                return num;
            } else {
                console.error(`❌ Valor descartado por seguridad: ${valorRaw} -> Resultó en: ${num}`);
                return null;
            }
        }
        return null;
    } catch (error) {
        console.error(`⚠️ Error en scraper BCV (${divId}):`, error.message);
        return null;
    }
};

module.exports = {
    getDolarBCV: () => getTasaFromBCV('dolar'),
    getEuroBCV: () => getTasaFromBCV('euro')
};