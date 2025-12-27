import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="grid two">
      <section className="card hero">
        <h1>Spa Gift Vouchers</h1>
        <p className="small">
          Purchase a Maggie’s P&P Massage voucher in minutes. Download instantly as a PDF and share with a loved one.
        </p>
        <div className="heroActions">
          <Link className="btn primary" to="/buy">Buy a Voucher</Link>
          {/* <Link className="btn" to="/v/DEMO">Scan Demo</Link> */}
        </div>
        <div className="pillRow">
          <span className="pill">Relaxation</span>
          <span className="pill">Wellness</span>
          <span className="pill">Massage & Spa</span>
        </div>
      </section>

      <section className="card">
        <h2>How it works</h2>
        <ol className="steps">
          <li>Select a voucher value</li>
          <li>Enter buyer & recipient details</li>
          <li>Pay (prototype now, M-Pesa later)</li>
          <li>Download PDF + QR for verification</li>
        </ol>
        <hr className="sep" />
        <p className="small">
          This prototype uses <b>localStorage</b>. Later we’ll connect M-Pesa and a backend to automate confirmations.
        </p>
      </section>
    </div>
  );
}
