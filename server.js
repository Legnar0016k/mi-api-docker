const express = require ('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({
        mensaje: "¡API en Docker desplegada con éxito!",
        engine : "Docker + Railway",
        developer : "Raul",
        status : "Online"
    });

});

app.get('/tasa', (req, res) => {
    res.json({
        moneda: "VES",
        tasa: 54.50, // Un ejemplo
        fuente: "Mi propia API"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});