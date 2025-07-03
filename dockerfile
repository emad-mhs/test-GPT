# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun build

# Stage 2: production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN bun install --production --frozen-lockfile
EXPOSE 3000
CMD ["node_modules/.bin/next","start"]
