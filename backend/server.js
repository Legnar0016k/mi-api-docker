//servidor principal de la aplicacion
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path'); // <-- 1. IMPORTANTE: Añadir esto
const bcvScraper = require('./scraper-bcv.js');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());

// 2. ESTA ES LA LÍNEA NUEVA:
// Hace que cuando alguien entre a la IP, vea tu index.html
app.use(express.static(path.join(__dirname, '../public')));

// Configuración de CORS manual y automática // elimminado


//Monitor del Euro
app.get('/api/euro', async (req, res) => {
    const tasa = await bcvScraper.getEuroBCV();
    if (tasa) {
        res.json({ success: true, tasa: tasa, moneda: 'EUR' });
    } else {
        res.status(500).json({ success: false, message: 'Error al conectar con BCV' });
    }
});

app.get('/status', (req, res) => res.send('API Operativa 🚀'));

app.get('/tasa-bcv', async (req, res) => {
    try {
        const { data } = await axios.get('https://www.monitordedivisavenezuela.com/', {
            timeout: 10000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const $ = cheerio.load(data);
        let tasaFinal = null;

        // Buscamos el div que contiene el texto de la tasa
        $('div.text-3xl.font-bold').each((i, el) => {
            const texto = $(el).text().trim();
            if (texto.includes('Bs/USD')) {
                const match = texto.match(/[\d.]+/);
                if (match) {
                    tasaFinal = parseFloat(match[0]);
                    return false;
                }
            }
        });

        if (!tasaFinal) throw new Error("No se encontró el dato");

        res.json({
            success: true,
            tasa: tasaFinal,
            fecha_consulta: new Date().toLocaleString('es-VE')
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Comodín para manejar el index.html en cualquier ruta no definida
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.listen(PORT, '0.0.0.0', () => console.log(`Puerto: ${PORT}`));

