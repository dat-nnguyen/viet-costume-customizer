# Multi-stage Docker build for Fullstack Node.js + Vite + Dual-Engine Database
# Stage 1: Build frontend assets
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies for building
COPY package*.json ./
RUN npm ci

# Copy source code and build Vite static files
COPY . .
RUN npm run build

# Stage 2: Production runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend assets and backend server source
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Ensure data directory exists for SQLite database persistence
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 3001

# Run Express server with tsx
CMD ["npx", "tsx", "server/index.ts"]
