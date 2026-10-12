import { test, expect } from "bun:test";
import {
  validateDocument,
  safeFilename,
  maxDocumentBytes,
} from "../src/documents/files";
test("documents validate content, extensions, empty files and size", async () => {
  expect(
    await validateDocument(new File(["%PDF-1.7\nfixture"], "contract.pdf")),
  ).toBe("application/pdf");
  await expect(
    validateDocument(new File(["<script>"], "contract.pdf")),
  ).rejects.toThrow("contents");
  await expect(
    validateDocument(new File(["text"], "contract.html")),
  ).rejects.toThrow("Choose a PDF");
  await expect(validateDocument(new File([], "empty.pdf"))).rejects.toThrow(
    "empty",
  );
  await expect(
    validateDocument(
      new File([new Uint8Array(maxDocumentBytes + 1)], "large.pdf"),
    ),
  ).rejects.toThrow("20 MB");
  expect(safeFilename("../../signed é-contract.pdf")).not.toContain("/");
  expect(safeFilename("signed é-contract.pdf")).toBe("signed e-contract.pdf");
});
