# Local development

The site runs in Docker. Do not install Node.js or Python on the machine.

Docker is required. This repository does not install it for you.

## Dev server

From the repository root:

```bash
docker compose up --build
```

Open http://localhost:3000. The home page is `Hello, world`.

`docker compose` publishes port 3000 and mounts the source directory into the container. Installed packages stay in the `web_node_modules` volume, so the host does not need a `node_modules` directory.

Stop the server with Ctrl+C, then:

```bash
docker compose down
```

## Static preview

Cloudflare Pages serves the `out` directory produced by `next build`. To preview those files locally:

```bash
docker compose --profile preview up --build preview
```

Open http://localhost:8080.

`next start` is not used. A static export has no Node server to start.

## Production build inside the dev image

```bash
docker compose run --rm --no-deps web npm run build
```

The HTML is written to `out/` on the host because the source directory is mounted. `out/` is generated and is not committed.
