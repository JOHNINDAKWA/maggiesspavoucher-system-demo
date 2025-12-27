const KEY = "maggies_vouchers_v1";

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(vouchers) {
  localStorage.setItem(KEY, JSON.stringify(vouchers));
}

export function createVoucher(voucher) {
  const all = readAll();
  all.unshift(voucher);
  writeAll(all);
  return voucher;
}

export function getVoucherByCode(code) {
  const all = readAll();
  return all.find(v => v.code === code) || null;
}

export function listVouchers() {
  return readAll();
}

export function updateVoucher(code, patch) {
  const all = readAll();
  const idx = all.findIndex(v => v.code === code);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  writeAll(all);
  return all[idx];
}
