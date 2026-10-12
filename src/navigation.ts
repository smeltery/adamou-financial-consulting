import { calculators } from "./tools/catalog";
import { email, uiIcon } from "./identity";
const pages = [
  ["Home", "/", "A clearer path forward"],
  ["Services", "/services/", "Budgeting, debt, and financial coaching"],
  ["About Matt", "/about/", "Meet your financial coach"],
  ["Our approach", "/approach/", "What working together looks like"],
  ["Financial tools", "/tools/", "Explore your numbers privately"],
  ["Contact Matt", "/contact/", "Start a conversation"],
  ["Brand resources", "/brand/", "Logos, colors, and downloads"],
  ["Privacy", "/privacy/", "How your information is handled"],
];
export const searchMarkup = `<dialog id="site-search" aria-labelledby="search-title"><div class="search-heading"><h2 id="search-title">Find your way</h2><button type="button" data-close aria-label="Close search">${uiIcon("close")}</button></div><label class="search-input" for="search-query">${uiIcon("search")}<span class="sr-only">Search pages and tools</span><input id="search-query" type="search" placeholder="Search Afin…" autocomplete="off"></label><div class="search-filters" aria-label="Filter search">${["All", "Pages", "Tools", "Contact"].map((name) => `<button type="button" data-scope="${name.toLowerCase()}" aria-pressed="${name === "All"}">${name}</button>`).join("")}</div><div class="search-scroll"><nav class="search-results" aria-label="Search results">${[
  ["Pages", pages],
  [
    "Tools",
    calculators.map((tool) => [
      tool.title,
      `/tools/#tool-${tool.id}`,
      tool.question,
    ]),
  ],
  [
    "Contact",
    [
      ["Email Matt", `mailto:${email}`, email],
      ["Call Matt", "tel:+12037706522", "(203) 770-6522"],
    ],
  ],
]
  .map(
    ([group, entries]) =>
      `<section data-group="${String(group).toLowerCase()}"><h3>${group}</h3>${(entries as string[][]).map(([title, href, description]) => `<a href="${href}" aria-label="${title}">${uiIcon(group === "Tools" ? "tools" : group === "Contact" ? "contact" : "page")}<span><strong>${title}</strong><small>${description}</small></span>${uiIcon("chevron")}</a>`).join("")}</section>`,
  )
  .join(
    "",
  )}</nav><p class="search-empty" hidden>No matches. Try budgeting, savings, or contact.</p></div><div class="search-footer"><p role="status" aria-live="polite"></p><span><kbd>↑</kbd><kbd>↓</kbd> Navigate · <kbd>↵</kbd> Open · <kbd>Esc</kbd> Close</span></div></dialog>`;
export function mobileMarkup(active: string) {
  return `<dialog id="mobile-navigation" aria-labelledby="mobile-title"><div class="search-heading"><h2 id="mobile-title">Explore Afin</h2><button type="button" data-close aria-label="Close navigation menu">${uiIcon("close")}</button></div><p class="mobile-intro">Personal guidance. A clearer path.</p><nav aria-label="Mobile navigation">${pages
    .filter(([, href]) => !["/contact/", "/privacy/"].includes(href))
    .map(
      ([title, href, description]) =>
        `<a href="${href}" aria-label="${title === "Financial tools" ? "Tools" : title}" ${href === `/${active}/` || (href === "/" && !active) ? 'aria-current="page"' : ""}>${uiIcon(href === "/tools/" ? "tools" : href === "/" ? "home" : href === "/about/" ? "person" : href === "/approach/" ? "compass" : href === "/services/" ? "briefcase" : "page")}<span><strong>${title}</strong><small>${description}</small></span>${uiIcon("chevron")}</a>`,
    )
    .join(
      "",
    )}</nav><div class="mobile-contact"><p>Ready for your next step?</p><a class="button" href="/contact/">Start a conversation</a><a href="mailto:${email}">${email}</a></div><a class="mobile-privacy" href="/privacy/">Privacy</a></dialog>`;
}
