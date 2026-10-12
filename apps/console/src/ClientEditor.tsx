import { useEffect, useRef, useState } from "react";
import { X, Save, Plus, Trash2, ClipboardList } from "lucide-react";
import {
  stages,
  stageLabels,
  transition,
  type Client,
  type Goal,
} from "./model";
import { loadHistory } from "./store";
import { ClientDocuments } from "./documents/ClientDocuments";
export function ClientEditor({
  client,
  existing,
  demo,
  save,
  close,
}: {
  client: Client;
  existing: boolean;
  demo: boolean;
  save: (client: Client) => Promise<void>;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(client);
  const [busy, setBusy] = useState(false);
  const [documentBusy, setDocumentBusy] = useState(false);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [history, setHistory] = useState<
    Awaited<ReturnType<typeof loadHistory>>
  >({ inquiries: [], events: [] });
  const [confirmClose, setConfirmClose] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(client);
  useEffect(() => {
    dialog.current?.showModal();
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let cancelled = false;
    if (existing && !demo)
      loadHistory(client.id)
        .then((value) => {
          if (!cancelled) setHistory(value);
        })
        .catch((e) => {
          if (!cancelled) setHistoryError(e.message);
        });
    return () => {
      cancelled = true;
      document.body.style.overflow = original;
    };
  }, [client.id, existing, demo]);
  useEffect(() => {
    const prevent = (e: BeforeUnloadEvent) => {
      if (dirty || documentBusy) e.preventDefault();
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty, documentBusy]);
  const patch = (values: Partial<Client>) =>
    setDraft((value) => ({ ...value, ...values }));
  function requestClose() {
    if (busy || documentBusy) return;
    if (dirty) setConfirmClose(true);
    else close();
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (documentBusy) return;
    if (
      draft.status === "archived" &&
      client.status !== "archived" &&
      !confirmArchive
    ) {
      setConfirmArchive(true);
      return;
    }
    setBusy(true);
    setError("");
    try {
      await save({
        ...draft,
        name: draft.name.trim(),
        email: draft.email.trim().toLowerCase(),
      });
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save. Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      className="editor"
      aria-labelledby="editor-title"
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
    >
      <form onSubmit={submit}>
        <header className="editor-heading">
          <div>
            <p className="eyebrow">
              {existing ? "CLIENT RECORD" : "A NEW CONNECTION"}
            </p>
            <h2 id="editor-title">{existing ? client.name : "Add a client"}</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close client record"
            onClick={requestClose}
          >
            <X />
          </button>
        </header>
        <div className="editor-body">
          <fieldset disabled={busy}>
            <legend>Contact & relationship</legend>
            <div className="form-grid">
              <label>
                Name
                <input
                  value={draft.name}
                  maxLength={200}
                  required
                  onChange={(e) => patch({ name: e.target.value })}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={draft.email}
                  maxLength={320}
                  required
                  onChange={(e) => patch({ email: e.target.value })}
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => patch({ phone: e.target.value })}
                />
              </label>
              <label>
                Stage
                <select
                  aria-label="Stage"
                  value={draft.status}
                  onChange={(e) => {
                    setDraft(
                      transition(draft, e.target.value as Client["status"]),
                    );
                    setConfirmArchive(false);
                  }}
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stageLabels[stage]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="full">
                Top priority
                <input
                  value={draft.priority}
                  onChange={(e) => patch({ priority: e.target.value })}
                />
              </label>
              <label>
                Next follow-up
                <input
                  type="date"
                  value={draft.next_contact || ""}
                  onChange={(e) =>
                    patch({ next_contact: e.target.value || null })
                  }
                />
              </label>
              <label>
                Source
                <input
                  disabled
                  value={
                    draft.source === "website"
                      ? "Website intake"
                      : "Manually added"
                  }
                />
              </label>
            </div>
          </fieldset>
          <Checklist
            title="Client goals"
            items={draft.goals}
            disabled={busy}
            change={(goals) => patch({ goals })}
          />
          <Checklist
            title="Onboarding & offboarding"
            items={draft.checklist}
            disabled={busy}
            change={(checklist) => patch({ checklist })}
          />
          <label>
            Coaching notes
            <textarea
              rows={5}
              maxLength={20000}
              value={draft.notes}
              disabled={busy}
              onChange={(e) => patch({ notes: e.target.value })}
            />
            <small>
              Use this for session context and agreed next steps. Avoid account
              passwords or full account numbers.
            </small>
          </label>
          {["offboarding", "archived"].includes(draft.status) && (
            <label>
              Offboarding summary
              <textarea
                rows={3}
                value={draft.offboarding_reason}
                disabled={busy}
                onChange={(e) => patch({ offboarding_reason: e.target.value })}
              />
            </label>
          )}
          <ClientDocuments
            clientId={client.id}
            existing={existing}
            demo={demo}
            disabled={busy}
            onBusyChange={setDocumentBusy}
          />
          {existing && (
            <section>
              <h3>
                <ClipboardList size={18} /> Intake & recent history
              </h3>
              {historyError && (
                <p role="alert" className="error">
                  {historyError}
                </p>
              )}
              {history.inquiries.map((inquiry) => (
                <details key={inquiry.id}>
                  <summary>
                    Website inquiry ·{" "}
                    {new Date(inquiry.received_at).toLocaleDateString()}
                  </summary>
                  <dl>
                    {Object.entries(inquiry.details).map(([key, value]) => (
                      <div key={key}>
                        <dt>{key}</dt>
                        <dd>
                          {Array.isArray(value) ? value.join(", ") : value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </details>
              ))}
              {history.events.map((event) => (
                <p className="history-event" key={event.id}>
                  <span>{event.summary}</span>
                  <small>{new Date(event.created_at).toLocaleString()}</small>
                </p>
              ))}
              {!history.events.length &&
                !history.inquiries.length &&
                !historyError && (
                  <p className="muted">
                    Saved changes and website inquiries appear here. The most
                    recent 50 of each are shown.
                  </p>
                )}
            </section>
          )}
        </div>
        <footer className="editor-footer">
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {confirmClose ? (
            <div className="confirm" role="alert">
              <p>Discard your unsaved changes?</p>
              <button
                type="button"
                className="secondary"
                onClick={() => setConfirmClose(false)}
              >
                Keep editing
              </button>
              <button type="button" className="danger" onClick={close}>
                Discard changes
              </button>
            </div>
          ) : (
            <>
              {confirmArchive && (
                <p className="notice">
                  Archiving removes this client from open follow-ups. Their
                  record and history remain available, and you can reopen them
                  later. Save again to confirm.
                </p>
              )}
              <button
                type="button"
                className="secondary"
                onClick={requestClose}
              >
                Cancel
              </button>
              <button className="primary" disabled={busy || documentBusy}>
                <Save size={18} />
                {busy
                  ? "Saving…"
                  : confirmArchive
                    ? "Confirm archive"
                    : "Save client"}
              </button>
            </>
          )}
        </footer>
      </form>
    </dialog>
  );
}
function Checklist({
  title,
  items,
  disabled,
  change,
}: {
  title: string;
  items: Goal[];
  disabled: boolean;
  change: (items: Goal[]) => void;
}) {
  const [titleValue, setTitleValue] = useState("");
  function add() {
    if (!titleValue.trim()) return;
    change([
      ...items,
      { id: crypto.randomUUID(), title: titleValue.trim(), done: false },
    ]);
    setTitleValue("");
  }
  return (
    <fieldset disabled={disabled}>
      <legend>{title}</legend>
      {items.map((item) => (
        <div className="check-row" key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.done}
              onChange={() =>
                change(
                  items.map((goal) =>
                    goal.id === item.id ? { ...goal, done: !goal.done } : goal,
                  ),
                )
              }
            />
            <span>{item.title}</span>
          </label>
          <button
            type="button"
            className="icon-button"
            aria-label={`Remove ${item.title}`}
            onClick={() => change(items.filter((goal) => goal.id !== item.id))}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <div className="add-row">
        <input
          aria-label={`Add to ${title}`}
          placeholder="Add a practical next step"
          value={titleValue}
          maxLength={200}
          onChange={(e) => setTitleValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          className="secondary"
          onClick={add}
          disabled={!titleValue.trim()}
        >
          <Plus size={18} />
          Add
        </button>
      </div>
    </fieldset>
  );
}
