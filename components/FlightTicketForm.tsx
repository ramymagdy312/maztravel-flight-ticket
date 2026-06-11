"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  MessageSquare,
  Download,
  Save,
  Users,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import TicketPDF from "./TicketPDF";
import { saveTicket, updateTicket } from "@/lib/ticket-store";
import { getAirlines, getTicketClasses } from "@/lib/settings-store";
import type { Flight, FlightDetails, Passenger, SavedTicket } from "@/lib/types";

interface FlightTicketFormProps {
  initialTicket?: SavedTicket;
}

const CURRENCIES = ["EGP", "USD"] as const;

const emptyPassenger: Passenger = {
  name: "",
  ticketNumber: "",
  frequentFlyerNo: "",
  seatNo: "",
  meals: "",
  baggage: "2P Cabin: 5-7Kg",
};

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
  class: "",
  airline: "",
  duration: "",
  remark: "",
};

function buildFlightDetailsFromTicket(ticket: SavedTicket): FlightDetails {
  return {
    passengers: ticket.passengers.length > 0 ? ticket.passengers : [{ ...emptyPassenger }],
    email: ticket.email,
    pnr: ticket.pnr,
    flights: ticket.flights.length > 0 ? ticket.flights : [{ ...emptyFlight }],
  };
}

const FlightTicketForm: React.FC<FlightTicketFormProps> = ({ initialTicket }) => {
  const router = useRouter();
  const isEditing = Boolean(initialTicket?.id);
  const [ticketId] = useState(initialTicket?.id);

  const [airlines, setAirlines] = useState<string[]>([]);
  const [ticketClasses, setTicketClasses] = useState<string[]>([]);

  const [flightDetails, setFlightDetails] = useState<FlightDetails>(() =>
    initialTicket
      ? buildFlightDetailsFromTicket(initialTicket)
      : {
          passengers: [{ ...emptyPassenger }],
          email: "",
          pnr: "",
          flights: [{ ...emptyFlight }],
        }
  );

  const [showGrandTotal, setShowGrandTotal] = useState(() => Boolean(initialTicket?.grandTotal));
  const [grandTotalAmount, setGrandTotalAmount] = useState(() =>
    initialTicket?.grandTotal ? String(initialTicket.grandTotal.amount) : ""
  );
  const [grandTotalCurrency, setGrandTotalCurrency] = useState<"EGP" | "USD">(
    () => initialTicket?.grandTotal?.currency ?? "EGP"
  );
  const [showIssueDateTime, setShowIssueDateTime] = useState(
    () => initialTicket?.showIssueDateTime ?? false
  );
  const [showCompanyInfo, setShowCompanyInfo] = useState(
    () => initialTicket?.showCompanyInfo ?? true
  );
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const [airlinesData, classesData] = await Promise.all([
        getAirlines(),
        getTicketClasses(),
      ]);
      const airlineNames = airlinesData.map((a) => a.name);
      const classNames = classesData.map((c) => c.name);
      setAirlines(airlineNames);
      setTicketClasses(classNames);

      if (!isEditing && (airlineNames.length > 0 || classNames.length > 0)) {
        setFlightDetails((prev) => ({
          ...prev,
          flights: prev.flights.map((f) => ({
            ...f,
            airline: f.airline || airlineNames[0] || "",
            class: f.class || classNames[0] || "",
          })),
        }));
      }
    }
    loadSettings();
  }, [isEditing]);

  const calculateDuration = (flight: Flight) => {
    if (
      flight.departureDate &&
      flight.departureTime &&
      flight.arrivalDate &&
      flight.arrivalTime
    ) {
      const departure = new Date(`${flight.departureDate}T${flight.departureTime}`);
      const arrival = new Date(`${flight.arrivalDate}T${flight.arrivalTime}`);
      const diffInMinutes =
        Math.abs(arrival.getTime() - departure.getTime()) / (1000 * 60);
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = Math.round(diffInMinutes % 60);
      return `${hours}h ${minutes}m`;
    }
    return "";
  };

  const flightScheduleKey = flightDetails.flights
    .map((f) => `${f.departureDate}${f.departureTime}${f.arrivalDate}${f.arrivalTime}`)
    .join();

  useEffect(() => {
    setFlightDetails((prev) => {
      const updatedFlights = prev.flights.map((flight) => {
        const autoDuration = calculateDuration(flight);
        return { ...flight, duration: flight.duration || autoDuration };
      });
      const unchanged = updatedFlights.every(
        (f, i) => f.duration === prev.flights[i]?.duration
      );
      if (unchanged) return prev;
      return { ...prev, flights: updatedFlights };
    });
  }, [flightScheduleKey]);

  // ── Passenger handlers ──
  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...flightDetails.passengers];
    updated[index] = { ...updated[index], [field]: value };
    setFlightDetails((prev) => ({ ...prev, passengers: updated }));
  };

  const addPassenger = () => {
    setFlightDetails((prev) => ({
      ...prev,
      passengers: [...prev.passengers, { ...emptyPassenger }],
    }));
  };

  const removePassenger = (index: number) => {
    if (flightDetails.passengers.length > 1) {
      setFlightDetails((prev) => ({
        ...prev,
        passengers: prev.passengers.filter((_, i) => i !== index),
      }));
    }
  };

  // ── Flight handlers ──
  const handleFlightChange = (index: number, field: keyof Flight, value: string) => {
    const newFlights = [...flightDetails.flights];
    newFlights[index] = { ...newFlights[index], [field]: value };
    setFlightDetails((prev) => ({ ...prev, flights: newFlights }));
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

  // ── Data helpers ──
  const getTicketData = (): FlightDetails => {
    const data = { ...flightDetails };
    if (showGrandTotal && grandTotalAmount) {
      data.grandTotal = {
        amount: parseFloat(grandTotalAmount),
        currency: grandTotalCurrency,
      };
    }
    data.showIssueDateTime = showIssueDateTime;
    data.showCompanyInfo = showCompanyInfo;
    return data;
  };

  const getTicketDataForPdf = (): FlightDetails => {
    const raw = getTicketData();
    const str = JSON.stringify(raw);
    const parsed = JSON.parse(str) as FlightDetails;
    const ensureString = (v: unknown): string =>
      v != null && typeof v === "string" ? v : "";

    parsed.email = ensureString(parsed.email);
    parsed.pnr = ensureString(parsed.pnr);

    parsed.passengers = (parsed.passengers || []).map((p) => ({
      name: ensureString(p.name),
      ticketNumber: ensureString(p.ticketNumber),
      frequentFlyerNo: ensureString(p.frequentFlyerNo),
      seatNo: ensureString(p.seatNo),
      meals: ensureString(p.meals),
      baggage: ensureString(p.baggage),
    }));

    const emptyFlightOut: Flight = {
      from: "", to: "", departureDate: "", departureTime: "",
      arrivalDate: "", arrivalTime: "", flightNumber: "", terminal: "",
      arrivalTerminal: "", class: "", airline: "", duration: "", remark: "",
    };
    parsed.flights = (parsed.flights || []).map((f) => {
      const o: Flight = { ...emptyFlightOut };
      (Object.keys(emptyFlightOut) as Array<keyof Flight>).forEach((k) => {
        (o[k] as unknown as string) = ensureString(
          (f as unknown as Record<string, unknown>)[k as unknown as string]
        );
      });
      return o;
    });

    if (parsed.grandTotal) {
      parsed.grandTotal = {
        amount: Number(parsed.grandTotal.amount) || 0,
        currency: parsed.grandTotal.currency === "USD" ? "USD" : "EGP",
      };
    }
    parsed.showCompanyInfo = parsed.showCompanyInfo !== false;
    return parsed;
  };

  // ── Actions ──
  const handleSave = async () => {
    try {
      setSaving(true);
      const ticketData = getTicketDataForPdf();
      const status = isEditing && initialTicket ? initialTicket.status : "draft";

      if (isEditing && ticketId) {
        await updateTicket(ticketId, ticketData, status);
      } else {
        await saveTicket(ticketData, "draft");
      }
      alert("Ticket saved successfully!");
      router.push("/dashboard/tickets");
    } catch (error) {
      console.error("Error saving ticket:", error);
      alert("Failed to save ticket. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave();
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const ticket = getTicketDataForPdf();
      const blob = await pdf(<TicketPDF ticket={ticket} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `flight-ticket-${flightDetails.pnr || "ticket"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      if (isEditing && ticketId) {
        await updateTicket(ticketId, ticket, "downloaded");
      } else {
        await saveTicket(ticket, "downloaded");
      }
      if (isEditing) router.push("/dashboard/tickets");
    } catch (error) {
      console.error("Error generating PDF:", error);
      const message = error instanceof Error ? error.message : "Failed to generate PDF.";
      alert(message);
    } finally {
      setDownloading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-colors outline-none";
  const labelClass = "flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5";
  const iconClass = "w-4 h-4 text-blue-600 shrink-0";

  return (
    <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <img src="/Logo.png" alt="Maz Travel" className="h-10 w-auto object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {isEditing ? "Edit Flight E-Ticket" : "Flight E-Ticket"}
            </h1>
            <p className="text-blue-100 text-sm mt-0.5">
              {isEditing ? "Update booking and passenger details" : "Enter booking and passenger details"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Booking details (shared) */}
        <section className="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-200">
            <Hash className="w-5 h-5 text-blue-600" />
            Booking details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}><Hash className={iconClass} /> PNR</label>
              <input
                type="text"
                value={flightDetails.pnr}
                onChange={(e) => setFlightDetails({ ...flightDetails, pnr: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}><Mail className={iconClass} /> Email</label>
              <input
                type="email"
                value={flightDetails.email}
                onChange={(e) => setFlightDetails({ ...flightDetails, email: e.target.value })}
                className={inputClass}
                required
              />
            </div>
          </div>
        </section>

        {/* Passengers section */}
        <section className="space-y-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 pb-3 border-b border-gray-200">
            <Users className="w-5 h-5 text-blue-600" />
            Passengers ({flightDetails.passengers.length})
          </h2>
          {flightDetails.passengers.map((passenger, pIdx) => (
            <div
              key={pIdx}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Passenger {pIdx + 1}
                </span>
                {flightDetails.passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassenger(pIdx)}
                    className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={labelClass}><User className={iconClass} /> Name</label>
                  <input
                    type="text"
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(pIdx, "name", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}><Hash className={iconClass} /> Ticket Number</label>
                  <input
                    type="text"
                    value={passenger.ticketNumber}
                    onChange={(e) => handlePassengerChange(pIdx, "ticketNumber", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}><Hash className={iconClass} /> Seat Number</label>
                  <input
                    type="text"
                    value={passenger.seatNo}
                    onChange={(e) => handlePassengerChange(pIdx, "seatNo", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}><Hash className={iconClass} /> Frequent Flyer No.</label>
                  <input
                    type="text"
                    value={passenger.frequentFlyerNo}
                    onChange={(e) => handlePassengerChange(pIdx, "frequentFlyerNo", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}><Briefcase className={iconClass} /> Baggage</label>
                  <input
                    type="text"
                    value={passenger.baggage}
                    onChange={(e) => handlePassengerChange(pIdx, "baggage", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}><Utensils className={iconClass} /> Meals</label>
                  <input
                    type="text"
                    value={passenger.meals}
                    onChange={(e) => handlePassengerChange(pIdx, "meals", e.target.value)}
                    placeholder="e.g. Vegetarian, Halal"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addPassenger}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 border-dashed border-emerald-300 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-400 font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add another passenger
          </button>
        </section>

        {/* Flight(s) section */}
        <section className="space-y-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 pb-3 border-b border-gray-200">
            <Plane className="w-5 h-5 text-blue-600" />
            Flight details
          </h2>
          {flightDetails.flights.map((flight, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Flight {index + 1}</span>
                {flightDetails.flights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFlight(index)}
                    className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}><Plane className={iconClass} /> Airline</label>
                  <select
                    value={flight.airline}
                    onChange={(e) => handleFlightChange(index, "airline", e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="">Select airline...</option>
                    {airlines.map((airline) => (
                      <option key={airline} value={airline}>{airline}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}><Hash className={iconClass} /> Class</label>
                  <select
                    value={flight.class}
                    onChange={(e) => handleFlightChange(index, "class", e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="">Select class...</option>
                    {ticketClasses.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}><MapPin className={iconClass} /> From</label>
                  <input type="text" value={flight.from} onChange={(e) => handleFlightChange(index, "from", e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}><MapPin className={iconClass} /> To</label>
                  <input type="text" value={flight.to} onChange={(e) => handleFlightChange(index, "to", e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}><Calendar className={iconClass} /> Departure date</label>
                  <input type="date" value={flight.departureDate} onChange={(e) => handleFlightChange(index, "departureDate", e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}><Clock className={iconClass} /> Departure time</label>
                  <input type="time" value={flight.departureTime} onChange={(e) => handleFlightChange(index, "departureTime", e.target.value)} step="60" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}><Calendar className={iconClass} /> Arrival date</label>
                  <input type="date" value={flight.arrivalDate} onChange={(e) => handleFlightChange(index, "arrivalDate", e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}><Clock className={iconClass} /> Arrival time</label>
                  <input type="time" value={flight.arrivalTime} onChange={(e) => handleFlightChange(index, "arrivalTime", e.target.value)} step="60" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}><Hash className={iconClass} /> Flight number</label>
                  <input type="text" value={flight.flightNumber} onChange={(e) => handleFlightChange(index, "flightNumber", e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}><Clock className={iconClass} /> Duration</label>
                  <input type="text" value={flight.duration} onChange={(e) => handleFlightChange(index, "duration", e.target.value)} placeholder="e.g. 2h 30m" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}><MessageSquare className={iconClass} /> Remark</label>
                  <textarea value={flight.remark} onChange={(e) => handleFlightChange(index, "remark", e.target.value)} rows={3} placeholder="Additional notes..." className={inputClass + " resize-none"} />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addFlight}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add another flight
          </button>
        </section>

        {/* Options */}
        <section className="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-4">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Ticket options
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={showGrandTotal} onChange={(e) => setShowGrandTotal(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Show grand total on ticket</span>
            </label>
            {showGrandTotal && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pl-7">
                <div>
                  <label className={labelClass}>Amount</label>
                  <input type="number" value={grandTotalAmount} onChange={(e) => setGrandTotalAmount(e.target.value)} className={inputClass} required={showGrandTotal} />
                </div>
                <div>
                  <label className={labelClass}>Currency</label>
                  <select value={grandTotalCurrency} onChange={(e) => setGrandTotalCurrency(e.target.value as "EGP" | "USD")} className={inputClass} required={showGrandTotal}>
                    {CURRENCIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
              </div>
            )}
            <label htmlFor="showIssueDateTime" className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" id="showIssueDateTime" checked={showIssueDateTime} onChange={(e) => setShowIssueDateTime(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Show ticket issue date & time on PDF</span>
            </label>
            <label htmlFor="showCompanyInfo" className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                id="showCompanyInfo"
                checked={showCompanyInfo}
                onChange={(e) => setShowCompanyInfo(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Show company info on PDF (name, email, phone)
              </span>
            </label>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            {downloading ? "Generating…" : "Download PDF"}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlightTicketForm;
