# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

ARG VITE_API_URL=http://localhost:8080/
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Run TanStack Start SSR with custom Node server
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY server.mjs ./
EXPOSE 3000
CMD ["node", "server.mjs"]
