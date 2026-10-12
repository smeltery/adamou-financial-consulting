import { useEffect, useState } from "react";
import type { Client } from "../model";
import { newMeeting, type Meeting } from "./model";
import { deleteMeeting, loadMeetings, saveMeeting } from "./repository";
export function useMeetings(
  authorized: boolean,
  demo: boolean,
  clients: Client[],
) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (!authorized) {
      setMeetings([]);
      setError("");
      setLoading(false);
      return;
    }
    if (demo) {
      setError("");
      setLoading(false);
      setMeetings(
        clients.slice(0, 3).map((client, index) => {
          const day = new Date();
          day.setDate(day.getDate() + index);
          return {
            ...newMeeting(client.id, day),
            title: index ? "Progress check-in" : "Introduction",
            status: index ? "confirmed" : "tentative",
          };
        }),
      );
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    loadMeetings()
      .then((items) => {
        if (!cancelled) setMeetings(items);
      })
      .catch((error: Error) => {
        if (!cancelled) setError(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // Demo fixtures initialize once per session, never when a client is edited.
  }, [authorized, demo, version]);
  async function save(meeting: Meeting) {
    const existing = meetings.some((item) => item.id === meeting.id);
    const saved = demo
      ? { ...meeting, updated_at: new Date().toISOString() }
      : await saveMeeting(meeting, existing);
    setMeetings((items) =>
      existing
        ? items.map((item) => (item.id === saved.id ? saved : item))
        : [...items, saved],
    );
  }
  async function remove(meeting: Meeting) {
    if (!demo) await deleteMeeting(meeting);
    setMeetings((items) => items.filter((item) => item.id !== meeting.id));
  }
  return {
    meetings,
    error,
    loading,
    save,
    remove,
    refresh: () => {
      if (!demo) setVersion((value) => value + 1);
    },
  };
}
