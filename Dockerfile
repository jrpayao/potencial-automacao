# Stage 1: build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nx build frontend --configuration=production
RUN npx nx build api --configuration=production

# Stage 2: API
FROM node:22-alpine AS api
WORKDIR /app
COPY --from=builder /app/dist/apps/api .
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "main.js"]

# Stage 3: Frontend
FROM nginx:1.27-alpine AS frontend
COPY --from=builder /app/dist/apps/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
