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
app.use(express.static(path.join(__dirname, '../')));

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

//nueva logica para manejar la tasa del dolar
app.get('/tasa-bcv', async (req, res) => {
    let tasaFinal = null;
    let fuenteUtilizada = '';

    try {
        // --- PASO 1: INTENTAR BCV DIRECTO (Tu nueva joya) ---
        const tasaBCV = await bcvScraper.getDolarBCV();
        
        if (tasaBCV && tasaBCV > 0) {
            tasaFinal = tasaBCV;
            fuenteUtilizada = 'BCV_Oficial';
            console.log("✅ Datos obtenidos de BCV Directo");
        } else {
            // --- PASO 2: SI BCV FALLA, SALTAR A MONITOR ---
            console.log("⚠️ BCV falló, intentando Monitor...");
            const { data } = await axios.get('https://www.monitordedivisavenezuela.com/', { timeout: 5000 });
            const $ = cheerio.load(data);
            
            $('div.text-3xl.font-bold').each((i, el) => {
                const texto = $(el).text().trim();
                if (texto.includes('Bs/USD')) {
                    const match = texto.match(/[\d.]+/);
                    if (match) tasaFinal = parseFloat(match[0]);
                }
            });
            
            if (tasaFinal) fuenteUtilizada = 'Monitor_Alternativo';
        }

        // --- PASO 3: EL SEGURO DE VIDA (DolarAPI) ---
        // Si después de los dos intentos seguimos sin tasa, DolarAPI nos salva
        if (!tasaFinal) {
            console.log("🚨 Fuentes primarias caídas. Activando DolarAPI...");
            const resp = await axios.get('https://ve.dolarapi.com/v1/dolares/oficial');
            if (resp.data && resp.data.promedio) {
                tasaFinal = resp.data.promedio;
                fuenteUtilizada = 'DolarAPI_Respaldo';
            }
        }

        if (tasaFinal) {
            return res.json({
                success: true,
                tasa: tasaFinal,
                fuente: fuenteUtilizada,
                fecha: new Date().toLocaleString('es-VE')
            });
        }

        throw new Error("Apagón total de fuentes");

    } catch (error) {
        console.error("❌ Error crítico en servidor:", error.message);
        res.status(500).json({ success: false, message: "No se pudo sincronizar ninguna tasa" });
    }
});

// Comodín para manejar el index.html en cualquier ruta no definida
// ESTO ES LO CORRECTO: Apunta directamente al archivo index.html en la raíz
// Redirección de seguridad para usuarios con rutas viejas
app.get('/public/index.html', (req, res) => {
    res.redirect(301, '/');
});
// Y asegúrate de que el comodín al final del archivo sea este:
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});
app.listen(PORT, '0.0.0.0', () => console.log(`Puerto: ${PORT}`));

