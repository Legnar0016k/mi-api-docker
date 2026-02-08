const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

/**
 * 🥷 NINJA SCRAPER BCV
 * Diseñado para ser invisible y preciso.
 */
const scraperBCV = async () => {
    const URL = 'https://www.bcv.org.ve/';
    
    // Agente para ignorar certificados SSL rotos del BCV
    const agent = new https.Agent({ rejectUnauthorized: false });

    try {
        const { data } = await axios.get(URL, {
            httpsAgent: agent,
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        const $ = cheerio.load(data);

        // Función interna para limpiar los números locos del BCV (ej: 382,63180000)
        const limpiarTasa = (selector) => {
            const raw = $(selector).text().trim();
            if (!raw) return null;
            // 1. Cambiamos la coma por punto 
            // 2. Quitamos cualquier cosa que no sea número o punto
            const limpio = raw.replace(',', '.').replace(/[^\d.]/g, '');
            return parseFloat(limpio);
        };

        return {
            usd: limpiarTasa('#dolar strong'),
            eur: limpiarTasa('#euro strong'),
            fecha: new Date().toISOString()
        };

    } catch (error) {
        console.error("❌ Ninja Scraper detectado o bloqueado:", error.message);
        throw error;
    }
};

module.exports = scraperBCV;