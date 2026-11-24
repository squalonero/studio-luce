# Cloudflare Workers

Each push to the connected GitHub branch builds this app and publishes the Worker `studio-luce`. Deployment does not run from a developer machine. Workers Builds authenticates with its own API token.

`npm run build` runs `vite build`. That command writes client files to `dist/client` and the server bundle to `dist/server`. `wrangler.jsonc` is the Worker configuration. Its `main` module is the vinext fetch handler, and its assets directory is `dist/client`.

A dry run of `npx wrangler deploy` accepts that configuration after the Vite build. The Worker name in `wrangler.jsonc` must stay `studio-luce`, the same name as the Worker connected to the repository.

## Build settings

In the Worker, open Settings, then Build. Use these commands:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Preview command | `npx vinext-cloudflare previews deploy` |

The deploy command must not be an OpenNext migration. `output: "export"` is not set. A static export does not produce the Worker bundle, which is why the previous Pages deploy failed while trying to run OpenNext.

Workers Builds installs dependencies with `npm ci` before the build command. `.node-version` pins Node.js `22.23.4`.

## What runs on a request

`wrangler.jsonc` sends every request through the Worker except the hashed files under `/_next/static`. Those files are served from Workers Static Assets. The page itself is rendered by the Worker.

There is no shared cache and no image optimizer. The hello-world page does not need them. `next.config.ts` sets `images.unoptimized` so `next/image` is not pointed at an optimizer this project does not configure.

## Free plan

A Worker on the free plan allows 100,000 requests per day and 10 ms of CPU time per request. A request for `/` counts against that quota. A request for a file under `/_next/static` does not, because the asset rule above skips the Worker.

Confirm the current numbers on the [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) page.

## Environment variables

This application does not read environment variables. Do not add a fallback value for a missing variable. Workers Builds injects `CI`, `WORKERS_CI`, `WORKERS_CI_BUILD_UUID`, `WORKERS_CI_COMMIT_SHA`, and `WORKERS_CI_BRANCH` into the build. The app does not read them.

Secrets do not belong in the repository. `.env` is gitignored. Workers Builds does not need `CLOUDFLARE_API_TOKEN` in the repository. Cloudflare supplies the build token.

## Local production build

The same build the CI runs:

```bash
docker compose run --rm --no-deps web npm run build
```
