export interface Passenger {
  name: string;
  ticketNumber: string;
  frequentFlyerNo: string;
  seatNo: string;
  meals: string;
  baggage: string;
}

export interface Flight {
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

export interface FlightDetails {
  passengers: Passenger[];
  email: string;
  pnr: string;
  flights: Flight[];
  grandTotal?: {
    amount: number;
    currency: "EGP" | "USD";
  };
  showIssueDateTime?: boolean;
  showCompanyInfo?: boolean;
}

export interface SavedTicket extends FlightDetails {
  id: string;
  createdAt: string;
  status: "sent" | "downloaded" | "draft";
}
