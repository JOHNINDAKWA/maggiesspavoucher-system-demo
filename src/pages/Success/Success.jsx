import { useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Success.css";

import front from "../../assets/front.png";
import back from "../../assets/back.png";

import VoucherPreview from "../../components/VoucherPreview/VoucherPreview";
import { getVoucherByCode } from "../../utils/voucherStore";
import { exportVoucherPdf } from "../../utils/pdfExport";

function StatusPill({ status }) {
  const s = String(status || "").toLowerCase();
  return <span className={`statusPill ${s}`}>{status}</span>;
}

export default function Success() {
  const { code } = useParams();
  const voucher = getVoucherByCode(code);

  const frontRef = useRef(null);
  const backRef = useRef(null);

  const [copyText, setCopyText] = useState("Copy link");

  const qrUrl = useMemo(() => {
    const origin = window.location.origin;
    return `${origin}/v/${code}`;
  }, [code]);

  const isBundle = voucher?.type === "BUNDLE";
  const amountFormatted = useMemo(() => {
    const n = Number(voucher?.amount || 0);
    return n.toLocaleString();
  }, [voucher]);

  if (!voucher) {
    return (
      <div className="card">
        <h2>Voucher not found</h2>
        <p className="small">This voucher code doesn’t exist in localStorage on this browser.</p>
        <Link className="btn" to="/buy">Go back</Link>
      </div>
    );
  }

  async function downloadPdf() {
    await exportVoucherPdf({
      frontEl: frontRef.current,
      backEl: backRef.current,
      fileName: `${voucher.code}.pdf`
    });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy link"), 1200);
    } catch {
      setCopyText("Copy failed");
      setTimeout(() => setCopyText("Copy link"), 1200);
    }
  }

  return (
    <div className="grid">
      {/* Receipt / Confirmation */}
      <section className="card receipt">
        <div className="receiptTop">
          <div>
            <h2 className="receiptTitle">Purchase complete</h2>
            <p className="small receiptSubtitle">
              Your voucher is ready. Download the PDF and share it with the recipient.
            </p>
          </div>

          <div className="receiptStatus">
            <StatusPill status={voucher.status} />
            <div className="small">
              {voucher.status === "PENDING"
                ? "Pending admin confirmation"
                : "Ready to use"}
            </div>
          </div>
        </div>

        <div className="receiptGrid">
          <div className="receiptCard">
            <div className="receiptLabel">Voucher Code</div>
            <div className="receiptValue mono">{voucher.code}</div>
          </div>

          <div className="receiptCard">
            <div className="receiptLabel">Type</div>
            <div className="receiptValue">
              {isBundle ? "Service Bundle" : "Value Voucher"}
            </div>
          </div>

          <div className="receiptCard">
            <div className="receiptLabel">Amount</div>
            <div className="receiptValue">KES {amountFormatted}</div>
          </div>

          <div className="receiptCard">
            <div className="receiptLabel">Valid Until</div>
            <div className="receiptValue mono">{voucher.expiryDate}</div>
          </div>
        </div>

        {/* QR link row */}
        <div className="linkRow">
          <div className="linkBox mono">{qrUrl}</div>
          <button className="btn" type="button" onClick={copyLink}>
            {copyText}
          </button>
          <Link className="btn" to={`/v/${voucher.code}`}>
            View Details
          </Link>
        </div>

        {/* Bundle mini summary */}
        {isBundle && Array.isArray(voucher.items) && voucher.items.length > 0 && (
          <div className="bundleBlock">
            <div className="bundleHeader">
              <h3 className="bundleTitle">Selected Services</h3>
              <div className="small">
                {voucher.items.length} item(s)
              </div>
            </div>

            <div className="bundleMini">
              {voucher.items.slice(0, 5).map((it, idx) => (
                <div key={idx} className="bundleMiniRow">
                  <div className="bmLeft">
                    <div className="bmTitle">{it.description}</div>
                    <div className="small">
                      Qty {it.qty} • {it.minutes ? `${it.minutes} mins` : "Add-on"} • {it.group}
                    </div>
                  </div>
                  <div className="bmRight">
                    <b>KES {Number(it.lineTotal || 0).toLocaleString()}</b>
                  </div>
                </div>
              ))}

              {voucher.items.length > 5 && (
                <div className="small" style={{ marginTop: 6 }}>
                  + {voucher.items.length - 5} more item(s)…
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="actions receiptActions">
          <button className="btn primary" onClick={downloadPdf}>
            Download PDF
          </button>
          <Link className="btn" to="/buy">Create Another</Link>
          <Link className="btn" to="/admin">Admin</Link>
        </div>

    
      </section>

      {/* Previews */}
      <section className="card">
        <div className="previewHeader">
          <h3>Front Preview</h3>
        </div>

        <VoucherPreview
          side="front"
          templateSrc={front}
          voucher={voucher}
          qrUrl={qrUrl}
          forwardedRef={frontRef}
        />
      </section>

      <section className="card">
        <div className="previewHeader">
          <h3>Back Preview</h3>
        </div>

        <VoucherPreview
          side="back"
          templateSrc={back}
          voucher={voucher}
          qrUrl={qrUrl}
          forwardedRef={backRef}
        />
      </section>
    </div>
  );
}
