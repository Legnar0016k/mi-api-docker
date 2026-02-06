// [server.js] - Servidor de Producción Blindado v3.8.8
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cron = require('node-cron');
const bcvScraper = require('./scraper-bcv.js');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database('./backend/history.db');

// Configuración de CORS
app.use(cors({
    origin: 'https://monitor-bcv-venezuela.vercel.app',
    optionsSuccessStatus: 200
}));

// Servir archivos estáticos del nivel superior
app.use(express.static(path.join(__dirname, '../')));

// PROTECTOR ANTI-CUELGUE (Evita el Error 503 de Railway)
const withTimeout = (promise, ms) => {
    const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT_BCV')), ms)
    );
    return Promise.race([promise, timeout]);
};

// --- ENDPOINTS ---

// 💵 Endpoint Dólar (Ruta principal)
app.get('/tasa-bcv', async (req, res) => {
    try {
        const tasa = await bcvScraper.getDolarBCV();
        if (tasa) {
            res.json({ success: true, tasa, fuente: 'BCV_Oficial', timestamp: new Date().toISOString() });
        } else {
            res.status(500).json({ success: false, error: 'No se pudo obtener el Dólar' });
        }
    } catch (error) {
        res.status(503).json({ success: false, error: 'Error de servidor' });
    }
});

// 💶 Endpoint Euro
app.get('/api/euro', async (req, res) => {
    try {
        // Le damos 8 segundos al BCV para responder antes de abortar
        const tasa = await withTimeout(bcvScraper.getEuroBCV(), 8000);
        if (tasa) {
            res.json({ success: true, tasa });
        } else {
            res.status(500).json({ success: false, error: 'Dato nulo del BCV' });
        }
    } catch (error) {
        console.error("🚨 Fallo en /api/euro:", error.message);
        res.status(503).json({ success: false, error: 'BCV fuera de servicio o lento' });
    }
});

// 📊 Endpoint Historial
app.get('/api/historial', (req, res) => {
    db.all("SELECT * FROM history ORDER BY date ASC LIMIT 30", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- SISTEMA AUTOMÁTICO (Cron) ---
cron.schedule('0 9,13,17 * * *', async () => {
    console.log("⏰ Guardando historial automático...");
    const tasa = await bcvScraper.getDolarBCV();
    if (tasa) {
        const today = new Date().toISOString().split('T')[0];
        db.run("INSERT OR IGNORE INTO history (date, usd_val) VALUES (?, ?)", [today, tasa]);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API activa en puerto ${PORT}`);
});