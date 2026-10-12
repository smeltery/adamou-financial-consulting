import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  MapPin,
  Plus,
  RefreshCw,
} from "lucide-react";
import type { Client } from "../model";
import {
  addDays,
  calendarEntries,
  dateKey,
  entriesOnDay,
  newMeeting,
  type CalendarEntry,
  type Meeting,
} from "./model";
import { downloadCalendar } from "./export";
export function Calendar({
  clients,
  meetings,
  error,
  loading,
  refresh,
  edit,
  openClient,
}: {
  clients: Client[];
  meetings: Meeting[];
  error: string;
  loading: boolean;
  refresh: () => void;
  edit: (meeting: Meeting) => void;
  openClient: (client: Client) => void;
}) {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [filter, setFilter] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState("");
  const entries = useMemo(
    () => calendarEntries(clients, meetings),
    [clients, meetings],
  );
  const visible = entries.filter((entry) =>
    filter === "all" ? entry.status !== "cancelled" : entry.status === filter,
  );
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const weekStart = addDays(
    new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    -(date.getDay() + 6) % 7,
  );
  const gridStart = addDays(first, -(first.getDay() + 6) % 7);
  const days =
    view === "month"
      ? Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
      : view === "week"
        ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
        : [date];
  const agendaDays = view === "month" ? [date] : days;
  const period =
    view === "month"
      ? date.toLocaleDateString(undefined, { month: "long", year: "numeric" })
      : view === "week"
        ? `${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${addDays(weekStart, 6).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
        : date.toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric",
          });
  function move(direction: number) {
    setDate(
      view === "month"
        ? new Date(date.getFullYear(), date.getMonth() + direction, 1)
        : addDays(date, direction * (view === "week" ? 7 : 1)),
    );
  }
  function open(entry: CalendarEntry) {
    if (entry.allDay) {
      const client = clients.find((client) => client.id === entry.clientId);
      if (client) openClient(client);
    } else {
      const meeting = meetings.find((meeting) => meeting.id === entry.id);
      if (meeting) edit(meeting);
    }
  }
  const exportEntries = entries.filter((entry) => entry.status !== "cancelled");
  return (
    <section className="calendar panel" aria-label="Calendar">
      <div className="calendar-top">
        <div>
          <h2>Make room for the next conversation.</h2>
          <p className="muted">
            Meetings and follow-up reminders ·{" "}
            {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </p>
        </div>
        <div className="calendar-actions">
          <button
            className="icon-button"
            aria-label="Refresh calendar"
            disabled={loading}
            onClick={refresh}
          >
            <RefreshCw size={19} />
          </button>
          <button
            className="secondary"
            disabled={loading || !!error || !exportEntries.length}
            onClick={() => setExporting(!exporting)}
            aria-expanded={exporting}
          >
            <Download size={17} /> Export all
          </button>
          <button
            className="primary"
            disabled={
              !clients.some((client) => client.status !== "archived") ||
              loading ||
              !!error
            }
            onClick={() =>
              edit(
                newMeeting(
                  clients.find((client) => client.status !== "archived")!.id,
                  date,
                ),
              )
            }
          >
            <Plus size={17} /> New meeting
          </button>
        </div>
      </div>
      {exporting && (
        <div className="calendar-export">
          <h3>Download your calendar</h3>
          <p>
            Includes all {exportEntries.length} non-cancelled meetings and
            follow-ups, across every date. Client names and meeting locations
            are included; notes and documents stay here.
          </p>
          <p>
            Import the .ics file into your calendar app. This is a snapshot, not
            a subscription. Later changes won’t sync, and repeated imports may
            create duplicates.
          </p>
          <button
            className="secondary"
            onClick={() => {
              downloadCalendar(exportEntries);
              setExportNotice(
                "Calendar downloaded. Import afin-calendar.ics into your calendar app.",
              );
              setExporting(false);
            }}
          >
            Download .ics
          </button>
        </div>
      )}
      {exportNotice && (
        <p role="status" className="save-notice">
          {exportNotice}
        </p>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading && <p role="status">Loading meetings…</p>}
      <div className="calendar-toolbar">
        <div className="calendar-period">
          <button
            className="icon-button"
            aria-label={`Previous ${view}`}
            onClick={() => move(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          <h3 aria-live="polite">{period}</h3>
          <button
            className="icon-button"
            aria-label={`Next ${view}`}
            onClick={() => move(1)}
          >
            <ChevronRight size={20} />
          </button>
          <button className="secondary" onClick={() => setDate(new Date())}>
            Today
          </button>
        </div>
        <div className="calendar-options">
          <div className="calendar-views" aria-label="Calendar view">
            {(["month", "week", "day"] as const).map((mode) => (
              <button
                key={mode}
                aria-pressed={view === mode}
                onClick={() => setView(mode)}
              >
                {mode[0].toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          <select
            aria-label="Filter calendar"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All upcoming & past</option>
            <option value="tentative">Tentative meetings</option>
            <option value="confirmed">Confirmed meetings</option>
            <option value="completed">Completed meetings</option>
            <option value="cancelled">Cancelled meetings</option>
            <option value="follow-up">Follow-up reminders</option>
          </select>
        </div>
      </div>
      {view !== "day" && (
        <div
          className={`calendar-month ${view === "week" ? "calendar-week" : ""}`}
          aria-label={period}
        >
          <div className="calendar-weekdays">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {days.map((day) => {
              const items = entriesOnDay(visible, day);
              return (
                <button
                  key={dateKey(day)}
                  className={`calendar-cell ${day.getMonth() !== date.getMonth() ? "outside-month" : ""}`}
                  aria-label={`${day.toLocaleDateString(undefined, { dateStyle: "full" })}, ${items.length} events`}
                  aria-pressed={dateKey(day) === dateKey(date)}
                  aria-current={
                    dateKey(day) === dateKey(new Date()) ? "date" : undefined
                  }
                  onClick={() => setDate(day)}
                >
                  <span className="calendar-date">{day.getDate()}</span>
                  <span className="calendar-cell-events">
                    {items.slice(0, 2).map((item) => (
                      <span
                        className={`calendar-chip calendar-status-${item.status}`}
                        key={item.id}
                      >
                        {item.title}
                      </span>
                    ))}
                    {items.length > 2 && (
                      <small>+{items.length - 2} more</small>
                    )}
                  </span>
                  {items.length > 0 && (
                    <span className="calendar-mobile-count">
                      {items.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="calendar-agenda" aria-label="Schedule">
        {agendaDays.map((day) => {
          const items = entriesOnDay(visible, day);
          return (
            <section key={dateKey(day)}>
              <h3>
                <CalendarDays size={18} />
                {day.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
                <span className="muted">{items.length}</span>
              </h3>
              {items.length ? (
                items.map((item) => (
                  <button
                    className="calendar-event"
                    key={item.id}
                    onClick={() => open(item)}
                  >
                    <Clock size={18} />
                    <span className="calendar-time">
                      {item.allDay
                        ? "Any time"
                        : `${new Date(item.start).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} – ${new Date(item.end).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`}
                    </span>
                    <span className="calendar-event-title">
                      <strong>{item.title}</strong>
                      {item.location && (
                        <small>
                          <MapPin size={13} />
                          {item.location}
                        </small>
                      )}
                    </span>
                    <span
                      className={`calendar-chip calendar-status-${item.status}`}
                    >
                      {item.status === "follow-up"
                        ? "Follow-up reminder"
                        : item.status}
                    </span>
                    <ChevronRight size={16} />
                  </button>
                ))
              ) : (
                <p className="calendar-empty">
                  No{" "}
                  {filter === "all"
                    ? "meetings or reminders"
                    : "matching events"}{" "}
                  for this day.
                </p>
              )}
            </section>
          );
        })}
      </div>
      <p className="muted calendar-help">
        Follow-up reminders open the client record. Meetings open their details.
        Tentative does not mean booked; saving a meeting never sends an
        invitation.
      </p>
    </section>
  );
}
