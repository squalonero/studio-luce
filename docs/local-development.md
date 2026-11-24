# Local development

The dev server runs in Docker. Do not install Node.js or Python on the machine.

Docker is required. This repository does not install it for you.

## Dev server

From the repository root:

```bash
docker compose up --build
```

Open http://localhost:3000. The header shows the logo on the left, and the hero reads `Studio Luce: L’Anima del Vetro`.

The container runs `vite dev` through vinext, on port 3000, bound to every interface. Source edits on the host are visible in the container. Installed packages stay in the `web_node_modules` volume.

`npm run dev` still starts the Next.js dev server. The Worker runtime used in production is the vinext server.

Stop the server with Ctrl+C, then:

```bash
docker compose down
```

## Production build inside the dev image

```bash
docker compose run --rm --no-deps web npm run build
```

This writes the Worker bundle and client assets under `dist/`. That directory is generated and is not committed. Cloudflare Workers Builds runs the same `npm run build` before `npx wrangler deploy`.
