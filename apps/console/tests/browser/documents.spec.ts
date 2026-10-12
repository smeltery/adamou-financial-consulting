import { test, expect } from "@playwright/test";
function fixturePdf() {
  const stream = "BT /F1 16 Tf 40 700 Td (Development document preview) Tj ET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R 5 0 R] /Count 2 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 6 0 R >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, i) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${object}\nendobj\n`;
  });
  const start = Buffer.byteLength(pdf);
  pdf += `xref\n0 7\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("")}trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  return Buffer.from(pdf);
}
async function openClient(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore with sample data" }).click();
  await page.getByRole("button", { name: /Alex Morgan New inquiry/ }).click();
}
test("development uploads preview, paginate, download original bytes, and remove only after confirmation", async ({
  page,
}) => {
  await openClient(page);
  const body = fixturePdf();
  await page.getByLabel("Choose client document").setInputFiles({
    name: "signed-contract.pdf",
    mimeType: "application/pdf",
    buffer: body,
  });
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "signed-contract.pdf uploaded." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Preview signed-contract.pdf" })
    .click();
  const preview = page.getByRole("dialog", {
    name: "signed-contract.pdf",
    exact: true,
  });
  await expect(preview.getByText("Page 1 of 2")).toBeVisible();
  await expect(preview.getByRole("status")).toHaveCount(0);
  await preview.getByText("Page text", { exact: true }).click();
  await expect(
    preview.getByText("Development document preview", { exact: true }),
  ).toBeVisible();
  await preview.getByRole("button", { name: "Next page" }).click();
  await expect(preview.getByText("Page 2 of 2")).toBeVisible();
  const downloaded = page.waitForEvent("download");
  await preview.getByRole("button", { name: "Download original" }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe("signed-contract.pdf");
  expect(await Bun.file((await download.path())!).arrayBuffer()).toEqual(
    body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength),
  );
  await page.keyboard.press("Escape");
  await expect(preview).not.toBeVisible();
  await expect(
    page.getByRole("dialog", { name: "Alex Morgan", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Remove signed-contract.pdf" })
    .click();
  await page.getByRole("button", { name: "Keep document" }).click();
  await expect(
    page.getByRole("button", { name: "Preview signed-contract.pdf" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Remove signed-contract.pdf" })
    .click();
  await page.getByRole("button", { name: "Confirm removal" }).click();
  await expect(
    page.getByText("No documents yet.", { exact: false }),
  ).toBeVisible();
});
test("invalid files are rejected and new clients must be saved before upload", async ({
  page,
}) => {
  await openClient(page);
  await page.getByLabel("Choose client document").setInputFiles({
    name: "fake.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("<script>"),
  });
  await expect(page.getByRole("alert")).toContainText("do not match");
  await page.getByRole("button", { name: "Close client record" }).click();
  await page.getByRole("button", { name: "Add client", exact: true }).click();
  await expect(
    page.getByText("Save this client first", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Upload document" }),
  ).toHaveCount(0);
});

test("images preview, Word files download, and files remain when the record reopens", async ({
  page,
}) => {
  await openClient(page);
  const image = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1ioAAAAASUVORK5CYII=",
    "base64",
  );
  await page
    .getByLabel("Choose client document")
    .setInputFiles({ name: "scan.png", mimeType: "image/png", buffer: image });
  await page.getByRole("button", { name: "Preview scan.png" }).click();
  await expect(
    page.getByRole("img", { name: "scan.png", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close document preview" }).click();
  await page.getByRole("button", { name: "Close client record" }).click();
  await page.getByRole("button", { name: /Alex Morgan New inquiry/ }).click();
  await expect(
    page.getByRole("button", { name: "Preview scan.png" }),
  ).toBeVisible();
  await page.getByLabel("Choose client document").setInputFiles({
    name: "agreement.docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    buffer: Buffer.from([80, 75, 3, 4, 0, 0, 0, 0]),
  });
  await page.getByRole("button", { name: "Preview agreement.docx" }).click();
  await expect(
    page.getByText("Download to view this document", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close document preview" }).click();
  await page.getByRole("button", { name: "Close client record" }).click();
  await page.reload();
  await page.getByRole("button", { name: "Explore with sample data" }).click();
  await page.getByRole("button", { name: /Alex Morgan New inquiry/ }).click();
  await expect(
    page.getByText("No documents yet.", { exact: false }),
  ).toBeVisible();
});
