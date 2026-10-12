import { useEffect, useRef, useState } from "react";
import { CalendarDays, Save, Trash2, X } from "lucide-react";
import type { Client } from "../model";
import { localInput, meetingStatuses, parseLocal, type Meeting } from "./model";
export function MeetingEditor({
  meeting,
  meetings,
  clients,
  existing,
  save,
  remove,
  close,
}: {
  meeting: Meeting;
  meetings: Meeting[];
  clients: Client[];
  existing: boolean;
  save: (meeting: Meeting) => Promise<void>;
  remove: (meeting: Meeting) => Promise<void>;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(meeting);
  const [start, setStart] = useState(localInput(meeting.starts_at));
  const [end, setEnd] = useState(localInput(meeting.ends_at));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<"discard" | "delete" | null>(null);
  const dirty =
    JSON.stringify(draft) !== JSON.stringify(meeting) ||
    start !== localInput(meeting.starts_at) ||
    end !== localInput(meeting.ends_at);
  const conflict = meetings.some(
    (item) =>
      item.id !== draft.id &&
      ["tentative", "confirmed"].includes(item.status) &&
      ["tentative", "confirmed"].includes(draft.status) &&
      new Date(item.starts_at) < new Date(end) &&
      new Date(item.ends_at) > new Date(start),
  );
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    ref.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  useEffect(() => {
    if (!dirty && !busy) return;
    const protect = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", protect);
    return () => window.removeEventListener("beforeunload", protect);
  }, [dirty, busy]);
  function requestClose() {
    if (!busy) dirty ? setConfirm("discard") : close();
  }
  async function submit() {
    setError("");
    try {
      const starts_at = parseLocal(start),
        ends_at = parseLocal(end);
      if (ends_at <= starts_at)
        throw new Error("The end must be after the start.");
      if (!draft.title.trim() || !draft.client_id)
        throw new Error("Choose a client and enter a meeting title.");
      setBusy(true);
      await save({ ...draft, title: draft.title.trim(), starts_at, ends_at });
      close();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function deleteRecord() {
    setBusy(true);
    setError("");
    try {
      await remove(meeting);
      close();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <dialog
      className="meeting-editor"
      ref={ref}
      aria-labelledby="meeting-title"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <header>
          <div>
            <p className="eyebrow">
              <CalendarDays size={17} /> MAKE TIME FOR PROGRESS
            </p>
            <h2 id="meeting-title">
              {existing ? "Edit meeting" : "New meeting"}
            </h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close meeting"
            onClick={requestClose}
            disabled={busy}
          >
            <X />
          </button>
        </header>
        <fieldset disabled={busy} className="meeting-fields">
          <label>
            Client
            <select
              aria-label="Client"
              required
              value={draft.client_id}
              onChange={(event) =>
                setDraft({ ...draft, client_id: event.target.value })
              }
            >
              <option value="">Choose a client</option>
              {clients
                .filter(
                  (client) =>
                    client.status !== "archived" ||
                    client.id === draft.client_id,
                )
                .map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Meeting title
            <input
              required
              maxLength={200}
              value={draft.title}
              onChange={(event) =>
                setDraft({ ...draft, title: event.target.value })
              }
            />
          </label>
          <div className="meeting-dates">
            <label>
              Starts
              <input
                required
                type="datetime-local"
                value={start}
                onChange={(event) => setStart(event.target.value)}
              />
            </label>
            <label>
              Ends
              <input
                required
                type="datetime-local"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
              />
            </label>
          </div>
          <p className="muted">
            Times are in {zone}. Calendar apps display the exported time in
            their own time zone.
          </p>
          <label>
            Status
            <select
              aria-label="Status"
              value={draft.status}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  status: event.target.value as Meeting["status"],
                })
              }
            >
              {meetingStatuses.map((status) => (
                <option key={status} value={status}>
                  {status[0].toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Location or meeting link
            <input
              maxLength={500}
              value={draft.location}
              onChange={(event) =>
                setDraft({ ...draft, location: event.target.value })
              }
              placeholder="Phone, office, or video call link"
            />
          </label>
          <p className="muted">
            Tentative meetings are possibilities, not confirmed appointments.
            Saving does not send an invitation.
          </p>
          {conflict && (
            <p className="calendar-warning" role="status">
              This overlaps another tentative or confirmed meeting. You can
              still save it.
            </p>
          )}
        </fieldset>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {confirm && (
          <div className="calendar-confirm" role="alert">
            <p>
              {confirm === "discard"
                ? "Discard your unsaved meeting changes?"
                : "Permanently remove this meeting? Mark it cancelled instead if you want to keep its history."}
            </p>
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={() => setConfirm(null)}
            >
              Keep editing
            </button>
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={() =>
                confirm === "discard" ? close() : void deleteRecord()
              }
            >
              {confirm === "discard" ? "Discard changes" : "Confirm removal"}
            </button>
          </div>
        )}
        <footer>
          {existing && (
            <button
              type="button"
              className="quiet"
              disabled={busy}
              onClick={() => setConfirm("delete")}
            >
              <Trash2 size={17} /> Remove
            </button>
          )}
          <button
            type="button"
            className="secondary"
            disabled={busy}
            onClick={requestClose}
          >
            Cancel
          </button>
          <button className="primary" disabled={busy}>
            <Save size={17} />
            {busy ? "Saving…" : "Save meeting"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
