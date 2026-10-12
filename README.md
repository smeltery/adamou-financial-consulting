# <img src="public/assets/afin-favicon.svg" width="36" height="36" alt=""> Afin · Adamou Financial Consulting

[![CI](https://github.com/smeltery/adamou-financial-consulting/actions/workflows/ci.yml/badge.svg)](https://github.com/smeltery/adamou-financial-consulting/actions/workflows/ci.yml)
[![Astro](https://img.shields.io/badge/Astro-static-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-calculators-149ECA?logo=react)](https://react.dev)
[![Bun](https://img.shields.io/badge/Bun-1.3.11-black?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-hosting-black?logo=vercel)](https://vercel.com)
[![Flox](https://img.shields.io/badge/Flox-reproducible-6C4CE4)](https://flox.dev)
[![License](https://img.shields.io/badge/license-PolyForm_Shield-blue)](LICENSE)

![Afin — Less money stress. More possibility.](public/assets/afin-social.png)

[Visit Afin](https://adamou-financial-consulting.vercel.app/) · [Documentation](docs/README.md)

A lean website for Matt Adamou’s financial coaching practice: clear service
pages, sixteen private financial calculators with dedicated guides, a downloadable SVG brand mark, and a
detailed client intake. Agent-readable Markdown, sitemap, and structured data. Astro pages with a React calculator island, managed with Bun;
Vercel hosting and Web Analytics; optional Formspree delivery.

```sh
flox activate
bun install --frozen-lockfile
bunx --bun playwright install chromium
bun run dev
```

Open `http://localhost:3000`. Run `./scripts/check.sh` (with Docker running) for the same quality checks used
by the pre-commit hook and CI. Flox installs the hook on activation.

See [the documentation](docs/README.md) for client guidance, brand resources,
Formspree setup, Vercel deployment, analytics, and development.

Licensed under [PolyForm Shield](LICENSE).
