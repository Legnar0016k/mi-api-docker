const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para que tu monitor.html y SISOV puedan consultar la API
app.use(cors());

// Ruta principal de bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: "API de Tasa Cambiaria Activa",
        autor: "Raul",
        endpoint: "/tasa-bcv"
    });
});

// Ruta de Scraping
app.get('/tasa-bcv', async (req, res) => {
    try {
        const { data } = await axios.get('https://www.monitordedivisavenezuela.com/', {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        let tasaTexto = '';

        // Buscamos de forma inteligente el valor del BCV en la página
        $('p, div, span, h5').each((i, el) => {
            const texto = $(el).text().toUpperCase();
            if (texto.includes('BCV') && texto.includes('BS')) {
                // Extrae el número (ejemplo: 54,50)
                const match = texto.match(/\d+,\d+/);
                if (match) {
                    tasaTexto = match[0];
                    return false; // Detiene el ciclo al encontrarlo
                }
            }
        });

        // Si la búsqueda inteligente falla, intentamos por selector de clase común
        if (!tasaTexto) {
            tasaTexto = $('.precio').first().text().trim();
        }

        if (!tasaTexto) throw new Error("No se encontró el formato de tasa esperado");

        // Convertimos "54,50" -> "54.50" -> 54.5 (Número)
        const tasaNumerica = parseFloat(tasaTexto.replace('.', '').replace(',', '.'));

        res.json({
            success: true,
            moneda: "USD",
            tasa: tasaNumerica,
            fecha_consulta: new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' }),
            fuente: "Monitor de Divisa (Datos BCV)"
        });

    } catch (error) {
        console.error("Error en el servidor:", error.message);
        res.status(500).json({
            success: false,
            error: "No se pudo obtener la tasa",
            detalle: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});