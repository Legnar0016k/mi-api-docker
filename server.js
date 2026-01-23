const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS manual y automática
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => res.send('API Operativa 🚀'));

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

app.listen(PORT, '0.0.0.0', () => console.log(`Puerto: ${PORT}`));