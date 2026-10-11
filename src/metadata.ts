import { email, linkedin } from "./identity";
export const siteUrl = "https://adamou-financial-consulting.vercel.app";
export const descriptions: Record<string, string> = {
  "": "Personal financial coaching with Matt Adamou. Build a budget, make a debt payoff plan, and move toward your goals.",
  services:
    "Explore Afin’s personalized budgeting, debt payoff planning, and financial goal coaching for individuals, couples, and small businesses.",
  about:
    "Meet Matt Adamou, the financial coach behind Adamou Financial Consulting.",
  approach:
    "Learn how Afin coaching starts: share your goals, connect with Matt, and agree on the next steps.",
  contact:
    "Introduce yourself to Matt Adamou. Share your financial goals, priorities, and preferred way to connect.",
  tools:
    "Free financial calculators from Afin: monthly budgets, emergency funds, savings goals, debt payoff, and net worth. Your numbers stay in your browser.",
  brand:
    "Download Afin’s standalone mountain SVG logo and explore the brand’s colors, typography, and voice.",
  privacy: "How Afin handles inquiry information and Vercel Web Analytics.",
};
export function metadata(title: string, path: string) {
  if (path === "404") return '<meta name="robots" content="noindex">';
  const url = `${siteUrl}/${path ? `${path}/` : ""}`;
  const description = descriptions[path] || descriptions[""];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Adamou Financial Consulting",
        alternateName: "Afin",
        description: descriptions[""],
        contactPoint: {
          "@type": "ContactPoint",
          email,
          telephone: "+1-203-770-6522",
          contactType: "client inquiries",
        },
        url: siteUrl,
        logo: `${siteUrl}/assets/afin-mark.svg`,
        email,
        telephone: "+1-203-770-6522",
        sameAs: ["https://www.instagram.com/adamoufinancial.consulting/"],
        founder: {
          "@type": "Person",
          name: "Matt Adamou",
          jobTitle: "Financial Coach",
          image: `${siteUrl}/assets/matt-adamou.jpg`,
          sameAs: [linkedin],
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Financial coaching",
          itemListElement: [
            "Personalized budgeting",
            "Debt payoff planning",
            "Financial goal coaching",
          ].map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Afin",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type":
          path === "contact"
            ? "ContactPage"
            : path === "about"
              ? "AboutPage"
              : "WebPage",
        url,
        name: title,
        description,
        inLanguage: "en",
        isPartOf: { "@id": `${siteUrl}/#website` },
      },
    ],
  };
  return `<meta name="description" content="${description}"><meta name="is-agentic-site-type" content="business"><link rel="canonical" href="${url}"><link rel="alternate" type="text/markdown" href="${siteUrl}/content/${path || "home"}.md" title="Read as Markdown"><meta property="og:type" content="website"><meta property="og:site_name" content="Afin — Adamou Financial Consulting"><meta property="og:title" content="${title} | Afin"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${siteUrl}/assets/afin-social.png"><meta property="og:image:alt" content="Afin — Adamou Financial Consulting. Less money stress. More possibility."><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/png"><meta name="twitter:image" content="${siteUrl}/assets/afin-social.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;
}
