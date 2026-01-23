app.get('/tasa-bcv', async (req, res) => {
    try {
        const { data } = await axios.get('https://www.monitordedivisavenezuela.com/', {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);

        // En esta página, buscamos el valor que está asociado al BCV
        // Usualmente está en un div o párrafo que contiene el texto "BCV"
        let tasaTexto = '';
        
        $('p, div, span').each((i, el) => {
            const texto = $(el).text();
            if (texto.includes('BCV') && texto.includes('Bs')) {
                // Buscamos el número dentro de ese texto
                const match = texto.match(/\d+,\d+/);
                if (match) {
                    tasaTexto = match[0];
                    return false; // Rompe el ciclo
                }
            }
        });

        if (!tasaTexto) {
            // Plan B: Buscar por una clase común en esa web si el texto falla
            tasaTexto = $('.precio').first().text().trim();
        }

        // Limpieza de formato: de "36,50" a 36.50
        const tasaNumerica = parseFloat(tasaTexto.replace('.', '').replace(',', '.'));

        if (isNaN(tasaNumerica)) throw new Error("No se pudo parsear la tasa");

        res.json({
            success: true,
            moneda: "USD",
            tasa: tasaNumerica,
            fecha_consulta: new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' }),
            fuente: "Monitor de Divisa Venezuela (Dato BCV)"
        });

    } catch (error) {
        console.error("Error Scraping:", error.message);
        res.status(500).json({
            success: false,
            error: "Error al obtener datos de la nueva fuente",
            detalle: error.message
        });
    }
});