# Stage 1: сборка фронта
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: nginx для фронта
FROM nginx:alpine

# Копируем билд фронта в стандартную папку nginx
COPY --from=build /app/build /usr/share/nginx/html

# Наш конфиг nginx для фронта
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Экспонируем порт 80 (внутри сети docker)
EXPOSE 80

# Старт nginx
CMD ["nginx", "-g", "daemon off;"]
