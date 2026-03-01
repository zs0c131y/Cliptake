# -------------------------
# Stage 1: Build Frontend
# -------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json files first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy frontend source and build
COPY tsconfig*.json vite.config.ts index.html ./
COPY src/ ./src/
COPY public/ ./public/

RUN npm run build

# -------------------------
# Stage 2: Production Server
# -------------------------
FROM node:20-alpine

# Install FFmpeg and Python3 (yt-dlp requires python)
RUN apk update && \
    apk add --no-cache ffmpeg python3 libc6-compat && \
    ln -sf python3 /usr/bin/python

WORKDIR /app

# Copy backend dependencies and install
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy backend source code
COPY server/ ./server/

# Copy the built frontend from Stage 1 into the /dist directory so the backend can serve it
COPY --from=builder /app/dist ./dist

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the server
CMD ["node", "server/index.js"]
