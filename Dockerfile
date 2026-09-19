# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
# --mount=type=cache persists npm's download cache across builds, and the
# retry/timeout config makes `npm ci` resilient to a flaky connection instead
# of restarting the whole install from scratch on one dropped packet.
RUN --mount=type=cache,target=/root/.npm \
  npm config set fetch-retries 5 fetch-retry-mintimeout 20000 fetch-retry-maxtimeout 120000 fetch-timeout 600000 \
  && npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Regenerate the Prisma data contract artifacts from contract.prisma so the
# image never ships a stale contract.json/contract.d.ts (no DB connection needed).
RUN npx prisma contract emit
RUN npm run build

# Standalone output (see next.config.ts) traces only the node_modules each
# route actually needs, so the runtime image never installs the full
# node_modules tree.
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
