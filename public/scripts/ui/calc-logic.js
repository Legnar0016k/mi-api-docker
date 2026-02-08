/**
 * CALCULATOR LOGIC MODULE 🧮
 * Nivel 0 - Sincronizado con UI Global
 */

let selectedCurrency = 'USD';

function setCurrency(type) {
    selectedCurrency = type;
    const btnUsd = document.getElementById('btn-usd');
    const btnEur = document.getElementById('btn-eur');

    if (type === 'USD') {
        btnUsd.className = "py-3 rounded-xl border border-cyan-400 bg-cyan-400/10 text-cyan-400 mono text-[10px] font-bold";
        btnEur.className = "py-3 rounded-xl border border-white/5 bg-slate-900/50 text-slate-500 mono text-[10px] font-bold";
    } else {
        btnEur.className = "py-3 rounded-xl border border-cyan-400 bg-cyan-400/10 text-cyan-400 mono text-[10px] font-bold";
        btnUsd.className = "py-3 rounded-xl border border-white/5 bg-slate-900/50 text-slate-500 mono text-[10px] font-bold";
    }
    calcular();
}

function calcular() {
    const input = document.getElementById('calc-input').value;
    const display = document.getElementById('calc-result');
    
    // Obtenemos los precios de los elementos que llenó el scraper
    const tasaUsd = parseFloat(document.getElementById('price').innerText) || 0;
    const tasaEur = parseFloat(document.getElementById('euro-price').innerText) || 0;
    
    let total = 0;
    const monto = parseFloat(input) || 0;

    total = (selectedCurrency === 'USD') ? monto * tasaUsd : monto * tasaEur;

    display.innerText = total.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function AbrirCalculadora() {
    const modal = document.getElementById('modal-calc');
    if (modal) {
        modal.classList.remove('hidden');
        document.getElementById('calc-input').focus();
    }
}

function CerrarCalculadora() {
    const modal = document.getElementById('modal-calc');
    if (modal) modal.classList.add('hidden');
}

function setQuickAmount(amount) {
    const input = document.getElementById('calc-input');
    if (input) {
        input.value = amount;
        calcular();
    }
}

// 🌍 EXPOSICIÓN AL SCOPE GLOBAL (Crucial para onclick)
window.AbrirCalculadora = AbrirCalculadora;
window.CerrarCalculadora = CerrarCalculadora;
window.setCurrency = setCurrency;
window.setQuickAmount = setQuickAmount;
window.calcular = calcular;