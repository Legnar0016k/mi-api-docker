# Bitácora de Cambios - Monitor BCV

## [v1.2.0] - 2026-01-23
### Añadido
- **Módulo Validador (`validador.js`)**: Nuevo sistema de peritaje que compara la tasa de Railway contra DolarApi en tiempo real.
- **Lógica de Tolerancia**: Umbral del 10% para detectar errores de scraping automáticamente.
- **Supervisor de Datos (`supervisor.js`)**: Implementado como controlador principal para gestionar el flujo entre APIs.

### Cambios
- **Aislamiento de Lógica**: Se movió la lógica de red fuera del `index.html` para mejorar la estabilidad.
- **Iconografía**: Actualizado icono oficial de la app con diseño "Neon Cyber Banana".

### Correciones
- **Fallo de Instalación**: Se corrigió el registro del Service Worker para mejorar la compatibilidad con Android.
- **Error 404**: Corregida la ruta de la API de respaldo de `/dolar/` a `/dolares/`.