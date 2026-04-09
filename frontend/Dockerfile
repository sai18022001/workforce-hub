# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .

# Vite builds static files into /app/dist
RUN npm run build

# ── Stage 2: Nginx serves the static files ────────────────────────────────────
# nginx:alpine is ~25MB and is the industry standard for serving React apps
FROM nginx:alpine

# Copy the built React app into nginx's serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (we'll create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]