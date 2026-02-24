// history-chart.js - Versión con filtro de 7 días
const HistoryChart = {
    chartInstance: null,
    datosCompletos: null,
    
    async cargarHistorial() {
        try {
            const response = await fetch('https://dolar-monitor-production.up.railway.app/api/tasas');
            const data = await response.json();
            
            if (data.success) {
                this.datosCompletos = data.data.historial;
                
                // Por defecto, mostrar últimos 7 días
                const ultimos7 = this.filtrarUltimos7(this.datosCompletos);
                this.renderizarGrafica(ultimos7);
                this.actualizarEstadisticas(ultimos7);
                
                // Actualizar input de fecha con la fecha más reciente
                this.actualizarInputFecha();
                
                return data.data;
            }
        } catch (error) {
            console.error('Error cargando historial:', error);
            const datosEjemplo = this.getDatosEjemplo();
            this.datosCompletos = datosEjemplo;
            this.renderizarGrafica(this.filtrarUltimos7(datosEjemplo));
            this.actualizarEstadisticas(this.filtrarUltimos7(datosEjemplo));
        }
    },
    
    filtrarUltimos7(datos) {
        if (!datos || datos.length === 0) return [];
        
        // Ordenar por fecha descendente y tomar últimos 7
        const ordenados = [...datos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        return ordenados.slice(0, 7).reverse(); // Revertir para orden ascendente en gráfica
    },
    
    filtrarPorSemana(datos, fechaSeleccionada) {
        if (!datos || datos.length === 0 || !fechaSeleccionada) return [];
        
        const fechaRef = new Date(fechaSeleccionada);
        const fechaInicio = new Date(fechaRef);
        fechaInicio.setDate(fechaInicio.getDate() - 6); // 7 días incluyendo la seleccionada
        
        // Formatear a YYYY-MM-DD para comparar
        const inicioStr = fechaInicio.toISOString().split('T')[0];
        const finStr = fechaRef.toISOString().split('T')[0];
        
        const filtrados = datos.filter(d => 
            d.fecha >= inicioStr && d.fecha <= finStr
        ).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        
        return filtrados;
    },
    
    // SE Modifica la función actualizarInputFecha para que llame a esta:
    actualizarInputFecha() {
        const input = document.getElementById('history-date');
        if (input && this.datosCompletos && this.datosCompletos.length > 0) {
            const fechas = this.datosCompletos.map(d => d.fecha).sort();
            input.value = fechas[fechas.length - 1];
            input.max = fechas[fechas.length - 1];
            input.min = fechas[0];

            // 🔥 NUEVO: Actualizar el texto del botón
            this.actualizarTextoBoton(input.value);
        }
    },

    actualizarTextoBoton(fecha) {
        const textoBoton = document.getElementById('fecha-seleccionada-text');
        if (textoBoton && fecha) {
            const fechaObj = new Date(fecha);
            const fechaFormateada = fechaObj.toLocaleDateString('es-VE', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
            textoBoton.innerText = fechaFormateada;
        }
    },
    
    // Modifica la función cambiarFecha para que actualice el texto:
    async cambiarFecha() {
        const input = document.getElementById('history-date');
        if (!input || !input.value || !this.datosCompletos) return;
        
        const fechaSeleccionada = input.value;
        const datosFiltrados = this.filtrarPorSemana(this.datosCompletos, fechaSeleccionada);
        
        if (datosFiltrados.length > 0) {
            this.renderizarGrafica(datosFiltrados);
            this.actualizarEstadisticas(datosFiltrados);
            // 🔥 NUEVO: Actualizar el texto del botón
            this.actualizarTextoBoton(fechaSeleccionada);
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Sin datos',
                text: 'No hay registros para la semana seleccionada',
                timer: 2000,
                showConfirmButton: false
            });
        }
    },
    
    getDatosEjemplo() {
        const datos = [];
        let fecha = new Date();
        fecha.setDate(fecha.getDate() - 30);
        
        for (let i = 0; i <= 30; i++) {
            const dia = new Date(fecha);
            dia.setDate(dia.getDate() + i);
            const fechaStr = dia.toISOString().split('T')[0];
            
            const base = 85 + i * 0.5;
            const variacion = Math.sin(i * 0.5) * 2;
            const valor = base + variacion;
            
            datos.push({
                fecha: fechaStr,
                usd: valor
            });
        }
        return datos;
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
        
        const statsVariacion = document.getElementById('stats-variacion');
        const statsMax = document.getElementById('stats-max');
        const statsMin = document.getElementById('stats-min');
        
        if (statsVariacion) {
            statsVariacion.innerHTML = `<span class="${ultimoValor > primerValor ? 'text-red-400' : 'text-green-400'}">${signo}${variacion}%</span>`;
        }
        
        if (statsMax) {
            statsMax.innerHTML = `<span class="text-red-400">Bs ${maximo.toFixed(2)}</span>`;
        }
        
        if (statsMin) {
            statsMin.innerHTML = `<span class="text-green-400">Bs ${minimo.toFixed(2)}</span>`;
        }
    },
    
    renderizarGrafica(historial) {
    const canvas = document.getElementById('history-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (this.chartInstance) {
        this.chartInstance.destroy();
    }
    
    const datosOrdenados = [...historial].sort((a, b) => 
        new Date(a.fecha) - new Date(b.fecha)
    );
    
    // 📈 Media móvil de 3 días (TENDENCIA)
    const mediaMovil = datosOrdenados.map((item, index, arr) => {
        if (index < 2) return item.usd;
        const sum = arr[index-2].usd + arr[index-1].usd + item.usd;
        return sum / 3;
    });
    
    // 🔴🟢 Colores según subida/bajada
    const coloresPorPunto = datosOrdenados.map((item, index, arr) => {
        if (index === 0) return '#94a3b8';
        return item.usd > arr[index-1].usd ? '#ef4444' : '#10b981';
    });
    
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
            datasets: [
                {
                    label: 'Tasa USD',
                    data: datosOrdenados.map(d => d.usd),
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: coloresPorPunto,
                    pointBorderColor: coloresPorPunto,
                    pointBorderWidth: 2,
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Tendencia',
                    data: mediaMovil,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#0f172a',
                    titleColor: '#e2e8f0',
                    bodyColor: '#94a3b8',
                    borderColor: '#00f2ff',
                    borderWidth: 1,
                    callbacks: {
                        // 💬 Tooltip mejorado con emojis
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
                                    const emoji = diferencia > 0 ? '🔴' : '🟢';
                                    cambio = ` ${emoji} ${signo}${diferencia.toFixed(2)}`;
                                }
                                return `USD: Bs ${valorActual.toFixed(2)}${cambio}`;
                            }
                            return `Tendencia: Bs ${valorActual.toFixed(2)}`;
                        },
                        // Color del punto en tooltip
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
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        callback: v => 'Bs ' + v.toFixed(2),
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: { display: false },
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

window.HistoryChart = HistoryChart;