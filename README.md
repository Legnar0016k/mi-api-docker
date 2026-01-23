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