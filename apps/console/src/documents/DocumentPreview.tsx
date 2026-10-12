import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { X, Download, FileText } from "lucide-react";
import type { ClientDocument } from "./files";
const PdfPreview = lazy(() => import("./PdfPreview"));
export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  // Keep the object URL alive until the browser has started the download.
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
export function DocumentPreview({
  record,
  blob,
  close,
}: {
  record: ClientDocument;
  blob: Blob;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [url, setUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    dialog.current?.showModal();
    const source = URL.createObjectURL(blob);
    setUrl(source);
    return () => URL.revokeObjectURL(source);
  }, [blob]);
  return (
    <dialog
      className="document-preview"
      ref={dialog}
      aria-labelledby="document-preview-title"
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        close();
      }}
    >
      <header>
        <div>
          <p className="eyebrow">PRIVATE DOCUMENT</p>
          <h2 id="document-preview-title">{record.name}</h2>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="Close document preview"
          onClick={close}
        >
          <X />
        </button>
      </header>
      <div className="document-preview-body">
        {record.type === "application/pdf" ? (
          <Suspense fallback={<p role="status">Loading PDF preview…</p>}>
            <PdfPreview blob={blob} />
          </Suspense>
        ) : record.type.startsWith("image/") && !imageError ? (
          <img
            src={url || undefined}
            alt={record.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="empty">
            <FileText size={32} />
            <h3>
              {imageError
                ? "Image preview unavailable"
                : "Download to view this document"}
            </h3>
            <p>
              {imageError
                ? "The original file is still available to download."
                : "Word files open in your preferred document editor. PDF and image files can be previewed here."}
            </p>
          </div>
        )}
      </div>
      <footer>
        <button type="button" className="secondary" onClick={close}>
          Close preview
        </button>
        <button
          type="button"
          className="primary"
          onClick={() => downloadBlob(blob, record.name)}
        >
          <Download size={18} />
          Download original
        </button>
      </footer>
    </dialog>
  );
}
