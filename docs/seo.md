# Search visibility

Afin serves complete HTML with unique titles and descriptions, canonical URLs,
a sitemap, crawlable navigation, and Organization, Person, WebSite, and page
structured data. The tools collection lists all eight calculators. Homepage
links lead directly to individual tools. Markdown copies declare their HTML
canonical using HTTP headers; raw `/pages/*.html` URLs redirect to public pages.
These signals help discovery and interpretation; they do not guarantee rankings.

## Domain cutover

The confirmed production domain is `afin-consulting.com`. It is attached to the
Vercel project, but its DNS still points to Squarespace. Vercel currently requests
an apex A record (`@`) of `76.76.21.21`; recheck the project’s Domains settings
before changing DNS. Replace the existing apex website A records only when ready
to move the site. Preserve mail-related MX and TXT records. Inventory existing
Squarespace URLs and add relevant redirects before cutover; its public sitemap
currently returns HTTP 401, so the old URL inventory has not been verified.
Canonical URLs remain on the live Vercel hostname until the new domain works.

## Launch checklist

1. Connect the chosen custom domain in Vercel, verify HTTPS, then update `siteUrl`
   in `src/site/metadata.ts` and the canonical Link headers in `vercel.json` together.
   Redirect the old production hostname to the chosen domain. Update public
   profile links and documentation after verifying the new site.
2. Verify ownership in [Google Search Console](https://search.google.com/search-console/).
   Submit `/sitemap.xml` and inspect the homepage, services, About Matt, and tools.
   Review indexing, search queries, impressions, and clicks as data becomes available.
3. Put the verified website URL on Matt’s LinkedIn and Afin’s Instagram profiles.
4. Have Matt review service descriptions, calculator assumptions, and his profile.
   Add qualifications, service area, and delivery options only after confirmation.
5. Build useful, original guides around real client questions. Include practical
   examples, Matt’s review, relevant sources, and links to the matching calculator
   and coaching service. Avoid pages made only to repeat search keywords.

## Next content opportunity

Eight dedicated calculator pages now include worked examples, assumptions, input
checklists, and common questions. Extend these guides using actual Search Console
queries and client questions, with Matt reviewing any new financial guidance.

## Verification

CI checks unique metadata, structured-data relationships, calculator discovery,
canonical redirects, Markdown canonical headers, mobile accessibility, and 404s.
Use Google’s [Rich Results Test](https://search.google.com/test/rich-results)
and Search Console URL Inspection after production changes. Search Console
verification, sitemap submission, and profile edits require the owner’s accounts;
these steps have not been performed by this repository’s build.

References: [Google’s SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide),
[canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls),
and [organization data](https://developers.google.com/search/docs/appearance/structured-data/organization).
