FROM node:22-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
# Patch Prisma generated ESM: Node requires .js extension for relative imports
RUN sed -i 's|from "./enums"|from "./enums.js"|g; s|from '\''./enums'\''|from '\''./enums.js'\''|g' /app/dist/prisma/generated/client.js \
    && sed -i 's|from "./internal/class"|from "./internal/class.js"|g' /app/dist/prisma/generated/client.js \
    && sed -i 's|from "./internal/prismaNamespace"|from "./internal/prismaNamespace.js"|g' /app/dist/prisma/generated/client.js \
    && sed -i 's|from "./class"|from "./class.js"|g' /app/dist/prisma/generated/internal/prismaNamespace.js \
    && sed -i 's|from "./enums"|from "./enums.js"|g' /app/dist/prisma/generated/commonInputTypes.js

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 8080
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/server.js"]
