# Cloudflare Pages

Yes. A Next.js site can be deployed on the Cloudflare Pages free plan when it is a static export. This repository is set up that way.

`next.config.ts` sets `output: "export"`. `npm run build` writes HTML, CSS, and JavaScript to `out/`. Pages serves those files. There is no Node server in production.

Official guide: [Deploy a static Next.js site](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).

## What the free plan includes

Figures below are from the [Pages limits](https://developers.cloudflare.com/pages/platform/limits/) page. Confirm them there before relying on a number.

| Limit | Free plan |
| --- | --- |
| Builds per month | 500 |
| Concurrent builds | 1 per account |
| Build timeout | 20 minutes |
| Files per site | 20,000 |
| Max file size | 25 MiB |
| Custom domains per project | 100 |
| Projects per account | 100 |

That page does not list a request cap for static assets. Requests to Pages Functions count against the Workers quota. This site has no Pages Functions.

`.node-version` pins Node.js `22.23.4`. Pages reads that file. Wrangler 4.167 requires Node `>= 22.12.0`, and Next.js 16 requires Node `>= 20.9.0`. See [Build image](https://developers.cloudflare.com/pages/configuration/build-image/).

## Environment variables

The site build does not read custom variables. `next build` succeeds without a `.env` file.

Direct upload with Wrangler requires two values. The deploy command throws if either one is missing or empty. They are not committed.

| Variable | Where it is used |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | Wrangler, to choose the Cloudflare account |
| `CLOUDFLARE_API_TOKEN` | Wrangler, to authenticate the upload |

Create the token in the Cloudflare dashboard under My Profile, API Tokens. The permission is Account, Cloudflare Pages, Edit. Copy the account ID from the same dashboard (Workers & Pages, the account overview). Put both values in a gitignored `.env` file at the repository root. `.env.example` lists the names.

```bash
cp .env.example .env
```

Pages injects `CI`, `CF_PAGES`, `CF_PAGES_COMMIT_SHA`, `CF_PAGES_BRANCH`, and `CF_PAGES_URL` during a Git build. This site does not read them. See [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/).

## Deploy from this machine

Docker Desktop must be running. From the repository root, with `.env` filled in:

```bash
docker compose --profile deploy run --rm --build deploy
```

That builds `out/` inside the image and runs `wrangler pages deploy`. The project name and output directory are in `wrangler.jsonc` (`studio-luce`, `./out`). The production URL is `https://studio-luce.pages.dev` when that project name is free on the account.

The API token is passed into the container at runtime. It is not written into the image.

## Deploy from Git

1. Push this repository to GitHub or GitLab.
2. In the Cloudflare dashboard, open Workers & Pages, then Create application.
3. Open the Pages tab and import the Git repository.
4. Use the framework preset **Next.js (Static HTML Export)**.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npx next build` |
| Build output directory | `out` |

Pages installs dependencies from `package-lock.json`, runs the build, and publishes `out`. Each push to the production branch deploys again. Pull requests get preview deployments.

The local `Dockerfile` is not used by Pages.

## What this export cannot do

These Next.js features need a server at request time. They are unsupported with `output: "export"` and will not run on Pages:

- Server-side rendering on each request
- Server Actions
- Middleware and proxy
- Incremental static regeneration
- Redirects, rewrites, and headers configured in `next.config.ts`
- Cookies and other request data during rendering
- The default `next/image` optimizer (this project sets `images.unoptimized`)

Pages and client components that can be rendered at build time are supported. Client components still run in the browser after the static files load.

A later feature that needs a server is a different deployment. Cloudflare's current recommendation for full Next.js is [vinext on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/), not Pages. Workers has its own free quota and is not required for this hello-world site.
