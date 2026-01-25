/**
 * CALCULATOR LOGIC MODULE 🧮
 * Maneja las conversiones sin afectar el flujo principal.
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
    
    // Obtenemos las tasas directamente de los elementos del DOM que ya actualiza el supervisor y ui-features
    const tasaUsd = parseFloat(document.getElementById('price').innerText);
    const tasaEur = parseFloat(document.getElementById('euro-price').innerText);
    
    let total = 0;
    const monto = parseFloat(input) || 0;

    if (selectedCurrency === 'USD') {
        total = monto * tasaUsd;
    } else {
        total = monto * tasaEur;
    }

    display.innerText = total.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Escuchar cambios en el input
document.addEventListener('DOMContentLoaded', () => {
    const inputElement = document.getElementById('calc-input');
    if (inputElement) {
        inputElement.addEventListener('input', calcular);
    }
});

/**
 * Añade esto al final de tu calc-logic.js
 */
function setQuickAmount(amount) {
    const input = document.getElementById('calc-input');
    if (input) {
        input.value = amount;
        calcular(); // Ejecuta el cálculo inmediatamente
    }
}

// Exponer al scope global para que los onclick/oninput del HTML funcionen
window.calcular = calcular;
window.setCurrency = setCurrency;
window.setQuickAmount = setQuickAmount;