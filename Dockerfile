# ── Stage 1: Dependencies ───────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies needed for native modules (sharp, etc.)
RUN apk add --no-cache libc6-compat python3 make g++

COPY package*.json .npmrc ./
RUN npm ci --ignore-scripts

# ── Stage 2: Builder ─────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Provide dummy env vars so Next.js can build without a live DB
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PAYLOAD_SECRET=build-time-secret-replace-at-runtime
ENV DATABASE_URI=postgresql://placeholder:placeholder@placeholder:5432/placeholder
ENV NEXT_PUBLIC_SITE_URL=https://thenationalfeed.com
ENV NEXT_PUBLIC_SITE_NAME="The National Feed"

RUN npm run build

# ── Stage 3: Runner (lean production image) ──────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy only what's needed to run
COPY --from=builder /app/public           ./public
COPY --from=builder /app/next.config.mjs  ./next.config.mjs
COPY --from=builder /app/package.json     ./package.json
COPY --from=builder /app/payload.config.ts ./payload.config.ts
COPY --from=builder /app/payload-types.ts  ./payload-types.ts
COPY --from=builder /app/tsconfig.json     ./tsconfig.json

# Next.js standalone output (set output: 'standalone' in next.config is optional;
# here we copy the whole .next + node_modules for simplicity on a single droplet)
COPY --from=builder --chown=nextjs:nodejs /app/.next          ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules   ./node_modules
COPY --from=builder /app/src               ./src

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["npm", "run", "start"]
