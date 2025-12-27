import { QRCodeCanvas } from "qrcode.react";
import "./VoucherPreview.css";

export default function VoucherPreview({
  side, // "front" or "back"
  templateSrc,
  voucher,
  qrUrl,
  forwardedRef
}) {
  // NOTE: You can tweak these overlay positions to match your Canva layout exactly.
  // They assume your exported template is 980x420.
  return (
    <div className="voucherWrap">
      <div className="voucher" ref={forwardedRef}>
        <img className="voucherImg" src={templateSrc} alt={`${side} template`} />

        {side === "back" && (
          <>
            {/* Voucher No overlay */}
            <div className="overlay voucherNo">{voucher.code}</div>

            {/* Expiry overlay */}
            <div className="overlay expiry">{voucher.expiryDate}</div>

            {/* QR code overlay (bottom-left area in your design) */}
            <div className="overlay qr">
              <QRCodeCanvas value={qrUrl} size={120} bgColor="#000000" fgColor="#0ac3c7" includeMargin={true} />
            </div>
          </>
        )}

        {side === "front" && (
          <>
            {/* Optional: show value on front if you want */}
            {voucher.amount && (
              <div className="overlay value">Value: <br /> KES {voucher.amount}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
