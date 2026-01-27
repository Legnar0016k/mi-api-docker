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

- **Módulo Central (`app-loader.js`)**: Implementación de un "Cerebro" que gestiona la inyección dinámica de scripts.
- **Manual de Emergencia**: Documentación técnica interna para protocolos de fallo y recuperación.
- **Suite de Resiliencia**: Integración de `recovery-logic.js`, `fault-test.js` y `chaos-test.js`.

### Cambios
- **Refactorización de Index**: Limpieza total del `index.html`, reduciendo la carga de scripts manuales en un 90%.
- **Optimización de Carga**: Se garantiza el orden de ejecución (Validador -> Render -> Supervisor) mediante carga asíncrona controlada.

## [v2.0.1] - 2026-01-25
### Corregido
- **Sincronización de Calculadora**: Se restauró el enlace entre el input manual y la función modular `calcular()`.
- **Scope Global**: Se forzó la visibilidad de `calcular`, `setCurrency` y `setQuickAmount` en el objeto `window` para compatibilidad con el cargador dinámico.
=======
- **Cerebro Central**: Implementación de `app-loader.js` para gestión modular.
### Eliminado
- **Código Muerto**: Se eliminaron más de 40 líneas de scripts manuales y funciones comentadas del `index.html`.
- **Scripts redundantes**: Limpieza de etiquetas `<script>` individuales en favor del inyector dinámico.


## [v2.1.0] - 2026-01-25
### Añadido
- **Módulo de Temas (`theme-logic.js`)**: Sistema de persistencia de tema mediante `localStorage`.
- **Soporte Modo Claro**: Refactorización de estilos CSS para permitir legibilidad en entornos de alta luminosidad.
- **Toggle de Interfaz**: Botón dinámico para cambio de tema en tiempo real sin recargar la página.


## [v2.2.0] - 2026-01-25
### Añadido
- **Estructura de Temas Externos**: Creada carpeta `/Temas` con `style1.css` para desacoplar el diseño del HTML.
- **UI Neobanco**: Rediseño total del Modo Claro con estética profesional de banca moderna.
- **Calculadora Tematizada**: Los botones e inputs de la calculadora ahora responden dinámicamente al cambio de tema.
### Cambios
- **CSS Inyectado**: El `app-loader.js` ahora gestiona la carga de hojas de estilo externas.

=======

## [v2.2.1] - 2026-01-25
### Corregido
- **Hotfix Calculadora**: Corregido Error de Referencia (`convertCurrency is not defined`) al sincronizar el evento `oninput` con la nueva lógica modular.
- **Scope Global**: Se exponen funciones de cálculo al objeto `window` para compatibilidad con el cargador dinámico.


## [v2.2.2] - 2026-01-25
### Corregido
- **Hotfix Calculadora**: Sincronización del atributo `oninput` con la función `calcular()` en el DOM.
- **Scope Global**: Exportación explícita de funciones de cálculo al objeto `window`.

=======

## [v2.2.3] - 2026-01-25
### Corregido
- **Modularidad Total**: Se habilitó el acceso global a `setQuickAmount` para permitir el uso de botones de montos predefinidos en la calculadora modular.
- **Interoperabilidad**: Sincronización final entre `index.html` y `calc-logic.js` mediante el objeto `window`.

## [v2.2.5] - 2026-01-25
### Corregido
- **Sincronización HTML-JS**: Se vincularon las funciones `calcular`, `setCurrency` y `setQuickAmount` al objeto global `window` para asegurar compatibilidad con el cargador dinámico.
- **Limpieza de Código**: Eliminados bloques de script comentados y redundantes en el `index.html` para mejorar la legibilidad y el peso de la carga.
- **Interoperabilidad**: Corregida la referencia de `oninput` en el campo de monto para disparar el cálculo en tiempo real sin errores de referencia.
<<<<<<< HEAD

## [v2.6.0] - 2026-01-25
### Cambios Estructurales
- **Refactorización de Arquitectura**: Separación total de responsabilidades (Cerebro vs. Vista).
- **Limpieza de index.html**: Eliminación de +100 líneas de código muerto y funciones comentadas.
- **Estandarización de Puentes**: Implementación del objeto global `window.calcModule` para una comunicación limpia entre módulos.
- **Optimización de Memoria**: Los scripts se cargan de forma asíncrona sin colisiones de variables globales.

## [v2.3.0] - 2026-01-25
### Cambios Estructurales
- **Refactorización de Directorios**: Migración a arquitectura separada `backend/` y `public/`.
- **Organización de Scripts**: Clasificación de lógica en subcarpetas `/core`, `/ui` y `/debug` para evitar colisiones.
- **Limpieza de Raíz**: Eliminación de archivos de prueba del flujo principal de carga para optimizar el rendimiento.

## [v2.3.1] - 2026-01-25
### Cambios Estructurales
- **Organización de Directorios**: Proyecto migrado a estructura `/Public` con subcarpetas `/core`, `/ui` y `/debug`.
- **Limpieza de Index**: Rediseño del `index.html` eliminando código muerto y actualizando rutas relativas.
- **Rutas de Activos**: Iconos y manifiesto movidos a `/assets` para evitar desorden en la raíz.

## [v2.3.2] - 2026-01-25
### Corregido
- **Rutas PWA**: Corregida la ruta del `manifest.json` hacia la nueva carpeta `/assets` para eliminar el error 404.
- **Service Worker**: Verificada la posición del `sw.js` para asegurar el alcance (scope) correcto de la PWA.
- **Limpieza de Consola**: Eliminadas advertencias de recursos no encontrados durante la carga inicial.

## [v2.3.3] - 2026-01-25
### Añadido
- **Control de Versiones**: Implementación de archivo `.gitignore` para optimizar el repositorio y proteger archivos de configuración sensible.

## [v2.3.4] - 2026-01-25
### Corregido
- **Rutas PWA**: Ajustado el `manifest.json` para reflejar la nueva posición en la carpeta `/assets`.
- **Navegación**: Corregido error de resolución de rutas "Cannot GET" al estandarizar la ubicación del `index.html`.
- **Redundancia**: Verificación de integridad en copia de seguridad v3 (Arquitectura Limpia).

## [v2.4.0] - 2026-01-25
### Arquitectura y Organización
- **Migración a Estándar Industrial**: Reorganización de archivos en carpetas `/public`, `/scripts` y `/assets`.
- **Preservación de Historial**: Los módulos fueron movidos manteniendo la integridad del repositorio.
- **Optimización de Rutas**: Actualización de todas las referencias internas para el nuevo sistema de directorios.

## [v2.4.1] - 2026-01-26
### Corregido
- **Sincronización de Repositorio**: Resolución de conflicto `non-fast-forward` mediante integración de historias no relacionadas tras la migración de directorios.
- **Consolidación de Versión**: Sincronización exitosa entre el entorno local v2.4.0 y el origen remoto en GitHub.

## [v2.4.2] - 2026-01-26
### Organización de Repositorio
- **Reestructuración de Raíz**: Migración final de archivos a carpetas `/public` y `/backend` para visualización profesional.
- **Sincronización Crítica**: Resolución de conflictos de historial mediante merge de historias no relacionadas.
- **Limpieza de Assets**: Reubicación de iconos y manifest a `/public/assets`.

## [v2.4.3] - 2026-01-26
### Añadido
- **Contenedorización**: Implementado `Dockerfile` para despliegue automatizado en Railway/Docker.
- **Consistencia de Entorno**: Se incluye `package-lock.json` para garantizar paridad de versiones entre desarrollo y producción.
- **Optimización de Build**: Añadido `.dockerignore` para acelerar el proceso de construcción del servidor.

## [v2.4.4] - 2026-01-26
### Corregido
- **Configuración Docker**: Actualizado el `Dockerfile` para reflejar la nueva ruta del punto de entrada en `backend/server.js`.
- **Despliegue**: Optimización del proceso de instalación con el flag `--production` para entornos de nube.

## [v2.4.5] - 2026-01-26
### Corregido
- **Rutas Estáticas**: Implementado `path.join` con backtracking (`../public`) para servir la interfaz desde la nueva ubicación del servidor en `/backend`.
- **Limpieza de Endpoints**: Se movió el mensaje de estado a `/status` para permitir que la raíz (`/`) sirva el `index.html` automáticamente.

## [v2.4.6] - 2026-01-26
### Consolidación
- **Backend**: Verificada la integridad del módulo `scraper-bcv.js` tras la migración.
- **Seguridad**: Mantenimiento del agente HTTPS personalizado para ignorar errores de certificado SSL en el origen gubernamental, asegurando la continuidad del servicio.

## [v2.4.8] - 2026-01-26
### Corregido
- **Enrutamiento de Respaldo**: Añadida ruta wildcard (`*`) para asegurar que el `index.html` se sirva correctamente incluso si falla la resolución de estáticos por defecto.
- **Normalización de Rutas**: Refinamiento de `path.join` para compatibilidad total con el entorno de contenedores Docker.

## [v2.4.9] - 2026-01-26
### Corregido
- **Configuración de Proyecto**: Actualizado `package.json` para corregir el punto de entrada (`main`) y el script de inicio (`start`) hacia la nueva ruta `backend/server.js`.
- **Compatibilidad de Despliegue**: Alineación de scripts de ejecución con la arquitectura modular del repositorio.

## [v2.4.10] - 2026-01-26
### Entorno de Desarrollo
- **Reconstrucción de Dependencias**: Reinstalación de módulos de Node tras la migración a la estructura v2.4.x para asegurar la operatividad local.
- **Verificación de Rutas**: Confirmación de que el script `npm start` localiza correctamente el punto de entrada en `backend/server.js`.

## [v2.5.0] - 2026-01-26
### ✨ GRAN REESTRUCTURACIÓN COMPLETADA
- **Arquitectura**: Migración exitosa a sistema modular (`/backend`, `/public`, `/assets`).
- **DevOps**: Configuración de `Dockerfile` y `package.json` alineada con estándares de la industria.
- **Rutas**: Implementación de `path.join` para servir archivos estáticos desde subdirectorios.
- **Estabilidad**: Verificación de entorno local exitosa; servidor operativo en puerto 3000.


## [v2.5.1] - 2026-01-26
### Corregido
- **Integración de Código**: Resolución de conflictos de merge en `index.html` causados por la sincronización de ramas.
- **Limpieza de UI**: Eliminación de marcadores de conflicto de Git en el frontend.


## [v2.5.6] - 2026-01-26
### Corregido
- **Sincronización de Módulos**: Resolución exitosa de los errores de carga de scripts core (Supervisor, Validador, Recovery).
- **Estabilidad Local**: El sistema central ahora es capaz de iniciar y validar tasas correctamente bajo la nueva estructura de directorios.
- **PWA**: Identificado error de ruta en `manifest.json` tras el movimiento del index a la raíz.

## [v2.5.7] - 2026-01-26
### Corregido
- **Ruta del Manifiesto**: Corregido error de redundancia en la ruta del `manifest.json` que causaba un fallo 404 por duplicación del prefijo de directorio.
- **PWA**: Restaurada la capacidad de detección del manifiesto para la instalación de la aplicación.

## [v3.0.0] - 2026-01-26
### ✨ REINICIO TOTAL DEL REPOSITORIO
- **Limpieza**: Eliminación de archivos legacy y duplicados en el repositorio remoto.
- **Arquitectura**: Re-implementación desde cero de la estructura modular (/backend y /public).
- **Estabilidad**: Sincronización forzada para asegurar que Railway lea únicamente la versión estable.

## [v3.0.2] - 2026-01-26
### Corregido
- **Prioridad de Servicio**: Se movió `index.html` a la raíz del repositorio para garantizar la compatibilidad inmediata con GitHub Pages.
- **Rutas de Producción**: Ajustadas las referencias de assets en el frontend para apuntar al subdirectorio `/public` desde la raíz.
- **Configuración de Servidor**: Actualizado `server.js` para servir archivos desde el directorio base, manteniendo la operatividad en Railway.

## [v3.0.3] - 2026-01-26
### Corregido
- **Rutas de Servidor**: Ajustada la ruta del comodín (`*`) en `server.js` para apuntar explícitamente al archivo `index.html` en la raíz.
- **Middleware Estático**: Configurado para servir desde el directorio base, permitiendo la coexistencia de la API y el frontend en la raíz para compatibilidad con GitHub Pages.

## [v3.0.6] - 2026-01-26
### Corregido
- **Rutas de Inyección**: Eliminados los selectores de nivel superior `../` en `app-loader.js`. 
- **Resolución de Assets**: Ajuste de rutas relativas para alinearlas con la ubicación del `index.html` en la raíz del repositorio.

## [v3.0.7] - 2026-01-26
### Corregido
- **Módulo de Recuperación**: Corregido error 404 en `recovery-logic.js` mediante la verificación de nomenclatura y ruta en el inyector dinámico.
- **Consola**: Depuración final de scripts para alcanzar un estado de "Zero Errors" en producción.

## [v3.1.0] - 2026-01-26
### ✨ ESTADO DE RÉGIMEN PERMANENTE
- **Consolidación**: El proyecto opera bajo una estructura híbrida (index en raíz, lógica en subcarpetas) optimizada para producción.
- **Estabilidad**: Eliminados todos los errores 404 de inyección dinámica en GitHub Pages.
- **Mantenibilidad**: Sistema de carga modular (app-loader) sincronizado con el entorno de despliegue.

## [3.1.1] - 2026-01-26
### Documentación
- **README.dev**: Creada guía de mantenimiento técnico para estandarizar el proceso de despliegue y evitar regresiones en las rutas de los assets.

## [v3.1.2] - 2026-01-26
### UI/UX - Calculadora
- **Visualización Persistente**: Se implementó el estado `sticky` en el visor de resultados de la calculadora.
- **Legibilidad**: Añadido efecto `backdrop-blur` y ajuste de opacidad para mejorar el contraste del monto durante el scroll.

## [v3.1.2] - 2026-01-26
### UI/UX - Calculadora
- **Visualización Persistente**: Implementado `sticky positioning` en el visor de resultados de la calculadora para mantener el total siempre visible durante el scroll.
- **Mejora Visual**: Añadido `backdrop-blur` para garantizar legibilidad sobre el contenido desplazable.

## [v3.1.3] - 2026-01-26
### UI/UX - Calculadora
- **Corrección Sticky**: Ajustada la estructura del modal con `overflow-y-auto` para permitir que el visor de resultados permanezca fijo mientras se desplaza el contenido.
- **Optimización Visual**: Implementado fondo sólido en el contenedor sticky para evitar solapamiento de texto durante el scroll manual.

## [v3.1.4] - 2026-01-26
### Optimización - Infraestructura
- **Build Efficiency**: Implementado `.railwayignore` para evitar reconstrucciones innecesarias del servidor ante cambios en el frontend.
- **Caché**: Ajustada la lógica de construcción para reducir el consumo de recursos en Railway.

## [v3.1.8] - 2026-01-26
### Corregido
- **PWA Routing**: Eliminadas referencias de ruta absoluta `./` en el Service Worker e Index para mejorar la compatibilidad con GitHub Pages.
- **Path Resolution**: Ajustadas todas las llamadas a assets para usar rutas relativas directas desde la raíz.

### 📝 Registro para el CHANGELOG.md (v3.1.9)


## [v3.1.9] - 2026-01-26
### Corregido
- **PWA Manifest**: Corregidas las rutas `start_url` y `scope` para apuntar correctamente a la raíz del proyecto desde la nueva ubicación en `public/assets/`.
- **Acceso PWA**: Resuelto error 404 que impedía la carga de la aplicación en instalaciones nuevas desde dispositivos móviles.

## [v3.2.0] - 2026-01-26
### Añadido
- **Sistema de Triple Redundancia (USD)**: Implementada cadena de fallos: MonitorDivisa -> Scraper BCV -> DolarAPI.
- **Scraper BCV Extendido**: Actualizada la lógica para extraer USD además de EUR mediante selectores de ID dinámicos.
- **Robustez de Servidor**: Añadidos bloques try/catch independientes por cada fuente para garantizar respuesta incluso ante fallos parciales.

## [v3.2.3] - 2026-01-26
### Añadido
- **Modularización de Scrapers**: Creado `scraper-dolar-bcv.js` para manejar la lógica de obtención de divisas sin tocar el core.
- **Validador Pro**: Nueva lógica de procesamiento que soporta metadatos (fuente y timestamp).
- **UI Debug**: Añadido indicador de origen de datos para validación en tiempo real.

## [v3.2.4] - 2026-01-26
### UI/UX
- **Debug View**: Añadido contenedor `debug-source` en el index para identificar el origen de la tasa en tiempo real.
### Arquitectura
- **Estrategia Non-Intrusive**: Implementados `scraper-respaldo.js` y `validador-ui.js` como módulos independientes para proteger el código fuente original.

## [v3.2.5] - 2026-01-26
### Arquitectura
- **Reordenamiento de dependencias**: Ajustado `app-loader.js` para seguir una jerarquía de carga lógica (Fetch -> Logic -> UI -> Supervisor).
- **Estabilidad**: Eliminados errores potenciales de funciones no definidas durante el arranque de la aplicación.

## [v3.2.6] - 2026-01-26
### Corregido
- **Sincronización**: Implementado trigger de arranque en `monitor-master.js` con retardo de seguridad para garantizar la ejecución de la lógica de respaldo tras la carga de módulos.
- **Flujo de Datos**: Vinculación corregida entre `obtenerDolarConRespaldo` y `actualizarInterfazDolar`.