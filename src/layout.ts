import { searchMarkup, mobileMarkup } from "./navigation";
import { uiIcon } from "./identity";
import {
  email,
  linkedin,
  linkedIcon,
  instagram,
  instagramIcon,
} from "./identity";
import { metadata } from "./metadata";
export function layout(title: string, content: string, active = "") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${metadata(title, active)}<meta name="theme-color" content="#204f60"><title>${title} | Afin</title><link rel="icon" href="/assets/afin-favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"></head><body>
  <a class="skip" href="#main">Skip to content</a>
  <div class="header-space"><header class="site-header"><div class="wrap header-inner">
    <a class="logo" href="/" aria-label="Afin home"><img src="/assets/afin-mark.svg" width="76" height="38" alt="Afin mountain mark"><span class="logo-name">Adamou Financial Consulting</span></a>
    <nav class="desktop-nav" aria-label="Main navigation"><a href="/services/" ${active === "services" ? 'aria-current="page"' : ""}>Services</a><a href="/about/" ${active === "about" ? 'aria-current="page"' : ""}>About Matt</a><a href="/approach/" ${active === "approach" ? 'aria-current="page"' : ""}>Our approach</a><a href="/tools/" ${active === "tools" ? 'aria-current="page"' : ""}>Tools</a></nav>
    <button class="search-trigger" type="button" data-search hidden aria-haspopup="dialog" aria-controls="site-search" aria-label="Search">${uiIcon("search")}<span>Search</span><kbd>⌘K</kbd></button>
    <a class="button nav-cta" href="/contact/">Contact Matt</a>
    <button class="mobile-menu-trigger" type="button" hidden aria-label="Open navigation menu" aria-haspopup="dialog" aria-controls="mobile-navigation">${uiIcon("menu")}</button>
  </div></header></div>${mobileMarkup(active)}${searchMarkup}
  <main id="main">${content}</main><footer class="site-footer"><div class="wrap">
  <div class="footer-grid"><div class="footer-brand"><a href="/" aria-label="Afin home"><img src="/assets/afin-mark.svg" width="80" height="40" alt="Afin mountain mark"></a><p class="footer-name">Adamou Financial<br> Consulting</p><p>Personal guidance.<br> A clearer path forward.</p><div class="social-links"><a href="${linkedin}" aria-label="Matt Adamou on LinkedIn">${linkedIcon}</a><a href="${instagram}" aria-label="Afin on Instagram">${instagramIcon}</a></div></div>
  <nav aria-label="Footer services"><h2>HOW WE HELP</h2><a href="/contact/?goal=budget">Budgeting</a><a href="/contact/?goal=debt">Debt payoff planning</a><a href="/contact/?goal=goals">Financial goals</a><a href="/services/">Small-business support</a></nav>
  <nav aria-label="Footer company"><h2>EXPLORE AFIN</h2><a href="/about/">Meet Matt</a><a href="/approach/" ${active === "approach" ? 'aria-current="page"' : ""}>Our approach</a><a href="/tools/" ${active === "tools" ? 'aria-current="page"' : ""}>Tools</a><a href="/brand/">Brand resources</a><a href="/contact/">Client intake</a></nav>
  <div class="footer-contact"><h2>LET’S CONNECT</h2><a class="icon-link" href="mailto:${email}">${uiIcon("contact")}${email}</a><a class="icon-link" href="tel:+12037706522">${uiIcon("phone")}(203) 770-6522</a><p>A question, a goal, or a fresh start.<br> There’s a good place to begin.</p><a class="footer-cta" href="/contact/">Start a conversation</a></div></div>
  <div class="footer-bottom"><button type="button" id="back-to-top">Back to top</button><span>© ${new Date().getFullYear()} Adamou Financial Consulting. All rights reserved.</span><a href="/privacy/">Privacy</a><a href="https://unsplash.com/photos/winding-path-through-a-green-mountain-valley-MIfIDLi_PIE">Photography by Valentin / Unsplash</a></div>
  </div></footer><script type="module" src="/app.js"></script></body></html>`;
}
