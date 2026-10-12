import { chromium } from "@playwright/test";
const mark = (
  await Bun.file("apps/site/public/assets/afin-mark.svg").text()
).replace("<svg ", '<svg x="64" y="48" width="92" height="40" ');
const photograph = Buffer.from(
  await Bun.file("apps/site/public/assets/mountain-path.jpg").arrayBuffer(),
).toString("base64");
const workspace = process.argv.includes("--workspace");
const output = workspace
  ? "apps/console/public/afin-workspace-social"
  : "apps/site/public/assets/afin-social";
const copy = workspace
  ? {
      eyebrow: "PRIVATE CLIENT WORKSPACE",
      headline: "Every client.",
      emphasis: "Clear next steps.",
      description: "Relationships and progress, in one place.",
      first: "Clients",
      second: "Meetings",
      third: "Documents",
      caption: "A clearer working day.",
      domain: "afin-workspace.vercel.app",
    }
  : {
      eyebrow: "PERSONAL FINANCIAL COACHING",
      headline: "Less money stress.",
      emphasis: "More possibility.",
      description: "A clearer plan. A coach in your corner.",
      first: "Budgeting",
      second: "Debt payoff",
      third: "Financial goals",
      caption: "Your path. Your pace.",
      domain: "afin-consulting.com",
    };
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.45" stop-color="#173d4b" stop-opacity="0"/><stop offset="1" stop-color="#173d4b" stop-opacity="0.9"/></linearGradient><clipPath id="landscape"><path d="M800 0H1200V630H722Z"/></clipPath></defs>
<rect width="1200" height="630" fill="#f7f4eb"/>
<g clip-path="url(#landscape)"><image x="690" y="0" width="510" height="630" preserveAspectRatio="xMidYMid slice" href="data:image/jpeg;base64,${photograph}"/><rect x="690" width="510" height="630" fill="url(#shade)"/></g>
<path d="M782 0 704 630" fill="none" stroke="#78978e" stroke-width="2"/>
${mark}<text x="180" y="64" fill="#173d4b" font-family="Georgia,serif" font-size="22">Adamou Financial</text><text x="180" y="92" fill="#173d4b" font-family="Georgia,serif" font-size="22">Consulting</text>
<text x="64" y="196" fill="#204f60" font-family="Arial,sans-serif" font-size="15" font-weight="bold" letter-spacing="2.5">${copy.eyebrow}</text>
<text x="60" y="289" fill="#204f60" font-family="Georgia,serif" font-size="72" letter-spacing="-2">${copy.headline}</text>
<text x="60" y="378" fill="#678579" font-family="Georgia,serif" font-size="76" font-style="italic" letter-spacing="-2">${copy.emphasis}</text>
<text x="64" y="438" fill="#566b70" font-family="Arial,sans-serif" font-size="23">${copy.description}</text>
<path d="M64 508H646" stroke="#cdd5ca"/>
<g fill="#204f60" font-family="Arial,sans-serif" font-size="16"><text x="64" y="550">${copy.first}</text><text x="206" y="550">${copy.second}</text><text x="362" y="550">${copy.third}</text></g><g fill="#78978e"><circle cx="178" cy="544" r="3"/><circle cx="334" cy="544" r="3"/></g>
<text x="800" y="523" fill="#f7f4eb" font-family="Georgia,serif" font-size="30">${copy.caption}</text><text x="802" y="563" fill="#f7f4eb" font-family="Arial,sans-serif" font-size="18">${copy.domain}</text>
</svg>`;
await Bun.write(`${output}.svg`, svg);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<style>body{margin:0}</style>${svg}`);
  await page.screenshot({ path: `${output}.png` });
} finally {
  await browser.close();
}
