import { getSupabase } from "./supabase";

export interface Airline {
  id: string;
  name: string;
  created_at: string;
}

export interface TicketClass {
  id: string;
  name: string;
  created_at: string;
}

function supabase() {
  try {
    return getSupabase();
  } catch {
    return null;
  }
}

// ── Airlines ──

export async function getAirlines(): Promise<Airline[]> {
  const client = supabase();
  if (!client) return [];

  const { data, error } = await client
    .from("airlines")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching airlines:", error);
    return [];
  }
  return data || [];
}

export async function addAirline(name: string): Promise<Airline | null> {
  const client = supabase();
  if (!client) return null;

  const { data, error } = await client
    .from("airlines")
    .insert({ name: name.trim() })
    .select()
    .single();

  if (error) {
    console.error("Error adding airline:", error);
    return null;
  }
  return data;
}

export async function updateAirline(id: string, name: string): Promise<boolean> {
  const client = supabase();
  if (!client) return false;

  const { error } = await client
    .from("airlines")
    .update({ name: name.trim() })
    .eq("id", id);

  if (error) {
    console.error("Error updating airline:", error);
    return false;
  }
  return true;
}

export async function deleteAirline(id: string): Promise<boolean> {
  const client = supabase();
  if (!client) return false;

  const { error } = await client
    .from("airlines")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting airline:", error);
    return false;
  }
  return true;
}

// ── Ticket Classes ──

export async function getTicketClasses(): Promise<TicketClass[]> {
  const client = supabase();
  if (!client) return [];

  const { data, error } = await client
    .from("ticket_classes")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching ticket classes:", error);
    return [];
  }
  return data || [];
}

export async function addTicketClass(name: string): Promise<TicketClass | null> {
  const client = supabase();
  if (!client) return null;

  const { data, error } = await client
    .from("ticket_classes")
    .insert({ name: name.trim() })
    .select()
    .single();

  if (error) {
    console.error("Error adding ticket class:", error);
    return null;
  }
  return data;
}

export async function updateTicketClass(id: string, name: string): Promise<boolean> {
  const client = supabase();
  if (!client) return false;

  const { error } = await client
    .from("ticket_classes")
    .update({ name: name.trim() })
    .eq("id", id);

  if (error) {
    console.error("Error updating ticket class:", error);
    return false;
  }
  return true;
}

export async function deleteTicketClass(id: string): Promise<boolean> {
  const client = supabase();
  if (!client) return false;

  const { error } = await client
    .from("ticket_classes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting ticket class:", error);
    return false;
  }
  return true;
}
