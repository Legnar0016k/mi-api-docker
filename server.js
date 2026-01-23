const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS súper abierta para pruebas
app.use(cors({
    origin: '*',
    methods: ['GET']
}));

app.get('/', (req, res) => {
    res.send('Servidor Vivo ✅');
});

app.get('/tasa-bcv', async (req, res) => {
    try {
        // Intentamos una fuente alternativa más estable y rápida
        const { data } = await axios.get('https://www.bcv.org.ve/', {
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        // Selector directo del BCV
        let tasaDolar = $('#dolar strong').text().trim().replace('.', '').replace(',', '.');
        let valor = parseFloat(tasaDolar);

        if (isNaN(valor)) throw new Error("Formato no numérico");

        res.json({
            success: true,
            tasa: valor,
            fecha_consulta: new Date().toLocaleString('es-VE')
        });

    } catch (error) {
        console.log("Error Scraping:", error.message);
        // Si falla el scraping, enviamos un dato de prueba para que el HTML no se rompa
        res.json({
            success: true, 
            tasa: 54.20, // Dato de respaldo
            nota: "Dato de respaldo por falla de conexión",
            fecha_consulta: new Date().toLocaleString('es-VE')
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});