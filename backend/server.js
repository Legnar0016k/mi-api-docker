// server.js - API con registro histórico y gráfica
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const obtenerTasasAPI = require('./scraper');
const { dbRun, dbGet, dbAll } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ======================================================
// FUNCIÓN PARA REGISTRAR TASA DIARIA (PROGRAMADA)
// ======================================================
async function registrarTasaDiaria() {
    try {
        console.log('🕒 Ejecutando registro programado de tasa...');
        
        const tasas = await obtenerTasasAPI();
        const fechaHoy = new Date().toISOString().split('T')[0];
        
        // Usar INSERT OR REPLACE para evitar duplicados
        await dbRun(`
            INSERT OR REPLACE INTO tasas_historicas (fecha, usd, eur, fuente) 
            VALUES (?, ?, ?, ?)
        `, [fechaHoy, tasas.usd, tasas.eur, tasas.fuente]);
        
        console.log(`✅ Tasa registrada: USD ${tasas.usd.toFixed(2)} Bs | ${fechaHoy}`);
        
        return tasas;
    } catch (error) {
        console.error('❌ Error registrando tasa diaria:', error.message);
    }
}

// ======================================================
// ENDPOINT PRINCIPAL - Devuelve tasa actual + históricas
// ======================================================
app.get('/api/tasas', async (req, res) => {
    try {
        // 1. Obtener tasa actual
        const tasasActuales = await obtenerTasasAPI();
        const fechaHoy = new Date().toISOString().split('T')[0];
        
        // 2. Registrar automáticamente la de hoy
        await dbRun(`
            INSERT OR REPLACE INTO tasas_historicas (fecha, usd, eur, fuente) 
            VALUES (?, ?, ?, ?)
        `, [fechaHoy, tasasActuales.usd, tasasActuales.eur, tasasActuales.fuente]);
        
        // 3. Obtener historial completo
        const historial = await dbAll(`
            SELECT fecha, usd, eur, fuente 
            FROM tasas_historicas 
            ORDER BY fecha DESC 
            LIMIT 90
        `);
        
        res.json({
            success: true,
            data: {
                actual: {
                    usd: tasasActuales.usd,
                    eur: tasasActuales.eur,
                    fecha: fechaHoy,
                    fuente: tasasActuales.fuente
                },
                historial: historial
            }
        });
        
    } catch (error) {
        console.error('❌ Error en endpoint /api/tasas:', error);
        
        // Fallback: devolver solo historial si la API actual falla
        try {
            const historial = await dbAll(`
                SELECT fecha, usd, eur, fuente 
                FROM tasas_historicas 
                ORDER BY fecha DESC 
                LIMIT 90
            `);
            
            res.json({
                success: true,
                warning: 'Usando datos históricos (API actual no disponible)',
                data: {
                    actual: null,
                    historial: historial
                }
            });
        } catch (dbError) {
            res.status(503).json({
                success: false,
                message: 'No hay datos disponibles'
            });
        }
    }
});

// ======================================================
// ENDPOINT PARA AGREGAR TASAS PASADAS (MANUAL)
// ======================================================
app.post('/api/tasas/historial', async (req, res) => {
    const { fecha, usd, eur, fuente = 'manual' } = req.body;
    
    if (!fecha || !usd) {
        return res.status(400).json({
            success: false,
            message: 'Fecha y USD son requeridos'
        });
    }
    
    try {
        await dbRun(`
            INSERT OR REPLACE INTO tasas_historicas (fecha, usd, eur, fuente) 
            VALUES (?, ?, ?, ?)
        `, [fecha, usd, eur || 0, fuente]);
        
        res.json({
            success: true,
            message: 'Tasa histórica agregada correctamente'
        });
        
    } catch (error) {
        console.error('Error agregando tasa histórica:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ======================================================
// ENDPOINT PARA OBTENER SOLO HISTORIAL
// ======================================================
app.get('/api/tasas/historial', async (req, res) => {
    try {
        const { limite = 90 } = req.query;
        
        const historial = await dbAll(`
            SELECT fecha, usd, eur, fuente 
            FROM tasas_historicas 
            ORDER BY fecha DESC 
            LIMIT ?
        `, [limite]);
        
        res.json({
            success: true,
            data: historial
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ======================================================
// PROGRAMAR TAREA DIARIA (8:00 AM)
// ======================================================
cron.schedule('0 3 * * *', async () => {
    console.log('⏰ Ejecutando tarea programada de las 8:00 AM');
    await registrarTasaDiaria();
});

// // También programar para las 2:00 PM (actualización de tarde)
// cron.schedule('0 14 * * *', async () => {
//     console.log('⏰ Ejecutando tarea programada de las 2:00 PM');
//     await registrarTasaDiaria();
// });

// // Y para las 8:00 PM (cierre)
// cron.schedule('0 20 * * *', async () => {
//     console.log('⏰ Ejecutando tarea programada de las 8:00 PM');
//     await registrarTasaDiaria();
// });

// ======================================================
// AGREGAR TASAS INICIALES (PARA DARLE VIDA)
// ======================================================
async function agregarTasasIniciales() {
    const tasasIniciales = [
        { fecha: '2026-02-20', usd: 92.50, eur: 98.00 },
        { fecha: '2026-02-21', usd: 93.20, eur: 99.10 },
        { fecha: '2026-02-22', usd: 94.80, eur: 100.50 },
        { fecha: '2026-02-23', usd: 95.40, eur: 101.20 },
        { fecha: '2026-02-24', usd: 96.10, eur: 102.00 },
        { fecha: '2026-02-25', usd: 97.30, eur: 103.50 },
        { fecha: '2026-02-26', usd: 98.50, eur: 105.00 },
        { fecha: '2026-02-27', usd: 99.80, eur: 106.20 },
        { fecha: '2026-02-28', usd: 101.20, eur: 108.00 },
        { fecha: '2026-03-01', usd: 102.50, eur: 109.50 }
    ];
    
    for (const tasa of tasasIniciales) {
        await dbRun(`
            INSERT OR IGNORE INTO tasas_historicas (fecha, usd, eur, fuente) 
            VALUES (?, ?, ?, 'inicial')
        `, [tasa.fecha, tasa.usd, tasa.eur]);
    }
    
    console.log('✅ Tasas iniciales agregadas');
}

// Ejecutar al iniciar
(async () => {
    await agregarTasasIniciales();
    // Registrar tasa de hoy al arrancar
    await registrarTasaDiaria();
})();

// ======================================================
// INICIAR SERVIDOR
// ======================================================
app.listen(PORT, () => {
    console.log(`✅ Servidor Histórico activo en http://localhost:${PORT}`);
    console.log(`👉 Endpoints:`);
    console.log(`   - GET  /api/tasas (tasa actual + historial)`);
    console.log(`   - GET  /api/tasas/historial`);
    console.log(`   - POST /api/tasas/historial (agregar manual)`);
});