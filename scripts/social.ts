import { chromium } from "@playwright/test";
const mark = (await Bun.file("public/assets/afin-mark.svg").text()).replace(
  "<svg ",
  '<svg x="72" y="52" width="92" height="40" ',
);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f7f4eb"/><rect x="862" width="338" height="630" fill="#204f60"/>${mark}<text x="72" y="126" fill="#111" font-family="Georgia,serif" font-size="26">Adamou Financial Consulting</text><path d="M72 169H790" stroke="#d9ded5"/><text x="69" y="292" fill="#204f60" font-family="Georgia,serif" font-size="75" letter-spacing="-2">Less money stress.</text><text x="69" y="384" fill="#678579" font-family="Georgia,serif" font-size="75" font-style="italic" letter-spacing="-2">More possibility.</text><text x="72" y="457" fill="#566b70" font-family="Arial,sans-serif" font-size="23">Personal financial coaching with Matt Adamou.</text><text x="72" y="560" fill="#204f60" font-family="Arial,sans-serif" font-size="17" letter-spacing="2">BUDGETING · DEBT PAYOFF · FINANCIAL GOALS</text><g transform="translate(880 192) scale(1.55)" fill="none" stroke="#dbe5db" stroke-width="5"><path d="M7 76 83 7 159 76M54 76 87 46 119 76M100 58 133 21 193 76"/></g><text x="910" y="398" fill="#f7f4eb" font-family="Arial,sans-serif" font-size="18" letter-spacing="3">YOUR PATH.</text><text x="910" y="429" fill="#f7f4eb" font-family="Arial,sans-serif" font-size="18" letter-spacing="3">YOUR PACE.</text><path d="M910 474H1145" stroke="#839a9f"/><text x="910" y="550" fill="#f7f4eb" font-family="Georgia,serif" font-size="35">afin</text></svg>`;
await Bun.write("public/assets/afin-social.svg", svg);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<style>body{margin:0}</style>${svg}`);
  await page.screenshot({ path: "public/assets/afin-social.png" });
} finally {
  await browser.close();
}
