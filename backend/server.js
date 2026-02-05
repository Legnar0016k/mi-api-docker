//servidor principal de la aplicacion
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path'); // <-- 1. IMPORTANTE: Añadir esto
const bcvScraper = require('./scraper-bcv.js');
const app = express();
const PORT = process.env.PORT || 3000;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/history.db');
const cron = require('node-cron');

// Permite que Vercel lea los datos de Railway
app.use(cors());

// 2. ESTA ES LA LÍNEA NUEVA:
// Hace que cuando alguien entre a la IP, vea tu index.html
app.use(express.static(path.join(__dirname, '../')));

// Configuración de CORS manual y automática // elimminado

// Monitor nueva logica 28/01/2026 del Euro con Respaldo Inteligente
app.get('/api/euro', async (req, res) => {
    let tasaFinal = null;
    let fuenteUtilizada = 'BCV_Oficial';

    try {
        // Intento 1: BCV (Tu lógica actual)
        tasaFinal = await bcvScraper.getEuroBCV();

        // Intento 2: Respaldo (DolarApi) si el BCV falla
        if (!tasaFinal) {
            console.log("⚠️ Euro BCV caído. Aplicando respaldo DolarAPI...");
            const resp = await axios.get('https://ve.dolarapi.com/v1/monedas/euro');
            if (resp.data && resp.data.valor) {
                tasaFinal = resp.data.valor;
                fuenteUtilizada = 'DolarAPI_Respaldo';
            }
        }

        if (tasaFinal) {
            return res.json({ 
                success: true, 
                tasa: tasaFinal, 
                moneda: 'EUR',
                fuente: fuenteUtilizada,
                fecha: new Date().toLocaleString('es-VE')
            });
        }

        throw new Error("No se pudo obtener la tasa del Euro");

    } catch (error) {
        console.error("❌ Error en ruta Euro:", error.message);
        res.status(500).json({ success: false, message: 'Fuentes de Euro no disponibles' });
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

// Crear tabla
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT UNIQUE, usd_val REAL)");
});

// Ruta para el historial
app.get('/api/historial', (req, res) => {
    db.all("SELECT date, usd_val FROM history ORDER BY date ASC LIMIT 30", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Tarea automática: Guarda la tasa a las 11:59 PM
cron.schedule('59 23 * * *', async () => {
    try {
        console.log("🕒 Iniciando guardado diario de tasa...");
        const tasa = await bcvScraper.getDolarBCV();
        
        if (tasa && tasa > 0) {
            const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
            db.run(
                "INSERT OR IGNORE INTO history (date, usd_val) VALUES (?, ?)", 
                [today, tasa],
                (err) => {
                    if (err) console.error("❌ Error al guardar historial:", err.message);
                    else console.log(`✅ Historial guardado: ${today} -> ${tasa} Bs.`);
                }
            );
        }
    } catch (error) {
        console.error("❌ Error en tarea programada:", error.message);
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

// Forzar un registro inmediato para probar la base de datos
bcvScraper.getDolarBCV().then(tasa => {
    const today = new Date().toISOString().split('T')[0];
    db.run("INSERT OR IGNORE INTO history (date, usd_val) VALUES (?, ?)", [today, tasa], () => {
        console.log("🚀 Registro inicial forzado con éxito");
    });
});

// // SIMULACIÓN: Crear un punto de ayer para que la gráfica tenga 2 puntos
// bcvScraper.getDolarBCV().then(tasa => {
//     // Restamos 1 día a la fecha actual
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);
//     const dateStr = yesterday.toISOString().split('T')[0];
    
//     // Insertamos un valor ligeramente menor para ver la tendencia en ROJO (subida)
//     const tasaSimulada = tasa - 0.50; 

//     db.run("INSERT OR IGNORE INTO history (date, usd_val) VALUES (?, ?)", [dateStr, tasaSimulada], () => {
//         console.log("📈 Punto de ayer simulado para activar la gráfica");
//     });
// });

