# Afin · Adamou Financial Consulting

[![CI](https://github.com/smeltery/adamou-financial-consulting/actions/workflows/ci.yml/badge.svg)](https://github.com/smeltery/adamou-financial-consulting/actions/workflows/ci.yml)
[![Bun](https://img.shields.io/badge/Bun-1.3.11-black?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-hosting-black?logo=vercel)](https://vercel.com)
[![Flox](https://img.shields.io/badge/Flox-reproducible-6C4CE4)](https://flox.dev)
[![License](https://img.shields.io/badge/license-PolyForm_Shield-blue)](LICENSE)

[Visit Afin](https://adamou-financial-consulting.vercel.app/) · [Documentation](docs/README.md)

A lean website for Matt Adamou’s financial coaching practice: clear service
introductions, a personal About section, a downloadable SVG brand mark, and a
detailed client intake. Static HTML, CSS, and TypeScript built with Bun;
Vercel hosting and Web Analytics; optional Formspree delivery.

```sh
flox activate
bun install --frozen-lockfile
bunx --bun playwright install chromium
bun run dev
```

Open `http://localhost:3000`. Run `bun run check` for the same quality checks used
by the pre-commit hook and CI. Flox installs the hook on activation.

See [the documentation](docs/README.md) for client guidance, brand resources,
Formspree setup, Vercel deployment, analytics, and development.

The [license](LICENSE) is copied byte-for-byte from `smeltery/hab`.
