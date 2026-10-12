# Agent discovery

The website serves complete HTML without requiring JavaScript. Every navigation
item leads to a dedicated, crawlable page with a canonical URL, page description,
Open Graph metadata, and JSON-LD organization and page data.

- `/robots.txt` allows public crawlers and points to `/sitemap.xml`.
- `/llms.txt` indexes the content and describes the contact workflow.
- `/llms-full.txt` combines the public page content.
- `/content/home.md` and matching page names expose Markdown generated from
  the same HTML content, avoiding a separately maintained copy.
- `Accept: text/markdown` requests return Markdown on canonical page routes;
  responses vary by `Accept` to keep shared caches correct. Missing routes return
  HTTP 404 with a Markdown recovery message when requested by an agent.

The site declares the `business` category for [Is Agentic](https://is-agentic.com/).
Run `bunx is-agentic adamou-financial-consulting.vercel.app` after deployment to
review its public report. Scores are external observations, not guarantees.

No API, MCP server, booking availability, or payment system is advertised.
Agents should get visitor consent before sending an inquiry and must not treat
an email draft as successful delivery. See [intake delivery](intake.md).

When moving to a custom domain, update `siteUrl` in `src/metadata.ts` and rebuild
so canonical URLs, structured data, sitemap, and Markdown links stay consistent.
