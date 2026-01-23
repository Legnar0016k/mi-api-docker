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