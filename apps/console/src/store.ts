import { createClient } from "@supabase/supabase-js";
import type { Client, Inquiry, Event } from "./model";
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const database =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: false, detectSessionInUrl: false },
      })
    : null;
export const ownerEmail = "madamou@afin-consulting.com";
export async function loadClients(): Promise<Client[]> {
  if (!database) throw new Error("Connect Supabase to use the workspace.");
  // Page explicitly: Supabase's default row cap must not silently distort metrics.
  const clients: Client[] = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await database
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false })
      .order("id")
      .range(offset, offset + 499);
    if (error) throw new Error("Could not load clients. Please retry.");
    clients.push(...(data as Client[]));
    if (data.length < 500) return clients;
  }
}
export async function saveClient(
  client: Client,
  existing: boolean,
): Promise<Client> {
  if (!database) throw new Error("Supabase is not connected.");
  const { updated_at, ...values } = client;
  const query = existing
    ? database
        .from("clients")
        .update(values)
        .eq("id", client.id)
        .eq("updated_at", updated_at)
    : database.from("clients").insert(values);
  const { data, error } = await query.select().maybeSingle();
  if (error)
    throw new Error(
      error.code === "23505"
        ? "A client already uses this email. Open their record instead."
        : "Could not save changes. Your edits are still here.",
    );
  if (!data)
    throw new Error(
      "This record changed in another window. Close and reopen it before editing.",
    );
  return data as Client;
}
export async function loadHistory(
  id: string,
): Promise<{ inquiries: Inquiry[]; events: Event[] }> {
  if (!database) return { inquiries: [], events: [] };
  const [inquiries, events] = await Promise.all([
    database
      .from("inquiries")
      .select("*")
      .eq("client_id", id)
      .order("received_at", { ascending: false })
      .limit(50),
    database
      .from("client_events")
      .select("*")
      .eq("client_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);
  if (inquiries.error || events.error)
    throw new Error("Could not load the recent intake and history.");
  return {
    inquiries: inquiries.data as Inquiry[],
    events: events.data as Event[],
  };
}
