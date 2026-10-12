# <img src="apps/site/public/assets/afin-favicon.svg" width="36" height="36" alt=""> Afin · Adamou Financial Consulting

[![CI](https://github.com/smeltery/adamou-financial-consulting/actions/workflows/ci.yml/badge.svg)](https://github.com/smeltery/adamou-financial-consulting/actions/workflows/ci.yml)
[![Astro](https://img.shields.io/badge/Astro-static-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-workspace-149ECA?logo=react)](https://react.dev)
[![Bun](https://img.shields.io/badge/Bun-1.3.11-black?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-hosting-black?logo=vercel)](https://vercel.com)
[![Flox](https://img.shields.io/badge/Flox-reproducible-6C4CE4)](https://flox.dev)
[![License](https://img.shields.io/badge/license-PolyForm_Shield-blue)](LICENSE)

![Afin — Less money stress. More possibility.](apps/site/public/assets/afin-social.png)

[Visit Afin](https://adamou-financial-consulting.vercel.app/) · [Documentation](docs/README.md)

Afin’s public website and Matt’s private client workspace in one Bun monorepo.

- `apps/site`: Astro website, sixteen financial calculators, guides, and intake.
- `apps/console`: React client records, onboarding, goals, follow-ups, offboarding,
  and animated business reporting. Supabase enforces Matt-only data access.
- `packages/intake`: shared field definitions and intake validation.

```sh
flox activate
bun install --frozen-lockfile
bunx --bun playwright install chromium
bun run dev           # public site: localhost:3000
bun run dev:console   # private workspace: localhost:3100
```

Run `./scripts/check.sh` (with Docker running) for the same quality checks used
by the pre-commit hook and CI. Flox installs the hook on activation.

See [the documentation](docs/README.md) for client guidance, brand resources,
Formspree setup, Vercel deployment, analytics, and development.

See [workspace setup and workflows](docs/workspace.md) to connect Supabase and
signed Formspree intake. Until connected, production client access stays disabled.

Licensed under [PolyForm Shield](LICENSE).
