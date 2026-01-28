// theme-manager.js - Gestor de temas claro/oscuro
class ThemeManager {
    constructor() {
        this.theme = this.getSavedTheme() || 'dark';
        this.init();
    }

    init() {
        // Aplicar tema inicial
        this.applyTheme();
        
        // Crear botón de cambio de tema si no existe
        this.createThemeToggle();
        
        // Escuchar cambios de tema del sistema
        this.watchSystemTheme();
    }

    getSavedTheme() {
        return localStorage.getItem('bcv-theme');
    }

    saveTheme(theme) {
        localStorage.setItem('bcv-theme', theme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        document.body.setAttribute('data-theme', this.theme);
        
        // Actualizar icono del botón
        this.updateToggleIcon();
        
        // Guardar preferencia
        this.saveTheme(this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        
        // Emitir evento personalizado para que otros módulos puedan reaccionar
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: this.theme }
        }));
        
        console.log(`Tema cambiado a: ${this.theme}`);
    }

    createThemeToggle() {
        // Verificar si ya existe el botón
        if (document.getElementById('theme-toggle')) return;

        // Crear contenedor para el botón
        const headerContainer = document.querySelector('.cyber-card > div:first-child');
        if (!headerContainer) return;

        // Crear botón de tema
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle';
        toggleBtn.className = 'theme-toggle-btn p-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-all duration-200';
        toggleBtn.innerHTML = `
            <svg class="theme-icon-sun hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg class="theme-icon-moon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
        `;
        
        // Insertar después del título
        const titleDiv = headerContainer.querySelector('div:first-child');
        if (titleDiv) {
            titleDiv.parentNode.insertBefore(toggleBtn, titleDiv.nextSibling);
        }

        // Añadir evento click
        toggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    updateToggleIcon() {
        const sunIcon = document.querySelector('.theme-icon-sun');
        const moonIcon = document.querySelector('.theme-icon-moon');
        
        if (!sunIcon || !moonIcon) return;
        
        if (this.theme === 'light') {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            sunIcon.classList.add('text-amber-500');
            moonIcon.classList.remove('text-slate-400');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            sunIcon.classList.remove('text-amber-500');
            moonIcon.classList.add('text-slate-400');
        }
    }

    watchSystemTheme() {
        // Verificar preferencia del sistema
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = (e) => {
            // Solo aplicar si no hay preferencia guardada
            if (!localStorage.getItem('bcv-theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        };
        
        // Escuchar cambios
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        // Aplicar inicialmente si no hay preferencia guardada
        if (!localStorage.getItem('bcv-theme')) {
            this.theme = mediaQuery.matches ? 'dark' : 'light';
            this.applyTheme();
        }
    }

    // Método para obtener tema actual (útil para otros módulos)
    getCurrentTheme() {
        return this.theme;
    }
}

// Instanciar y hacer disponible globalmente
window.ThemeManager = new ThemeManager();