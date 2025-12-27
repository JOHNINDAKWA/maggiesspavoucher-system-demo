import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportVoucherPdf({ frontEl, backEl, fileName = "voucher.pdf" }) {
  const W = 980;
  const H = 420;

  // Use mm for predictable PDF sizing (optional but solid)
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [W, H] });

  const capture = async (el) => {
    const canvas = await html2canvas(el, {
      backgroundColor: "#ffffff", // important for JPEG (no alpha)
      scale: 3,                  // 2–3 is usually enough; 4 is huge
      width: W,
      height: H,
      windowWidth: W,
      windowHeight: H,
      useCORS: true
    });

    // JPEG compresses massively vs PNG
    return canvas.toDataURL("image/jpeg", 0.88); // 0.80–0.92 sweet spot
  };

  const img1 = await capture(frontEl);
  pdf.addImage(img1, "JPEG", 0, 0, W, H);

  pdf.addPage([W, H], "landscape");
  const img2 = await capture(backEl);
  pdf.addImage(img2, "JPEG", 0, 0, W, H);

  pdf.save(fileName);
}
