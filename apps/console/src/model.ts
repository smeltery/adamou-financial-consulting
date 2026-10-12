export const stages = [
  "inquiry",
  "onboarding",
  "active",
  "offboarding",
  "archived",
] as const;
export type Stage = (typeof stages)[number];
export const stageLabels: Record<Stage, string> = {
  inquiry: "New inquiry",
  onboarding: "Onboarding",
  active: "Active",
  offboarding: "Offboarding",
  archived: "Archived",
};
export type Goal = { id: string; title: string; done: boolean };
export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: Stage;
  source: "manual" | "website";
  priority: string;
  notes: string;
  next_contact: string | null;
  goals: Goal[];
  checklist: Goal[];
  offboarding_reason: string;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  archived_at: string | null;
};
export type Inquiry = {
  id: string;
  client_id: string;
  details: Record<string, string | string[]>;
  received_at: string;
};
export type Event = {
  id: string;
  client_id: string;
  summary: string;
  created_at: string;
};
export const today = () => new Date().toLocaleDateString("en-CA");
export function blankClient(): Client {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: "",
    email: "",
    phone: "",
    status: "inquiry",
    source: "manual",
    priority: "",
    notes: "",
    next_contact: null,
    goals: [],
    checklist: [],
    offboarding_reason: "",
    created_at: now,
    updated_at: now,
    started_at: null,
    archived_at: null,
  };
}
export function transition(client: Client, status: Stage): Client {
  const onboarding = [
    "Confirm goals and scope",
    "Agree fees and working arrangements",
    "Schedule the first session",
  ];
  const offboarding = [
    "Review progress together",
    "Share next steps and resources",
    "Confirm final follow-up",
  ];
  const titles =
    status === "onboarding"
      ? onboarding
      : status === "offboarding"
        ? offboarding
        : [];
  const checklist = [...client.checklist];
  for (const title of titles)
    if (!checklist.some((item) => item.title === title))
      checklist.push({ id: crypto.randomUUID(), title, done: false });
  return {
    ...client,
    status,
    checklist,
    started_at:
      status === "active"
        ? client.started_at || new Date().toISOString()
        : client.started_at,
    archived_at: status === "archived" ? new Date().toISOString() : null,
  };
}
export function summarize(clients: Client[], now = new Date()) {
  const date = now.toLocaleDateString("en-CA");
  const open = clients.filter((c) => c.status !== "archived");
  const converted = clients.filter((c) => c.started_at).length;
  return {
    active: clients.filter((c) => c.status === "active").length,
    inquiries: clients.filter((c) => c.status === "inquiry").length,
    overdue: open.filter((c) => c.next_contact && c.next_contact < date).length,
    conversion: clients.length
      ? Math.round((converted / clients.length) * 100)
      : null,
    completed: clients.reduce(
      (sum, c) => sum + c.goals.filter((g) => g.done).length,
      0,
    ),
    goals: clients.reduce((sum, c) => sum + c.goals.length, 0),
    pipeline: stages.map((stage) => ({
      name: stageLabels[stage],
      count: clients.filter((c) => c.status === stage).length,
    })),
    months: Array.from({ length: 6 }, (_, index) => {
      const start = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      return {
        name: start.toLocaleDateString("en-US", { month: "short" }),
        count: clients.filter(
          (c) =>
            new Date(c.created_at) >= start && new Date(c.created_at) < end,
        ).length,
      };
    }),
  };
}
