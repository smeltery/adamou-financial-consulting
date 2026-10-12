import { database } from "../store";
import type { Meeting } from "./model";
export async function loadMeetings(): Promise<Meeting[]> {
  if (!database) throw new Error("Connect Supabase to load the calendar.");
  const meetings: Meeting[] = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await database
      .from("meetings")
      .select("*")
      .order("starts_at")
      .order("id")
      .range(offset, offset + 499);
    if (error)
      throw new Error(
        "Could not load meetings. Check the calendar migration and retry.",
      );
    meetings.push(...(data as Meeting[]));
    if (data.length < 500) return meetings;
  }
}
export async function saveMeeting(
  meeting: Meeting,
  existing: boolean,
): Promise<Meeting> {
  if (!database) throw new Error("Supabase is not connected.");
  const { updated_at, ...values } = meeting;
  const query = existing
    ? database
        .from("meetings")
        .update(values)
        .eq("id", meeting.id)
        .eq("updated_at", updated_at)
    : database.from("meetings").insert(values);
  const { data, error } = await query.select().maybeSingle();
  if (error)
    throw new Error("Could not save the meeting. Your edits are still here.");
  if (!data)
    throw new Error(
      "This meeting changed elsewhere. Close, refresh the calendar, and reopen it.",
    );
  return data as Meeting;
}
export async function deleteMeeting(meeting: Meeting) {
  if (!database) throw new Error("Supabase is not connected.");
  const { data, error } = await database
    .from("meetings")
    .delete()
    .eq("id", meeting.id)
    .eq("updated_at", meeting.updated_at)
    .select("id");
  if (error || !data?.length)
    throw new Error(
      "Could not remove the meeting. Refresh the calendar before trying again.",
    );
}
