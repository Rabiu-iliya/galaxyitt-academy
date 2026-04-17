import jsPDF from "jspdf";

interface CertData {
  studentName: string;
  programName: string;
  issuedAt: string;
  certificateId: string;
}

// Brand colors (matching design tokens)
const NAVY: [number, number, number] = [30, 58, 95];   // #1E3A5F
const GOLD: [number, number, number] = [212, 168, 67]; // #D4A843
const CREAM: [number, number, number] = [252, 250, 245];
const DARK: [number, number, number] = [40, 40, 40];
const MUTED: [number, number, number] = [120, 120, 120];

export function generateCertificatePDF(data: CertData) {
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
  doc.circle(cx, 38, 11, "F");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1.2);
  doc.circle(cx, 38, 13);
  doc.setTextColor(...GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("G", cx, 42, { align: "center" });

  // Academy name
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("GalaxyITT Technology Academy", cx, 62, { align: "center" });

  // Subtitle / divider
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(cx - 30, 67, cx + 30, 67);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text("CERTIFICATE OF COMPLETION", cx, 75, { align: "center", charSpace: 3 });

  // "This is to certify that"
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text("This is to certify that", cx, 92, { align: "center" });

  // Student name (large, gold)
  doc.setFont("times", "bolditalic");
  doc.setFontSize(36);
  doc.setTextColor(...GOLD);
  doc.text(data.studentName, cx, 112, { align: "center" });

  // Underline under name
  const nameWidth = Math.min(doc.getTextWidth(data.studentName) + 20, W - 60);
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.4);
  doc.line(cx - nameWidth / 2, 117, cx + nameWidth / 2, 117);

  // "has successfully completed the program"
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text("has successfully completed the program", cx, 130, { align: "center" });

  // Program name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...NAVY);
  doc.text(data.programName, cx, 144, { align: "center" });

  // Body text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  const body = "demonstrating dedication, technical proficiency, and successful completion of all required coursework and a capstone project reviewed by GalaxyITT instructors.";
  const lines = doc.splitTextToSize(body, W - 80);
  doc.text(lines, cx, 156, { align: "center" });

  // Footer signatures
  const footerY = H - 38;
  // Left: Date
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.4);
  doc.line(35, footerY, 95, footerY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text(data.issuedAt, 65, footerY - 2, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("Date of Issue", 65, footerY + 5, { align: "center" });

  // Right: Director signature
  doc.setDrawColor(...NAVY);
  doc.line(W - 95, footerY, W - 35, footerY);
  doc.setFont("times", "italic");
  doc.setFontSize(13);
  doc.setTextColor(...NAVY);
  doc.text("GalaxyITT Academy", W - 65, footerY - 2, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("Director of Education", W - 65, footerY + 5, { align: "center" });

  // Certificate ID
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(`Certificate ID: ${data.certificateId.toUpperCase()}`, cx, H - 20, { align: "center" });
  doc.setFontSize(7);
  doc.text("Verify authenticity at galaxyitt.academy", cx, H - 15, { align: "center" });

  // Save
  const fileName = `GalaxyITT-Certificate-${data.studentName.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
}
