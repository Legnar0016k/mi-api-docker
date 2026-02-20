/**
 * CALCULATOR LOGIC MODULE 🧮
 * Versión Mobile - Con soporte para referencias
 */

let selectedCurrency = 'USD';

function setCurrency(type) {
    selectedCurrency = type;
    const btnUsd = document.getElementById('btn-usd');
    const btnEur = document.getElementById('btn-eur');

    if (type === 'USD') {
        btnUsd.className = "currency-btn py-4 rounded-2xl border-2 border-cyan-400 bg-cyan-400/20 text-cyan-400 font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all";
        btnEur.className = "currency-btn py-4 rounded-2xl border-2 border-white/10 bg-slate-800 text-slate-400 font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all";
    } else {
        btnEur.className = "currency-btn py-4 rounded-2xl border-2 border-cyan-400 bg-cyan-400/20 text-cyan-400 font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all";
        btnUsd.className = "currency-btn py-4 rounded-2xl border-2 border-white/10 bg-slate-800 text-slate-400 font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all";
    }
    calcular();
}

function calcular() {
    const input = document.getElementById('calc-input');
    const display = document.getElementById('calc-result');
    
    if (!input || !display) return;
    
    // Obtener tasas, manejando modo offline
    const priceElem = document.getElementById('price');
    const euroElem = document.getElementById('euro-price');
    
    let tasaUsd = parseFloat(priceElem?.innerText) || 0;
    let tasaEur = parseFloat(euroElem?.innerText) || 0;
    
    // Si estamos en modo offline, no calcular
    if (priceElem?.innerText === '--.--') tasaUsd = 0;
    if (euroElem?.innerText === '--.--') tasaEur = 0;
    
    let total = 0;
    const monto = parseFloat(input.value) || 0;

    if (selectedCurrency === 'USD' && tasaUsd > 0) {
        total = monto * tasaUsd;
    } else if (selectedCurrency === 'EUR' && tasaEur > 0) {
        total = monto * tasaEur;
    }

    display.innerText = total.toLocaleString('es-VE', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
}

function AbrirCalculadora() {
    const modal = document.getElementById('modal-calc');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            document.getElementById('calc-input')?.focus();
        }, 100);
    }
}

function CerrarCalculadora() {
    const modal = document.getElementById('modal-calc');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function setQuickAmount(amount) {
    const input = document.getElementById('calc-input');
    if (input) {
        input.value = amount;
        calcular();
    }
}

 // monitor vial en la calculadora para actualizar tasas en tiempo real
    function actualizarTasasCalc() {
        const usdRate = document.getElementById('price')?.innerText || '--.--';
        const eurRate = document.getElementById('euro-price')?.innerText || '--.--';
        
        const calcUsd = document.getElementById('calc-usd-rate');
        const calcEur = document.getElementById('calc-eur-rate');
        
        if (calcUsd) calcUsd.innerText = usdRate;
        if (calcEur) calcEur.innerText = eurRate;
    }

    // Observar cambios en las tasas principales
    const observer = new MutationObserver(actualizarTasasCalc);
    const priceElem = document.getElementById('price');
    const euroElem = document.getElementById('euro-price');
    
    if (priceElem) observer.observe(priceElem, { childList: true, characterData: true, subtree: true });
    if (euroElem) observer.observe(euroElem, { childList: true, characterData: true, subtree: true });
    
    // Actualizar al abrir la calculadora
    const abrirCalcOriginal = window.AbrirCalculadora;
    window.AbrirCalculadora = function() {
        actualizarTasasCalc();
        if (abrirCalcOriginal) abrirCalcOriginal();
    };

// Exposición global
window.AbrirCalculadora = AbrirCalculadora;
window.CerrarCalculadora = CerrarCalculadora;
window.setCurrency = setCurrency;
window.setQuickAmount = setQuickAmount;
window.calcular = calcular;