// database.js - Configuración de SQLite para Railway
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear/abrir base de datos en Railway (se guarda en /tmp en el plan gratuito)
const dbPath = process.env.NODE_ENV === 'production' 
    ? '/tmp/tasas.db' 
    : path.join(__dirname, 'tasas.db');

const db = new sqlite3.Database(dbPath);

// Promisify para usar async/await
const dbRun = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

const dbGet = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const dbAll = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Inicializar tablas
async function initDatabase() {
    await dbRun(`
        CREATE TABLE IF NOT EXISTS tasas_historicas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha TEXT UNIQUE,
            usd REAL NOT NULL,
            eur REAL NOT NULL,
            fuente TEXT DEFAULT 'auto',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    console.log('✅ Base de datos inicializada');
}

// Ejecutar inicialización
initDatabase().catch(console.error);

module.exports = { db, dbRun, dbGet, dbAll };