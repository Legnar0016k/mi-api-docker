# Usamos la versión 20 que ya tenías (es excelente)
FROM node:20-slim

WORKDIR /app

# Copiamos los archivos de configuración desde la raíz
COPY package*.json ./

# Instalamos solo lo necesario para producción
RUN npm install --production

# Copiamos TODO el proyecto (incluyendo las carpetas backend/ y public/)
COPY . .

# Exponemos el puerto
EXPOSE 3000

# IMPORTANTE: Apuntamos a la nueva ubicación del servidor
CMD ["node", "backend/server.js"]