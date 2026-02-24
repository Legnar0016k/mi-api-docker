// history-chart.js - Versión corregida
const HistoryChart = {
    chartInstance: null,
    
    async cargarHistorial() {
        try {
            const response = await fetch('https://dolar-monitor-production.up.railway.app/api/tasas');
            const data = await response.json();
            
            if (data.success) {
                this.renderizarGrafica(data.data.historial);
                this.actualizarEstadisticas(data.data.historial);
                return data.data;
            }
        } catch (error) {
            console.error('Error cargando historial:', error);
            const datosEjemplo = this.getDatosEjemplo();
            this.renderizarGrafica(datosEjemplo);
            this.actualizarEstadisticas(datosEjemplo);
        }
    },
    
    getDatosEjemplo() {
        const fechas = [];
        const valores = [];
        let fecha = new Date();
        fecha.setDate(fecha.getDate() - 30); // Empezar desde hace 30 días
        
        for (let i = 0; i <= 30; i++) {
            const dia = new Date(fecha);
            dia.setDate(dia.getDate() + i);
            const fechaStr = dia.toISOString().split('T')[0];
            
            // Crear tendencia alcista (más rojo que verde)
            const base = 85 + i * 0.7; // Sube lentamente
            const variacion = Math.sin(i * 0.3) * 3;
            const valor = Math.max(80, base + variacion);
            
            fechas.push({
                fecha: fechaStr,
                usd: valor
            });
        }
        
        return fechas;
    },
    
    actualizarEstadisticas(historial) {
        if (!historial || historial.length === 0) return;
        
        const valores = historial.map(d => d.usd);
        const maximo = Math.max(...valores);
        const minimo = Math.min(...valores);
        const primerValor = historial[0]?.usd || 0;
        const ultimoValor = historial[historial.length-1]?.usd || 0;
        
        const variacion = ((ultimoValor - primerValor) / primerValor * 100).toFixed(2);
        const signo = ultimoValor > primerValor ? '+' : '';
        
        document.getElementById('stats-variacion').innerHTML = 
            `<span class="${ultimoValor > primerValor ? 'text-red-400' : 'text-green-400'}">${signo}${variacion}%</span>`;
        
        document.getElementById('stats-max').innerHTML = 
            `<span class="text-red-400">Bs ${maximo.toFixed(2)}</span>`;
        
        document.getElementById('stats-min').innerHTML = 
            `<span class="text-green-400">Bs ${minimo.toFixed(2)}</span>`;
    },
    
    renderizarGrafica(historial) {
        const canvas = document.getElementById('history-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destruir instancia anterior si existe
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
        
        // Ordenar por fecha ascendente
        const datosOrdenados = historial.sort((a, b) => 
            new Date(a.fecha) - new Date(b.fecha)
        );
        
        // Calcular tendencia (media móvil de 3 días para suavizar)
        const mediaMovil = datosOrdenados.map((item, index, arr) => {
            if (index < 2) return item.usd;
            const sum = arr[index-2].usd + arr[index-1].usd + item.usd;
            return sum / 3;
        });
        
        // 🔥 NUEVA LÓGICA: Determinar color día por día
        const coloresPorPunto = datosOrdenados.map((item, index, arr) => {
            if (index === 0) return '#94a3b8'; // Gris para el primer punto
            
            const valorAnterior = arr[index-1].usd;
            const valorActual = item.usd;
            
            // ROJO si subió, VERDE si bajó
            return valorActual > valorAnterior ? '#ef4444' : '#10b981';
        });
        
        // Dataset principal con colores variables
        const datasets = [
            {
                label: 'Tasa USD',
                data: datosOrdenados.map(d => d.usd),
                borderColor: '#4f46e5', // Color por defecto para la línea
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: coloresPorPunto, // 🟢🔴 Cada punto con su color
                pointBorderColor: coloresPorPunto,
                pointBorderWidth: 2,
                tension: 0.2,
                fill: true
            },
            {
                label: 'Tendencia',
                data: mediaMovil,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
                tension: 0.3
            }
        ];
        
        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datosOrdenados.map(d => {
                    const fecha = new Date(d.fecha);
                    return fecha.toLocaleDateString('es-VE', { 
                        day: '2-digit', 
                        month: 'short' 
                    });
                }),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#0f172a',
                        titleColor: '#e2e8f0',
                        bodyColor: '#94a3b8',
                        borderColor: '#00f2ff',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const valorActual = context.raw;
                                const dataset = context.dataset;
                                
                                if (context.datasetIndex === 0) {
                                    const index = context.dataIndex;
                                    let cambio = '';
                                    if (index > 0) {
                                        const valorAnterior = dataset.data[index-1];
                                        const diferencia = valorActual - valorAnterior;
                                        const signo = diferencia > 0 ? '+' : '';
                                        cambio = ` (${signo}${diferencia.toFixed(2)})`;
                                    }
                                    return `USD: Bs ${valorActual.toFixed(2)}${cambio}`;
                                }
                                return `Tendencia: Bs ${valorActual.toFixed(2)}`;
                            },
                            labelColor: function(context) {
                                if (context.datasetIndex === 0) {
                                    const index = context.dataIndex;
                                    return {
                                        borderColor: coloresPorPunto[index],
                                        backgroundColor: coloresPorPunto[index],
                                        borderWidth: 2
                                    };
                                }
                                return {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                    borderWidth: 2
                                };
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'Bs ' + value.toFixed(2);
                            },
                            color: '#94a3b8'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            color: '#94a3b8'
                        }
                    }
                }
            }
        });
    },
    
    abrirModal() {
        const modal = document.getElementById('modal-history');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            this.cargarHistorial();
        }
    },
    
    cerrarModal() {
        const modal = document.getElementById('modal-history');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }
};

// Exponer globalmente
window.HistoryChart = HistoryChart;