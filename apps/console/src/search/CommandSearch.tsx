import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Command,
  Search,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import type { Client } from "../model";
import type { Meeting } from "../calendar/model";
export type SearchAction = {
  id: string;
  label: string;
  icon: LucideIcon;
  run: () => void;
};
export function CommandSearch({
  clients,
  meetings,
  actions,
  openClient,
  openMeeting,
  close,
}: {
  clients: Client[];
  meetings: Meeting[];
  actions: SearchAction[];
  openClient: (client: Client) => void;
  openMeeting: (meeting: Meeting) => void;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const all = useMemo(
    () => [
      ...actions.map((action) => ({
        ...action,
        detail: "Workspace action",
        group: "Navigate & create",
        keywords: action.label,
      })),
      ...clients.map((client) => ({
        id: `client-${client.id}`,
        label: client.name,
        detail: `${client.email} · ${client.status}`,
        group: "Clients",
        keywords: `${client.name} ${client.email} ${client.priority}`,
        icon: UserRound,
        run: () => openClient(client),
      })),
      ...meetings.map((meeting) => {
        const name =
          clients.find((client) => client.id === meeting.client_id)?.name ||
          "Client";
        return {
          id: `meeting-${meeting.id}`,
          label: meeting.title,
          detail: `${name} · ${new Date(meeting.starts_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} · ${meeting.status}`,
          group: "Meetings",
          keywords: `${meeting.title} ${name} ${meeting.location} ${meeting.status}`,
          icon: CalendarDays,
          run: () => openMeeting(meeting),
        };
      }),
    ],
    [actions, clients, meetings, openClient, openMeeting],
  );
  const matches = all.filter((item) =>
    query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .every((word) => item.keywords.toLowerCase().includes(word)),
  );
  const results = matches.slice(0, 30);
  const selected = Math.min(active, Math.max(0, results.length - 1));
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    input.current?.focus();
    return () => {
      clearTimeout(timer.current);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  useEffect(() => {
    document
      .getElementById(`workspace-result-${selected}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selected]);
  function dismiss(action?: () => void) {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    timer.current = setTimeout(
      () => {
        close();
        if (action) requestAnimationFrame(action);
      },
      matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 150,
    );
  }
  return (
    <dialog
      ref={dialog}
      className={`command-search ${closing ? "is-closing" : ""}`}
      aria-labelledby="workspace-search-title"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            dismiss();
        }
      }}
    >
      <header>
        <h2 id="workspace-search-title">
          <Command size={20} /> Find your next step
        </h2>
        <button
          className="icon-button"
          aria-label="Close search"
          onClick={() => dismiss()}
        >
          <X size={19} />
        </button>
      </header>
      <div className="command-input">
        <Search size={22} />
        <input
          ref={input}
          aria-label="Search workspace"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="true"
          aria-controls="workspace-results"
          aria-activedescendant={
            results.length ? `workspace-result-${selected}` : undefined
          }
          placeholder="Search clients, meetings, or actions…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (
              (event.metaKey || event.ctrlKey) &&
              event.key.toLowerCase() === "k"
            ) {
              event.preventDefault();
              dismiss();
            }
            if (["ArrowDown", "ArrowUp"].includes(event.key)) {
              event.preventDefault();
              setActive(
                (value) =>
                  (value +
                    (event.key === "ArrowDown" ? 1 : -1) +
                    Math.max(results.length, 1)) %
                  Math.max(results.length, 1),
              );
            }
            if (event.key === "Enter" && results[selected]) {
              event.preventDefault();
              dismiss(results[selected].run);
            }
          }}
        />
      </div>
      <p className="command-count" role="status">
        {matches.length
          ? `${matches.length} results${matches.length > 30 ? " · Showing the first 30; refine your search" : ""}`
          : "No matches. Try a client name, meeting title, or Calendar."}
      </p>
      <div
        id="workspace-results"
        role="listbox"
        aria-label="Workspace results"
        className="command-results"
        key={query}
      >
        {results.map((item, index) => (
          <div key={item.id}>
            {(index === 0 || item.group !== results[index - 1].group) && (
              <p className="command-group" role="presentation">
                {item.group}
              </p>
            )}
            <div
              role="option"
              id={`workspace-result-${index}`}
              aria-selected={index === selected}
              className="command-result"
              onMouseMove={() => setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => dismiss(item.run)}
            >
              <item.icon size={20} />
              <span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </span>
            </div>
          </div>
        ))}
      </div>
      <footer>
        <span>
          <kbd>↑</kbd> <kbd>↓</kbd> Navigate
        </span>
        <span>
          <kbd>↵</kbd> Open
        </span>
        <span>
          <kbd>Esc</kbd> Close
        </span>
      </footer>
    </dialog>
  );
}
