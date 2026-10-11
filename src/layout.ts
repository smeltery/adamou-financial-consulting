export const email = "madamou@afin-consulting.com";
export const linkedin =
  "https://www.linkedin.com/in/matt-adamou-p-e-9b7059111/";
export const linkedIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.45 2H3.55A1.55 1.55 0 0 0 2 3.55v16.9A1.55 1.55 0 0 0 3.55 22h16.9A1.55 1.55 0 0 0 22 20.45V3.55A1.55 1.55 0 0 0 20.45 2ZM8 19H5V9h3ZM6.5 7.7A1.75 1.75 0 1 1 6.5 4a1.75 1.75 0 0 1 0 3.7ZM19 19h-3v-5c0-1.4-.6-2-1.5-2S13 12.6 13 14v5h-3V9h3v1.4A3.4 3.4 0 0 1 16 9c2 0 3 1.3 3 4Z"/></svg>';
export function layout(title: string, content: string, active = "") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Personal financial coaching with Matt Adamou. Build a budget, make a debt payoff plan, and move toward your goals."><meta name="theme-color" content="#204f60"><title>${title} | Afin</title><link rel="icon" href="/assets/afin-mark.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"></head><body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header"><div class="wrap header-inner">
    <a class="logo" href="/" aria-label="Afin home"><img src="/assets/afin-mark.svg" width="76" height="38" alt="Afin mountain mark"></a>
    <nav class="desktop-nav" aria-label="Main navigation"><a href="/#services">Services</a><a href="/#about">About Matt</a><a href="/#process">Our approach</a><a href="/brand/" ${active === "brand" ? 'aria-current="page"' : ""}>Brand</a></nav>
    <a class="button nav-cta" href="/contact/">Contact Matt</a>
    <details class="mobile-menu"><summary aria-label="Open navigation menu"><span></span><span></span><span></span></summary><nav aria-label="Mobile navigation"><a href="/#services">Services</a><a href="/#about">About Matt</a><a href="/#process">Our approach</a><a href="/brand/">Brand resources</a><a href="/contact/">Start a conversation</a></nav></details>
  </div></header>
  <main id="main">${content}</main><footer class="site-footer"><div class="wrap">
  <div class="footer-grid"><div class="footer-brand"><a href="/" aria-label="Afin home"><img src="/assets/afin-mark.svg" width="80" height="40" alt="Afin mountain mark"></a><p class="footer-name">Adamou Financial<br>Consulting</p><p>Personal guidance.<br>A clearer path forward.</p><div class="social-links"><a href="${linkedin}" aria-label="Matt Adamou on LinkedIn">${linkedIcon}</a><a href="https://www.instagram.com/adamoufinancial.consulting/" aria-label="Afin on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a></div></div>
  <nav aria-label="Footer services"><h2>HOW WE HELP</h2><a href="/contact/?goal=budget">Budgeting</a><a href="/contact/?goal=debt">Debt payoff planning</a><a href="/contact/?goal=goals">Financial goals</a><a href="/#services">Small-business support</a></nav>
  <nav aria-label="Footer company"><h2>EXPLORE AFIN</h2><a href="/#about">Meet Matt</a><a href="/#process">Our approach</a><a href="/brand/">Brand resources</a><a href="/contact/">Client intake</a></nav>
  <div class="footer-contact"><h2>LET’S CONNECT</h2><a href="mailto:${email}">${email}</a><a href="tel:+12037706522">(203) 770-6522</a><p>A question, a goal, or a fresh start.<br>There’s a good place to begin.</p><a class="footer-cta" href="/contact/">Start a conversation</a></div></div>
  <div class="footer-bottom"><span>© ${new Date().getFullYear()} Adamou Financial Consulting. All rights reserved.</span><a href="/privacy/">Privacy</a><a href="https://unsplash.com/photos/winding-path-through-a-green-mountain-valley-MIfIDLi_PIE">Photography by Valentin / Unsplash</a></div>
  </div></footer><script type="module" src="/app.js"></script></body></html>`;
}
