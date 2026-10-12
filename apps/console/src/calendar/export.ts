import type { CalendarEntry } from "./model";
const escapeText = (text: string) =>
  text
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
const stamp = (value: string) =>
  new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
// RFC 5545 counts UTF-8 octets, including the continuation space, not characters.
function fold(line: string) {
  const encoder = new TextEncoder();
  let result = "",
    size = 0;
  for (const character of line) {
    const bytes = encoder.encode(character).length;
    if (size + bytes > 75) {
      result += "\r\n ";
      size = 1;
    }
    result += character;
    size += bytes;
  }
  return result;
}
export function exportCalendar(entries: CalendarEntry[], now = new Date()) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Afin//Client Workspace//EN",
    "CALSCALE:GREGORIAN",
  ];
  for (const entry of entries) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${entry.id}@afin-consulting.com`,
      `DTSTAMP:${stamp(now.toISOString())}`,
      `LAST-MODIFIED:${stamp(entry.updated)}`,
      `SUMMARY:${escapeText(entry.title)}`,
      "CLASS:PRIVATE",
    );
    if (entry.allDay)
      lines.push(
        `DTSTART;VALUE=DATE:${entry.start.replaceAll("-", "")}`,
        `DTEND;VALUE=DATE:${entry.end.replaceAll("-", "")}`,
      );
    else
      lines.push(`DTSTART:${stamp(entry.start)}`, `DTEND:${stamp(entry.end)}`);
    lines.push(
      `STATUS:${entry.status === "tentative" ? "TENTATIVE" : entry.status === "cancelled" ? "CANCELLED" : "CONFIRMED"}`,
      `TRANSP:${entry.allDay || entry.status === "cancelled" ? "TRANSPARENT" : "OPAQUE"}`,
    );
    if (entry.location) lines.push(`LOCATION:${escapeText(entry.location)}`);
    lines.push(
      `DESCRIPTION:${escapeText(entry.allDay ? "Follow-up reminder, not a booked meeting." : `Meeting status: ${entry.status}. Exported from Afin; no invitation sent.`)}`,
      "END:VEVENT",
    );
  }
  return [...lines, "END:VCALENDAR"].map(fold).join("\r\n") + "\r\n";
}
export function downloadCalendar(entries: CalendarEntry[]) {
  const url = URL.createObjectURL(
    new Blob([exportCalendar(entries)], {
      type: "text/calendar;charset=utf-8",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "afin-calendar.ics";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
