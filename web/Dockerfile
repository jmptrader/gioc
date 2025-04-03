# Etapa 1: Construcción de la aplicación
FROM node:18 AS build

# Establecer el directorio de trabajo
WORKDIR /web

# Copiar archivos de dependencias y el código fuente
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Servidor web para producción
FROM nginx:alpine

# Copiar la aplicación compilada al directorio de Nginx
COPY --from=build /web/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando de inicio del servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
