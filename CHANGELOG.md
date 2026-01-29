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

## [v3.2.2] - 2026-01-26
### Refactorización - Frontend
- **Validador dinámico**: Actualizado `validador.js` para procesar la nueva estructura de respuesta del servidor (tasa + fuente).
- **Depuración**: Añadido soporte para visualización de origen de datos en el frontend para facilitar pruebas de redundancia.

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

## [v3.2.7] - 2026-01-26
### Añadido
- **Estructura de Respaldo**: Implementados nuevos módulos independientes (`scraper-respaldo.js`, `validador-pro.js`, `validador-ui.js`) para la redundancia de USD.
- **Vista de Depuración**: Añadido el elemento `debug-source` en el frontend para identificar el origen de la tasa.
- **Orquestación**: Integrado `monitor-master.js` para coordinar el nuevo flujo de datos sin afectar el core original.
### Ajustes
- **Orden de Carga**: Reestructurado `app-loader.js` para garantizar la jerarquía de dependencias.

## [v3.2.8] - 2026-01-26
### Corregido
- **CORS & Mixed Content**: Ajustada la URL del scraper de respaldo para apuntar explícitamente a la instancia de producción en Railway vía HTTPS.
- **Path Resolution**: Corregida la carga de módulos en entornos de subdirectorios (GitHub Pages).

## [v3.2.9] - 2026-01-26
### Refactorización
- **Unificación de Scrapers**: Se migró la lógica de extracción de USD al backend (`scraper-bcv.js`) para igualar la robustez del Euro.
- **Optimización de Código**: Implementada función genérica de extracción en servidor para reducir redundancia.
- **Seguridad**: Se mantiene el agente HTTPS para evitar bloqueos por certificados en ambas monedas.

## [v3.3.0] - 2026-01-26
### Refactorización
- **Data Flow Unification**: Se estableció una jerarquía clara donde el servidor procesa el scrapeo y el frontend actúa como consumidor.
- **Fix**: Corregido el endpoint de `scraper-respaldo.js` para apuntar a la instancia de producción correcta.

## [v3.3.1] - 2026-01-26
### Simplificación de Arquitectura
- **Eliminación de Redundancia**: Se eliminó `scraper-dolar-bcv.js` al quedar obsoleto por la lógica unificada en el backend.
- **Backend Core**: `scraper-bcv.js` ahora centraliza toda la extracción de tasas oficiales mediante selectores dinámicos.
- **Refactorización**: Movida la lógica de respaldo al lado del servidor para mejorar la velocidad de respuesta del cliente.

## [v3.3.2] - 2026-01-26
### Optimización de Backend
- **Algoritmo de Prioridad**: Reestructurada la ruta `/tasa-bcv` para establecer el BCV como fuente primaria y DolarAPI como último recurso (Safe-Fail).
- **Estabilidad de Datos**: Implementada jerarquía de tres niveles para mitigar la volatilidad de fuentes externas.
- **Logs de Servidor**: Mejorada la trazabilidad de errores en el flujo de redundancia.

## [v3.3.3] - 2026-01-26
### Arquitectura de Sistema
- **Mantenimiento de Módulos**: Confirmada la permanencia de Supervisores y Validadores para control de calidad en el lado del cliente (Frontend).
- **Limpieza**: Depuración de archivos obsoletos tras la migración de lógica al servidor central.
- **Flujo de Ejecución**: Sincronización final entre el Orquestador (Monitor-Master) y el Consumidor de API (Scraper-Respaldo).

## [v3.3.4] - 2026-01-26
### Añadido
- **Triple Respaldo USD**: Implementada jerarquía de seguridad (BCV Scraper -> Monitor Scraper -> DolarAPI).
- **Consolidación de Backend**: El archivo `scraper-bcv.js` ahora centraliza la extracción de EUR y USD usando lógica genérica.
### Corregido
- **Visibilidad de Origen**: Activado el visor `debug-source` en el frontend para monitorear qué fuente está proveyendo la tasa.
### Limpieza
- Depuración de módulos redundantes (`scraper-dolar-bcv.js` eliminado) para optimizar la carga.

## [v3.3.5] - 2026-01-26
### Corregido
- **Jerarquía de Mando**: Se ajustó `supervisor.js` para evitar condiciones de carrera (Race Conditions) con `monitor-master.js`.
- **Latencia de Scrapeo**: Aumentado el timeout del supervisor para permitir que el backend complete el proceso de extracción en Railway.
- **Validación de UI**: El sistema ahora respeta la tasa del BCV si esta ya fue inyectada en el DOM, evitando el downgrade automático a DolarApi.

## [v3.3.7] - 2026-01-26
### Ajustes de Sincronización
- **Prioridad de Carga**: Se redujo el delay del Monitor Master a 300ms para asegurar el inicio temprano de la captura de datos.
- **Modo Emergencia**: Se retrasó la activación del Supervisor a 3000ms para actuar estrictamente como respaldo en caso de latencia en la API principal.

## [v3.3.8] - 2026-01-26
### Corregido
- **Guerra de Scripts**: Resuelto el conflicto de sobreescritura entre `monitor-master.js` y `supervisor.js`.
- **Sincronización de Tiempos**: 
    - Monitor Master: Ajustado a 300ms (Prioridad Alta).
    - Supervisor: Ajustado a 3000ms (Respaldo Pasivo).
- **Lógica de Bloqueo**: El Supervisor ahora valida correctamente la presencia de `BCV_Oficial` antes de intentar cualquier acción de respaldo.

## [v3.3.9] - 2026-01-26
### Corregido
- **Lógica de Interrupción**: Añadido `return` faltante en `supervisor.js` para evitar que el sistema active el respaldo innecesariamente cuando la API principal es válida.
- **Flujo de Ejecución**: Eliminados disparos múltiples del supervisor durante la carga inicial.
- **Estabilidad de UI**: Corregido error donde la tasa de DolarApi sobreescribía la tasa oficial del BCV.
## [v3.4.0] - 2026-01-26
### Hito Alcanzado
- **Estabilización de Concurrencia**: Lograda la sincronización perfecta entre el Monitor Master (300ms) y el Supervisor (3000ms).
- **Validación Cruzada Activa**: El sistema ahora discrimina correctamente entre la tasa oficial de Railway (358.92) y la referencia de DolarApi (355.55) sin entrar en conflicto.
- **Control de Flujo**: Implementada la interrupción de procesos (`return`) tras validación exitosa, optimizando el uso de recursos y ancho de banda.

## [v3.4.1] - 2026-01-27
### Corregido
- **Visibilidad de Fuente**: Se vinculó el elemento `debug-source` dentro de la función `actualizarUI` del Supervisor para eliminar el estado perpetuo de "Cargando fuente...".
- **Sincronización de UI**: Asegurada la limpieza de estados de carga (Loaders) tras una validación exitosa de la API Principal.

## [v3.4.2] - 2026-01-27
### Mejorado
- **Dinámica de Fuentes**: Sincronizada la respuesta del Servidor (Railway) con la Interfaz de Usuario.
- **Transparencia de Datos**: El visor `debug-source` ahora refleja la fuente real utilizada por el backend (BCV, Monitor o DolarAPI) en lugar de un texto estático.
- **Precisión de Supervisor**: Se ajustó la función `actualizarUI` para procesar metadatos de origen enviados por el API Principal.

## [v3.4.3] - 2026-01-27
### Mejorado
- **Comunicación End-to-End**: El Supervisor ahora recibe y procesa el parámetro `fuente` enviado desde el backend en Railway.
- **Interfaz Informativa**: El elemento `debug-source` ahora muestra dinámicamente si el dato viene de `BCV_Oficial`, `Monitor_Alternativo` o `DolarAPI_Respaldo`.
- **Refactorización de UI**: Se optimizó la función `actualizarUI` para manejar múltiples orígenes de datos sin sobreescribir información crítica de auditoría.

## [v3.5.0] - 2026-01-28
### Añadido
- **Sistema de Temas**: Implementado `ThemeManager` para soporte de modo claro/oscuro.
- **Persistencia**: Preferencia de tema guardada en `localStorage`.
- **Nuevos Estilos**: Integrados `style3.css` y `theme-toggle.css`.
### Corregido
- **Error de Carga**: Corregido typo en nombre de archivo (`teme` -> `theme`) y error 404 en la inyección de módulos.

## [v3.5.1] - 2026-01-28
### Corregido
- **UI Calculadora**: Se corrigió el contraste del visor de resultados en el modal de la calculadora para el Modo Claro.
- **Refactor de Estilos**: Sobrescritas las clases fijas `bg-black/80` y `text-white` mediante selectores de atributo en `style3.css`.

## [v3.5.2] - 2026-01-28
### Añadido
- **Sistema de Temas Dinámico**: Implementación completa de `ThemeManager` con persistencia en `localStorage`.
- **Estilos Adaptativos**: Integración de `style3.css` y `theme-toggle.css` para una transición suave entre modos.
### Corregido
- **Contraste de Calculadora**: Se forzó el esquema de colores en el modal de la calculadora para evitar texto invisible en modo claro.
- **Jerarquía de Archivos**: Corregidos errores de nombrado (typos) y rutas en el cargador central (`app-loader.js`).

## [v3.5.4] - 2026-01-28
### Corregido
- **PWA Manifest Assets**: Sincronizada la lista de precaché del `sw.js` con el `app-loader.js`.
- **Estabilidad Offline**: Eliminados archivos inexistentes de la lista de recursos del Service Worker para evitar fallos de instalación.

## [v3.5.5] - 2026-01-28
### Corregido
- **PWA Integrity**: Depurada la lista de assets en `sw.js` eliminando referencias a estilos antiguos (`style1`, `style2`) que causaban el error `Request failed`.
- **Rutas Relativas**: Implementado el uso de `./` para asegurar la compatibilidad con GitHub Pages.

## [v3.5.8] - 2026-01-28
### Mejorado
- **Estrategia de Caché**: Implementado cache-busting dinámico mediante marcas de tiempo para forzar la actualización del Service Worker.
- **Gestión de Ciclo de Vida**: Optimizado el evento 'activate' para asegurar la purga de archivos obsoletos en el almacenamiento local del cliente.

## [v3.6.0] - 2026-01-28
### Añadido
- **Auto-Update System**: Implementada lógica de mensajería entre Service Worker y Cliente para forzar actualizaciones inmediatas.
- **Skip Waiting**: El sistema ahora ignora el periodo de espera de los Service Workers, asegurando que los cambios en GitHub se reflejen al instante tras la descarga.
- **UX Improvement**: Eliminada la necesidad de recarga manual por parte del usuario para ver nuevas versiones.

## [v3.6.1] - 2026-01-28
### Añadido
- **Sistema de Auto-Actualización**: Integrada lógica en `app-loader.js` para detectar nuevas versiones del Service Worker en tiempo real.
- **Activación Inmediata**: Implementado el evento `message` con `SKIP_WAITING` en `sw.js` para forzar la actualización sin cerrar la pestaña.
- **Sincronización de Cache**: El sistema ahora fuerza un `window.location.reload()` automático al detectar cambios en los assets de GitHub.
### Mejorado
- **Robustez PWA**: El ciclo de vida del Service Worker ahora es menos "terco", eliminando la necesidad de actualizaciones manuales por parte del usuario.

## [v3.7.0] - 2026-01-28
### Añadido
- **Respaldo para Euro**: Implementada lógica de redundancia en la ruta `/api/euro`.
- **Integración DolarAPI**: Se configuró `ve.dolarapi.com` como fuente secundaria para el Euro en caso de falla del scraper original del BCV.
- **Metadatos de Fuente**: La respuesta del Euro ahora incluye el campo `fuente` para auditoría en el frontend.

## [v3.8.0] - 2026-01-28
### Añadido
- **Recovery Sentinel Pro**: Evolución del módulo de auto-recuperación a la versión 2.0.
- **Network Awareness**: Detección inteligente de estado online/offline para evitar bucles de error sin conexión.
- **Cache Purge Logic**: Capacidad de auto-limpieza de caché tras fallos persistentes (anti-corrupción de SW).
- **Backoff Algorítmico**: Optimización del consumo de recursos mediante intervalos de reintento incrementales.

## [v3.8.1] - 2026-01-28
### Añadido
- **Sentinel Súper Soldado**: Activada la versión 2.0 de `recovery-logic.js` con consciencia de red (online/offline) y auto-purga de caché.
- **Blindaje de Divisas**: Finalizada la integración de respaldo para el Euro vía DolarAPI, garantizando disponibilidad 24/7.
### Seguridad
- **Resiliencia de SW**: Implementado sistema de mensajería para evitar el estado "terco" del Service Worker y asegurar actualizaciones inmediatas tras cada push.

## [v3.9.0] - 2026-01-29
### Añadido
- **Despliegue en Vercel**: Migración/Espejo del frontend a Vercel para mejorar los tiempos de respuesta globales.
- **Optimización de Entrega**: Configuración de cabeceras de caché automáticas mediante el borde de Vercel.
### Mejorado
- **Redundancia de Hosting**: El proyecto ahora cuenta con presencia en GitHub Pages y Vercel simultáneamente.

## [v3.9.1] - 2026-01-29
### Añadido
- **Configuración Vercel (`vercel.json`)**: Implementadas reglas de cabeceras HTTP para optimizar la entrega del Service Worker.
- **Políticas de Caché**: Forzada la revalidación de `sw.js` para garantizar que el sistema de Auto-Update detecte cambios en tiempo real.
- **Clean URLs**: Activada la limpieza de rutas para una navegación más estética.

## [v3.9.2] - 2026-01-29
### Corregido
- **Deployment Vercel**: Resuelto error 404 NOT_FOUND mediante el ajuste del Root Directory y Framework Preset.
- **Estructura de Rutas**: Verificada la jerarquía de `index.html` para asegurar la compatibilidad con el despliegue automático de Vercel.

## [v3.9.4] - 2026-01-29
### Corregido
- **Vercel NOT_FOUND**: Se forzó el Framework Preset a 'Other' y se anularon los comandos de Build automáticos.
- **Punto de Entrada**: Confirmada la disponibilidad de `index.html` en la raíz del despliegue.

## [v3.9.5] - 2026-01-29
### Corregido
- **Error de Build en Vercel**: Se corrigió la referencia errónea al Root Directory (`./`).
- **Configuración de Despliegue**: Se restableció el directorio raíz a su valor por defecto (vacío) para permitir que Vercel localice correctamente el `index.html` en la base del repositorio.

## [v3.9.6] - 2026-01-29
### Corregido
- **Vercel Build Path**: Eliminada la ruta relativa `./` del Root Directory cumpliendo con las políticas de despliegue de Vercel.
- **Configuración Estática**: Establecido el Framework Preset en 'Other' para prevenir errores de compilación en archivos HTML/JS puros.

## [v3.9.7] - 2026-01-29
### Investigando
- **Vercel Deployment**: Diagnosticando error 404 persistente. 
- **Ajuste de Salida**: Se probó configurar el 'Output Directory' como `.` para forzar el reconocimiento de archivos estáticos en la raíz.

## [v3.9.8] - 2026-01-29
### Corregido
- **Vercel Routing**: Se añadió la regla `rewrites` y `public: true` en `vercel.json` para forzar el modo de renderizado estático.
- **Identidad del Proyecto**: Corregido conflicto donde Vercel interpretaba el frontend como una Serverless Function debido a la presencia de archivos de configuración de Node.

## [v3.9.9] - 2026-01-29
### Corregido
- **Vercel Build Engine**: Implementada configuración de construcción estática (`@vercel/static`) para anular la detección automática de Node.js causada por el `package.json`.
- **Manifest PWA**: Corregidas las rutas de `start_url` y `scope` para asegurar la instalación desde el dominio de Vercel.
- **Rutas de Despliegue**: Mapeo explícito de activos públicos y el Service Worker en `vercel.json`.

## [v4.0.0] - 2026-01-29
### Añadido
- **Soporte Multi-Hosting**: Configuración terminada para despliegue simultáneo en Vercel y GitHub Pages.
- **Vercel Static Engine**: Forzado el uso de `@vercel/static` en `vercel.json` para ignorar la lógica de backend en el despliegue del cliente.
### Corregido
- **PWA Manifest**: Se migraron las rutas relativas (`../../`) a rutas raíz (`/`) para garantizar que la app sea instalable desde cualquier dominio o subcarpeta.

## [v4.0.1] - 2026-01-29
### Corregido
- **PWA Asset Path**: Ajustada la ruta de los iconos en el manifest para resolver el error de descarga en el despliegue de Vercel.
- **Estabilidad PWA**: Confirmado el registro exitoso del Service Worker y la activación del modo standalone.

## [v4.0.2] - 2026-01-29
### Corregido
- **Ruta de Recursos**: Corregida la ubicación del icono en el `manifest.json` apuntando a la ruta física real `/public/assets/icon-512.png`.
- **Sincronización PWA**: Actualizado el Service Worker para incluir el asset del icono en la estrategia de pre-caché, eliminando el error de descarga en consola.

## [v4.0.3] - 2026-01-29
### Mejorado
- **Estructura de Assets**: Se movió el `manifest.json` a la carpeta `/public/assets/` para centralizar recursos gráficos.
- **Rutas Relativas**: Ajustada la referencia del icono dentro del manifiesto y la referencia del manifiesto en el `index.html` para compatibilidad con Vercel.

## [v4.1.0] - 2026-01-29
### Añadido
- **Módulo de Análisis Histórico**: Implementación de gráficas de tendencia usando Chart.js.
- **Memoria de Tasas**: Sistema de almacenamiento en LocalStorage para registro de variaciones diarias.
- **Indicadores de Color**: Diferenciación visual de tendencia (Rojo: Alza / Verde: Baja).
- **Interfaz Modal**: Nueva ventana emergente para visualización de datos históricos sin recargar la página.
### Mejorado
- **UX**: Se añadió un acceso directo a la gráfica para análisis rápido de la economía.

## [v4.1.0] - 2026-01-29
### Añadido
- **Persistencia en Railway**: Implementada base de datos SQLite para almacenamiento histórico de tasas.
- **API de Historial**: Nueva ruta `/api/historial` que sirve los últimos 30 registros económicos.
- **Gráficas Inteligentes**: Integración con Chart.js para visualización de tendencias con semáforo de color (Rojo/Verde).
### Mejorado
- **Robustez de Datos**: Se eliminó la dependencia de LocalStorage en favor de almacenamiento persistente en servidor.