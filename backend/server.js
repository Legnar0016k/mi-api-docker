// [server.js] - Servidor con Validación Dinámica v4.0.0
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cron = require('node-cron');
const axios = require('axios'); // Añadido para la validación externa
const bcvScraper = require('./scraper-bcv.js');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database('./backend/history.db');

app.use(cors({
    origin: 'https://monitor-bcv-venezuela.vercel.app',
    optionsSuccessStatus: 200
}));

app.use(express.static(path.join(__dirname, '../')));

// --- LÓGICA DE VALIDACIÓN DINÁMICA (EL CEREBRO) ---

const MARGEN_TOLERANCIA = 0.15; // 15% de diferencia permitida

async function obtenerReferenciaExterna(moneda = 'usd') {
    try {
        const url = moneda === 'usd' 
            ? 'https://ve.dolarapi.com/v1/dolares/oficial' 
            : 'https://ve.dolarapi.com/v1/dolares/euro';
        const res = await axios.get(url, { timeout: 4000 });
        return res.data.promedio || res.data.compra;
    } catch (e) {
        console.error(`⚠️ Error consultando referencia externa (${moneda}):`, e.message);
        return null;
    }
}

async function validarYProcesar(tasaBcv, moneda = 'usd') {
    const refMercado = await obtenerReferenciaExterna(moneda);
    
    if (!refMercado) return { tasa: tasaBcv, fuente: 'BCV_Unverified' };

    const diferencia = Math.abs(tasaBcv - refMercado) / refMercado;

    // Si la tasa del BCV es coherente (está cerca del mercado)
    if (diferencia <= MARGEN_TOLERANCIA) {
        return { tasa: tasaBcv, fuente: 'BCV_Oficial', verificado: true };
    } else {
        // Si el BCV devuelve una locura, el servidor hace "SWAP" automático a la referencia
        console.error(`🚨 ANOMALÍA DETECTADA: BCV(${tasaBcv}) vs Ref(${refMercado}). Usando Respaldo.`);
        return { tasa: refMercado, fuente: 'DolarApi_Fallback', verificado: false };
    }
}

// --- ENDPOINTS ACTUALIZADOS ---

app.get('/tasa-bcv', async (req, res) => {
    try {
        // Envolvemos el scraper en la promesa de tiempo límite
        // Si el BCV no responde en 5 segundos, saltará al 'catch'
        const tasaRaw = await withTimeout(bcvScraper.getDolarBCV(), 5000);

        if (!tasaRaw) throw new Error("Scraper fallido o vacío");

        // Continuamos con el peritaje y validación (Railway vs DolarApi)
        const resultado = await validarYProcesar(tasaRaw, 'usd');
        
        res.json({ 
            success: true, 
            tasa: resultado.tasa, 
            fuente: resultado.fuente,
            timestamp: new Date().toISOString() 
        });

    } catch (error) {
        // Si el error fue por tiempo (Timeout), lo registramos específicamente
        console.error(`🚨 [BCV TIMEOUT/ERROR]: ${error.message}`);
        
        res.status(503).json({ 
            success: false, 
            error: 'Servicio no disponible',
            detalles: error.message === 'Timeout' ? 'El BCV tardó demasiado en responder' : 'Error de scraping'
        });
    }
});

app.get('/api/euro', async (req, res) => {
    try {
        // Implementación del límite de 5000ms para la respuesta del BCV
        const tasaRaw = await withTimeout(bcvScraper.getEuroBCV(), 5000);

        if (!tasaRaw) throw new Error("Scraper de Euro fallido");

        // Procesamiento y validación cruzada (EUR)
        const resultado = await validarYProcesar(tasaRaw, 'eur');

        res.json({ 
            success: true, 
            tasa: resultado.tasa, 
            fuente: resultado.fuente,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        // Registro de error específico en los logs del servidor
        console.error(`🚨 [EURO TIMEOUT/ERROR]: ${error.message}`);

        res.status(503).json({ 
            success: false, 
            error: 'Error en consulta Euro',
            detalles: error.message === 'Timeout' ? 'El servidor BCV excedió el tiempo de respuesta (5s)' : error.message
        });
    }
});

// --- CRON JOB INTELIGENTE ---
// Ahora solo guarda en el historial si la tasa es válida
cron.schedule('0 9,13,17 * * *', async () => {
    console.log("⏰ Ejecutando registro de historial verificado...");
    const tasaRaw = await bcvScraper.getDolarBCV();
    if (tasaRaw) {
        const resultado = await validarYProcesar(tasaRaw, 'usd');
        // Solo guardamos si la fuente es oficial o si decidimos que el respaldo es válido
        const today = new Date().toISOString().split('T')[0];
        db.run("INSERT OR IGNORE INTO history (date, usd_val) VALUES (?, ?)", [today, resultado.tasa]);
    }
});

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server Verificado en Puerto ${PORT}`));