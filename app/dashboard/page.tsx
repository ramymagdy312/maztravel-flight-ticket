"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Send,
  Download,
  CalendarDays,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { getTicketStats, getTickets } from "@/lib/ticket-store";
import type { SavedTicket } from "@/lib/types";

export default function DashboardOverview() {
  const [stats, setStats] = useState({ total: 0, sent: 0, downloaded: 0, todayCount: 0 });
  const [recentTickets, setRecentTickets] = useState<SavedTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, ticketsData] = await Promise.all([
        getTicketStats(),
        getTickets(),
      ]);
      setStats(statsData);
      setRecentTickets(ticketsData.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const statCards = [
    {
      label: "Total Tickets",
      value: stats.total,
      icon: FileText,
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Sent via Email",
      value: stats.sent,
      icon: Send,
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Downloaded",
      value: stats.downloaded,
      icon: Download,
      bgLight: "bg-violet-50",
      textColor: "text-violet-600",
    },
    {
      label: "Created Today",
      value: stats.todayCount,
      icon: CalendarDays,
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-200/80 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${card.bgLight}`}>
                  <Icon className={`w-5 h-5 ${card.textColor}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/new-ticket"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors group"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="font-medium text-sm">Create New Ticket</span>
              <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/dashboard/tickets"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors group"
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium text-sm">View All Tickets</span>
              <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200/80 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">Recent Tickets</h3>
            {recentTickets.length > 0 && (
              <Link href="/dashboard/tickets" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </Link>
            )}
          </div>
          {recentTickets.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No tickets created yet</p>
              <Link
                href="/dashboard/new-ticket"
                className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <PlusCircle className="w-4 h-4" />
                Create your first ticket
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{ticket.passengers.map((p) => p.name).join(", ") || "—"}</p>
                    <p className="text-xs text-gray-500">
                      PNR: {ticket.pnr} &bull; {ticket.flights[0]?.from} → {ticket.flights[0]?.to}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        ticket.status === "sent"
                          ? "bg-emerald-50 text-emerald-700"
                          : ticket.status === "downloaded"
                          ? "bg-violet-50 text-violet-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ticket.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
