// scraper.js - Obtiene tasas de APIs confiables
const axios = require('axios');

async function obtenerTasasAPI() {
    try {
        // Usar ExchangeRate-API como fuente principal
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
            timeout: 8000
        });
        
        const data = response.data;
        
        if (data && data.rates) {
            const usdVes = data.rates.VES;
            const eurVes = usdVes / data.rates.EUR;
            
            return {
                usd: usdVes,
                eur: eurVes,
                fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                fuente: 'exchangerate-api'
            };
        }
        throw new Error('Datos incompletos');
    } catch (error) {
        console.log('⚠️ ExchangeRate-API falló, intentando con DolarAPI');
        
        // Fallback a DolarAPI
        try {
            const dolarRes = await axios.get('https://ve.dolarapi.com/v1/dolares/oficial', {
                timeout: 5000
            });
            
            const dolarData = dolarRes.data;
            
            if (dolarData && dolarData.promedio) {
                // Para euro, usamos una aproximación (1 EUR ≈ 1.05 USD)
                const usdValue = dolarData.promedio;
                const eurValue = usdValue * 1.05; // Aproximación
                
                return {
                    usd: usdValue,
                    eur: eurValue,
                    fecha: new Date().toISOString().split('T')[0],
                    fuente: 'dolarapi'
                };
            }
        } catch (fallbackError) {
            console.error('❌ Todas las APIs fallaron');
            throw new Error('No se pudo obtener tasas de ninguna fuente');
        }
    }
}

module.exports = obtenerTasasAPI;