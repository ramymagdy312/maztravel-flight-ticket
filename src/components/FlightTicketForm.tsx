import React, { useState, useEffect } from "react";
import {
  Plane,
  Mail,
  Calendar,
  User,
  MapPin,
  Clock,
  Hash,
  Utensils,
  Briefcase,
  Plus,
  Trash2,
  DollarSign,
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TicketPDF from "./TicketPDF";

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

interface FlightDetails {
  passengerName: string;
  email: string;
  pnr: string;
  ticketNumber: string;
  frequentFlyerNo: string;
  seatNo: string;
  meals: string;
  baggage: string;
  flights: Flight[];
  grandTotal?: {
    amount: number;
    currency: "EGP" | "USD";
  };
}

const AIRLINES = ["Egyptair", "AirCairo", "Turkish Airlines"] as const;
const TICKET_CLASSES = ["Economy", "Business Class"] as const;
const CURRENCIES = ["EGP", "USD"] as const;

const emptyFlight: Flight = {
  from: "",
  to: "",
  departureDate: "",
  departureTime: "",
  arrivalDate: "",
  arrivalTime: "",
  flightNumber: "",
  terminal: "",
  arrivalTerminal: "",
  class: "Economy",
  airline: "Egyptair",
  duration: "",
};

const FlightTicketForm: React.FC = () => {
  const [flightDetails, setFlightDetails] = useState<FlightDetails>({
    passengerName: "",
    email: "",
    pnr: "",
    ticketNumber: "",
    frequentFlyerNo: "",
    seatNo: "",
    meals: "",
    baggage: "2P Cabin: 5-7Kg",
    flights: [{ ...emptyFlight }],
  });

  const [showGrandTotal, setShowGrandTotal] = useState(false);
  const [grandTotalAmount, setGrandTotalAmount] = useState("");
  const [grandTotalCurrency, setGrandTotalCurrency] = useState<"EGP" | "USD">(
    "EGP"
  );

  const calculateDuration = (flight: Flight) => {
    if (
      flight.departureDate &&
      flight.departureTime &&
      flight.arrivalDate &&
      flight.arrivalTime
    ) {
      const departure = new Date(
        `${flight.departureDate}T${flight.departureTime}`
      );
      const arrival = new Date(`${flight.arrivalDate}T${flight.arrivalTime}`);

      const diffInMinutes =
        Math.abs(arrival.getTime() - departure.getTime()) / (1000 * 60);
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = Math.round(diffInMinutes % 60);

      return `${hours}h ${minutes}m`;
    }
    return "";
  };

  useEffect(() => {
    const updatedFlights = flightDetails.flights.map((flight) => ({
      ...flight,
      duration: calculateDuration(flight),
    }));

    setFlightDetails((prev) => ({
      ...prev,
      flights: updatedFlights,
    }));
  }, [
    flightDetails.flights
      .map(
        (f) =>
          `${f.departureDate}${f.departureTime}${f.arrivalDate}${f.arrivalTime}`
      )
      .join(),
  ]);

  const handleFlightChange = (
    index: number,
    field: keyof Flight,
    value: string
  ) => {
    const newFlights = [...flightDetails.flights];
    newFlights[index] = {
      ...newFlights[index],
      [field]: value,
    };
    setFlightDetails((prev) => ({
      ...prev,
      flights: newFlights,
    }));
  };

  const addFlight = () => {
    setFlightDetails((prev) => ({
      ...prev,
      flights: [...prev.flights, { ...emptyFlight }],
    }));
  };

  const removeFlight = (index: number) => {
    if (flightDetails.flights.length > 1) {
      setFlightDetails((prev) => ({
        ...prev,
        flights: prev.flights.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // PDF download will be handled by PDFDownloadLink
  };

  const getTicketData = () => {
    const ticketData = { ...flightDetails };
    if (showGrandTotal && grandTotalAmount) {
      ticketData.grandTotal = {
        amount: parseFloat(grandTotalAmount),
        currency: grandTotalCurrency,
      };
    }
    return ticketData;
  };

  return (
    <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-center mb-8">
        <img src="Logo.png" alt="Maz Travel Logo" className="h-16 mr-4" />
        <h2 className="text-2xl font-bold text-gray-800 ml-3">
          Flight Ticket Details
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <User className="w-5 h-5 mr-2" />
              <span>Passenger Name</span>
            </label>
            <input
              type="text"
              value={flightDetails.passengerName}
              onChange={(e) =>
                setFlightDetails({
                  ...flightDetails,
                  passengerName: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <Hash className="w-5 h-5 mr-2" />
              <span>PNR</span>
            </label>
            <input
              type="text"
              value={flightDetails.pnr}
              onChange={(e) =>
                setFlightDetails({ ...flightDetails, pnr: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <Hash className="w-5 h-5 mr-2" />
              <span>Ticket Number</span>
            </label>
            <input
              type="text"
              value={flightDetails.ticketNumber}
              onChange={(e) =>
                setFlightDetails({
                  ...flightDetails,
                  ticketNumber: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <Hash className="w-5 h-5 mr-2" />
              <span>Frequent Flyer Number</span>
            </label>
            <input
              type="text"
              value={flightDetails.frequentFlyerNo}
              onChange={(e) =>
                setFlightDetails({
                  ...flightDetails,
                  frequentFlyerNo: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <Hash className="w-5 h-5 mr-2" />
              <span>Seat Number</span>
            </label>
            <input
              type="text"
              value={flightDetails.seatNo}
              onChange={(e) =>
                setFlightDetails({ ...flightDetails, seatNo: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <Briefcase className="w-5 h-5 mr-2" />
              <span>Baggage Allowance</span>
            </label>
            <input
              type="text"
              value={flightDetails.baggage}
              onChange={(e) =>
                setFlightDetails({ ...flightDetails, baggage: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <Mail className="w-5 h-5 mr-2" />
              <span>Email</span>
            </label>
            <input
              type="email"
              value={flightDetails.email}
              onChange={(e) =>
                setFlightDetails({ ...flightDetails, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          {flightDetails.flights.map((flight, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Flight {index + 1}
                </h3>
                {flightDetails.flights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFlight(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700">
                    <Plane className="w-5 h-5 mr-2" />
                    <span>Airline</span>
                  </label>
                  <select
                    value={flight.airline}
                    onChange={(e) =>
                      handleFlightChange(index, "airline", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {AIRLINES.map((airline) => (
                      <option key={airline} value={airline}>
                        {airline}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-700">
                    <Hash className="w-5 h-5 mr-2" />
                    <span>Class</span>
                  </label>
                  <select
                    value={flight.class}
                    onChange={(e) =>
                      handleFlightChange(index, "class", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {TICKET_CLASSES.map((ticketClass) => (
                      <option key={ticketClass} value={ticketClass}>
                        {ticketClass}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>From</span>
                  </label>
                  <input
                    type="text"
                    value={flight.from}
                    onChange={(e) =>
                      handleFlightChange(index, "from", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>To</span>
                  </label>
                  <input
                    type="text"
                    value={flight.to}
                    onChange={(e) =>
                      handleFlightChange(index, "to", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>Departure Date</span>
                  </label>
                  <input
                    type="date"
                    value={flight.departureDate}
                    onChange={(e) =>
                      handleFlightChange(index, "departureDate", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>Departure Time</span>
                  </label>
                  <input
                    type="time"
                    value={flight.departureTime}
                    onChange={(e) =>
                      handleFlightChange(index, "departureTime", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>Arrival Date</span>
                  </label>
                  <input
                    type="date"
                    value={flight.arrivalDate}
                    onChange={(e) =>
                      handleFlightChange(index, "arrivalDate", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>Arrival Time</span>
                  </label>
                  <input
                    type="time"
                    value={flight.arrivalTime}
                    onChange={(e) =>
                      handleFlightChange(index, "arrivalTime", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-700">
                    <Hash className="w-5 h-5 mr-2" />
                    <span>Flight Number</span>
                  </label>
                  <input
                    type="text"
                    value={flight.flightNumber}
                    onChange={(e) =>
                      handleFlightChange(index, "flightNumber", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>Duration</span>
                  </label>
                  <input
                    type="text"
                    value={flight.duration}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addFlight}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 border-2 border-dashed border-blue-500 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Another Flight</span>
          </button>
        </div>

        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showGrandTotal"
              checked={showGrandTotal}
              onChange={(e) => setShowGrandTotal(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showGrandTotal" className="text-gray-700">
              Add Grand Total
            </label>
          </div>

          {showGrandTotal && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center text-gray-700">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>Amount</span>
                </label>
                <input
                  type="number"
                  value={grandTotalAmount}
                  onChange={(e) => setGrandTotalAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={showGrandTotal}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-700">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>Currency</span>
                </label>
                <select
                  value={grandTotalCurrency}
                  onChange={(e) =>
                    setGrandTotalCurrency(e.target.value as "EGP" | "USD")
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={showGrandTotal}
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <PDFDownloadLink
            document={<TicketPDF ticket={getTicketData()} />}
            fileName={`flight-ticket-${flightDetails.pnr}.pdf`}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            {({ loading }) => (
              <>
                <Mail className="w-5 h-5" />
                <span>{loading ? "Generating PDF..." : "Download Ticket"}</span>
              </>
            )}
          </PDFDownloadLink>
        </div>
      </form>
    </div>
  );
};

export default FlightTicketForm;
