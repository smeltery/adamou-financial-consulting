import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Users,
  Inbox,
  Clock3,
  TrendingUp,
  ArrowUpRight,
  Target,
  CalendarDays,
} from "lucide-react";
import { summarize, stageLabels, type Client } from "./model";
export function Dashboard({
  clients,
  open,
}: {
  clients: Client[];
  open: (client: Client) => void;
}) {
  const metrics = summarize(clients);
  const [motion, setMotion] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const due = clients
    .filter((c) => c.status !== "archived" && c.next_contact)
    .sort((a, b) => a.next_contact!.localeCompare(b.next_contact!))
    .slice(0, 5);
  const cards = [
    {
      title: "Active clients",
      value: metrics.active,
      icon: Users,
      caption: "People you’re currently supporting",
    },
    {
      title: "New inquiries",
      value: metrics.inquiries,
      icon: Inbox,
      caption: "Ready for an introduction",
    },
    {
      title: "Overdue follow-ups",
      value: metrics.overdue,
      icon: Clock3,
      caption: "Open clients with a past follow-up date",
    },
    {
      title: "Started coaching",
      value: metrics.conversion === null ? "—" : `${metrics.conversion}%`,
      icon: TrendingUp,
      caption: "Clients ever active ÷ all client records",
    },
  ];
  return (
    <>
      <section className="metric-grid" aria-label="Business metrics">
        {cards.map(({ title, value, icon: Icon, caption }) => (
          <article className="metric" key={title}>
            <div>
              <span>{title}</span>
              <Icon size={20} />
            </div>
            <strong>{value}</strong>
            <small>{caption}</small>
          </article>
        ))}
      </section>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">BUILDING RELATIONSHIPS</p>
              <h2>New client records</h2>
            </div>
            <span className="tag">Last 6 months</span>
          </div>
          <p className="muted">
            Manual additions and first website inquiries, by month.
          </p>
          <div
            className="chart"
            role="img"
            aria-label={metrics.months
              .map((m) => `${m.name}: ${m.count}`)
              .join(", ")}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={metrics.months}
                margin={{ top: 20, right: 12, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#608579" stopOpacity={0.4} />
                    <stop
                      offset="100%"
                      stopColor="#608579"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e5e8e2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Area
                  name="Client records"
                  type="monotone"
                  dataKey="count"
                  stroke="#285966"
                  strokeWidth={3}
                  fill="url(#growth)"
                  isAnimationActive={motion}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <details className="chart-data">
            <summary>View chart data</summary>
            {metrics.months.map((m) => (
              <p key={m.name}>
                {m.name}
                <strong>{m.count}</strong>
              </p>
            ))}
          </details>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">AT A GLANCE</p>
              <h2>Your client pipeline</h2>
            </div>
            <Users size={22} />
          </div>
          <div
            className="chart"
            role="img"
            aria-label={metrics.pipeline
              .map((m) => `${m.name}: ${m.count}`)
              .join(", ")}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={metrics.pipeline}
                margin={{ left: 5, right: 24 }}
              >
                <XAxis type="number" allowDecimals={false} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip />
                <Bar
                  name="Clients"
                  dataKey="count"
                  fill="#608579"
                  radius={[0, 5, 5, 0]}
                  isAnimationActive={motion}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <details className="chart-data">
            <summary>View chart data</summary>
            {metrics.pipeline.map((m) => (
              <p key={m.name}>
                {m.name}
                <strong>{m.count}</strong>
              </p>
            ))}
          </details>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">MAKE THE NEXT MOVE</p>
              <h2>Upcoming follow-ups</h2>
            </div>
            <CalendarDays size={22} />
          </div>
          {due.length ? (
            due.map((c) => (
              <button key={c.id} className="follow-up" onClick={() => open(c)}>
                <span className="avatar">
                  {c.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span>
                  <strong>{c.name}</strong>
                  <small>
                    {stageLabels[c.status]} · {c.next_contact}
                  </small>
                </span>
                <ArrowUpRight size={18} />
              </button>
            ))
          ) : (
            <p className="empty">
              Add a follow-up date to a client record and it will appear here.
            </p>
          )}
        </section>
        <section className="panel progress-panel">
          <Target size={30} />
          <p className="eyebrow">SMALL STEPS, REAL PROGRESS</p>
          <h2>Keep the goals in view.</h2>
          <p>
            <strong className="progress-number">{metrics.completed}</strong> of{" "}
            {metrics.goals} client goals complete
          </p>
          <progress
            value={metrics.completed}
            max={Math.max(metrics.goals, 1)}
          />
          <p className="muted">
            Track practical milestones inside each client record. Progress
            reflects the goals you mark complete.
          </p>
        </section>
      </div>
    </>
  );
}
