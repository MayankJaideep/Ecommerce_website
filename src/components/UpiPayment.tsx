"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { brand } from "@/lib/config";
import { formatINR } from "@/lib/pricing";
import { CheckIcon, CopyIcon } from "./Icons";

const UPI_APPS = ["GPay", "PhonePe", "Paytm", "BHIM", "Any UPI app"];

export function UpiPayment({ amount }: { amount: number }) {
  const [qr, setQr] = useState<string | null>(null);
  const [qrMode, setQrMode] = useState<"dynamic" | "uploaded">("dynamic");
  const [copied, setCopied] = useState(false);

  const upiUri =
    `upi://pay?pa=${encodeURIComponent(brand.upiId)}` +
    `&pn=${encodeURIComponent(brand.upiPayeeName)}` +
    `&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Hurlikattu order")}`;

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(upiUri, {
      width: 480,
      margin: 1,
      color: { dark: "#3d2615", light: "#ffffff" },
    }).then((url) => !cancelled && setQr(url));
    return () => {
      cancelled = true;
    };
  }, [upiUri]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(brand.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-sm text-coffee">Amount to pay</p>
      <p className="text-4xl font-bold text-bark">{formatINR(amount)}</p>

      {/* Mode toggle */}
      <div className="mt-3 flex w-full max-w-xs rounded-full bg-paper p-1 text-xs font-semibold ring-1 ring-coffee/10 sm:max-w-sm">
        <button
          type="button"
          onClick={() => setQrMode("dynamic")}
          className={`min-w-0 flex-1 rounded-full px-3 py-2 transition ${
            qrMode === "dynamic" ? "bg-tomato text-cream shadow-xs" : "text-coffee hover:text-bark"
          }`}
        >
          <span className="hidden sm:inline">Instant Amount QR ({formatINR(amount)})</span>
          <span className="sm:hidden">Instant QR</span>
        </button>
        <button
          type="button"
          onClick={() => setQrMode("uploaded")}
          className={`min-w-0 flex-1 rounded-full px-3 py-2 transition ${
            qrMode === "uploaded" ? "bg-tomato text-cream shadow-xs" : "text-coffee hover:text-bark"
          }`}
        >
          <span className="hidden sm:inline">Uploaded Bank QR</span>
          <span className="sm:hidden">Bank QR</span>
        </button>
      </div>

      <div className="mt-4 w-full max-w-xs rounded-3xl bg-white p-4 shadow-md ring-1 ring-coffee/10 sm:max-w-sm">
        {qrMode === "dynamic" ? (
          qr ? (
            // eslint-disable-next-line @next/next/no-img-element -- data URL generated on the client
            <img
              src={qr}
              alt={`UPI QR code to pay ${formatINR(amount)}`}
              className="mx-auto h-52 w-52 max-w-full object-contain sm:h-56 sm:w-56"
            />
          ) : (
            <div className="mx-auto h-52 w-52 max-w-full animate-pulse rounded-xl bg-paper sm:h-56 sm:w-56" />
          )
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/upi-qr.png"
            alt="Merchant Bank UPI QR Code"
            className="mx-auto h-52 w-52 max-w-full rounded-xl object-contain sm:h-56 sm:w-56"
          />
        )}
        <p className="mt-2 text-xs font-semibold text-coffee/80">
          {qrMode === "dynamic" ? "Scan with any UPI app (amount pre-filled)" : "Scan with PhonePe, GPay, or any UPI app"}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {UPI_APPS.map((app) => (
          <span key={app} className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-coffee">
            {app}
          </span>
        ))}
      </div>

      <div className="mt-4 flex w-full max-w-sm items-center justify-between gap-2 rounded-2xl bg-paper px-3 py-3 sm:px-4">
        <div className="min-w-0 text-left">
          <p className="text-xs text-coffee/85">UPI ID · {brand.upiPayeeName}</p>
          {/* break-all (not truncate): a nowrap UPI ID would otherwise set the
              min-content width of the whole checkout column and push the page
              sideways on narrow phones. */}
          <p className="font-mono text-sm font-semibold break-all">{brand.upiId}</p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-2 text-sm font-semibold ring-1 ring-coffee/15"
        >
          {copied ? <CheckIcon className="h-4 w-4 text-tomato" /> : <CopyIcon className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* On phones the QR can't be scanned from the same screen — offer a direct app link */}
      <a href={upiUri} className="btn-secondary mt-3 w-full max-w-sm sm:hidden">
        Pay {formatINR(amount)} with a UPI app
      </a>

      <p className="mt-3 max-w-sm text-xs leading-relaxed text-coffee/85">
        On mobile? Tap the button above, or take a screenshot of this QR and open it from your UPI
        app&apos;s &ldquo;Scan from gallery&rdquo; option. Your details here are saved while you pay.
      </p>
    </div>
  );
}
