import jsPDF from "jspdf";
import QRCode from "qrcode";

interface SignatureData {
  name: string;
  title: string;
  imageDataUrl?: string | null; // base64 data URL of signature image
}

interface CertData {
  studentName: string;
  programName: string;
  issuedAt: string;
  certificateId: string;     // short display id
  fullCertificateId: string; // full UUID for QR / verify URL
  verifyUrl: string;         // e.g. https://site.com/verify/<id>
  signature?: SignatureData | null;
}

// Brand colors (matching design tokens)
const NAVY: [number, number, number] = [30, 58, 95];   // #1E3A5F
const GOLD: [number, number, number] = [212, 168, 67]; // #D4A843
const CREAM: [number, number, number] = [252, 250, 245];
const DARK: [number, number, number] = [40, 40, 40];
const MUTED: [number, number, number] = [120, 120, 120];

export async function generateCertificatePDF(data: CertData) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();   // 297
  const H = doc.internal.pageSize.getHeight();  // 210

  // Cream background
  doc.setFillColor(...CREAM);
  doc.rect(0, 0, W, H, "F");

  // Outer navy border
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(2);
  doc.rect(8, 8, W - 16, H - 16);

  // Inner gold border
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.rect(13, 13, W - 26, H - 26);

  // Decorative gold corner accents
  const corner = (x: number, y: number, dx: number, dy: number) => {
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1.2);
    doc.line(x, y, x + 18 * dx, y);
    doc.line(x, y, x, y + 18 * dy);
  };
  corner(20, 20, 1, 1);
  corner(W - 20, 20, -1, 1);
  corner(20, H - 20, 1, -1);
  corner(W - 20, H - 20, -1, -1);

  // Top emblem — gold ring with monogram
  const cx = W / 2;
  doc.setFillColor(...NAVY);
  doc.circle(cx, 36, 10, "F");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1.2);
  doc.circle(cx, 36, 12);
  doc.setTextColor(...GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("G", cx, 40, { align: "center" });

  // Academy name
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("GalaxyITT Technology Academy", cx, 58, { align: "center" });

  // Subtitle / divider
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(cx - 28, 63, cx + 28, 63);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("CERTIFICATE OF COMPLETION", cx, 70, { align: "center", charSpace: 3 });
  doc.setCharSpace(0);

  // "This is to certify that"
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text("This is to certify that", cx, 85, { align: "center" });

  // Student name (large, gold)
  doc.setFont("times", "bolditalic");
  doc.setFontSize(34);
  doc.setTextColor(...GOLD);
  doc.text(data.studentName, cx, 105, { align: "center" });

  // Underline under name
  const nameWidth = Math.min(doc.getTextWidth(data.studentName) + 20, W - 60);
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.4);
  doc.line(cx - nameWidth / 2, 110, cx + nameWidth / 2, 110);

  // "has successfully completed the program"
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text("has successfully completed the program", cx, 122, { align: "center" });

  // Program name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...NAVY);
  doc.text(data.programName, cx, 134, { align: "center" });

  // Body text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const body = "demonstrating dedication, technical proficiency, and successful completion of all required coursework and a capstone project reviewed by GalaxyITT instructors.";
  const lines = doc.splitTextToSize(body, W - 100);
  doc.text(lines, cx, 144, { align: "center" });

  // Footer signatures
  const footerY = H - 38;

  // Left: Date
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.4);
  doc.line(30, footerY, 90, footerY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text(data.issuedAt, 60, footerY - 2, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("Date of Issue", 60, footerY + 5, { align: "center" });

  // Right: Director signature (dynamic from DB)
  const sigCx = W - 60;
  if (data.signature?.imageDataUrl) {
    try {
      doc.addImage(data.signature.imageDataUrl, "PNG", sigCx - 25, footerY - 18, 50, 16);
    } catch {
      // If addImage fails, fall through to text-only
    }
  }
  doc.setDrawColor(...NAVY);
  doc.line(W - 90, footerY, W - 30, footerY);
  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.setTextColor(...NAVY);
  doc.text(data.signature?.name || "Authorized Signature", sigCx, footerY - 2, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(data.signature?.title || "GalaxyITT Academy", sigCx, footerY + 5, { align: "center" });

  // QR Code (bottom-left)
  try {
    const qrDataUrl = await QRCode.toDataURL(data.verifyUrl, { margin: 1, width: 200, color: { dark: "#1E3A5F", light: "#FFFFFF" } });
    const qrSize = 24;
    doc.addImage(qrDataUrl, "PNG", 16, H - qrSize - 16, qrSize, qrSize);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text("Scan to verify", 16 + qrSize / 2, H - 10, { align: "center" });
  } catch (e) {
    // QR failure is non-fatal
  }

  // Certificate ID
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(`Certificate ID: ${data.certificateId.toUpperCase()}`, cx, H - 18, { align: "center" });
  doc.setFontSize(7);
  doc.text(`Verify at ${data.verifyUrl}`, cx, H - 13, { align: "center" });

  // Save
  const fileName = `GalaxyITT-Certificate-${data.studentName.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
}

// Helper: convert an image URL to a data URL (so jsPDF can embed it)
export async function imageUrlToDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}
