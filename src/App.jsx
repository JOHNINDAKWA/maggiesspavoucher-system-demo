import { Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Buy from "./pages/Buy/Buy.jsx";
import Success from "./pages/Success/Success.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import VoucherDetails from "./pages/VoucherDetails/VoucherDetails.jsx";

export default function App() {
  return (
    <div>
      <header className="topbar">
        <div className="brand">
          <div className="dot" />
          <span>Maggie’s P&amp;P Massage</span>
        </div>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/buy">Buy Voucher</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/success/:code" element={<Success />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/v/:code" element={<VoucherDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">
        <div>© {new Date().getFullYear()} Maggie’s P&amp;P Massage</div>
      </footer>
    </div>
  );
}
