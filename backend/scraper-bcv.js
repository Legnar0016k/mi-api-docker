//Scraper para monitorear la tasa del Euro y Dolar
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const BCV_URL = "https://www.bcv.org.ve/";

// Agente para evitar errores de certificado SSL comunes en entes gubernamentales
const agent = new https.Agent({  
  rejectUnauthorized: false
});

// Función genérica para no repetir código
const getTasaFromBCV = async (divId) => {
    try {
        const response = await axios.get(BCV_URL, {
            httpsAgent: agent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'es-ES,es;q=0.9',
                'Cache-Control': 'no-cache',
                'Prrer': 'https://www.google.com/'
            }
        });

       const $ = cheerio.load(response.data);
        // Usamos el ID dinámico: #euro o #dolar
        let valor = $(`#${divId} strong`).text().trim();

        if (valor) {
            // Transformamos "35,55280000" -> "35.55280000"
            return parseFloat(valor.replace(',', '.'));
        }
        return null;
    } catch (error) {
        console.error(`Error scrapeando ${divId}:`, error.message);
        return null;
    }
};

// Exportamos ambas funciones con la misma potencia
const getEuroBCV = () => getTasaFromBCV('euro');
const getDolarBCV = () => getTasaFromBCV('dolar');

module.exports = { getEuroBCV, getDolarBCV };