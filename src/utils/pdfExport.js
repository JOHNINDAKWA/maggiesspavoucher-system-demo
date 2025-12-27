import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportVoucherPdf({ frontEl, backEl, fileName = "voucher.pdf" }) {
  const W = 980;
  const H = 420;

  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [W, H] });

  const capture = async (el) => {
    const canvas = await html2canvas(el, {
      backgroundColor: null,
      scale: 4,              // ⬅️ higher = sharper (3–5 is good)
      width: W,              // ⬅️ force base size
      height: H,
      windowWidth: W,        // ⬅️ important on mobile
      windowHeight: H,
      useCORS: true
    });
    return canvas.toDataURL("image/png", 1.0);
  };

  const img1 = await capture(frontEl);
  pdf.addImage(img1, "PNG", 0, 0, W, H);

  pdf.addPage([W, H], "landscape");
  const img2 = await capture(backEl);
  pdf.addImage(img2, "PNG", 0, 0, W, H);

  pdf.save(fileName);
}
