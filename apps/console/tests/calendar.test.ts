import { expect, test } from "bun:test";
import { blankClient } from "../src/model";
import {
  calendarEntries,
  entriesOnDay,
  newMeeting,
  parseLocal,
} from "../src/calendar/model";
import { exportCalendar } from "../src/calendar/export";
test("calendar export preserves UTC, stable IDs, escaping and UTF-8 folding", () => {
  const client = {
    ...blankClient(),
    name: "Élodie, Example",
    next_contact: "2026-12-31",
  };
  const meeting = {
    ...newMeeting(client.id),
    title: "Review; " + "🎉".repeat(60),
    starts_at: "2026-10-12T14:00:00Z",
    ends_at: "2026-10-12T15:00:00Z",
    location: "Office\nBEGIN:VEVENT, Room; A\\B",
  };
  const entries = calendarEntries([client], [meeting]);
  const ics = exportCalendar(entries, new Date("2026-10-01T00:00:00Z"));
  const unfolded = ics.replace(/\r\n /g, "");
  expect(unfolded).toContain("DTSTART:20261012T140000Z");
  expect(unfolded).toContain("DTEND;VALUE=DATE:20270101");
  expect(unfolded).toContain(`UID:${meeting.id}@afin-consulting.com`);
  expect(unfolded).toContain(
    "LOCATION:Office\\nBEGIN:VEVENT\\, Room\\; A\\\\B",
  );
  expect(unfolded.match(/^BEGIN:VEVENT$/gm)).toHaveLength(2);
  expect(unfolded).not.toContain("ATTENDEE");
  expect(unfolded).not.toContain("METHOD:REQUEST");
  expect(unfolded).not.toContain("NOTES");
  for (const line of ics.split("\r\n"))
    expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
  expect(ics).toEndWith("END:VCALENDAR\r\n");
});
test("multi-day meetings intersect each local day; archived clients have no reminders", () => {
  const client = { ...blankClient(), next_contact: "2026-10-12" };
  const meeting = {
    ...newMeeting(client.id),
    starts_at: new Date(2026, 9, 12, 23).toISOString(),
    ends_at: new Date(2026, 9, 14, 0).toISOString(),
  };
  const entries = calendarEntries([client], [meeting]);
  expect(entriesOnDay(entries, new Date(2026, 9, 12))).toHaveLength(2);
  expect(entriesOnDay(entries, new Date(2026, 9, 13))).toHaveLength(1);
  expect(entriesOnDay(entries, new Date(2026, 9, 14))).toHaveLength(0);
  expect(calendarEntries([{ ...client, status: "archived" }], [])).toHaveLength(
    0,
  );
  expect(() => parseLocal("2026-02-30T10:00")).toThrow();
});
