// Servidor Principal de Producción - v3.8.5
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cron = require('node-cron');
const bcvScraper = require('./scraper-bcv.js');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database('./backend/history.db');

app.use(cors({
    origin: 'https://monitor-bcv-venezuela.vercel.app',
    optionsSuccessStatus: 200
}));

app.use(express.static(path.join(__dirname, '../')));

// PROTECTOR ANTI-502: Cancela peticiones lentas del BCV
const withTimeout = (promise, ms) => {
    const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT_BCV')), ms)
    );
    return Promise.race([promise, timeout]);
};

// Endpoint Euro (Blindado)
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
        res.status(503).json({ success: false, error: 'BCV Lento o Caído' });
    }
});

// ... resto de endpoints (tasa-bcv, historial) se mantienen igual ...

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server en puerto ${PORT}`));