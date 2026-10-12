import { useEffect, useRef, useState } from "react";
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
} from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { ChevronLeft, ChevronRight } from "lucide-react";
GlobalWorkerOptions.workerSrc = workerUrl;
export default function PdfPreview({ blob }: { blob: Blob }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [width, setWidth] = useState(600);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [rendering, setRendering] = useState(true);
  useEffect(() => {
    let cancelled = false;
    let task: ReturnType<typeof getDocument> | undefined;
    blob
      .arrayBuffer()
      .then((data) => {
        if (cancelled) return;
        task = getDocument({
          data: new Uint8Array(data),
          cMapUrl: "/pdfjs/cmaps/",
          cMapPacked: true,
          standardFontDataUrl: "/pdfjs/standard_fonts/",
          wasmUrl: "/pdfjs/wasm/",
        });
        return task.promise.then((document) => {
          if (!cancelled) setPdf(document);
        });
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "This PDF cannot be previewed. It may be password-protected or damaged. You can still download the original.",
          );
      });
    return () => {
      cancelled = true;
      void task?.destroy();
    };
  }, [blob]);
  useEffect(() => {
    const observer = new ResizeObserver((entries) =>
      setWidth(Math.max(100, entries[0].contentRect.width - 24)),
    );
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!pdf) return;
    let cancelled = false;
    let task:
      | ReturnType<Awaited<ReturnType<PDFDocumentProxy["getPage"]>>["render"]>
      | undefined;
    setRendering(true);
    setText("");
    pdf
      .getPage(page)
      .then(async (document) => {
        if (cancelled || !canvas.current) return;
        const base = document.getViewport({ scale: 1 });
        const viewport = document.getViewport({
          scale: Math.min(
            width / base.width,
            1600 / Math.max(base.width, base.height),
          ),
        });
        const ratio = Math.min(devicePixelRatio || 1, 2);
        const element = canvas.current;
        element.width = Math.floor(viewport.width * ratio);
        element.height = Math.floor(viewport.height * ratio);
        element.style.width = `${viewport.width}px`;
        element.style.height = `${viewport.height}px`;
        task = document.render({
          canvas: element,
          viewport,
          transform: [ratio, 0, 0, ratio, 0, 0],
        });
        await task.promise;
        const content = await document.getTextContent();
        if (!cancelled) {
          setText(
            content.items
              .map((item) => ("str" in item ? item.str : ""))
              .join(" "),
          );
          setRendering(false);
        }
      })
      .catch((e) => {
        if (!cancelled && e.name !== "RenderingCancelledException") {
          setError(
            "This page could not be rendered. Download the original to view it.",
          );
          setRendering(false);
        }
      });
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [pdf, page, width]);
  return (
    <div ref={container} className="pdf-viewer">
      {error ? (
        <p role="alert" className="error">
          {error}
        </p>
      ) : (
        <>
          <div className="pdf-controls">
            <button
              type="button"
              className="icon-button"
              aria-label="Previous page"
              disabled={!pdf || page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              <ChevronLeft />
            </button>
            <span aria-live="polite">
              {pdf ? `Page ${page} of ${pdf.numPages}` : "Opening PDF…"}
            </span>
            <button
              type="button"
              className="icon-button"
              aria-label="Next page"
              disabled={!pdf || page === pdf.numPages}
              onClick={() => setPage((value) => value + 1)}
            >
              <ChevronRight />
            </button>
          </div>
          {rendering && <p role="status">Rendering page…</p>}
          <canvas ref={canvas} aria-label={`Document page ${page}`} />
          {!rendering && (
            <details>
              <summary>Page text</summary>
              <p className="pdf-text">
                {text ||
                  "This page is a scan without selectable text. Download the original for your preferred document reader."}
              </p>
            </details>
          )}
        </>
      )}
    </div>
  );
}
