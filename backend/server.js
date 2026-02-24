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
        { fecha: '2026-02-02', usd: 370.25, eur: 440.47 },
        { fecha: '2026-02-03', usd: 372.10, eur: 439.63 },
        { fecha: '2026-02-04', usd: 375.08, eur: 442.58 },
        { fecha: '2026-02-05', usd: 378.45, eur: 447.21 },
        { fecha: '2026-02-06', usd: 381.10, eur: 449.85 },
        { fecha: '2026-02-09', usd: 382.63, eur: 451.87 },
        { fecha: '2026-02-10', usd: 385.27, eur: 458.87 },
        { fecha: '2026-02-11', usd: 388.73, eur: 462.78 },
        { fecha: '2026-02-12', usd: 390.29, eur: 463.08 },
        { fecha: '2026-02-13', usd: 393.22, eur: 467.33 },
        { fecha: '2026-02-18', usd: 396.36, eur: 470.28 },
        { fecha: '2026-02-19', usd: 398.75, eur: 471.41 },
        { fecha: '2026-02-20', usd: 402.33, eur: 472.83 },
        { fecha: '2026-02-23', usd: 405.35, eur: 476.70 },
        { fecha: '2026-02-24', usd: 407.37, eur: 480.80 },
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