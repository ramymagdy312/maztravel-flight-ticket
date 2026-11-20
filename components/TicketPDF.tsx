import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  Svg,
  Path,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  StyleSheet,
} from "@react-pdf/renderer";

const publicSrc = (path: string) =>
  typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

const mazLogoSrc = publicSrc("/Logo.png");
const worldMapSrc = publicSrc("/ticket-world-map.jpg");

const NAVY = "#0f2744";
const NAVY_DEEP = "#071a45";
const BLUE = "#1e4b9e";
const GOLD = "#c9a84c";
const MUTED = "#64748b";
const LABEL = "#94a3b8";
const PAGE_W = 596;
const HEADER_H = 94;

const CITY_IATA: [string, string][] = [
  ["cairo", "CAI"],
  ["sharm", "SSH"],
  ["hurghada", "HRG"],
  ["luxor", "LXR"],
  ["aswan", "ASW"],
  ["marsa alam", "RMF"],
  ["alexandria", "HBE"],
  ["athens", "ATH"],
  ["dubai", "DXB"],
  ["jeddah", "JED"],
  ["riyadh", "RUH"],
  ["dammam", "DMM"],
  ["kuwait", "KWI"],
  ["amman", "AMM"],
  ["beirut", "BEY"],
  ["istanbul", "IST"],
  ["doha", "DOH"],
  ["abu dhabi", "AUH"],
  ["sharjah", "SHJ"],
  ["medina", "MED"],
  ["london", "LHR"],
  ["paris", "CDG"],
  ["rome", "FCO"],
  ["milan", "MXP"],
  ["frankfurt", "FRA"],
  ["munich", "MUC"],
  ["vienna", "VIE"],
  ["barcelona", "BCN"],
  ["madrid", "MAD"],
];

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#eef3f8",
    padding: 0,
    paddingBottom: 104,
    fontFamily: "Helvetica",
  },
  worldMap: {
    position: "absolute",
    top: HEADER_H,
    left: 0,
    width: PAGE_W,
    height: 600,
    objectFit: "cover",
  },
  headerBar: {
    height: HEADER_H,
    backgroundColor: NAVY_DEEP,
    marginBottom: 18,
    overflow: "hidden",
  },
  headerAccent: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  headerInner: {
    position: "relative",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 26,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    backgroundColor: "#ffffff",
    borderRadius: 9,
    padding: 5,
    marginRight: 13,
  },
  logo: {
    width: 52,
    height: 52,
    objectFit: "contain",
  },
  brandName: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 8,
    color: "rgba(255,255,255,0.82)",
    letterSpacing: 0.2,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  headerRightCentered: {
    alignItems: "center",
    width: "100%",
  },
  docTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  headerPnrBadge: {
    backgroundColor: "#d2ac56",
    borderWidth: 1,
    borderColor: "#f1d98f",
    borderRadius: 4,
    paddingTop: 4,
    paddingBottom: 3,
    paddingHorizontal: 9,
  },
  headerPnrText: {
    fontSize: 13,
    fontWeight: "bold",
    color: NAVY_DEEP,
  },
  content: {
    paddingHorizontal: 28,
    paddingBottom: 12,
  },
  section: {
    marginBottom: 14,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#c3cfdf",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: BLUE,
    letterSpacing: 0.2,
  },
  bookingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bookingItem: {
    width: "50%",
    paddingRight: 16,
  },
  fieldLabel: {
    fontSize: 7,
    color: LABEL,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  labelRow: {
    position: "relative",
    marginBottom: 3,
  },
  labelIcon: {
    position: "absolute",
    left: 0,
    top: -1.5,
  },
  labelText: {
    fontSize: 7,
    color: LABEL,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingLeft: 14,
  },
  sectionIcon: {
    marginRight: 6,
  },
  fieldValue: {
    fontSize: 10,
    color: NAVY,
    fontWeight: "bold",
  },
  pnrBox: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#2c3f5f",
    borderRadius: 6,
    paddingTop: 6,
    paddingBottom: 5,
    paddingHorizontal: 12,
  },
  pnrValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: NAVY,
  },
  emailValue: {
    fontSize: 10,
    color: NAVY,
    fontWeight: "bold",
  },
  card: {
    position: "relative",
    backgroundColor: "#ffffff",
    borderWidth: 1.2,
    borderColor: "#3b4f6e",
    borderRadius: 7,
    paddingTop: 11,
    paddingBottom: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    overflow: "hidden",
  },
  cardGlass: {
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  goldBar: {
    position: "absolute",
    left: 60,
    right: 60,
    bottom: 0,
    height: 1.6,
    backgroundColor: GOLD,
  },
  passengerTitle: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: GOLD,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  passengerName: {
    fontSize: 13,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  passengerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  passengerItem: {
    width: "33.33%",
    marginBottom: 6,
    paddingRight: 8,
  },
  flightHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  flightHeadLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
    paddingRight: 8,
  },
  flightCardTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: NAVY,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginLeft: 5,
  },
  flightNumberValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.6,
    marginLeft: 8,
  },
  routeGraphic: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  routeLineWrap: {
    position: "relative",
    width: 90,
    height: 22,
    marginHorizontal: 4,
  },
  routePlane: {
    position: "absolute",
    top: 0,
    left: 39,
  },
  routeCode: {
    fontSize: 10,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.5,
  },
  flightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  flightColFrom: {
    width: "40%",
    paddingRight: 8,
  },
  flightColDuration: {
    width: "20%",
    paddingRight: 6,
    alignItems: "center",
    paddingTop: 10,
  },
  flightColTo: {
    width: "40%",
    paddingRight: 4,
  },
  flightLabel: {
    fontSize: 7,
    color: LABEL,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  flightAirport: {
    fontSize: 8.5,
    color: NAVY,
    marginBottom: 6,
  },
  flightDateValue: {
    fontSize: 12.5,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.2,
    marginBottom: 1,
  },
  flightTimeValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.3,
  },
  durationLabel: {
    fontSize: 7,
    color: LABEL,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  durationValue: {
    fontSize: 9,
    color: NAVY,
    fontWeight: "bold",
  },
  classWrap: {
    marginTop: 8,
  },
  classValue: {
    fontSize: 10,
    color: NAVY,
  },
  remarkBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
  },
  remarkLabel: {
    fontSize: 7,
    color: MUTED,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  remarkText: {
    fontSize: 9,
    color: "#334155",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#e9edf3",
    borderTopWidth: 1,
    borderTopColor: "#d3dae4",
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 32,
  },
  footerText: {
    fontSize: 7.5,
    color: "#3f4a5c",
    textAlign: "center",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
  },
  contactText: {
    fontSize: 7.5,
    color: "#3f4a5c",
  },
  contactTextSecond: {
    fontSize: 7.5,
    color: "#3f4a5c",
    marginLeft: 16,
  },
  footerRule: {
    marginTop: 12,
    height: 1.5,
    backgroundColor: "#1d3363",
  },
  totalWrap: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalPill: {
    backgroundColor: "#0b2766",
    borderWidth: 1,
    borderColor: "#3a5a9a",
    borderRadius: 4,
    paddingTop: 7,
    paddingBottom: 6,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 11.5,
    fontWeight: "bold",
    color: "#ffffff",
    marginRight: 12,
  },
  totalValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#d9b25b",
  },
});

function HeaderArt() {
  const cx = 405;
  const cy = 44;
  return (
    <Svg style={styles.headerAccent} width={PAGE_W} height={HEADER_H} viewBox={`0 0 ${PAGE_W} ${HEADER_H}`}>
      <Defs>
        <LinearGradient id="hdrBg" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#071a4d" />
          <Stop offset="0.55" stopColor="#0f3482" />
          <Stop offset="1" stopColor="#0a2563" />
        </LinearGradient>
        <RadialGradient id="hdrGlow" cx={cx} cy={cy} r="150" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#7cc4ff" stopOpacity={0.55} />
          <Stop offset="0.45" stopColor="#3f8fe0" stopOpacity={0.18} />
          <Stop offset="1" stopColor="#3f8fe0" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="beamA" x1={cx - 120} y1={cy - 70} x2={cx + 120} y2={cy + 70} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#bfe3ff" stopOpacity={0} />
          <Stop offset="0.5" stopColor="#d6eeff" stopOpacity={0.75} />
          <Stop offset="1" stopColor="#bfe3ff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id="beamB" x1={cx - 120} y1={cy + 70} x2={cx + 120} y2={cy - 70} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#bfe3ff" stopOpacity={0} />
          <Stop offset="0.5" stopColor="#d6eeff" stopOpacity={0.6} />
          <Stop offset="1" stopColor="#bfe3ff" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width={PAGE_W} height={HEADER_H} fill="url(#hdrBg)" />
      <Rect x="0" y="0" width={PAGE_W} height={HEADER_H} fill="url(#hdrGlow)" />
      <Path
        d={`M ${cx - 130} ${cy - 76} L ${cx - 104} ${cy - 76} L ${cx + 130} ${cy + 76} L ${cx + 104} ${cy + 76} Z`}
        fill="url(#beamA)"
      />
      <Path
        d={`M ${cx - 96} ${cy + 76} L ${cx - 78} ${cy + 76} L ${cx + 112} ${cy - 76} L ${cx + 94} ${cy - 76} Z`}
        fill="url(#beamB)"
      />
      <Path
        d={`M ${cx - 70} ${cy - 76} L ${cx - 64} ${cy - 76} L ${cx + 150} ${cy + 76} L ${cx + 144} ${cy + 76} Z`}
        fill="url(#beamA)"
        fillOpacity={0.5}
      />
    </Svg>
  );
}

function IconPlane({ size = 11, color = NAVY }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
        fill={color}
      />
    </Svg>
  );
}

function IconSeat({ size = 11, color = GOLD }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M5 3 H9 V13 H18 C19.1 13 20 13.9 20 15 V17 H7 C5.9 17 5 16.1 5 15 Z" fill={color} />
      <Path d="M8 17 V21 M17 17 V21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function IconPerson({ size = 11, color = GOLD }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="7.5" r="4.5" fill={color} />
      <Path d="M3.5 21 C3.5 16 7.3 13.5 12 13.5 C16.7 13.5 20.5 16 20.5 21 Z" fill={color} />
    </Svg>
  );
}

function IconMeals({ size = 11, color = GOLD }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5 2 V8 C5 9.7 6.3 11 8 11 C9.7 11 11 9.7 11 8 V2 M8 2 V22"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M18 2 C15.5 4 15.5 10 18 12 V22" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function IconTicket({ size = 11, color = GOLD }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3 6 H21 V10 C19.9 10 19 10.9 19 12 C19 13.1 19.9 14 21 14 V18 H3 V14 C4.1 14 5 13.1 5 12 C5 10.9 4.1 10 3 10 Z"
        fill={color}
      />
    </Svg>
  );
}

function IconBaggage({ size = 11, color = GOLD }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M9 6 V3.5 H15 V6" stroke={color} strokeWidth={2} fill="none" />
      <Path d="M4 6 H20 V20 H4 Z" fill={color} />
    </Svg>
  );
}

function IconBooking({ size = 12, color = BLUE }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M5 3 H15 L19 7 V21 H5 Z" stroke={color} strokeWidth={2} fill="none" />
      <Path d="M8 11 H16 M8 15 H16" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function IconEnvelope({ size = 11, color = BLUE }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 5 H21 V19 H3 Z" stroke={color} strokeWidth={2} fill="none" />
      <Path d="M3.5 5.5 L12 12.5 L20.5 5.5" stroke={color} strokeWidth={2} fill="none" />
    </Svg>
  );
}

function LabelWithIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.labelRow}>
      <View style={styles.labelIcon}>{icon}</View>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
}

function IconPlaneRight({ size = 13, color = BLUE }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22 12 L15 10.8 L11 4 L9 4 L11 10.8 L5 10.8 L3 8.5 L1.5 8.5 L2.6 12 L1.5 15.5 L3 15.5 L5 13.2 L11 13.2 L9 20 L11 20 L15 13.2 Z"
        fill={color}
      />
    </Svg>
  );
}

function FlightRoute({ fromCode, toCode }: { fromCode: string; toCode: string }) {
  return (
    <View style={styles.routeGraphic}>
      <Text style={styles.routeCode}>{fromCode}</Text>
      <View style={styles.routeLineWrap}>
        <Svg width={90} height={22} viewBox="0 0 90 22">
          <Path
            d="M4 17 Q 45 1 86 17"
            stroke="#7f95b3"
            strokeWidth={1}
            fill="none"
            strokeDasharray="2.5,2"
          />
          <Circle cx="4" cy="17" r="2.2" fill={BLUE} />
          <Circle cx="86" cy="17" r="2.2" fill={BLUE} />
        </Svg>
        <View style={styles.routePlane}>
          <IconPlaneRight />
        </View>
      </View>
      <Text style={styles.routeCode}>{toCode}</Text>
    </View>
  );
}

interface Passenger {
  name: string;
  ticketNumber: string;
  frequentFlyerNo: string;
  seatNo: string;
  meals: string;
  baggage: string;
}

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
    passengers: Passenger[];
    pnr: string;
    email: string;
    flights: Flight[];
    grandTotal?: {
      amount: number;
      currency: "EGP" | "USD";
    };
    showIssueDateTime?: boolean;
    showCompanyInfo?: boolean;
  };
}

function getIata(name: string | undefined): string | null {
  const raw = String(name ?? "").trim();
  if (!raw) return null;
  const prefix = raw.match(/^([A-Z]{3})(?=\s*[-–]|\s+)/);
  if (prefix) return prefix[1];
  const lower = raw.toLowerCase();
  for (const [needle, code] of CITY_IATA) {
    if (lower.includes(needle)) return code;
  }
  return null;
}

function airportLine(name: string | undefined, terminal?: string) {
  const raw = String(name ?? "").trim();
  if (!raw && !terminal) return "—";
  const iata = getIata(raw);
  let display = raw;
  if (iata && !display.toUpperCase().startsWith(iata)) {
    display = `${iata} - ${display}`;
  }
  if (terminal && !/terminal/i.test(display)) {
    display = `${display} Terminal ${terminal}`;
  }
  return display || "—";
}

const TicketPDF: React.FC<TicketPDFProps> = ({ ticket: ticketProp }) => {
  const ticket = {
    passengers: Array.isArray(ticketProp?.passengers) ? ticketProp.passengers : [],
    pnr: ticketProp?.pnr ?? "",
    email: ticketProp?.email ?? "",
    flights: Array.isArray(ticketProp?.flights) ? ticketProp.flights : [],
    grandTotal: ticketProp?.grandTotal,
    showIssueDateTime: Boolean(ticketProp?.showIssueDateTime),
    showCompanyInfo: ticketProp?.showCompanyInfo !== false,
  };

  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const issuedAt = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;

  const n = (s: string | undefined) =>
    s != null && String(s).trim() !== "" ? String(s) : "—";

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const formatTicketDate = (value: string | undefined) => {
    if (value == null || String(value).trim() === "") return "—";
    const raw = String(value).trim();
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return raw;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (Number.isNaN(parsed.getTime())) return raw;
    return `${WEEKDAYS[parsed.getUTCDay()]} ${day} ${MONTHS[month - 1]} ${year}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image fixed src={worldMapSrc} style={styles.worldMap} />

        <View style={styles.headerBar}>
          <HeaderArt />
          <View style={styles.headerInner}>
            {ticket.showCompanyInfo ? (
              <View style={styles.headerLeft}>
                <View style={styles.logoBox}>
                  <Image src={mazLogoSrc} style={styles.logo} />
                </View>
                <View>
                  <Text style={styles.brandName}>MAZ TRAVEL</Text>
                  <Text style={styles.brandTagline}>
                    Flight E-Ticket • Reservation & Support
                  </Text>
                </View>
              </View>
            ) : (
              <View />
            )}
            <View
              style={
                ticket.showCompanyInfo
                  ? styles.headerRight
                  : [styles.headerRight, styles.headerRightCentered]
              }
            >
              <Text style={styles.docTitle}>E-TICKET</Text>
              <View style={styles.headerPnrBadge}>
                <Text style={styles.headerPnrText}>PNR: {n(ticket.pnr)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <View style={styles.sectionIcon}>
                <IconBooking />
              </View>
              <Text style={styles.sectionTitle}>Booking information</Text>
            </View>
            <View style={styles.bookingRow}>
              <View style={styles.bookingItem}>
                <Text style={styles.fieldLabel}>PNR</Text>
                <View style={styles.pnrBox}>
                  <Text style={styles.pnrValue}>{n(ticket.pnr)}</Text>
                </View>
              </View>
              <View style={styles.bookingItem}>
                <LabelWithIcon icon={<IconEnvelope />} label="Email" />
                <Text style={styles.emailValue}>{n(ticket.email)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>
                Passenger details ({ticket.passengers.length})
              </Text>
            </View>
            {ticket.passengers.map((p, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.goldBar} />
                <Text style={styles.passengerTitle}>Passenger {i + 1}</Text>
                <Text style={styles.passengerName}>{n(p.name)}</Text>
                <View style={styles.passengerGrid}>
                  <View style={styles.passengerItem}>
                    <LabelWithIcon icon={<IconTicket />} label="Ticket number" />
                    <Text style={styles.fieldValue}>{n(p.ticketNumber)}</Text>
                  </View>
                  <View style={styles.passengerItem}>
                    <LabelWithIcon icon={<IconSeat />} label="Seat" />
                    <Text style={styles.fieldValue}>{n(p.seatNo)}</Text>
                  </View>
                  <View style={styles.passengerItem}>
                    <LabelWithIcon icon={<IconPerson />} label="Frequent flyer" />
                    <Text style={styles.fieldValue}>{n(p.frequentFlyerNo)}</Text>
                  </View>
                  <View style={styles.passengerItem}>
                    <LabelWithIcon icon={<IconBaggage />} label="Baggage" />
                    <Text style={styles.fieldValue}>{n(p.baggage)}</Text>
                  </View>
                  <View style={styles.passengerItem}>
                    <LabelWithIcon icon={<IconMeals />} label="Meals" />
                    <Text style={styles.fieldValue}>{n(p.meals)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Flight details</Text>
            </View>
            {ticket.flights.map((flight, index) => {
              const fromCode = getIata(flight.from) || "—";
              const toCode = getIata(flight.to) || "—";
              return (
                <View key={index} style={[styles.card, styles.cardGlass]} wrap={false}>
                  <View style={styles.goldBar} />
                  <View style={styles.flightHead}>
                    <View style={styles.flightHeadLeft}>
                      <IconPlane />
                      <Text style={styles.flightCardTitle}>
                        Flight {index + 1} • {flight.airline || "—"}
                      </Text>
                      <Text style={styles.flightNumberValue}>
                        {flight.flightNumber || "—"}
                      </Text>
                    </View>
                    <FlightRoute fromCode={fromCode} toCode={toCode} />
                  </View>
                  <View style={styles.flightRow}>
                    <View style={styles.flightColFrom}>
                      <Text style={styles.flightLabel}>From</Text>
                      <Text style={styles.flightAirport}>
                        {airportLine(flight.from, flight.terminal)}
                      </Text>
                      <Text style={styles.flightDateValue}>
                        {formatTicketDate(flight.departureDate)}
                      </Text>
                      <Text style={styles.flightTimeValue}>
                        {n(flight.departureTime)}
                      </Text>
                      <View style={styles.classWrap}>
                        <Text style={styles.flightLabel}>Class</Text>
                        <Text style={styles.classValue}>{n(flight.class)}</Text>
                      </View>
                    </View>
                    <View style={styles.flightColDuration}>
                      <Text style={styles.durationLabel}>Duration</Text>
                      <Text style={styles.durationValue}>{n(flight.duration)}</Text>
                    </View>
                    <View style={styles.flightColTo}>
                      <Text style={styles.flightLabel}>To</Text>
                      <Text style={styles.flightAirport}>
                        {airportLine(flight.to, flight.arrivalTerminal)}
                      </Text>
                      <Text style={styles.flightDateValue}>
                        {formatTicketDate(flight.arrivalDate)}
                      </Text>
                      <Text style={styles.flightTimeValue}>
                        {n(flight.arrivalTime)}
                      </Text>
                    </View>
                  </View>
                  {flight.remark ? (
                    <View style={styles.remarkBox}>
                      <Text style={styles.remarkLabel}>Remark</Text>
                      <Text style={styles.remarkText}>{flight.remark}</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        <View fixed style={styles.footer}>
          {ticket.showIssueDateTime ? (
            <Text style={styles.footerText}>Issued on {issuedAt}</Text>
          ) : null}
          {ticket.showCompanyInfo ? (
            <View style={styles.contactRow}>
              <Text style={styles.contactText}>reservation@maztravel.net</Text>
              <Text style={styles.contactTextSecond}>
                01005599399 / 01010737343
              </Text>
            </View>
          ) : null}

          <View style={styles.footerRule} />

          {ticket.grandTotal ? (
            <View
              wrap={false}
              render={({ pageNumber, totalPages }) =>
                pageNumber === totalPages ? (
                  <View style={styles.totalWrap}>
                    <View style={styles.totalPill}>
                      <Text style={styles.totalLabel}>Grand total</Text>
                      <Text style={styles.totalValue}>
                        {`${ticket.grandTotal?.currency === "EGP" ? "EGP " : "USD "}${ticket.grandTotal?.amount.toLocaleString() ?? ""}`}
                      </Text>
                    </View>
                  </View>
                ) : null
              }
            />
          ) : null}
        </View>
      </Page>
    </Document>
  );
};

export default TicketPDF;
