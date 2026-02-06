// [server.js] - Servidor con Validación Dinámica (Solo USD) v4.1.0
// Fecha: 2026-02-06
// Descripción: Eliminación total de lógica de Euro y optimización de validación cruzada.

const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cron = require('node-cron');
const axios = require('axios');
const bcvScraper = require('./scraper-bcv.js');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database('./backend/history.db');

// Configuración de CORS
app.use(cors({
    origin: 'https://monitor-bcv-venezuela.vercel.app',
    optionsSuccessStatus: 200
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../')));

// --- LÓGICA DE VALIDACIÓN DINÁMICA (EL CEREBRO) ---

const MARGEN_TOLERANCIA = 0.15; // 15% de diferencia permitida respecto a referencia

/**
 * Obtiene la tasa de referencia oficial desde una API externa (DolarApi)
 */
async function obtenerReferenciaExterna() {
    try {
        const url = 'https://ve.dolarapi.com/v1/dolares/oficial';
        const res = await axios.get(url, { timeout: 4000 });
        return res.data.promedio || res.data.compra;
    } catch (e) {
        console.error("🛡️ Validador: Imposible contactar referencia externa.");
        return null;
    }
}

/**
 * Compara el dato extraído del BCV contra el mercado para evitar "tasas locas"
 */
async function validarYProcesar(tasaRaw) {
    const refMercado = await obtenerReferenciaExterna();
    
    if (!refMercado) {
        console.warn("⚠️ Sin referencia externa. Usando dato de scraper con precaución.");
        return { tasa: tasaRaw, fuente: 'BCV_Scraper' };
    }

    const diferencia = Math.abs(tasaRaw - refMercado) / refMercado;

    if (diferencia <= MARGEN_TOLERANCIA) {
        console.log(`✅ Validación exitosa. Dif: ${(diferencia * 100).toFixed(2)}%`);
        return { tasa: tasaRaw, fuente: 'BCV_Oficial' };
    } else {
        console.error(`🚨 ANOMALÍA DETECTADA: BCV(${tasaRaw}) vs REF(${refMercado}). Usando Respaldo.`);
        return { tasa: refMercado, fuente: 'DolarApi_Respaldo' };
    }
}

// --- ENDPOINTS ---

/**
 * 💵 Endpoint Dólar (Ruta principal)
 * Implementa un timeout manual para evitar colgar el servidor si el BCV no responde
 */
app.get('/tasa-bcv', async (req, res) => {
    try {
        console.log("🔍 Consulta recibida: Iniciando peritaje de Dólar...");
        
        // Timeout de seguridad de 7 segundos para el scraper
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 7000)
        );

        const tasaRaw = await Promise.race([
            bcvScraper.getDolarBCV(),
            timeoutPromise
        ]);

        if (!tasaRaw) throw new Error("Scraper entregó dato nulo o vacío");

        const resultado = await validarYProcesar(tasaRaw);
        
        res.json({ 
            success: true, 
            tasa: resultado.tasa, 
            fuente: resultado.fuente,
            timestamp: new Date().toISOString() 
        });

    } catch (error) {
        console.error(`🚨 [ERROR CRÍTICO]: ${error.message}`);
        
        res.status(503).json({ 
            success: false, 
            error: 'Servicio no disponible',
            detalles: error.message === 'Timeout' ? 'El BCV tardó demasiado' : 'Fallo de scraping'
        });
    }
});

/**
 * 📊 Endpoint Historial (Solo USD)
 */
app.get('/api/historial', (req, res) => {
    db.all("SELECT * FROM history ORDER BY date ASC LIMIT 30", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- CRON JOB INTELIGENTE ---
// Registra la tasa oficial en la base de datos 3 veces al día
cron.schedule('0 9,13,17 * * *', async () => {
    console.log("⏰ Ejecutando registro de historial verificado...");
    try {
        const tasaRaw = await bcvScraper.getDolarBCV();
        if (tasaRaw) {
            const resultado = await validarYProcesar(tasaRaw);
            const today = new Date().toISOString().split('T')[0];
            
            db.run(`INSERT OR REPLACE INTO history (date, rate, source) VALUES (?, ?, ?)`, 
                [today, resultado.tasa, resultado.fuente], 
                (err) => {
                    if (err) console.error("❌ Error en DB Cron:", err.message);
                    else console.log("✅ Historial USD actualizado correctamente.");
                }
            );
        }
    } catch (e) {
        console.error("❌ Error en tarea programada:", e.message);
    }
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Dólar Pro activo en puerto ${PORT}`);
});