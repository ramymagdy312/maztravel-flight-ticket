"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/new-ticket": "New Ticket",
  "/dashboard/tickets": "Tickets History",
  "/dashboard/airlines": "Airlines",
  "/dashboard/classes": "Ticket Classes",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const title = pathname.match(/\/dashboard\/tickets\/[^/]+\/edit/)
    ? "Edit Ticket"
    : pageTitles[pathname] || "Dashboard";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
