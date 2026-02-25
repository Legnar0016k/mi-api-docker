// history-chart.js - Versión con registro inteligente + tendencia (CORREGIDO)
const HistoryChart = {
    chartInstance: null,
    datosCompletos: null,
    
    async cargarHistorial() {
        try {
            const response = await fetch('https://dolar-monitor-production.up.railway.app/api/tasas');
            const data = await response.json();
            
            if (data.success) {
                this.datosCompletos = data.data.historial;
                
                const fechaHoy = new Date().toISOString().split('T')[0];
                const datosHoy = this.datosCompletos.filter(d => d.fecha === fechaHoy);
                
                const tasaActualResponse = await fetch('https://dolar-monitor-production.up.railway.app/api/tasas/actual');
                const tasaActualData = await tasaActualResponse.json();
                
                if (tasaActualData.success) {
                    const tasaActual = tasaActualData.data.usd;
                    
                    if (datosHoy.length === 0) {
                        console.log('📝 Registrando tasa de hoy...');
                        await this.registrarTasaHoy(tasaActual, false);
                        
                        const response2 = await fetch('https://dolar-monitor-production.up.railway.app/api/tasas');
                        const data2 = await response2.json();
                        this.datosCompletos = data2.data.historial;
                    }
                    else if (Math.abs(datosHoy[0].usd - tasaActual) > 0.30) {
                        console.log(`📝 Actualizando tasa: ${datosHoy[0].usd} → ${tasaActual}`);
                        await this.registrarTasaHoy(tasaActual, true);
                        
                        const response2 = await fetch('https://dolar-monitor-production.up.railway.app/api/tasas');
                        const data2 = await response2.json();
                        this.datosCompletos = data2.data.historial;
                    }
                }
                
                const ultimos7 = this.filtrarUltimos7(this.datosCompletos);
                this.renderizarGrafica(ultimos7);
                this.actualizarEstadisticas(ultimos7);
                this.actualizarInputFecha();
                
                return data.data;
            }
        } catch (error) {
            console.error('Error:', error);
            const datosEjemplo = this.getDatosEjemplo();
            this.datosCompletos = datosEjemplo;
            const ultimos7 = this.filtrarUltimos7(datosEjemplo);
            this.renderizarGrafica(ultimos7);
            this.actualizarEstadisticas(ultimos7);
        }
    },
    
    async registrarTasaHoy(tasa, esActualizacion = false) {
        try {
            const response = await fetch('https://dolar-monitor-production.up.railway.app/api/tasas/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usd: tasa, actualizar: esActualizacion })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log(`✅ Tasa ${esActualizacion ? 'actualizada' : 'registrada'}: Bs ${tasa.toFixed(2)}`);
                Swal.fire({
                    icon: 'success',
                    title: esActualizacion ? '📊 Tasa actualizada' : '📊 Nuevo registro',
                    text: `Dólar: Bs ${tasa.toFixed(2)}`,
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#0f172a',
                    color: '#fff',
                    toast: true,
                    position: 'top-end'
                });
            }
        } catch (error) {
            console.error('❌ Error:', error);
        }
    },
    
    // 🔥 VERSIÓN CORREGIDA - Últimos 7 días en orden ascendente
    filtrarUltimos7(datos) {
        if (!datos || datos.length === 0) return [];
        
        const ordenados = [...datos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        const ultimos7 = ordenados.slice(0, 7);
        
        // ORDENAR ASCENDENTE para la gráfica
        return ultimos7.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    },
    
    // 🔥 VERSIÓN CORREGIDA - 7 días hacia atrás y orden correcto
    filtrarPorSemana(datos, fechaSeleccionada) {
        if (!datos || datos.length === 0 || !fechaSeleccionada) return [];
        
        const fechaRef = new Date(fechaSeleccionada);
        const fechaInicio = new Date(fechaRef);
        fechaInicio.setDate(fechaRef.getDate() - 6);
        
        const inicioStr = fechaInicio.toISOString().split('T')[0];
        const finStr = fechaRef.toISOString().split('T')[0];
        
        console.log(`📅 Período: ${inicioStr} → ${finStr}`);
        
        // Filtrar datos entre inicio y fin
        const filtrados = datos.filter(d => 
            d.fecha >= inicioStr && d.fecha <= finStr
        );
        
        // ORDENAR POR FECHA ASCENDENTE (importante para la gráfica)
        filtrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        
        console.log('📊 Datos filtrados:', filtrados.map(d => `${d.fecha}: ${d.usd}`));
        
        if (filtrados.length < 3) {
            const ordenados = [...datos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            return ordenados.slice(0, 7).reverse();
        }
        
        return filtrados;
    },
    
    actualizarInputFecha() {
        const input = document.getElementById('history-date');
        if (input && this.datosCompletos && this.datosCompletos.length > 0) {
            const fechas = this.datosCompletos.map(d => d.fecha).sort();
            input.value = fechas[fechas.length - 1];
            input.max = fechas[fechas.length - 1];
            input.min = fechas[0];
            this.actualizarTextoBoton(input.value);
        }
    },
    
    actualizarTextoBoton(fecha) {
        const textoBoton = document.getElementById('fecha-seleccionada-text');
        if (textoBoton && fecha) {
            const fechaObj = new Date(fecha);
            textoBoton.innerText = fechaObj.toLocaleDateString('es-VE', {
                day: '2-digit', month: 'long', year: 'numeric'
            });
        }
    },
    
    async cambiarFecha() {
        const input = document.getElementById('history-date');
        if (!input || !input.value || !this.datosCompletos) return;
        
        const fechaSeleccionada = input.value;
        let datosFiltrados = this.filtrarPorSemana(this.datosCompletos, fechaSeleccionada);
        
        console.log('📊 Datos para gráfica:', datosFiltrados.map(d => `${d.fecha}: ${d.usd}`));
        
        if (datosFiltrados.length === 0) {
            Swal.fire({
                icon: 'info', title: 'Sin datos', timer: 2500,
                text: 'Mostrando últimos disponibles',
                background: '#0f172a', color: '#fff', toast: true, position: 'top-end'
            });
            datosFiltrados = this.filtrarUltimos7(this.datosCompletos);
        }
        
        this.renderizarGrafica(datosFiltrados);
        this.actualizarEstadisticas(datosFiltrados);
        this.actualizarTextoBoton(fechaSeleccionada);
    },
    
    getDatosEjemplo() {
        const datos = [];
        let fecha = new Date();
        fecha.setDate(fecha.getDate() - 30);
        
        for (let i = 0; i <= 30; i++) {
            const dia = new Date(fecha);
            dia.setDate(dia.getDate() + i);
            datos.push({
                fecha: dia.toISOString().split('T')[0],
                usd: 85 + i * 0.5 + Math.sin(i * 0.5) * 2
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
        
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
        
        const datosOrdenados = [...historial].sort((a, b) => 
            new Date(a.fecha) - new Date(b.fecha)
        );
        
        // 📈 Media móvil (tendencia)
        const mediaMovil = datosOrdenados.map((item, index, arr) => {
            if (index < 2) return item.usd;
            return (arr[index-2].usd + arr[index-1].usd + item.usd) / 3;
        });
        
        const coloresPorPunto = datosOrdenados.map((item, index, arr) => {
            if (index === 0) return '#94a3b8';
            return item.usd > arr[index-1].usd ? '#ef4444' : '#10b981';
        });
        
        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datosOrdenados.map(d => {
                    const fecha = new Date(d.fecha);
                    return fecha.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' });
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
                            label: function(context) {
                                const valorActual = context.raw;
                                if (context.datasetIndex === 0) {
                                    const index = context.dataIndex;
                                    let cambio = '';
                                    if (index > 0) {
                                        const valorAnterior = context.dataset.data[index-1];
                                        const diferencia = valorActual - valorAnterior;
                                        const signo = diferencia > 0 ? '+' : '';
                                        const emoji = diferencia > 0 ? '🔴' : '🟢';
                                        cambio = ` ${emoji} ${signo}${diferencia.toFixed(2)}`;
                                    }
                                    return `USD: Bs ${valorActual.toFixed(2)}${cambio}`;
                                }
                                return `Tendencia: Bs ${valorActual.toFixed(2)}`;
                            },
                            labelColor: function(context) {
                                if (context.datasetIndex === 0) {
                                    return {
                                        borderColor: coloresPorPunto[context.dataIndex],
                                        backgroundColor: coloresPorPunto[context.dataIndex],
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
                        ticks: { callback: v => 'Bs ' + v.toFixed(2), color: '#94a3b8' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { maxRotation: 45, minRotation: 45, color: '#94a3b8' }
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