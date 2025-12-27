import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./VoucherPreview.css";

export default function VoucherPreview({
  side,
  templateSrc,
  voucher,
  qrUrl,
  forwardedRef
}) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const pad = 32; // container padding safety
      const available = Math.min(window.innerWidth - pad, 980);
      setScale(Math.min(1, available / 980));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="voucherWrap">
      <div className="voucherScale" style={{ ["--voucherScale"]: scale }}>
        <div className="voucher" ref={forwardedRef}>
          <img className="voucherImg" src={templateSrc} alt={`${side} template`} />

          {side === "back" && (
            <>
              <div className="overlay voucherNo">{voucher.code}</div>
              <div className="overlay expiry">{voucher.expiryDate}</div>

              <div className="overlay qr">
                <QRCodeCanvas
                  value={qrUrl}
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#0ac3c7"
                  includeMargin={true}
                />
              </div>
            </>
          )}

          {side === "front" && voucher.amount && (
            <div className="overlay value">
              Value: <br /> KES {voucher.amount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
