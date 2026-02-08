const AppLoader = {
    modules: [
        'public/scripts/core/scraper-respaldo.js',
        'public/scripts/ui/calc-logic.js',
        'public/scripts/core/theme-manager.js',
        'public/scripts/ui/ui-render.js'
    ],

    init() {
        console.log("🚀 Iniciando sistema Nivel 0...");
        const version = new Date().getTime(); // Anti-caché

        this.modules.forEach(scriptName => {
            const script = document.createElement('script');
            script.src = `./${scriptName}?v=${version}`;
            script.async = false;
            document.head.appendChild(script);
        });
    }
};

// Arrancar lo antes posible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AppLoader.init());
} else {
    AppLoader.init();
}

// Registro del SW para actualizaciones automáticas
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
        reg.onupdatefound = () => {
            const worker = reg.installing;
            worker.onstatechange = () => {
                if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                    worker.postMessage('SKIP_WAITING');
                }
            };
        };
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });
}