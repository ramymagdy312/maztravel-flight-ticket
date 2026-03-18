import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Maz Travel - Flight Ticket",
  description: "Generate and email flight e-tickets for Maz Travel passengers.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

