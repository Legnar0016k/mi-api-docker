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

## [v1.4.0] - 2026-01-24
### Añadido
- **Módulo Scraper Independiente (`scraper-bcv.js`)**: Nuevo motor de extracción directa del portal BCV.
- **Soporte para Euro (EUR)**: Endpoint `/api/euro` habilitado.
- **Seguridad de Conexión**: Implementación de `httpsAgent` para bypass de certificados SSL inválidos.

## [v1.5.0] - 2026-01-24
### Añadido
- **Módulo de Euro**: Nueva sección en el grid para mostrar la tasa EUR.
- **Módulo de UI Features (`ui-features.js`)**: Nuevo archivo para manejar modales y datos secundarios.
- **Calculadora Modal**: Estructura base (esqueleto) implementada con diseño Cyberpunk.

## [v1.6.0] - 2026-01-24
### Añadido
- **Módulo de Calculadora (`calc-logic.js`)**: Lógica de conversión dinámica integrada.
- **Interconectividad**: La calculadora ahora utiliza los datos en tiempo real del Supervisor (USD) y del Scraper BCV (EUR).
- **UI de Calculadora**: Interfaz optimizada para móviles con selector de moneda y feedback visual "Neon".

### Corregido
- **Error 404/JSON**: Se diagnosticó fallo de endpoint en producción; se requiere despliegue de `scraper-bcv.js` en el backend.

## [v1.7.0] - 2026-01-24
### Añadido
- **Quick-Tap Buttons**: Botones de acceso rápido (5, 10, 15, 20, 50, 100) en el modal de la calculadora.
- **Funcionalidad Directa**: El sistema ahora calcula automáticamente al presionar un múltiplo sin necesidad de escribir.
- **UI Refinada**: Mejoras en el layout del modal para visualización en pantallas pequeñas.

## [v1.7.1] - 2026-01-24
### Corregido
- **Política CORS**: Implementación de middleware en el backend para permitir peticiones desde el dashboard.
- **PWA Meta Tags**: Actualización de etiquetas meta según estándares modernos de Chrome.
- **Estabilidad de red**: Resuelto error de conversión de respuesta en el Service Worker.

## [v1.7.3] - 2026-01-24
### Corregido
- **Middleware Order**: Reorganización de `server.js` para asegurar que CORS afecte a todos los endpoints (Fix 404/CORS).
- **Service Worker Logic**: Se excluyeron las peticiones de API del interceptor del SW para evitar errores de tipo 'Response'.
- **Redundancia**: Eliminación de múltiples declaraciones de CORS en el backend.

## [v1.7.4] - 2026-01-24
### Corregido
- **Seguridad Frontend**: Eliminación de scripts de backend en el cliente para evitar errores de referencia.
- **Optimización de Server**: Limpieza de redundancias en la configuración de CORS y orden de Middlewares.
- **Despliegue**: Verificación de rutas relativas para el módulo de scraping del Euro.

## [v1.7.5] - 2026-01-24
### Corregido
- **Middleware Sync**: Reordenamiento de CORS en `server.js` para validar correctamente los endpoints `/api/euro` y `/tasa-bcv`.
- **Arquitectura**: Eliminada la carga de `scraper-bcv.js` en el cliente (solo backend) para evitar errores de referencia en el navegador.
- **Service Worker**: Implementada exclusión de URLs de API para prevenir el error 'Failed to convert value to Response'.
- **PWA**: Actualización de etiquetas meta obsoletas para mejor compatibilidad en Chrome.

## [v1.8.0] - 2026-01-25
### Corregido
- **UI Consistency**: Eliminada función duplicada en `supervisor.js` que causaba solapamiento de textos en "Última Act.".
- **Semáforo de Estado**: Implementado `SINCRO SWAP` (Naranja) y `SINCRO FAIL` (Rojo) mediante `UIRenderer`.
- **Naming**: Cambiadas las referencias de "DolarApi" a "SWAP" en logs y etiquetas de interfaz.
### Añadido
- **Quick Amounts**: Activación de lógica para botones de múltiplos de 5 en la calculadora.

## [v1.8.1] - 2026-01-25
### Corregido
- **UI Logic**: Sincronizado `supervisor.js` con `UIRenderer.js` para evitar duplicidad de escritura en el DOM.
- **Visual Status**: El estado de respaldo ahora se muestra correctamente como "SINCRO SWAP" en color naranja.
### Añadido
- **Testing Tool**: Creado `fault-test.js` para simular caídas de servidor y validar el sistema de contingencia.

## [v1.9.0] - 2026-01-25
### Añadido
- **Módulo de Resiliencia**: Creado `recovery-logic.js` para intentos de reconexión automática mediante backoff algorítmico tras un `SINCRO FAIL`.
- **Suite de Pruebas de Estrés**: Implementados `fault-test.js` y `chaos-and-recovery-test.js` para simular catástrofes de red y validar la recuperación del sistema.
- **Modo Caos**: Capacidad de interceptar el `fetch` global para forzar estados de error controlados.

### Corregido
- **Estabilidad de UI**: El semáforo de sincronización ahora responde correctamente a los cambios de estado inducidos por fallos de red manuales.
- **Persistencia**: Se asegura que el sistema retorne a `SINCRO OK` automáticamente una vez que la red se restablece en las pruebas de caos.

## [v2.0.0] - 2026-01-25
### Añadido
- **Cerebro Central**: Implementación de `app-loader.js` para gestión modular.
### Eliminado
- **Código Muerto**: Se eliminaron más de 40 líneas de scripts manuales y funciones comentadas del `index.html`.
- **Scripts redundantes**: Limpieza de etiquetas `<script>` individuales en favor del inyector dinámico.

## [v2.1.0] - 2026-01-25
### Añadido
- **Módulo de Temas (`theme-logic.js`)**: Sistema de persistencia de tema mediante `localStorage`.
- **Soporte Modo Claro**: Refactorización de estilos CSS para permitir legibilidad en entornos de alta luminosidad.
- **Toggle de Interfaz**: Botón dinámico para cambio de tema en tiempo real sin recargar la página.

## [v2.2.1] - 2026-01-25
### Corregido
- **Hotfix Calculadora**: Corregido Error de Referencia (`convertCurrency is not defined`) al sincronizar el evento `oninput` con la nueva lógica modular.
- **Scope Global**: Se exponen funciones de cálculo al objeto `window` para compatibilidad con el cargador dinámico.

## [v2.2.3] - 2026-01-25
### Corregido
- **Modularidad Total**: Se habilitó el acceso global a `setQuickAmount` para permitir el uso de botones de montos predefinidos en la calculadora modular.
- **Interoperabilidad**: Sincronización final entre `index.html` y `calc-logic.js` mediante el objeto `window`.

## [v2.2.5] - 2026-01-25
### Corregido
- **Sincronización HTML-JS**: Se vincularon las funciones `calcular`, `setCurrency` y `setQuickAmount` al objeto global `window` para asegurar compatibilidad con el cargador dinámico.
- **Limpieza de Código**: Eliminados bloques de script comentados y redundantes en el `index.html` para mejorar la legibilidad y el peso de la carga.
- **Interoperabilidad**: Corregida la referencia de `oninput` en el campo de monto para disparar el cálculo en tiempo real sin errores de referencia.
