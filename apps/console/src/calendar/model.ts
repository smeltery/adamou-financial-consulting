import type { Client } from "../model";
export const meetingStatuses = [
  "tentative",
  "confirmed",
  "completed",
  "cancelled",
] as const;
export type Meeting = {
  id: string;
  client_id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  status: (typeof meetingStatuses)[number];
  location: string;
  updated_at: string;
};
export type CalendarEntry = {
  id: string;
  clientId: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  status: Meeting["status"] | "follow-up";
  location: string;
  updated: string;
};
export const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
export function localInput(iso: string) {
  const date = new Date(iso);
  return `${dateKey(date)}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
export function parseLocal(value: string) {
  const date = new Date(value);
  // Reject nonexistent local times in the spring daylight-saving gap.
  if (
    !Number.isFinite(date.getTime()) ||
    localInput(date.toISOString()) !== value
  )
    throw new Error(
      "Choose a valid local date and time, outside the daylight-saving gap.",
    );
  return date.toISOString();
}
export function newMeeting(clientId: string, day = new Date()): Meeting {
  const start = new Date(day);
  start.setHours(10, 0, 0, 0);
  return {
    id: crypto.randomUUID(),
    client_id: clientId,
    title: "Client conversation",
    starts_at: start.toISOString(),
    ends_at: new Date(+start + 3600000).toISOString(),
    status: "tentative",
    location: "",
    updated_at: new Date().toISOString(),
  };
}
export function calendarEntries(
  clients: Client[],
  meetings: Meeting[],
): CalendarEntry[] {
  const names = new Map(clients.map((client) => [client.id, client.name]));
  const entries: CalendarEntry[] = meetings.map((meeting) => ({
    id: meeting.id,
    clientId: meeting.client_id,
    title: `${meeting.title} · ${names.get(meeting.client_id) || "Client"}`,
    start: meeting.starts_at,
    end: meeting.ends_at,
    allDay: false,
    status: meeting.status,
    location: meeting.location,
    updated: meeting.updated_at,
  }));
  for (const client of clients) {
    if (!client.next_contact || client.status === "archived") continue;
    entries.push({
      id: `followup-${client.id}`,
      clientId: client.id,
      title: `Follow up · ${client.name}`,
      start: client.next_contact,
      end: dateKey(addDays(new Date(`${client.next_contact}T12:00:00`), 1)),
      allDay: true,
      status: "follow-up",
      location: "",
      updated: client.updated_at,
    });
  }
  return entries.sort((a, b) => a.start.localeCompare(b.start));
}
export function entriesOnDay(entries: CalendarEntry[], day: Date) {
  const key = dateKey(day);
  const start = new Date(`${key}T00:00:00`);
  const end = addDays(start, 1);
  return entries.filter((entry) =>
    entry.allDay
      ? entry.start === key
      : new Date(entry.start) < end && new Date(entry.end) > start,
  );
}
