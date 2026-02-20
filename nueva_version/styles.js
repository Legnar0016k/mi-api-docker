// Estado de la aplicación
        const state = {
            tasaUSD: 0,
            tasaEUR: 0,
            selectedCurrency: 'USD',
            loading: true
        };

        // Elementos del DOM
        const elements = {
            loader: document.getElementById('loader'),
            mainContent: document.getElementById('main-content'),
            price: document.getElementById('price'),
            euroPrice: document.getElementById('euro-price'),
            date: document.getElementById('date'),
            syncStatus: document.getElementById('sync-status'),
            debugSource: document.getElementById('debug-source'),
            btnRefresh: document.getElementById('btn-refresh'),
            btnCalculator: document.getElementById('btn-calculator'),
            modal: document.getElementById('modal-calc'),
            modalClose: document.getElementById('modal-close'),
            calcInput: document.getElementById('calc-input'),
            calcResult: document.getElementById('calc-result')
        };

        // Función para formatear números
        function formatNumber(num) {
            return num.toLocaleString('es-VE', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
        }

        // Función para actualizar UI
        function updateUI(data, isBackup = false) {
            state.tasaUSD = data.usd;
            state.tasaEUR = data.eur;

            elements.price.textContent = formatNumber(data.usd);
            elements.euroPrice.textContent = formatNumber(data.eur) + ' €';
            elements.date.textContent = new Date().toLocaleTimeString('es-VE');
            
            elements.syncStatus.textContent = isBackup ? 'Respaldo' : 'Sincronizado';
            elements.syncStatus.style.color = isBackup ? '#f59e0b' : '#10b981';
            
            elements.debugSource.textContent = isBackup ? 'FUENTE: RESPALDO' : 'FUENTE: BCV OFICIAL';

            // Mostrar contenido
            elements.loader.classList.add('hidden');
            elements.mainContent.classList.remove('hidden');
        }

        // Función para cargar tasas
        async function fetchTasa() {
            try {
                // Reemplaza con tu URL de Railway
                const url = 'https://mi-api-docker-production.up.railway.app/api/tasas';
                
                const response = await fetch(url);
                const res = await response.json();

                if (res.success && res.data) {
                    updateUI(res.data, false);
                } else {
                    throw new Error('Respuesta inválida del servidor');
                }
            } catch (error) {
                console.error('Error al cargar tasas:', error);
                elements.syncStatus.textContent = 'Error';
                elements.syncStatus.style.color = '#ef4444';
                elements.debugSource.textContent = 'ERROR: Servidor no disponible';
                
                // Mostrar contenido aunque haya error
                elements.loader.classList.add('hidden');
                elements.mainContent.classList.remove('hidden');
            }
        }

        // Calculadora
        function calculate() {
            const amount = parseFloat(elements.calcInput.value) || 0;
            const rate = state.selectedCurrency === 'USD' ? state.tasaUSD : state.tasaEUR;
            const total = amount * rate;
            
            elements.calcResult.textContent = formatNumber(total);
        }

        // Event Listeners
        elements.btnRefresh.addEventListener('click', fetchTasa);

        elements.btnCalculator.addEventListener('click', () => {
            elements.modal.classList.add('active');
            elements.calcInput.focus();
        });

        elements.modalClose.addEventListener('click', () => {
            elements.modal.classList.remove('active');
        });

        elements.modal.addEventListener('click', (e) => {
            if (e.target === elements.modal) {
                elements.modal.classList.remove('active');
            }
        });

        elements.calcInput.addEventListener('input', calculate);

        // Quick amounts
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                elements.calcInput.value = btn.dataset.amount;
                calculate();
            });
        });

        // Currency toggle
        document.querySelectorAll('.currency-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.selectedCurrency = btn.dataset.currency;
                calculate();
            });
        });

        // Cargar tasas al iniciar
        fetchTasa();

        // Actualizar cada 5 minutos
        setInterval(fetchTasa, 5 * 60 * 1000);