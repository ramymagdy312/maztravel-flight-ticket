import type { FlightDetails } from "./types";

export function buildTicketShareMessage(ticket: FlightDetails): string {
  const passengerNames = ticket.passengers.map((p) => p.name).join(", ") || "—";
  const firstFlight = ticket.flights[0];
  const route = firstFlight ? `${firstFlight.from} → ${firstFlight.to}` : "—";

  return [
    "Flight e-ticket from Maz Travel",
    `PNR: ${ticket.pnr}`,
    `Passenger(s): ${passengerNames}`,
    `Route: ${route}`,
  ].join("\n");
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function shareTicketPdf(
  ticket: FlightDetails,
  pdfBlob: Blob,
  fileName: string
): Promise<void> {
  const message = buildTicketShareMessage(ticket);
  const file = new File([pdfBlob], fileName, { type: "application/pdf" });
  const shareData: ShareData = {
    title: `Flight Ticket - ${ticket.pnr}`,
    text: message,
  };

  if (navigator.share) {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ ...shareData, files: [file] });
      return;
    }

    await navigator.share(shareData);
    downloadBlob(pdfBlob, fileName);
    return;
  }

  downloadBlob(pdfBlob, fileName);
  alert("Sharing is not supported on this browser. The PDF has been downloaded instead.");
}
