# 1. Usamos una imagen de Node.js como base
FROM node:18-slim

# 2. Creamos una carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install

# 5. Copiamos el resto de nuestro código
COPY . .

# 6. Exponemos el puerto que usará la app
EXPOSE 3000

# 7. El comando para arrancar la aplicación
CMD ["node", "server.js"]