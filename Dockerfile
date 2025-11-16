# Angular 19 con Node 20
FROM node:20-alpine

WORKDIR /app

# Copiar solo package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Exponer puerto del servidor Angular
EXPOSE 4200

# Iniciar Angular accesible desde fuera del contenedor
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]

