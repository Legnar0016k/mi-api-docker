/**
 * 📊 MÓDULO DE ANÁLISIS HISTÓRICO (V1.1)
 * Integración con SQLite Railway + Estilo Google Finance
 */

window.HistoryModule = window.HistoryModule || {
    // URL de tu API en Railway
    apiUrl: 'https://mi-api-docker-production.up.railway.app/api/historial',

    init() {
        console.log("📊 Módulo de Historia: Inicializado...");
        this.createModal();
    },
    
//======================================================================================
    createModal() {
        if (document.getElementById('historyModal')) return;

        const modalHTML = `
            <div id="historyModal" class="modal" style="display:none; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.8); backdrop-filter:blur(5px);">
                <div class="modal-content" style="background:#0f172a; margin:10% auto; padding:20px; border:1px solid #334155; width:90%; max-width:600px; border-radius:15px; color:white; position:relative;">
                    <span class="close-history" style="position:absolute; right:20px; top:10px; cursor:pointer; font-size:28px;">&times;</span>
                    <h2 style="margin-bottom:20px; font-size:1.2rem; font-family:'Plus Jakarta Sans', sans-serif;">Historial BCV (7 días)</h2>
                    <div class="chart-container" style="position:relative; height:300px; width:100%;">
                        <canvas id="rateChart"></canvas>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Evento para cerrar
        document.querySelector('.close-history').onclick = () => {
            document.getElementById('historyModal').style.display = "none";
        };
    },
//======================================================================================
    async renderChart() {
        const modal = document.getElementById('historyModal');
        modal.style.display = "block";
        
        const canvas = document.getElementById('rateChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();

            // Mensaje si no hay datos suficientes (necesitamos al menos 2 para una línea)
            if (!data || data.length < 2) {
                if (window.myChart) window.myChart.destroy();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = "16px Arial";
                ctx.fillStyle = "#94a3b8";
                ctx.textAlign = "center";
                ctx.fillText("Recopilando datos... Vuelve en 24h.", canvas.width / 2, canvas.height / 2);
                return;
            }

            const labels = data.map(d => d.date);
            const usdValues = data.map(d => d.usd_val);
            
            // Lógica de color: Rojo si sube (devaluación), Verde si baja
            const isUp = usdValues[usdValues.length - 1] > usdValues[usdValues.length - 2];
            const color = isUp ? '#ef4444' : '#22c55e'; 

            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, color + '66');
            gradient.addColorStop(1, color + '00');

            if (window.myChart) window.myChart.destroy();

            window.myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        data: usdValues,
                        borderColor: color,
                        borderWidth: 2,
                        fill: true,
                        backgroundColor: gradient,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: true, grid: { display: false } },
                        y: { display: true, position: 'right', grid: { color: '#334155' } }
                    }
                }
            });
        } catch (e) {
            console.error("❌ Error en la gráfica:", e);
        }
    }
};

// // Iniciar módulo
// document.addEventListener('DOMContentLoaded', () => HistoryModule.init());

// Al final de history-charts.js
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HistoryModule.init());
} else {
    HistoryModule.init();
}