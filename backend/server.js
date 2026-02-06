// Servidor Principal de Producción - v3.8.3
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cron = require('node-cron');
const bcvScraper = require('./scraper-bcv.js');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database('./backend/history.db');

// Configuración de CORS para tu frontend en Vercel
app.use(cors({
    origin: 'https://monitor-bcv-venezuela.vercel.app',
    optionsSuccessStatus: 200
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../')));

// UTILERÍA: Protector contra el "Efecto 502" (Cuelgue de peticiones)
const withTimeout = (promise, ms) => {
    const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT_BCV')), ms)
    );
    return Promise.race([promise, timeout]);
};

// --- ENDPOINTS ---

// Dólar (Prioridad)
app.get('/tasa-bcv', async (req, res) => {
    try {
        const tasa = await withTimeout(bcvScraper.getDolarBCV(), 8000);
        if (tasa) {
            res.json({ success: true, tasa, fuente: 'BCV Oficial', fecha: new Date().toLocaleTimeString() });
        } else {
            throw new Error('Dato nulo');
        }
    } catch (error) {
        console.error("Fallo /tasa-bcv:", error.message);
        res.status(503).json({ success: false, error: 'Servicio temporalmente no disponible' });
    }
});

// Euro (Independiente)
app.get('/api/euro', async (req, res) => {
    try {
        const tasa = await withTimeout(bcvScraper.getEuroBCV(), 8000);
        if (tasa) {
            res.json({ success: true, tasa });
        } else {
            throw new Error('Dato nulo');
        }
    } catch (error) {
        console.error("Fallo /api/euro:", error.message);
        res.status(503).json({ success: false, error: 'BCV Lento' });
    }
});

// Historial para Gráficas
app.get('/api/historial', (req, res) => {
    db.all("SELECT * FROM history ORDER BY date ASC LIMIT 30", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- SISTEMA DE BASE DE DATOS Y CRON ---

// Guardado automático diario
cron.schedule('0 9,13,17 * * *', async () => {
    console.log("⏰ Ejecutando registro automático de historial...");
    const tasa = await bcvScraper.getDolarBCV();
    if (tasa) {
        const date = new Date().toISOString().split('T')[0];
        db.run("INSERT OR IGNORE INTO history (date, usd_val) VALUES (?, ?)", [date, tasa]);
    }
});

// Comodín para SPA (Redirige cualquier ruta al index)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor blindado corriendo en puerto ${PORT}`);
});