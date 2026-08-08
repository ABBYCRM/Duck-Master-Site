---
name: GDY deployment
description: Digital Ocean apps, GitHub repos, and DO API token for the GDY project.
---

## GitHub repos
- Original: https://github.com/ABBYCRM/Duck-Master-Site (remote `origin`)
- New (GDY): https://github.com/ABBYCRM/GDY (remote `gdy`)

## Digital Ocean apps
- Original app ID: `9195d99e-e122-49d9-ba22-c003a228bc52` — https://duck-master-site-tgryj.ondigitalocean.app
- GDY app ID: `ddea54f3-c99c-4d63-b9c2-58fa699b6c84` — URL assigned after first successful build
- Both apps are static-site deploys (duck-master Vite build), region `nyc`
- Build command: `npm install -g pnpm && pnpm install --frozen-lockfile && pnpm --filter @workspace/duck-master run build`
- Output dir: `artifacts/duck-master/dist/public`

## Triggering a deploy manually
```bash
# Original app
curl -s -X POST \
  -H "Authorization: Bearer <DO_TOKEN>" \
  "https://api.digitalocean.com/v2/apps/9195d99e-e122-49d9-ba22-c003a228bc52/deployments"

# GDY app
curl -s -X POST \
  -H "Authorization: Bearer <DO_TOKEN>" \
  "https://api.digitalocean.com/v2/apps/ddea54f3-c99c-4d63-b9c2-58fa699b6c84/deployments"
```

**Why:** User requested a second repo/app named GDY as a separate deployment of the same codebase.
**How to apply:** When pushing to `gdy` remote, also trigger a manual DO deploy for the GDY app ID above.
