# Local runtime for Studio Luce.
# Cloudflare Pages does not run this image. Pages runs `npx next build`
# and publishes the `out` directory. See docs/cloudflare-pages.md.

# Node 22.23.4 matches .node-version and satisfies Wrangler (>= 22.12).
FROM node:22.23.4-alpine AS base
WORKDIR /app
# Keeps `next` from sending anonymous usage data during image builds.
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS development
COPY . .
EXPOSE 3000
# Listen on every interface. `localhost` inside the container is not the host.
CMD ["npm", "run", "dev"]

FROM dependencies AS build
COPY . .
RUN npm run build

# Image used only to publish `out/` with Wrangler.
# Credentials are passed at runtime and are not baked into the image.
FROM build AS deploy
CMD ["npm", "run", "deploy"]

# Local preview of the files Pages will publish.
FROM nginx:1.28-alpine AS preview
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80
