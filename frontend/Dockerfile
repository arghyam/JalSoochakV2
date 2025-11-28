# Stage 1 — build the app
FROM node:20-alpine AS builder
WORKDIR /app

# system deps for native modules/build tools
RUN apk add --no-cache python3 make g++

# copy dependency manifests first for cached installs
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --silent; else npm install --silent; fi

# copy source and build
COPY . .
RUN npm run build --silent

# Stage 2 — serve the built files with nginx
FROM nginx:stable-alpine AS runner
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# optional: replace default conf to enable SPA fallback (if nginx.conf exists)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]