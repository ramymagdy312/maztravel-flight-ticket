import React, { useState, useEffect } from 'react';
import { Plane, Mail, Calendar, User, MapPin, Clock, Hash, Utensils, Briefcase } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPDF from './TicketPDF';

interface FlightDetails {
  passengerName: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  email: string;
  pnr: string;
  ticketNumber: string;
  frequentFlyerNo: string;
  seatNo: string;
  flightNumber: string;
  terminal: string;
  arrivalTerminal: string;
  class: string;
  airline: string;
  duration: string;
  meals: string;
  baggage: string;
}

const AIRLINES = ['Egyptair', 'AirCairo', 'Turkish Airlines'] as const;
const TICKET_CLASSES = ['Economy', 'Business Class'] as const;

const FlightTicketForm: React.FC = () => {
  const [flightDetails, setFlightDetails] = useState<FlightDetails>({
    passengerName: '',
    from: '',
    to: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    email: '',
    pnr: '',
    ticketNumber: '',
    frequentFlyerNo: '',
    seatNo: '',
    flightNumber: '',
    terminal: '',
    arrivalTerminal: '',
    class: 'Economy',
    airline: 'Egyptair',
    duration: '',
    meals: '',
    baggage: '2P Cabin: 5-7Kg'
  });

  useEffect(() => {
    if (flightDetails.departureDate && flightDetails.departureTime && 
        flightDetails.arrivalDate && flightDetails.arrivalTime) {
      const departure = new Date(`${flightDetails.departureDate}T${flightDetails.departureTime}`);
      const arrival = new Date(`${flightDetails.arrivalDate}T${flightDetails.arrivalTime}`);
      
      const diffInMinutes = Math.abs(arrival.getTime() - departure.getTime()) / (1000 * 60);
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = Math.round(diffInMinutes % 60);
      
      const duration = `${hours}h ${minutes}m`;
      setFlightDetails(prev => ({ ...prev, duration }));
    }
  }, [flightDetails.departureDate, flightDetails.departureTime, flightDetails.arrivalDate, flightDetails.arrivalTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // PDF download will be handled by PDFDownloadLink
  };

  return (
    <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-center mb-8">
        <Plane className="w-10 h-10 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800 ml-3">Flight Ticket Details</h2>
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
              onChange={(e) => setFlightDetails({ ...flightDetails, passengerName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <Plane className="w-5 h-5 mr-2" />
              <span>Airline</span>
            </label>
            <select
              value={flightDetails.airline}
              onChange={(e) => setFlightDetails({ ...flightDetails, airline: e.target.value })}
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
              value={flightDetails.class}
              onChange={(e) => setFlightDetails({ ...flightDetails, class: e.target.value })}
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
              <Hash className="w-5 h-5 mr-2" />
              <span>PNR</span>
            </label>
            <input
              type="text"
              value={flightDetails.pnr}
              onChange={(e) => setFlightDetails({ ...flightDetails, pnr: e.target.value })}
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
              onChange={(e) => setFlightDetails({ ...flightDetails, ticketNumber: e.target.value })}
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
              onChange={(e) => setFlightDetails({ ...flightDetails, frequentFlyerNo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <MapPin className="w-5 h-5 mr-2" />
              <span>From</span>
            </label>
            <input
              type="text"
              value={flightDetails.from}
              onChange={(e) => setFlightDetails({ ...flightDetails, from: e.target.value })}
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
              value={flightDetails.to}
              onChange={(e) => setFlightDetails({ ...flightDetails, to: e.target.value })}
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
              value={flightDetails.departureDate}
              onChange={(e) => setFlightDetails({ ...flightDetails, departureDate: e.target.value })}
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
              value={flightDetails.departureTime}
              onChange={(e) => setFlightDetails({ ...flightDetails, departureTime: e.target.value })}
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
              value={flightDetails.arrivalDate}
              onChange={(e) => setFlightDetails({ ...flightDetails, arrivalDate: e.target.value })}
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
              value={flightDetails.arrivalTime}
              onChange={(e) => setFlightDetails({ ...flightDetails, arrivalTime: e.target.value })}
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
              value={flightDetails.duration}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <Hash className="w-5 h-5 mr-2" />
              <span>Flight Number</span>
            </label>
            <input
              type="text"
              value={flightDetails.flightNumber}
              onChange={(e) => setFlightDetails({ ...flightDetails, flightNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
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
              onChange={(e) => setFlightDetails({ ...flightDetails, seatNo: e.target.value })}
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
              onChange={(e) => setFlightDetails({ ...flightDetails, baggage: e.target.value })}
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
              onChange={(e) => setFlightDetails({ ...flightDetails, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <PDFDownloadLink
            document={<TicketPDF ticket={flightDetails} />}
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