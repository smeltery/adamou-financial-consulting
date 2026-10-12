import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { formatBytes, type ClientDocument } from "./files";
import {
  listDocuments,
  uploadDocument,
  readDocument,
  removeDocument,
} from "./repository";
import { DocumentPreview, downloadBlob } from "./DocumentPreview";
import "./documents.css";
export function ClientDocuments({
  clientId,
  existing,
  demo,
  disabled,
  onBusyChange,
}: {
  clientId: string;
  existing: boolean;
  demo: boolean;
  disabled: boolean;
  onBusyChange: (busy: boolean) => void;
}) {
  const [files, setFiles] = useState<ClientDocument[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [removing, setRemoving] = useState<ClientDocument | null>(null);
  const [preview, setPreview] = useState<{
    record: ClientDocument;
    blob: Blob;
  } | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    onBusyChange(!!busy);
    return () => onBusyChange(false);
  }, [busy, onBusyChange]);
  useEffect(() => {
    if (!existing) return;
    let cancelled = false;
    setBusy("Loading documents…");
    listDocuments(clientId, demo)
      .then((data) => {
        if (!cancelled) setFiles(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setBusy("");
      });
    return () => {
      cancelled = true;
    };
  }, [clientId, existing, demo]);
  async function run(label: string, action: () => Promise<void>) {
    setBusy(label);
    setError("");
    setNotice("");
    try {
      await action();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Document action failed. Please retry.",
      );
    } finally {
      setBusy("");
    }
  }
  const locked = !!busy || disabled;
  return (
    <section className="client-documents" aria-labelledby="documents-title">
      <div className="documents-heading">
        <div>
          <h3 id="documents-title">
            <FileText size={18} />
            Documents
          </h3>
          <p className="muted">
            Signed contracts, agreements, and supporting files.
          </p>
        </div>
        {existing && (
          <button
            type="button"
            className="icon-button"
            aria-label="Refresh documents"
            disabled={locked}
            onClick={() =>
              void run("Refreshing documents…", async () =>
                setFiles(await listDocuments(clientId, demo)),
              )
            }
          >
            <RefreshCw size={18} />
          </button>
        )}
      </div>
      {!existing ? (
        <p className="notice">
          Save this client first, then reopen their record to add documents.
        </p>
      ) : (
        <>
          <div className="document-upload">
            <Upload size={24} />
            <div>
              <strong>Keep the paperwork with the person.</strong>
              <p>PDF, PNG, JPG, WebP, or Word (.docx) · Up to 20 MB per file</p>
              <small>
                {demo
                  ? "Development preview: uploads stay in memory until sign-out or reload."
                  : "Only Matt’s authorized account can upload or retrieve files."}
              </small>
            </div>
            <button
              type="button"
              className="secondary"
              disabled={locked}
              onClick={() => input.current?.click()}
            >
              Upload document
            </button>
            <input
              ref={input}
              type="file"
              aria-label="Choose client document"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.docx"
              hidden
              disabled={locked}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file)
                  void run("Uploading document…", async () => {
                    const added = await uploadDocument(clientId, file, demo);
                    setFiles((items) => [added, ...items]);
                    setNotice(`${added.name} uploaded.`);
                  });
              }}
            />
          </div>
          <p className="document-save-note">
            Documents save immediately, separately from the client’s other
            edits.
          </p>
          {busy && (
            <p role="status" className="document-status">
              {busy}
            </p>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="document-status">
              {notice}
            </p>
          )}
          <ul className="document-list">
            {files.map((record) => (
              <li key={record.path}>
                <FileText size={22} />
                <div className="document-name">
                  <strong>{record.name}</strong>
                  <small>
                    {formatBytes(record.size)} ·{" "}
                    {record.created
                      ? new Date(record.created).toLocaleDateString()
                      : "Date unavailable"}
                  </small>
                </div>
                <div className="document-actions">
                  <button
                    type="button"
                    className="icon-button"
                    disabled={locked}
                    aria-label={`Preview ${record.name}`}
                    onClick={() =>
                      void run("Opening document…", async () =>
                        setPreview({
                          record,
                          blob: await readDocument(record, demo),
                        }),
                      )
                    }
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    disabled={locked}
                    aria-label={`Download ${record.name}`}
                    onClick={() =>
                      void run("Preparing download…", async () =>
                        downloadBlob(
                          await readDocument(record, demo),
                          record.name,
                        ),
                      )
                    }
                  >
                    <Download size={18} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    disabled={locked}
                    aria-label={`Remove ${record.name}`}
                    onClick={() => setRemoving(record)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {removing?.path === record.path && (
                  <div className="document-remove" role="alert">
                    <p>
                      Permanently remove <strong>{record.name}</strong>? This
                      cannot be undone.
                    </p>
                    <button
                      type="button"
                      className="secondary"
                      disabled={locked}
                      onClick={() => setRemoving(null)}
                    >
                      Keep document
                    </button>
                    <button
                      type="button"
                      className="danger"
                      disabled={locked}
                      onClick={() =>
                        void run("Removing document…", async () => {
                          await removeDocument(record, demo);
                          setFiles((items) =>
                            items.filter((item) => item.path !== record.path),
                          );
                          setRemoving(null);
                          setNotice("Document removed.");
                        })
                      }
                    >
                      Confirm removal
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {!busy && !error && !files.length && (
            <p className="documents-empty">
              No documents yet. Upload a signed agreement or supporting file to
              get started.
            </p>
          )}
        </>
      )}
      {preview && (
        <DocumentPreview
          record={preview.record}
          blob={preview.blob}
          close={() => setPreview(null)}
        />
      )}
    </section>
  );
}
