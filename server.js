const express = require('express');
const cors = require('cors'); // <--- 1. Importar cors
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // <--- 2. Permitir que cualquier app consulte tu API
app.get('/tasa-bcv', async (req, res) => {
    try {
        // 1. Descargamos el HTML de la página del BCV
        // Usamos un 'User-Agent' para que el BCV crea que somos un navegador real
        const { data } = await axios.get('https://www.bcv.org.ve/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // 2. Cargamos el HTML en cheerio para analizarlo
        const $ = cheerio.load(data);

        // 3. Buscamos el ID específico donde el BCV guarda el dólar
        let tasaDolar = $('#dolar strong').text().trim();

        // 4. Limpiamos el formato (Cambiamos coma por punto para que sea un número válido)
        tasaDolar = tasaDolar.replace('.', '').replace(',', '.');
        const tasaNumerica = parseFloat(tasaDolar);

        res.json({
            success: true,
            moneda: "USD",
            tasa: tasaNumerica,
            fecha_consulta: new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' }),
            fuente: "Banco Central de Venezuela"
        });

    } catch (error) {
        console.error("Error haciendo scraping:", error.message);
        res.status(500).json({
            success: false,
            error: "No se pudo obtener la tasa del BCV"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
