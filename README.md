# 🚀 Mi Primera API Dockerizada - Node.js & Express

Este proyecto representa un hito importante en mi camino como desarrollador **Fullstack**. Es una API robusta, empaquetada en un contenedor Docker y desplegada automáticamente en la nube (Railway), diseñada para servir como microservicio de datos.

## 🛠️ Tecnologías Utilizadas

* **Backend:** Node.js con el framework Express.
* **Contenedorización:** Docker (para asegurar que el sistema funcione en cualquier entorno).
* **Despliegue (CI/CD):** Railway con integración continua desde GitHub.
* **Protocolo:** REST API enviando datos en formato JSON.

## 📌 Características Principales

* **Arquitectura de Contenedores:** Uso de `Dockerfile` para definir un entorno de ejecución ligero y seguro.
* **Endpoints Dinámicos:** * `/`: Ruta raíz con mensaje de estado del sistema.
    * `/tasa`: Endpoint que simula la entrega de tipos de cambio en tiempo real.
* **Gestión de Puertos Dinámicos:** Configuración preparada para entornos de producción mediante variables de entorno.

## 🚀 Cómo ejecutar este proyecto localmente

Si tienes Docker instalado, puedes replicar este entorno en segundos:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/Legnar0016k/mi-api-docker.git](https://github.com/Legnar0016k/mi-api-docker.git)

   //==========================================================================================
   # 🏦 Monitor de Tasa BCV - Microservicio & Dashboard

Este proyecto es una solución Fullstack diseñada para consultar, procesar y visualizar la tasa oficial del Banco Central de Venezuela en tiempo real. Utiliza técnicas de **Web Scraping** para extraer datos de fuentes financieras y los expone a través de una API propia.



## 🚀 Características Técnicas

- **Backend:** Node.js v20 con Express.
- **Scraping Engine:** Axios + Cheerio (Extracción de datos inteligente).
- **Contenedorización:** Dockerizado para asegurar consistencia en cualquier entorno.
- **Despliegue:** Cloud hosting en Railway con CI/CD automatizado.
- **Frontend:** Dashboard con diseño *Cyberpunk/Glassmorphism* usando Tailwind CSS.
- **Seguridad:** CORS configurado para consumo de aplicaciones externas (SISOV, Dashboards, etc.).

## 🛠️ Estructura del Proyecto

- `/server.js`: Servidor Express y lógica de extracción de datos.
- `/index.html`: Dashboard interactivo que consume la API.
- `/Dockerfile`: Configuración de la imagen para el despliegue.

## 📦 Instalación Local

Si tienes Docker instalado:

1. Clona el repositorio:
   ```bash
   git clone [https://github.com/TU_USUARIO/TU_REPOSO.git](https://github.com/TU_USUARIO/TU_REPOSO.git)


🏦 **Monitor de Tasa BCV - Sistema de Alta Disponibilidad**

Este proyecto ha evolucionado de una API Dockerizada a un ecosistema Fullstack robusto. Diseñado para consultar, procesar y visualizar la tasa oficial del BCV, cuenta con un sistema de triple capa para garantizar que los datos mostrados sean siempre coherentes y verídicos, incluso si la fuente original falla.

🛠️ **Arquitectura Modular (Triple Capa)**
Para evitar errores de "datos locos" o caídas del servidor, el frontend ahora se divide en módulos independientes:

**Capa de Supervisión (supervisor.js):** El cerebro que orquestador. Decide qué fuente de datos usar (Railway o Respaldo) basándose en la salud del sistema.

**Capa de Validación (validador.js):** El perito matemático. Compara el dato de Railway contra una API de referencia (dolarapi.com) y rechaza desviaciones mayores al 10%.

**Capa de Renderizado (ui-render.js):** El motor visual. Maneja los estados de sincronización (OK, SWAP, FAIL) sin interferir con la lógica de datos.

**🚀 Características Técnicas**
Backend: Node.js v20 + Express.

Scraping: Axios + Cheerio (Extracción inteligente de datos financieros).

PWA (Progressive Web App): Instalable en Android, iOS y PC con soporte Offline mediante Service Workers.

Contenedorización: Dockerizado (Dockerfile optimizado) para despliegue inmediato.

Despliegue: Cloud hosting en Railway con CI/CD automatizado desde GitHub.

Diseño: Dashboard Cyberpunk / Glassmorphism con Tailwind CSS e indicadores de estado dinámicos.

**📌 Gestión de Estados de Sincronización**
La app comunica su estado de salud en tiempo real:

🟢 SINCRO OK: Datos obtenidos de la API principal y validados exitosamente.

🟠 SINCRO SWAP: Error detectado en la fuente principal; el sistema activó el respaldo de emergencia.

🔴 SINCRO FAIL: Ambas fuentes de datos están fuera de línea.

**📦 Estructura de Archivos**
Bash
├── server.js          # API REST y Motor de Scraping (Backend)
├── index.html         # Dashboard Principal (PWA)
├── supervisor.js      # Orquestador de lógica y Failover
├── validador.js       # Validación dinámica de coherencia (10% umbral)
├── ui-render.js       # Controlador de interfaz y estados visuales
├── sw.js              # Service Worker para soporte Offline
├── manifest.json      # Configuración de PWA e iconos
└── Dockerfile         # Definición del contenedor de producción
⚙️ Instalación y Ejecución Local
Con Docker (Recomendado)
Si tienes Docker instalado, puedes levantar el backend en segundos:

**Clonar:** git clone https://github.com/Legnar0016k/mi-api-docker.git

Construir imagen: docker build -t bcv-monitor .

Ejecutar: docker run -p 3000:3000 bcv-monitor

Sin Docker
Instala dependencias: npm install

Inicia el servidor: node server.js

Abre index.html en tu navegador.

**📝 Bitácora de Cambios**
El historial detallado de actualizaciones, incluyendo el fix para evitar "picos" de precio y la migración a arquitectura modular, se encuentra en el archivo CHANGELOG.md.

**proximos cambios**
configurar un "Web Hook" para que te llegue un aviso al celular si el supervisor detecta un fallo y tiene que hacer SWAP...

**📦 Estructura de Archivos actual version v1.9.0**
PROYECTO: TERMINAL BCV
├── 🌐 Backend (Railway/Node.js)
│   ├── server.js           # Orquestador de la API
│   └── scraper-bcv.js      # Minería de datos (BCV/Monitor)
│
├── 💻 Frontend (Cliente PWA)
│   ├── index.html          # Estructura y carga de scripts
│   ├── manifest.json       # Configuración PWA
│   ├── sw.js               # Service Worker (Cache & Offline)
│   │
│   ├── ⚙️ CORE LOGIC
│   │   ├── supervisor.js   # Toma de decisiones (Fetch A o B)
│   │   └── validador.js    # Inteligencia de comparación (Umbral 10%)
│   │
│   ├── 🎨 UI & RENDER
│   │   ├── ui-render.js    # El "Pintor" (Semáforo y Precios)
│   │   ├── ui-features.js  # Modales y Euro
│   │   └── calc-logic.js   # Calculadora y botones rápidos
│   │
│   └── 🛡️ RESILIENCIA & TEST (Nuevos)
│       ├── recovery-logic.js       # Reintento tras fallo (Centinela)
│       ├── fault-test.js           # Inyector de errores manual
│       └── chaos-and-recovery-test.js # Test de sabotaje automático
│
└── 📖 DOCUMENTACIÓN
    └── CHANGELOG.md        # Historial técnico de cambios
    └── README.md


**🚨 Protocolo de Emergencia y Pruebas de Resiliencia (v1.9.0)**

Este manual describe cómo operar las herramientas de sabotaje y recuperación añadidas en la última actualización.

1. Simulación de Fallo de Servidor (fault-test.js)
Objetivo: Forzar al sistema a abandonar la API de Railway y activar el respaldo (SWAP).

Cómo activarlo: Descomenta la carga del script en el index.html.

Resultado esperado:

La consola mostrará: ⚠️ MODO DE PRUEBA: Forzando error en API Principal...

El indicador de estado en la UI cambiará de SINCRO OK a SINCRO SWAP (Naranja).

La tasa se obtendrá de ve.dolarapi.com.

2. Test de Caos Dinámico (chaos-and-recovery-test.js)
Objetivo: Validar que el sistema sobrevive a una caída total de internet y se recupera solo.

Funcionamiento: 1. Secuestra el comando fetch y lo bloquea durante 15 segundos. 2. El sistema entrará en SINCRO FAIL (Rojo). 3. A los 15 segundos, libera el bloqueo. 4. El recovery-logic.js (Centinela) detectará el fallo y reintentará la conexión hasta volver a SINCRO OK.

3. El Centinela de Recuperación (recovery-logic.js)
Estado: Siempre activo en segundo plano.

Lógica de Reintento: Utiliza un Backoff Algorítmico. Empieza reintentando cada 5 segundos y va aumentando el tiempo hasta un máximo de 30 segundos para no saturar el dispositivo del usuario.

🛠️ Instrucciones para el Desarrollador (Mantenimiento)
[!WARNING] IMPORTANTE PARA PRODUCCIÓN: Antes de hacer un git push definitivo, asegúrate de que el bloque de "DEBUG" en el index.html esté comentado. De lo contrario, los usuarios finales experimentarán "caos" programado.

HTML
<script src="validador.js"></script>
<script src="ui-render.js"></script>
<script src="supervisor.js"></script>
<script src="recovery-logic.js"></script>