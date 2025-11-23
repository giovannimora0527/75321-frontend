FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# En Angular 19, los archivos están en dist/[proyecto]/browser
COPY --from=build /app/dist/datta-able-free-angular-admin-template/browser /usr/share/nginx/html/

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]