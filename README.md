# Xentra Technologies website

Next.js 16 (App Router, Cache Components, Turbopack), TypeScript, Tailwind CSS 4,
GSAP + ScrollTrigger, three.js. Content lives in `lib/content/`.

## Requirements

- Node.js 20.9 or newer (Next.js 16 requirement; see `engines` in `package.json`)
- npm (the lockfile is `package-lock.json`)

## Local development

```bash
npm ci
npm run dev        # http://localhost:3000 (drafts are visible in dev)
```

## Checks before pushing

```bash
npm run lint
npm run build      # also type-checks
```

A standalone `npx tsc --noEmit` needs the types Next.js generates first
(`next-env.d.ts`, `.next/types`): run it after a build, or after `npx next typegen`.

## Production

The site needs a Node.js server: it is mostly prerendered, but `proxy.ts`
(real 404s for unpublished case studies) and the partially prerendered
`/case-studies/[slug]` run at request time. A static export would drop them.

```bash
npm run build
npm run start      # next start
```

### Hostinger (Node.js web app from GitHub)

Needs a plan with Node.js web apps (Business Web Hosting or Cloud). In hPanel:
Websites → Add Website → Node.js web app → Import Git repository.

| Setting | Value |
|---|---|
| Framework / application type | Next.js (`next`) |
| Branch | the branch you want live |
| Node.js version | 20 or newer (22 LTS recommended) |
| Root directory | repository root |
| Build script | `build` (runs `next build`) |
| Output directory | `.next` |
| Entry file / start command | none: Hostinger builds with standalone output and starts the server itself |

Environment variables (hPanel → the app → Environment variables), set before
the build:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes, for SEO | The live address, e.g. `https://www.example.com` (no trailing slash). Makes canonical / Open Graph URLs absolute and fills `sitemap.xml` and the `robots.txt` sitemap line. Read at build time: redeploy after changing it. |
| `XENTRA_SHOW_DRAFTS` | No | Leave unset in production. `true` makes a review build that shows draft copy and blocks all crawlers. |

Every push to the connected branch triggers a rebuild and redeploy.
