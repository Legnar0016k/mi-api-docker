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
        let tasaNumerica = null;

        // ESTRATEGIA: Buscar en elementos que suelen tener el precio
        $('.precio, .rate, .value, h4, h5, p').each((i, el) => {
            const texto = $(el).text().trim();
            // Si el texto tiene un formato de moneda (ej: 54,12)
            if (/\d+,\d+/.test(texto)) {
                // Si además el contenedor o un pariente cercano menciona "BCV"
                const contexto = $(el).closest('div').text().toUpperCase();
                if (contexto.includes('BCV')) {
                    const match = texto.match(/\d+,\d+/);
                    if (match) {
                        tasaNumerica = parseFloat(match[0].replace('.', '').replace(',', '.'));
                        return false; // Encontrado, salir del bucle
                    }
                }
            }
        });

        if (!tasaNumerica || isNaN(tasaNumerica)) {
             throw new Error("El formato de la tasa cambió en la web origen");
        }

        res.json({
            success: true,
            moneda: "USD",
            tasa: tasaNumerica,
            fecha_consulta: new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' }),
            fuente: "Monitor de Divisa (Analizado)"
        });

    } catch (error) {
        console.error("Error Grave:", error.message);
        res.status(500).json({
            success: false,
            error: "Falla en el motor de extracción",
            detalle: error.message
        });
    }
});