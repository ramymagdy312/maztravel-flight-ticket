import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 0,
    fontFamily: "Helvetica",
  },
  // Header bar - full width
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e3a8a",
    paddingHorizontal: 32,
    paddingVertical: 20,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: "column",
  },
  brandName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 9,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 0.3,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  docTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  docSubtitle: {
    fontSize: 9,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  // Content area
  content: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  // Section block
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a8a",
    letterSpacing: 0.5,
  },
  // Passenger grid - 2 cols
  passengerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  passengerItem: {
    width: "50%",
    marginBottom: 12,
    paddingRight: 16,
  },
  fieldLabel: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  fieldValue: {
    fontSize: 11,
    color: "#0f172a",
    fontWeight: "bold",
  },
  // Flight card
  flightCard: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 14,
    marginBottom: 14,
  },
  flightCardTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  flightRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  flightCol: {
    flex: 1,
  },
  flightLabel: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 1,
    textTransform: "uppercase",
  },
  flightValue: {
    fontSize: 10,
    color: "#0f172a",
  },
  flightValueBold: {
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
  },
  remarkBox: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 2,
    borderLeftWidth: 3,
    borderLeftColor: "#1e3a8a",
  },
  remarkLabel: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  remarkText: {
    fontSize: 9,
    color: "#334155",
  },
  // Grand total
  totalBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 14,
    paddingRight: 16,
    borderTopWidth: 2,
    borderTopColor: "#1e3a8a",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginRight: 12,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  footerText: {
    fontSize: 8,
    color: "#64748b",
    textAlign: "center",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
  },
  contactText: {
    fontSize: 8,
    color: "#475569",
  },
  contactTextSecond: {
    fontSize: 8,
    color: "#475569",
    marginLeft: 16,
  },
});

interface Flight {
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  flightNumber: string;
  terminal: string;
  arrivalTerminal: string;
  class: string;
  airline: string;
  duration: string;
  remark: string;
}

interface TicketPDFProps {
  ticket: {
    passengerName: string;
    pnr: string;
    ticketNumber: string;
    frequentFlyerNo: string;
    seatNo: string;
    email: string;
    meals: string;
    baggage: string;
    flights: Flight[];
    grandTotal?: {
      amount: number;
      currency: "EGP" | "USD";
    };
    showIssueDateTime?: boolean;
  };
}

const TicketPDF: React.FC<TicketPDFProps> = ({ ticket: ticketProp }) => {
  const ticket = {
    passengerName: ticketProp?.passengerName ?? "",
    pnr: ticketProp?.pnr ?? "",
    ticketNumber: ticketProp?.ticketNumber ?? "",
    frequentFlyerNo: ticketProp?.frequentFlyerNo ?? "",
    seatNo: ticketProp?.seatNo ?? "",
    email: ticketProp?.email ?? "",
    meals: ticketProp?.meals ?? "",
    baggage: ticketProp?.baggage ?? "",
    flights: Array.isArray(ticketProp?.flights) ? ticketProp.flights : [],
    grandTotal: ticketProp?.grandTotal,
    showIssueDateTime: Boolean(ticketProp?.showIssueDateTime),
  };
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const issuedAt = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;

  const n = (s: string | undefined) => (s != null && String(s).trim() !== "" ? String(s) : "—");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Text style={styles.brandName}>MAZ TRAVEL</Text>
            <Text style={styles.brandTagline}>Flight E-Ticket • Reservation & Support</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.docTitle}>E-TICKET</Text>
            <Text style={styles.docSubtitle}>PNR: {n(ticket.pnr)}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Passenger details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Passenger & booking details</Text>
            <View style={styles.passengerGrid}>
              <View style={styles.passengerItem}>
                <Text style={styles.fieldLabel}>Passenger name</Text>
                <Text style={styles.fieldValue}>{n(ticket.passengerName)}</Text>
              </View>
              <View style={styles.passengerItem}>
                <Text style={styles.fieldLabel}>PNR</Text>
                <Text style={styles.fieldValue}>{n(ticket.pnr)}</Text>
              </View>
              <View style={styles.passengerItem}>
                <Text style={styles.fieldLabel}>Ticket number</Text>
                <Text style={styles.fieldValue}>{n(ticket.ticketNumber)}</Text>
              </View>
              <View style={styles.passengerItem}>
                <Text style={styles.fieldLabel}>Seat</Text>
                <Text style={styles.fieldValue}>{n(ticket.seatNo)}</Text>
              </View>
              <View style={styles.passengerItem}>
                <Text style={styles.fieldLabel}>Frequent flyer no.</Text>
                <Text style={styles.fieldValue}>{n(ticket.frequentFlyerNo)}</Text>
              </View>
              <View style={styles.passengerItem}>
                <Text style={styles.fieldLabel}>Email</Text>
                <Text style={styles.fieldValue}>{n(ticket.email)}</Text>
              </View>
              <View style={styles.passengerItem}>
                <Text style={styles.fieldLabel}>Baggage</Text>
                <Text style={styles.fieldValue}>{n(ticket.baggage)}</Text>
              </View>
              <View style={styles.passengerItem}>
                <Text style={styles.fieldLabel}>Meals</Text>
                <Text style={styles.fieldValue}>{n(ticket.meals)}</Text>
              </View>
            </View>
          </View>

          {/* Flights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Flight details</Text>
            {ticket.flights.map((flight, index) => (
              <View key={index} style={styles.flightCard}>
                <Text style={styles.flightCardTitle}>Flight {index + 1} • {flight.airline || "—"} • {flight.flightNumber || "—"}</Text>
                <View style={styles.flightRow}>
                  <View style={styles.flightCol}>
                    <Text style={styles.flightLabel}>From</Text>
                    <Text style={styles.flightValueBold}>{n(flight.from)}</Text>
                    <Text style={styles.flightValue}>
                      {n(flight.departureDate)} {n(flight.departureTime)}
                      {flight.terminal ? ` • Terminal ${flight.terminal}` : ""}
                    </Text>
                  </View>
                  <View style={styles.flightCol}>
                    <Text style={styles.flightLabel}>Duration</Text>
                    <Text style={styles.flightValue}>{n(flight.duration)}</Text>
                  </View>
                  <View style={styles.flightCol}>
                    <Text style={styles.flightLabel}>To</Text>
                    <Text style={styles.flightValueBold}>{n(flight.to)}</Text>
                    <Text style={styles.flightValue}>
                      {n(flight.arrivalDate)} {n(flight.arrivalTime)}
                      {flight.arrivalTerminal ? ` • Terminal ${flight.arrivalTerminal}` : ""}
                    </Text>
                  </View>
                </View>
                <View style={styles.flightRow}>
                  <View style={styles.flightCol}>
                    <Text style={styles.flightLabel}>Class</Text>
                    <Text style={styles.flightValue}>{n(flight.class)}</Text>
                  </View>
                </View>
                {flight.remark ? (
                  <View style={styles.remarkBox}>
                    <Text style={styles.remarkLabel}>Remark</Text>
                    <Text style={styles.remarkText}>{flight.remark}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>

          {/* Grand total */}
          {ticket.grandTotal ? (
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Grand total</Text>
              <Text style={styles.totalValue}>
                {ticket.grandTotal.currency === "EGP" ? "EGP " : "USD "}
                {ticket.grandTotal.amount.toLocaleString()}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {ticket.showIssueDateTime ? (
            <Text style={styles.footerText}>Issued on {issuedAt}</Text>
          ) : null}
          <View style={styles.contactRow}>
            <Text style={styles.contactText}>reservation@maztravel.net</Text>
            <Text style={styles.contactTextSecond}>01005599399 / 01010737343</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TicketPDF;
