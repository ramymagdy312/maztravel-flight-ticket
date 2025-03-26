import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#1e40af',
    paddingBottom: 10,
  },
  headerContent: {
    flex: 1,
  },
  logo: {
    width: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  companyInfo: {
    fontSize: 10,
    color: '#1e40af',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  sectionTitle: {
    backgroundColor: '#1e40af',
    color: '#ffffff',
    padding: 5,
    marginBottom: 10,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 5,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
  },
  value: {
    fontSize: 12,
    marginTop: 2,
  },
  flightDetails: {
    marginTop: 20,
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  flightSection: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
  },
  flightNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  totalSection: {
    marginTop: 20,
    borderTop: 2,
    borderTopColor: '#1e40af',
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 5,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginRight: 20,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
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
      currency: 'EGP' | 'USD';
    };
  };
}

const TicketPDF: React.FC<TicketPDFProps> = ({ ticket }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            style={styles.logo}
            src="https://maztravel.net/wp-content/uploads/2024/02/maz-travel-logo.png"
          />
          <Text style={styles.companyInfo}>MAZ TRAVEL</Text>
          <Text style={styles.companyInfo}>EMAIL: RESERVATION@MAZTRAVEL.NET</Text>
          <Text style={styles.companyInfo}>PHONE: 01005599399 / 01010737343</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>FLIGHT E-TICKET</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PASSENGER DETAILS</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Pax Name</Text>
            <Text style={styles.value}>{ticket.passengerName || 'N/A'}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>PNR</Text>
            <Text style={styles.value}>{ticket.pnr || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Ticket Number</Text>
            <Text style={styles.value}>{ticket.ticketNumber || 'N/A'}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Seat No.</Text>
            <Text style={styles.value}>{ticket.seatNo || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Frequent flyer no</Text>
            <Text style={styles.value}>{ticket.frequentFlyerNo || 'N/A'}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{ticket.email || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Baggage Allowance</Text>
            <Text style={styles.value}>{ticket.baggage || 'N/A'}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Meals</Text>
            <Text style={styles.value}>{ticket.meals || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FLIGHT DETAILS</Text>
        {ticket.flights.map((flight, index) => (
          <View key={index} style={styles.flightSection}>
            <Text style={styles.flightNumber}>Flight {index + 1}</Text>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Flight</Text>
                <Text style={styles.value}>
                  {`${flight.class || 'N/A'}\n${flight.airline || 'N/A'}\n${flight.flightNumber || 'N/A'}`}
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Departs</Text>
                <Text style={styles.value}>
                  {`${flight.departureDate || 'N/A'} ${flight.departureTime || 'N/A'}\n${flight.from || 'N/A'}`}
                  {flight.terminal ? `\nTerminal: ${flight.terminal}` : ''}
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Duration</Text>
                <Text style={styles.value}>{flight.duration || 'N/A'}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Arrives</Text>
                <Text style={styles.value}>
                  {`${flight.arrivalDate || 'N/A'} ${flight.arrivalTime || 'N/A'}\n${flight.to || 'N/A'}`}
                  {flight.arrivalTerminal ? `\nTerminal: ${flight.arrivalTerminal}` : ''}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {ticket.grandTotal && (
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total:</Text>
            <Text style={styles.totalValue}>
              {ticket.grandTotal.currency === 'EGP' ? 'EGP ' : '$ '}
              {ticket.grandTotal.amount.toLocaleString()}
            </Text>
          </View>
        </View>
      )}
    </Page>
  </Document>
);

export default TicketPDF;