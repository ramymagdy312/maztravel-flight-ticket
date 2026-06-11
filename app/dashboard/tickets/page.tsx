"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FileText, Trash2, Download, Send, Search, Filter, Loader2, Pencil } from "lucide-react";
import { getTickets, deleteTicket } from "@/lib/ticket-store";
import { pdf } from "@react-pdf/renderer";
import TicketPDF from "@/components/TicketPDF";
import type { SavedTicket } from "@/lib/types";

export default function TicketsHistoryPage() {
  const [tickets, setTickets] = useState<SavedTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    const success = await deleteTicket(id);
    if (success) {
      setTickets((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleRedownload = async (ticket: SavedTicket) => {
    try {
      const blob = await pdf(<TicketPDF ticket={ticket} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `flight-ticket-${ticket.pnr || "ticket"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error re-generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.passengers.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, PNR, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="sent">Sent</option>
            <option value="downloaded">Downloaded</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200/80 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No tickets found</p>
          <p className="text-sm text-gray-400 mt-1">
            {tickets.length === 0
              ? "Create your first ticket to see it here."
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Passenger</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">PNR</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">Route</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800">{ticket.passengers.map((p) => p.name).join(", ") || "—"}</p>
                      <p className="text-xs text-gray-400">{ticket.email}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-700">{ticket.pnr}</td>
                    <td className="py-3 px-4 hidden md:table-cell text-gray-600">
                      {ticket.flights[0]?.from} → {ticket.flights[0]?.to}
                      {ticket.flights.length > 1 && (
                        <span className="text-xs text-gray-400 ml-1">(+{ticket.flights.length - 1})</span>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                          ticket.status === "sent"
                            ? "bg-emerald-50 text-emerald-700"
                            : ticket.status === "downloaded"
                            ? "bg-violet-50 text-violet-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {ticket.status === "sent" && <Send className="w-3 h-3" />}
                        {ticket.status === "downloaded" && <Download className="w-3 h-3" />}
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/dashboard/tickets/${ticket.id}/edit`}
                          className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleRedownload(ticket)}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ticket.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-sm text-gray-500">
            Showing {filtered.length} of {tickets.length} tickets
          </div>
        </div>
      )}
    </div>
  );
}
