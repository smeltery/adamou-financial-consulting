import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Inbox,
  CalendarDays,
  Archive,
  Plus,
  Search,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { Calendar } from "./calendar/Calendar";
import { MeetingEditor } from "./calendar/MeetingEditor";
import { useMeetings } from "./calendar/useMeetings";
import { newMeeting, type Meeting } from "./calendar/model";
import { CommandSearch } from "./search/CommandSearch";
import { Login, Brand } from "./Login";
const Dashboard = lazy(() =>
  import("./Dashboard").then((module) => ({ default: module.Dashboard })),
);
import { ClientEditor } from "./ClientEditor";
import { clearDemoDocuments } from "./documents/repository";
import { database, loadClients, saveClient } from "./store";
import {
  blankClient,
  stageLabels,
  stages,
  type Client,
  type Stage,
} from "./model";
const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "clients", label: "All clients", icon: Users },
  { id: "inquiries", label: "Inquiries", icon: Inbox },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "followups", label: "Follow-ups", icon: CalendarDays },
  { id: "archive", label: "Archive", icon: Archive },
];
export default function App() {
  const [authorized, setAuthorized] = useState(false);
  const [demo, setDemo] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const calendar = useMeetings(authorized, demo, clients);
  const [meetingEditor, setMeetingEditor] = useState<Meeting | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [view, setView] = useState("overview");
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<Stage | "">("");
  const [editor, setEditor] = useState<Client | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [menu, setMenu] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = matchMedia("(max-width: 700px)");
    const update = () => {
      setMobile(query.matches);
      if (!query.matches) setMenu(false);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!menu || !mobile) return;
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const controls = Array.from(
      navigationRef.current?.querySelectorAll<HTMLButtonElement>("button") ||
        [],
    );
    controls[0]?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
      if (event.key !== "Tab") return;
      const index = controls.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        controls.at(-1)?.focus();
      } else if (!event.shiftKey && index === controls.length - 1) {
        event.preventDefault();
        controls[0]?.focus();
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keyboard);
      previous?.focus();
    };
  }, [menu, mobile]);

  useEffect(() => {
    if (!authorized) {
      setSearchOpen(false);
      setMeetingEditor(null);
      return;
    }
    function shortcut(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k")
        return;
      event.preventDefault();
      if (!document.querySelector("dialog[open]")) {
        setMenu(false);
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [authorized]);
  async function authorize() {
    if (!database) return;
    const { data, error } = await database.rpc("is_owner");
    if (error || data !== true) {
      await database.auth.signOut();
      setError("This account is not authorized for Matt’s workspace.");
      return;
    }
    setAuthorized(true);
  }
  useEffect(() => {
    const listener = database?.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setAuthorized(false);
        setClients([]);
        setEditor(null);
      }
    });
    return () => listener?.data.subscription.unsubscribe();
  }, []);
  async function refresh() {
    setBusy(true);
    setError("");
    try {
      setClients(await loadClients());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (authorized && !demo) void refresh();
  }, [authorized, demo]);
  async function enterDemo() {
    if (!import.meta.env.DEV) return;
    clearDemoDocuments();
    const { sampleClients } = await import("./demo");
    setClients(sampleClients());
    setDemo(true);
    setAuthorized(true);
  }
  async function save(client: Client) {
    const existing = clients.some((c) => c.id === client.id);
    if (
      demo &&
      clients.some(
        (c) =>
          c.id !== client.id &&
          c.email.toLowerCase() === client.email.toLowerCase(),
      )
    )
      throw new Error("A client already uses this email.");
    const saved = demo
      ? { ...client, updated_at: new Date().toISOString() }
      : await saveClient(client, existing);
    setClients((list) =>
      existing
        ? list.map((c) => (c.id === saved.id ? saved : c))
        : [saved, ...list],
    );
    setNotice(`${saved.name} saved.`);
  }
  async function signOut() {
    if (!demo && database) {
      const { error } = await database.auth.signOut();
      if (error) {
        setError("Could not sign out. Please retry.");
        return;
      }
    }
    clearDemoDocuments();
    setMenu(false);
    setClients([]);
    setAuthorized(false);
    setDemo(false);
    setEditor(null);
  }
  if (!authorized)
    return (
      <>
        <Login
          onAccess={() => void authorize()}
          onDemo={import.meta.env.DEV ? enterDemo : undefined}
        />
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
      </>
    );
  const filtered = clients.filter(
    (c) =>
      (view === "archive"
        ? c.status === "archived"
        : view === "inquiries"
          ? c.status === "inquiry"
          : view === "followups"
            ? c.next_contact && c.status !== "archived"
            : c.status !== "archived") &&
      (!stage || c.status === stage) &&
      `${c.name} ${c.email} ${c.priority}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  if (view === "followups")
    filtered.sort((a, b) => a.next_contact!.localeCompare(b.next_contact!));
  const title = navigation.find((item) => item.id === view)!.label;
  return (
    <div className="workspace">
      {menu && (
        <button
          className="nav-backdrop"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        />
      )}
      <aside
        ref={navigationRef}
        inert={mobile && !menu}
        className={`sidebar ${menu ? "is-open" : ""}`}
      >
        <Brand />
        <button
          className="mobile-close icon-button"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        >
          <X />
        </button>
        <p className="nav-caption">YOUR WORKSPACE</p>
        <nav aria-label="Workspace">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              aria-current={view === id ? "page" : undefined}
              onClick={() => {
                setView(id);
                setStage("");
                setQuery("");
                setMenu(false);
              }}
            >
              <Icon size={20} />
              {label}
              {id === "inquiries" && (
                <span className="nav-count">
                  {clients.filter((c) => c.status === "inquiry").length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <ShieldCheck size={18} />
          <small>
            Private workspace
            <br />
            Matt Adamou
          </small>
          <button
            className="icon-button"
            aria-label="Sign out"
            onClick={() => void signOut()}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main className="workspace-main" inert={mobile && menu}>
        <header className="topbar">
          <button
            className="mobile-toggle icon-button"
            aria-label="Open navigation"
            aria-expanded={menu}
            onClick={() => setMenu(true)}
          >
            <Menu />
          </button>
          <span>
            Adamou Financial Consulting <span className="separator">/</span>{" "}
            <strong>{title}</strong>
          </span>
          <button
            className="workspace-search-trigger"
            aria-label="Search workspace"
            aria-keyshortcuts="Meta+k Control+k"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={18} />
            <span>Search</span>
            <kbd>⌘ K</kbd>
          </button>
          <span className="owner-avatar">MA</span>
        </header>
        {demo && (
          <div className="demo-banner">
            Development preview · Fictional sample data · Changes stay in memory
          </div>
        )}
        <div className="content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">
                {view === "overview"
                  ? "YOUR BUSINESS, IN FOCUS"
                  : "PEOPLE BEFORE PAPERWORK"}
              </p>
              <h1>
                {view === "overview" ? "A clearer view of what’s next." : title}
              </h1>
              <p>
                {view === "overview"
                  ? "Keep relationships moving. Make room for meaningful progress."
                  : view === "archive"
                    ? "Past relationships, kept with care. Reopen a record whenever needed."
                    : "Every introduction, next step, and shared goal in one place."}
              </p>
            </div>
            <div className="heading-actions">
              {!demo && (
                <button
                  className="icon-button"
                  aria-label="Refresh clients"
                  disabled={busy}
                  onClick={() => void refresh()}
                >
                  <RefreshCw size={19} />
                </button>
              )}
              <button
                className="primary"
                onClick={() => setEditor(blankClient())}
              >
                <Plus size={18} />
                Add client
              </button>
            </div>
          </div>
          {error && (
            <div className="error" role="alert">
              {error}
              <button className="quiet" onClick={() => void refresh()}>
                Retry
              </button>
            </div>
          )}
          {notice && (
            <div className="save-notice" role="status">
              {notice}
              <button
                className="icon-button"
                aria-label="Dismiss confirmation"
                onClick={() => setNotice("")}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {busy ? (
            <div className="loading" role="status">
              Loading your workspace…
            </div>
          ) : view === "overview" ? (
            <Suspense
              fallback={
                <div className="loading" role="status">
                  Loading charts…
                </div>
              }
            >
              <Dashboard clients={clients} open={setEditor} />
            </Suspense>
          ) : view === "calendar" ? (
            <Calendar
              clients={clients}
              meetings={calendar.meetings}
              error={calendar.error}
              loading={calendar.loading}
              refresh={calendar.refresh}
              edit={setMeetingEditor}
              openClient={setEditor}
            />
          ) : (
            <section className="panel client-panel">
              <div className="list-controls">
                <label className="search">
                  <Search size={20} />
                  <input
                    aria-label="Search clients"
                    placeholder="Search name, email, or priority…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                {view === "clients" && (
                  <select
                    aria-label="Filter by stage"
                    value={stage}
                    onChange={(e) => setStage(e.target.value as Stage | "")}
                  >
                    <option value="">All open stages</option>
                    {stages
                      .filter((s) => s !== "archived")
                      .map((s) => (
                        <option value={s} key={s}>
                          {stageLabels[s]}
                        </option>
                      ))}
                  </select>
                )}
                <span className="muted">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "client" : "clients"}
                </span>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Stage</th>
                      <th>Priority</th>
                      <th>Next follow-up</th>
                      <th>Goals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((client) => (
                      <tr key={client.id}>
                        <td>
                          <button
                            className="client-link"
                            onClick={() => setEditor(client)}
                          >
                            <span className="avatar">
                              {client.name.charAt(0)}
                            </span>
                            <span>
                              <strong>{client.name}</strong>
                              <small>{client.email}</small>
                            </span>
                          </button>
                        </td>
                        <td>
                          <span className={`status status-${client.status}`}>
                            {stageLabels[client.status]}
                          </span>
                        </td>
                        <td className="priority-cell">
                          {client.priority || "Not yet discussed"}
                        </td>
                        <td>{client.next_contact || "Not scheduled"}</td>
                        <td>
                          {client.goals.filter((g) => g.done).length}/
                          {client.goals.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!filtered.length && (
                <div className="empty">
                  <Users size={32} />
                  <h2>
                    {query || stage
                      ? "No matching clients"
                      : "A fresh place to start."}
                  </h2>
                  <p>
                    {query || stage
                      ? "Try another search or stage."
                      : "Add a client manually, or connect website intake to bring introductions here automatically."}
                  </p>
                </div>
              )}
            </section>
          )}
          <footer className="workspace-footer">
            <ShieldCheck size={15} /> Private client workspace{" "}
            <span>Built around your next step.</span>
          </footer>
        </div>
      </main>
      {searchOpen && (
        <CommandSearch
          clients={clients}
          meetings={calendar.meetings}
          actions={[
            ...navigation.map((item) => ({
              ...item,
              run: () => {
                setView(item.id);
                setQuery("");
                setStage("");
              },
            })),
            {
              id: "add-client",
              label: "Add client",
              icon: Plus,
              run: () => setEditor(blankClient()),
            },
            ...(clients.some((client) => client.status !== "archived") &&
            !calendar.loading &&
            !calendar.error
              ? [
                  {
                    id: "add-meeting",
                    label: "New meeting",
                    icon: CalendarDays,
                    run: () =>
                      setMeetingEditor(
                        newMeeting(
                          clients.find(
                            (client) => client.status !== "archived",
                          )!.id,
                        ),
                      ),
                  },
                ]
              : []),
          ]}
          openClient={setEditor}
          openMeeting={setMeetingEditor}
          close={() => setSearchOpen(false)}
        />
      )}
      {meetingEditor && (
        <MeetingEditor
          key={meetingEditor.id}
          meeting={meetingEditor}
          meetings={calendar.meetings}
          clients={clients}
          existing={calendar.meetings.some(
            (item) => item.id === meetingEditor.id,
          )}
          save={calendar.save}
          remove={calendar.remove}
          close={() => setMeetingEditor(null)}
        />
      )}
      {editor && (
        <ClientEditor
          key={editor.id}
          client={editor}
          existing={clients.some((c) => c.id === editor.id)}
          demo={demo}
          save={save}
          close={() => setEditor(null)}
        />
      )}
    </div>
  );
}
