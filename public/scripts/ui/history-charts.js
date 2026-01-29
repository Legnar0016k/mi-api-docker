/**
 * 📊 MÓDULO DE ANÁLISIS HISTÓRICO (V1.0)
 * Visualización de tendencias y memoria de tasas.
 */

const HistoryModule = {
    storageKey: 'bcv_history_data',

    init() {
        console.log("📊 Módulo de Historia: Activado.");
        this.saveTodayRate();
        this.createModal();
    },

    // 💾 Guarda la tasa del día si no existe
    saveTodayRate() {
        const currentData = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const today = new Date().toLocaleDateString('es-VE');
        
        // Obtenemos la tasa actual desde el DOM (donde la pone tu monitor-master)
        const rateText = document.getElementById('usd-rate')?.innerText || "0";
        const rate = parseFloat(rateText.replace(',', '.'));

        if (rate > 0 && !currentData.find(d => d.date === today)) {
            currentData.push({ date: today, rate: rate });
            // Solo guardamos los últimos 30 días
            if (currentData.length > 30) currentData.shift();
            localStorage.setItem(this.storageKey, JSON.stringify(currentData));
        }
    },

    createModal() {
        const modalHTML = `
            <div id="historyModal" class="modal">
                <div class="modal-content">
                    <span class="close-history">&times;</span>
                    <h2>Historial de Tendencia (USD)</h2>
                    <canvas id="rateChart"></canvas>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        document.querySelector('.close-history').onclick = () => {
            document.getElementById('historyModal').style.display = "none";
        };
    },

    renderChart() {
        const ctx = document.getElementById('rateChart').getContext('2d');
        const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        
        if (data.length < 2) {
            alert("Necesitamos al menos 2 días de datos para generar la tendencia.");
            return;
        }

        const labels = data.map(d => d.date);
        const values = data.map(d => d.rate);
        
        // Lógica de color: Comparar hoy vs ayer
        const isUp = values[values.length - 1] > values[values.length - 2];
        const color = isUp ? '#ef4444' : '#22c55e'; // Rojo si sube, Verde si baja

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tasa Oficial BCV',
                    data: values,
                    borderColor: color,
                    backgroundColor: color + '22',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true }
        });
        
        document.getElementById('historyModal').style.display = "block";
    }
};

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => HistoryModule.init());