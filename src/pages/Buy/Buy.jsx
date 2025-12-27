import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Buy.css";

import servicesData from "../../data/services.json";
import ServicePicker from "../../components/ServicePicker/ServicePicker.jsx";

import { createVoucher } from "../../utils/voucherStore";
import { addDays, formatDateISO, makeVoucherCode } from "../../utils/voucherUtils";

function parseKesToNumber(priceStr) {
  // "KES 11,300" -> 11300
  if (!priceStr) return 0;
  const digits = priceStr.replace(/[^0-9]/g, "");
  return digits ? Number(digits) : 0;
}

export default function Buy() {
  const nav = useNavigate();

  // MODE: VALUE (user enters any amount) OR BUNDLE (select multiple services)
  const [mode, setMode] = useState("VALUE"); // "VALUE" | "BUNDLE"

  // VALUE mode fields
  const [customAmount, setCustomAmount] = useState("5000");

  // Shared fields
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");

  // BUNDLE mode state
  const [branchId, setBranchId] = useState(servicesData?.branches?.[0]?.id || "nairobi");
  const [selectedItems, setSelectedItems] = useState([]); 
  // items: [{ id, branchId, heading, subgroupTitle, description, minutes, unitPrice, qty }]

  const expiryDate = useMemo(() => {
    const exp = addDays(new Date(), 30);
    return formatDateISO(exp);
  }, []);

  const branch = useMemo(() => {
    return servicesData.branches.find((b) => b.id === branchId);
  }, [branchId]);

  const bundleTotal = useMemo(() => {
    return selectedItems.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
  }, [selectedItems]);

  const finalAmount = useMemo(() => {
    if (mode === "BUNDLE") return bundleTotal;
    const n = Number(String(customAmount).replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [mode, bundleTotal, customAmount]);

  function validate() {
    if (!buyerName.trim() || !buyerPhone.trim()) return "Please enter your name and phone number.";
    if (mode === "VALUE") {
      if (!finalAmount || finalAmount < 1) return "Please enter a valid voucher amount.";
    }
    if (mode === "BUNDLE") {
      if (!selectedItems.length) return "Please select at least one service for the bundle.";
      if (!finalAmount || finalAmount < 1) return "Bundle total must be greater than zero.";
    }
    return null;
  }

  function handleCreate(e) {
    e.preventDefault();

    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    const code = makeVoucherCode();

    const voucher = {
      code,
      type: mode,              // "VALUE" | "BUNDLE"
      branchId: mode === "BUNDLE" ? branchId : null,
      amount: finalAmount,     // always store final KES amount
      items:
        mode === "BUNDLE"
          ? selectedItems.map((it) => ({
              description: it.description,
              minutes: it.minutes,
              qty: it.qty,
              unitPrice: it.unitPrice,
              lineTotal: it.unitPrice * it.qty,
              group: it.heading,
              subgroup: it.subgroupTitle
            }))
          : [],
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      recipientName: recipientName.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      expiryDate,
      status: "PENDING"
    };

    createVoucher(voucher);
    nav(`/success/${code}`);
  }

  return (
    <div className="grid two">
      <section className="card">
        <h2>Buy a Voucher</h2>
        <p className="small">
          Choose a voucher value or build a service bundle. Payment is simulated for now.
        </p>

        <form onSubmit={handleCreate} className="form">
          {/* Mode selector */}
          <div className="modeRow">
            <button
              type="button"
              className={`btn ${mode === "VALUE" ? "primary" : ""}`}
              onClick={() => setMode("VALUE")}
            >
              Value Voucher
            </button>
            <button
              type="button"
              className={`btn ${mode === "BUNDLE" ? "primary" : ""}`}
              onClick={() => setMode("BUNDLE")}
            >
              Choose Services
            </button>
          </div>

          {/* VALUE MODE */}
          {mode === "VALUE" && (
            <div>
              <label>Voucher Amount (KES)</label>
              <input
                className="input"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="e.g., 5000"
                inputMode="numeric"
              />
              <div className="small" style={{ marginTop: 6 }}>
                This voucher can be redeemed for any services up to its value.
              </div>
            </div>
          )}

          {/* BUNDLE MODE */}
          {mode === "BUNDLE" && (
            <div>
              <label>Branch</label>
              <select value={branchId} onChange={(e) => setBranchId(e.target.value)}>
                {servicesData.branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: 12 }}>
                <ServicePicker
                  branch={branch}
                  parseKesToNumber={parseKesToNumber}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />
              </div>

              <div className="small" style={{ marginTop: 10 }}>
                Bundle Total: <b>KES {bundleTotal.toLocaleString()}</b>
              </div>
            </div>
          )}

          <hr className="sep" />

          {/* Buyer / recipient */}
          <div className="grid two">
            <div>
              <label>Your Name</label>
              <input
                className="input"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            <div>
              <label>Your Phone</label>
              <input
                className="input"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="e.g., 07xx..."
                required
              />
            </div>
          </div>

          <div className="grid two">
            <div>
              <label>Recipient Name (optional)</label>
              <input
                className="input"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g., Jane"
              />
            </div>
            <div>
              <label>Valid Until</label>
              <input className="input" value={expiryDate} readOnly />
            </div>
          </div>

          <div>
            <label>Gift Message (optional)</label>
            <textarea
              className="input"
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a short note..."
            />
          </div>

          <div className="small">
            Amount to pay: <b>KES {finalAmount.toLocaleString()}</b>
          </div>

          <button className="btn primary" type="submit">
            Continue
          </button>
        </form>
      </section>

      <section className="card previewHint">
        <h3>What gets generated</h3>
        <p className="small">
          After checkout, the system generates:
          <br />• Voucher number
          <br />• Expiry date
          <br />• QR code linking to voucher details
          <br />• PDF download (front + back)
        </p>
        <div className="note">
          Later, M-Pesa will confirm payment automatically and Admin confirmation won’t be needed.
        </div>
      </section>
    </div>
  );
}
