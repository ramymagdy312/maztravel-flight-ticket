"use client";

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
  MessageSquare,
  Download,
  Send,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import TicketPDF from "./TicketPDF";
import { saveTicket } from "@/lib/ticket-store";
import { getAirlines, getTicketClasses } from "@/lib/settings-store";
import type { Flight, FlightDetails } from "@/lib/types";

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
  class: "",
  airline: "",
  duration: "",
  remark: "",
};

const FlightTicketForm: React.FC = () => {
  const [airlines, setAirlines] = useState<string[]>([]);
  const [ticketClasses, setTicketClasses] = useState<string[]>([]);

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
  const [grandTotalCurrency, setGrandTotalCurrency] =
    useState<"EGP" | "USD">("EGP");
  const [showIssueDateTime, setShowIssueDateTime] = useState(false);
  const [sending, setSending] = useState(false);
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

      if (airlineNames.length > 0 || classNames.length > 0) {
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
  }, []);

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

  useEffect(() => {
    const updatedFlights = flightDetails.flights.map((flight) => {
      const autoDuration = calculateDuration(flight);
      return {
        ...flight,
        duration: flight.duration || autoDuration,
      };
    });

    setFlightDetails((prev) => ({
      ...prev,
      flights: updatedFlights,
    }));
  }, [
    flightDetails.flights
      .map((f) => `${f.departureDate}${f.departureTime}${f.arrivalDate}${f.arrivalTime}`)
      .join(),
  ]);

  const handleFlightChange = (index: number, field: keyof Flight, value: string) => {
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

  const getTicketData = () => {
    const ticketData = { ...flightDetails };
    if (showGrandTotal && grandTotalAmount) {
      ticketData.grandTotal = {
        amount: parseFloat(grandTotalAmount),
        currency: grandTotalCurrency,
      };
    }
    ticketData.showIssueDateTime = showIssueDateTime;
    return ticketData;
  };

  /** Plain object copy for react-pdf: no undefined/null, no getters (avoids hasOwnProperty errors) */
  const getTicketDataForPdf = (): FlightDetails => {
    const raw = getTicketData();
    const str = JSON.stringify(raw);
    const parsed = JSON.parse(str) as FlightDetails;
    const emptyFlightOut: Flight = {
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
      airline: "Air Cairo",
      duration: "",
      remark: "",
    };
    const ensureString = (v: unknown): string => (v != null && typeof v === "string" ? v : "");
    parsed.passengerName = ensureString(parsed.passengerName);
    parsed.email = ensureString(parsed.email);
    parsed.pnr = ensureString(parsed.pnr);
    parsed.ticketNumber = ensureString(parsed.ticketNumber);
    parsed.frequentFlyerNo = ensureString(parsed.frequentFlyerNo);
    parsed.seatNo = ensureString(parsed.seatNo);
    parsed.meals = ensureString(parsed.meals);
    parsed.baggage = ensureString(parsed.baggage);
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
    return parsed;
  };

  const sendEmail = async () => {
    try {
      setSending(true);
      const ticketData = getTicketDataForPdf();
      const pdfBlob = await pdf(<TicketPDF ticket={ticketData} />).toBlob();
      const pdfBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(",")[1]);
        };
        reader.readAsDataURL(pdfBlob);
      });

      const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!baseUrl || !anonKey) {
        throw new Error(
          "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
        );
      }

      const response = await fetch(`${baseUrl}/functions/v1/send-ticket`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${anonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfBase64,
          recipientEmail: flightDetails.email,
          subject: `Flight Ticket - PNR: ${flightDetails.pnr}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      await saveTicket(ticketData, "sent");
      alert("Ticket has been sent to your email!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendEmail();
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
      await saveTicket(ticket, "downloaded");
    } catch (error) {
      console.error("Error generating PDF:", error);
      const message = error instanceof Error ? error.message : "Failed to generate PDF. Please try again.";
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
            <h1 className="text-xl font-bold tracking-tight">Flight E-Ticket</h1>
            <p className="text-blue-100 text-sm mt-0.5">Enter passenger and flight details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Passenger details card */}
        <section className="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-200">
            <User className="w-5 h-5 text-blue-600" />
            Passenger & booking details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}><User className={iconClass} /> Passenger Name</label>
              <input
                type="text"
                value={flightDetails.passengerName}
                onChange={(e) => setFlightDetails({ ...flightDetails, passengerName: e.target.value })}
                className={inputClass}
                required
              />
            </div>
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
              <label className={labelClass}><Hash className={iconClass} /> Ticket Number</label>
              <input
                type="text"
                value={flightDetails.ticketNumber}
                onChange={(e) => setFlightDetails({ ...flightDetails, ticketNumber: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}><Hash className={iconClass} /> Frequent Flyer No.</label>
              <input
                type="text"
                value={flightDetails.frequentFlyerNo}
                onChange={(e) => setFlightDetails({ ...flightDetails, frequentFlyerNo: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}><Hash className={iconClass} /> Seat Number</label>
              <input
                type="text"
                value={flightDetails.seatNo}
                onChange={(e) => setFlightDetails({ ...flightDetails, seatNo: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}><Briefcase className={iconClass} /> Baggage</label>
              <input
                type="text"
                value={flightDetails.baggage}
                onChange={(e) => setFlightDetails({ ...flightDetails, baggage: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}><Utensils className={iconClass} /> Meals</label>
              <input
                type="text"
                value={flightDetails.meals}
                onChange={(e) => setFlightDetails({ ...flightDetails, meals: e.target.value })}
                placeholder="e.g. Vegetarian, Halal"
                className={inputClass}
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
                  <input
                    type="text"
                    value={flight.from}
                    onChange={(e) => handleFlightChange(index, "from", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}><MapPin className={iconClass} /> To</label>
                  <input
                    type="text"
                    value={flight.to}
                    onChange={(e) => handleFlightChange(index, "to", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}><Calendar className={iconClass} /> Departure date</label>
                  <input
                    type="date"
                    value={flight.departureDate}
                    onChange={(e) => handleFlightChange(index, "departureDate", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}><Clock className={iconClass} /> Departure time</label>
                  <input
                    type="time"
                    value={flight.departureTime}
                    onChange={(e) => handleFlightChange(index, "departureTime", e.target.value)}
                    step="60"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}><Calendar className={iconClass} /> Arrival date</label>
                  <input
                    type="date"
                    value={flight.arrivalDate}
                    onChange={(e) => handleFlightChange(index, "arrivalDate", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}><Clock className={iconClass} /> Arrival time</label>
                  <input
                    type="time"
                    value={flight.arrivalTime}
                    onChange={(e) => handleFlightChange(index, "arrivalTime", e.target.value)}
                    step="60"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}><Hash className={iconClass} /> Flight number</label>
                  <input
                    type="text"
                    value={flight.flightNumber}
                    onChange={(e) => handleFlightChange(index, "flightNumber", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}><Clock className={iconClass} /> Duration</label>
                  <input
                    type="text"
                    value={flight.duration}
                    onChange={(e) => handleFlightChange(index, "duration", e.target.value)}
                    placeholder="e.g. 2h 30m"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}><MessageSquare className={iconClass} /> Remark</label>
                  <textarea
                    value={flight.remark}
                    onChange={(e) => handleFlightChange(index, "remark", e.target.value)}
                    rows={3}
                    placeholder="Additional notes for this flight..."
                    className={inputClass + " resize-none"}
                  />
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
              <input
                type="checkbox"
                checked={showGrandTotal}
                onChange={(e) => setShowGrandTotal(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Show grand total on ticket</span>
            </label>
            {showGrandTotal && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pl-7">
                <div>
                  <label className={labelClass}>Amount</label>
                  <input
                    type="number"
                    value={grandTotalAmount}
                    onChange={(e) => setGrandTotalAmount(e.target.value)}
                    className={inputClass}
                    required={showGrandTotal}
                  />
                </div>
                <div>
                  <label className={labelClass}>Currency</label>
                  <select
                    value={grandTotalCurrency}
                    onChange={(e) => setGrandTotalCurrency(e.target.value as "EGP" | "USD")}
                    className={inputClass}
                    required={showGrandTotal}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <label htmlFor="showIssueDateTime" className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                id="showIssueDateTime"
                checked={showIssueDateTime}
                onChange={(e) => setShowIssueDateTime(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Show ticket issue date & time on PDF</span>
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
            disabled={sending}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            {sending ? "Sending…" : "Send to email"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlightTicketForm;

