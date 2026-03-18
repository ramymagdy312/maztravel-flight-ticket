import { getSupabase } from "./supabase";
import type { FlightDetails, SavedTicket } from "./types";

function supabase() {
  try {
    return getSupabase();
  } catch {
    return null;
  }
}

export async function getTickets(): Promise<SavedTicket[]> {
  const client = supabase();
  if (!client) return [];

  const { data, error } = await client
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }

  return (data || []).map(mapRowToTicket);
}

export async function saveTicket(
  ticket: FlightDetails,
  status: SavedTicket["status"]
): Promise<SavedTicket | null> {
  const client = supabase();
  if (!client) return null;

  const row = {
    passengers: ticket.passengers,
    email: ticket.email,
    pnr: ticket.pnr,
    flights: ticket.flights,
    grand_total: ticket.grandTotal || null,
    show_issue_date_time: ticket.showIssueDateTime || false,
    status,
  };

  const { data, error } = await client
    .from("tickets")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("Error saving ticket:", error);
    return null;
  }

  return mapRowToTicket(data);
}

export async function deleteTicket(id: string): Promise<boolean> {
  const client = supabase();
  if (!client) return false;

  const { error } = await client
    .from("tickets")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting ticket:", error);
    return false;
  }

  return true;
}

export async function getTicketStats() {
  const client = supabase();
  const empty = { total: 0, sent: 0, downloaded: 0, todayCount: 0 };
  if (!client) return empty;

  const { data, error } = await client
    .from("tickets")
    .select("status, created_at");

  if (error) {
    console.error("Error fetching stats:", error);
    return empty;
  }

  const tickets = data || [];
  const today = new Date().toISOString().split("T")[0];

  return {
    total: tickets.length,
    sent: tickets.filter((t) => t.status === "sent").length,
    downloaded: tickets.filter((t) => t.status === "downloaded").length,
    todayCount: tickets.filter((t) => t.created_at?.startsWith(today)).length,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToTicket(row: any): SavedTicket {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    passengers: row.passengers || [],
    email: row.email || "",
    pnr: row.pnr || "",
    flights: row.flights || [],
    grandTotal: row.grand_total || undefined,
    showIssueDateTime: row.show_issue_date_time || false,
  };
}
