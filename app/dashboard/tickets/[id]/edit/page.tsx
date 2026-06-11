"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import FlightTicketForm from "@/components/FlightTicketForm";
import { getTicketById } from "@/lib/ticket-store";
import type { SavedTicket } from "@/lib/types";

export default function EditTicketPage() {
  const params = useParams();
  const id = params.id as string;
  const [ticket, setTicket] = useState<SavedTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getTicketById(id);
      if (data) {
        setTicket(data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (notFound || !ticket) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-gray-600 font-medium">Ticket not found</p>
        <Link
          href="/dashboard/tickets"
          className="inline-flex items-center gap-2 mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Link
        href="/dashboard/tickets"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to History
      </Link>
      <FlightTicketForm key={ticket.id} initialTicket={ticket} />
    </div>
  );
}
