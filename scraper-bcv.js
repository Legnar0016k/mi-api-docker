//Scraper para monitorear la tasa del Euro
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const BCV_URL = "https://www.bcv.org.ve/";

// Agente para evitar errores de certificado SSL comunes en entes gubernamentales
const agent = new https.Agent({  
  rejectUnauthorized: false
});

const getEuroBCV = async () => {
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
        
        // Buscamos el valor dentro de la estructura que me pasaste
        let valorEuro = $('#euro strong').text().trim();

        // Limpieza: "417,58609701" -> 417.58
        if (valorEuro) {
            valorEuro = valorEuro.replace(',', '.');
            return parseFloat(valorEuro);
        }
        
        throw new Error("No se pudo localizar el valor del Euro");

    } catch (error) {
        console.error("Error en Scraper BCV:", error.message);
        return null;
    }
};

module.exports = { getEuroBCV };