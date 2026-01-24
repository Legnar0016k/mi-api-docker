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


## [v1.2.1] - 2026-01-23
### Añadido
- **Indicador Visual de Estado**: Implementación de etiquetas dinámicas en la UI:
  - `SINCRO OK` (Verde): Datos validados desde API Principal.
  - `SINCRO SWAP` (Naranja): Fallback activo usando API de respaldo.
  - `SINCRO FAIL` (Rojo): Fallo total de conexión en ambas fuentes.


  ## [v1.2.2] - 2026-01-23
### Añadido
- **Módulo UI Renderer (`ui-render.js`)**: Separación total de la lógica visual. Ahora el diseño es independiente de la obtención de datos.
- **Gestión de Estados**: Implementación de clases dinámicas para `SINCRO OK`, `SWAP` y `FAIL`.

### Cambios
- **Refactorización Modular**: El proyecto ahora sigue el patrón de responsabilidad única (UI, Validación, Supervisión).


## [v1.3.0] - 2026-01-24
### Añadido
- **Modularización Completa**: Separación de lógica en `ui-render.js`, `validador.js` y `supervisor.js` para evitar corrupción de código fuente.
- **Validación Dinámica**: Implementación de comparación porcentual (10%) contra DolarApi para descartar datos erróneos del scraping.
- **Documentación Pro**: Actualización total del README.md con arquitectura de triple capa.

