app.get('/tasa-bcv', async (req, res) => {
    try {
        const { data } = await axios.get('https://www.monitordedivisavenezuela.com/', {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        let tasaFinal = null;

        // BUSQUEDA SELECTIVA:
        // Buscamos en todos los divs que tengan la clase de fuente grande
        $('div.text-3xl.font-bold').each((i, el) => {
            const texto = $(el).text().trim(); // Ejemplo: "352.71 Bs/USD"
            
            if (texto.includes('Bs/USD')) {
                // Extraemos solo el número (ejemplo: 352.71)
                const match = texto.match(/[\d.]+/); 
                if (match) {
                    tasaFinal = parseFloat(match[0]);
                    return false; // Detener búsqueda
                }
            }
        });

        // Si por alguna razón el diseño cambia un poco, buscamos por texto "Tasa BCV"
        if (!tasaFinal) {
            $('*').each((i, el) => {
                const textoPadre = $(el).text().toUpperCase();
                if (textoPadre.includes('TASA BCV')) {
                    const precioSiguiente = $(el).find('.text-3xl').text().trim();
                    const match = precioSiguiente.match(/[\d.]+/);
                    if (match) tasaFinal = parseFloat(match[0]);
                }
            });
        }

        if (!tasaFinal || isNaN(tasaFinal)) throw new Error("No se encontró el precio en el formato Bs/USD");

        res.json({
            success: true,
            moneda: "USD",
            tasa: tasaFinal,
            fecha_consulta: new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' }),
            fuente: "Monitor de Divisa (Captura Directa)"
        });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            success: false,
            error: "Error al extraer el dato exacto",
            detalle: error.message
        });
    }
});