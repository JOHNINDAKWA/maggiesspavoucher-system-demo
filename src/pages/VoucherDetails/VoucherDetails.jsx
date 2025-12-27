import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./VoucherDetails.css";

import servicesData from "../../data/services.json";
import { getVoucherByCode, updateVoucher } from "../../utils/voucherStore";
import { computeStatus } from "../../utils/voucherUtils";

function StatusPill({ status }) {
  const s = String(status || "").toLowerCase();
  return (
    <span className={`vdStatus ${s}`}>
      <span className="vdDot" />
      {status}
    </span>
  );
}

export default function VoucherDetails() {
  const { code } = useParams();
  const voucher = getVoucherByCode(code);

  const status = useMemo(() => computeStatus(voucher), [voucher]);
  const isBundle = voucher?.type === "BUNDLE";

  const branchName = useMemo(() => {
    if (!voucher?.branchId) return "—";
    const b = servicesData.branches.find((x) => x.id === voucher.branchId);
    return b?.name || voucher.branchId;
  }, [voucher]);

  const amountFormatted = useMemo(() => {
    const n = Number(voucher?.amount || 0);
    return n.toLocaleString();
  }, [voucher]);

  const [copied, setCopied] = useState(false);
  const shareUrl = useMemo(() => `${window.location.origin}/v/${code}`, [code]);

  if (!voucher) {
    return (
      <div className="card">
        <h2>Voucher not found</h2>
        <p className="small">
          Prototype note: this app uses localStorage, so vouchers only exist on the device that created them.
        </p>
        <Link className="btn" to="/">Home</Link>
      </div>
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  function redeem() {
    updateVoucher(code, { status: "REDEEMED", redeemedAt: new Date().toISOString() });
    window.location.reload();
  }

  return (
    <div className="grid two">
      <section className="card vdCard">
        {/* Header */}
        <div className="vdHeader">
          <div>
            <h2 className="vdTitle">Voucher Verification</h2>
            <p className="vdSubtitle small">
              Confirm voucher details and status below.
            </p>
          </div>

          <div className="vdHeaderRight">
            <StatusPill status={status} />
            <div className="vdCode mono">{voucher.code}</div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="vdGrid">
          <div className="vdInfoCard">
            <div className="vdLabel">Type</div>
            <div className="vdValue">{isBundle ? "Service Bundle" : "Value Voucher"}</div>
          </div>

          <div className="vdInfoCard">
            <div className="vdLabel">Value</div>
            <div className="vdValue teal">KES {amountFormatted}</div>
          </div>

          <div className="vdInfoCard">
            <div className="vdLabel">Valid Until</div>
            <div className="vdValue mono">{voucher.expiryDate}</div>
          </div>

          <div className="vdInfoCard">
            <div className="vdLabel">Recipient</div>
            <div className="vdValue">{voucher.recipientName || "—"}</div>
          </div>

          {isBundle && (
            <div className="vdInfoCard">
              <div className="vdLabel">Branch</div>
              <div className="vdValue">{branchName}</div>
            </div>
          )}

          <div className="vdInfoCard vdWide">
            <div className="vdLabel">Message</div>
            <div className="vdValue">{voucher.message || "—"}</div>
          </div>
        </div>

        {/* Share row */}
        <div className="vdShare">
          <div className="vdLink mono" title={shareUrl}>{shareUrl}</div>
          <button className="btn" type="button" onClick={copyLink}>
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <Link className="btn" to="/buy">Create Another</Link>
        </div>

        {/* Bundle items */}
        {isBundle && Array.isArray(voucher.items) && voucher.items.length > 0 && (
          <div className="vdSection">
            <div className="vdSectionHeader">
              <h3 className="vdH3">Selected Services</h3>
              <div className="small">{voucher.items.length} item(s)</div>
            </div>

            <div className="vdTable">
              <div className="vdRow vdHead">
                <div>Service</div>
                <div>Details</div>
                <div className="right">Qty</div>
                <div className="right">Each</div>
                <div className="right">Total</div>
              </div>

              {voucher.items.map((it, idx) => (
                <div key={idx} className="vdRow">
                  <div className="vdSvc">
                    <div className="vdSvcTitle">{it.description}</div>
                    <div className="small">{it.group} • {it.subgroup}</div>
                  </div>
                  <div className="small">
                    {it.minutes ? `${it.minutes} mins` : "Add-on"}
                  </div>
                  <div className="right"><b>{it.qty}</b></div>
                  <div className="right">KES {Number(it.unitPrice || 0).toLocaleString()}</div>
                  <div className="right"><b>KES {Number(it.lineTotal || 0).toLocaleString()}</b></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="vdActions">
          <Link className="btn" to="/admin">Admin</Link>

          {status === "ACTIVE" && (
            <button className="btn danger" onClick={redeem}>
              Mark as Redeemed
            </button>
          )}
        </div>

        <div className="vdNote small">
          Note: In the real build, this page will fetch voucher data from a backend so it works on any phone.
        </div>
      </section>

      {/* Right side info card */}
      <section className="card vdSide">
        <h3 className="vdSideTitle">For Admin/Staff</h3>
        <p className="small">
          Confirm vouchers as <b>ACTIVE</b> in Admin after payment. Later, M-Pesa will do this automatically.
        </p>

        <div className="vdTips">
          <div className="vdTip">
            <div className="vdTipTitle">Best practice</div>
            <div className="small">Scan the QR to verify status before redemption.</div>
          </div>
          <div className="vdTip">
            <div className="vdTipTitle">Security note</div>
            <div className="small">In production, redemption will require staff login.</div>
          </div>
        </div>

        <hr className="sep" />

        <div className="vdQuickLinks">
          <Link className="btn primary" to="/admin">Open Admin</Link>
          <Link className="btn" to="/">Home</Link>
        </div>
      </section>
    </div>
  );
}
