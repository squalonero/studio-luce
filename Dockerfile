# Local runtime for Studio Luce.
# Cloudflare Pages does not run this image. Pages runs `npx next build`
# and publishes the `out` directory. See docs/cloudflare-pages.md.

FROM node:22-alpine AS base
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

# Local preview of the files Pages will publish.
FROM nginx:1.28-alpine AS preview
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80
