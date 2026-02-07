
/**
 * UI FEATURES & MODALS 🛠️
 * Lógica para la Calculadora (Sin Euro)
 */

// Lógica del Modal (MANTENER ESTO)
function AbrirCalculadora() {
    document.getElementById('modal-calc').classList.remove('hidden');
}

function CerrarCalculadora() {
    document.getElementById('modal-calc').classList.add('hidden');
}

// Nota: Se eliminó la función fetchEuro y su event listener 
// para optimizar la carga y enfocarse solo en el Dólar.