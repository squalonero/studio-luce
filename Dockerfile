# Local runtime for Studio Luce.
# Cloudflare Workers Builds does not use this image. It runs `npm run build`
# and then `npx wrangler deploy`. See docs/cloudflare-workers.md.

# Node 22.23.4 matches .node-version and satisfies Wrangler (>= 22.12).
FROM node:22.23.4-alpine AS base
WORKDIR /app
# Keeps Next.js and Vite from sending anonymous usage data during image builds.
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS development
COPY . .
EXPOSE 3000
# Listen on every interface. localhost inside the container is not the host.
CMD ["npm", "run", "dev:vinext"]

FROM dependencies AS build
COPY . .
RUN npm run build
