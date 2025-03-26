import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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
});

interface TicketPDFProps {
  ticket: {
    passengerName: string;
    pnr: string;
    ticketNumber: string;
    frequentFlyerNo: string;
    seatNo: string;
    from: string;
    to: string;
    departureDate: string;
    departureTime: string;
    arrivalDate: string;
    arrivalTime: string;
    flightNumber: string;
    class: string;
    airline: string;
    duration: string;
    meals: string;
    baggage: string;
    terminal: string;
    arrivalTerminal: string;
  };
}

const TicketPDF: React.FC<TicketPDFProps> = ({ ticket }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>FLIGHT E-TICKET</Text>
          <Text style={styles.companyInfo}>MAZ TRAVEL</Text>
          <Text style={styles.companyInfo}>EMAIL: RESERVATION@MAZTRAVEL.NET</Text>
          <Text style={styles.companyInfo}>PHONE: 01005599399 / 01010737343</Text>
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
            <Text style={styles.label}>Meals</Text>
            <Text style={styles.value}>{ticket.meals || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Baggage Allowance</Text>
            <Text style={styles.value}>{ticket.baggage || 'N/A'}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Airline</Text>
            <Text style={styles.value}>{ticket.airline || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FLIGHT DETAILS</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Flight</Text>
            <Text style={styles.value}>{`${ticket.class || 'N/A'}\n${ticket.flightNumber || 'N/A'}`}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Departs</Text>
            <Text style={styles.value}>
              {`${ticket.departureDate || 'N/A'} ${ticket.departureTime || 'N/A'}\n${ticket.from || 'N/A'}`}
              {ticket.terminal ? `\nTerminal: ${ticket.terminal}` : ''}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{ticket.duration || 'N/A'}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Arrives</Text>
            <Text style={styles.value}>
              {`${ticket.arrivalDate || 'N/A'} ${ticket.arrivalTime || 'N/A'}\n${ticket.to || 'N/A'}`}
              {ticket.arrivalTerminal ? `\nTerminal: ${ticket.arrivalTerminal}` : ''}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default TicketPDF;