import { useEffect, useState } from "react";
import "./Admin.css";
import { listVouchers, updateVoucher } from "../../utils/voucherStore";
import { computeStatus } from "../../utils/voucherUtils";

export default function Admin() {
  const [items, setItems] = useState([]);

  function refresh() {
    setItems(listVouchers());
  }

  useEffect(() => {
    refresh();
  }, []);

  function confirm(code) {
    updateVoucher(code, { status: "ACTIVE", confirmedAt: new Date().toISOString() });
    refresh();
  }

  function reset(code) {
    updateVoucher(code, { status: "PENDING" });
    refresh();
  }

  return (
    <div className="card">
      <h2>Admin</h2>
      <p className="small">Prototype confirmation. In the real build, M-Pesa success would auto-confirm.</p>

      <div className="adminList">
        {items.length === 0 ? (
          <div className="empty">No vouchers yet.</div>
        ) : (
          items.map(v => {
            const status = computeStatus(v);
            return (
              <div key={v.code} className="row">
                <div className="left">
                  <div className="code">{v.code}</div>
                  <div className="meta small">
                    KES {v.amount.toLocaleString()} • Expires {v.expiryDate} • {status}
                  </div>
                </div>

                <div className="right">
                  {status === "PENDING" && (
                    <button className="btn primary" onClick={() => confirm(v.code)}>Confirm</button>
                  )}
                  {status !== "PENDING" && (
                    <button className="btn" onClick={() => reset(v.code)}>Set Pending</button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
