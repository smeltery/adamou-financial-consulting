export const activityLifetime = 24 * 60 * 60 * 1000;
export type InquiryEvent = { id: string; at: number };

export function recentEvents(value: unknown, now = Date.now()): InquiryEvent[] {
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, InquiryEvent>();
  for (const event of value) {
    if (
      event &&
      typeof event.id === "string" &&
      /^[a-f0-9]{64}$/.test(event.id) &&
      typeof event.at === "number" &&
      Number.isFinite(event.at) &&
      event.at <= now &&
      event.at > now - activityLifetime
    ) {
      unique.set(event.id, { id: event.id, at: event.at });
    }
  }
  return [...unique.values()].sort((a, b) => b.at - a.at).slice(0, 3);
}
