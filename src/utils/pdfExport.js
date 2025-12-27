import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Exports frontRef & backRef as a 2-page PDF.
 * The voucher previews should be fixed-size for clean output.
 */
export async function exportVoucherPdf({ frontEl, backEl, fileName = "voucher.pdf" }) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [980, 420] });

  // Page 1
  const c1 = await html2canvas(frontEl, { scale: 2, backgroundColor: null });
  const img1 = c1.toDataURL("image/png");
  pdf.addImage(img1, "PNG", 0, 0, 980, 420);

  // Page 2
  pdf.addPage([980, 420], "landscape");
  const c2 = await html2canvas(backEl, { scale: 2, backgroundColor: null });
  const img2 = c2.toDataURL("image/png");
  pdf.addImage(img2, "PNG", 0, 0, 980, 420);

  pdf.save(fileName);
}
