export const intakeFields = [
  "name",
  "email",
  "phone",
  "contactPreference",
  "clientType",
  "business",
  "location",
  "goals",
  "priority",
  "budget",
  "debt",
  "timeline",
  "experience",
  "notes",
  "availability",
  "consent",
] as const;

/** Explicit allowlist: provider metadata and unexpected fields never reach the CRM. */
export function parseIntake(value: unknown): Record<string, string | string[]> {
  if (!value || typeof value !== "object") throw new Error("Invalid inquiry");
  const input = value as Record<string, unknown>;
  const result: Record<string, string | string[]> = {};
  for (const key of intakeFields) {
    const field = input[key];
    if (field === undefined) continue;
    if (typeof field === "string" && field.length <= 10000)
      result[key] = field.trim();
    else if (
      key === "goals" &&
      Array.isArray(field) &&
      field.length <= 20 &&
      field.every((item) => typeof item === "string" && item.length <= 200)
    )
      result[key] = field;
    else throw new Error("Invalid inquiry field");
  }
  if (
    typeof result.name !== "string" ||
    !result.name ||
    result.name.length > 200 ||
    typeof result.email !== "string" ||
    result.email.length > 320 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)
  )
    throw new Error("Name and email are required");
  return result;
}

export const goalLabels: Record<string, string> = {
  budget: "Building a budget",
  debt: "Paying down debt",
  goals: "Saving toward a goal",
  habits: "Building money habits",
  business: "Small-business finances",
  unsure: "Finding a starting point",
};

export const fieldLabels: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  contactPreference: "Preferred contact",
  clientType: "Coaching for",
  business: "Business",
  location: "Location / time zone",
  goals: "Goal",
  priority: "Top priority",
  budget: "Budgeting approach",
  debt: "Debt focus",
  timeline: "Timing",
  experience: "Previous coaching",
  notes: "Additional context",
  availability: "Availability",
  consent: "Permission to respond",
};
