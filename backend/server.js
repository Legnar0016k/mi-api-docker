const express = require('express');
const cors = require('cors');
const scraperBCV = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

/**
 * 🚀 ENDPOINT PRINCIPAL
 * Devuelve USD y EUR directamente del BCV.
 */
app.get('/api/tasas', async (req, res) => {
    try {
        console.log("🔍 Petición recibida. Iniciando scrapeo...");
        const datos = await scraperBCV();
        
        res.json({
            success: true,
            data: datos
        });

    } catch (error) {
        res.status(503).json({
            success: false,
            message: "El BCV no responde o cambió la estructura.",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor Nivel 0 activo en http://localhost:${PORT}`);
    console.log(`👉 Prueba el endpoint en: http://localhost:${PORT}/api/tasas`);
});