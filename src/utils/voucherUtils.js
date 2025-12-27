import { v4 as uuidv4 } from "uuid";

export function makeVoucherCode() {
  const short = uuidv4().split("-")[0].toUpperCase(); // e.g., 8F3K2D1A
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `MPS-${y}${m}${day}-${short.slice(0,6)}`;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDateISO(d) {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function computeStatus(voucher) {
  if (!voucher) return "UNKNOWN";
  if (voucher.status === "REDEEMED") return "REDEEMED";
  const now = new Date();
  const exp = new Date(voucher.expiryDate);
  if (now > exp) return "EXPIRED";
  return voucher.status; // PENDING or ACTIVE
}
