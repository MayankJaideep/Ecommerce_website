"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/lib/orders";

export function OrderControls({
  orderId,
  status: initialStatus,
  trackingInfo: initialTracking,
  adminNote: initialNote,
}: {
  orderId: string;
  status: OrderStatus;
  trackingInfo: string;
  adminNote: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [trackingInfo, setTrackingInfo] = useState(initialTracking);
  const [adminNote, setAdminNote] = useState(initialNote);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const dirty = status !== initialStatus || trackingInfo !== initialTracking || adminNote !== initialNote;

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingInfo, adminNote }),
      });
      if (!res.ok) throw new Error();
      setMessage({ ok: true, text: "Saved" });
      router.refresh();
    } catch {
      setMessage({ ok: false, text: "Could not save. Try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-5">
      <h2 className="font-semibold">Update order</h2>
      <p className="mt-1 text-xs text-coffee/70">Customers see the status and tracking info on their order page.</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`rounded-xl px-3 py-2.5 text-left text-sm font-semibold ring-1 transition ${status === s ? "bg-tomato text-cream ring-tomato" : "bg-white ring-coffee/15 hover:bg-paper"}`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <label htmlFor="trackingInfo" className="label mt-4">
        Courier &amp; tracking number
      </label>
      <input
        id="trackingInfo"
        className="input"
        maxLength={200}
        placeholder="e.g. India Post EK123456789IN"
        value={trackingInfo}
        onChange={(e) => setTrackingInfo(e.target.value)}
      />

      <label htmlFor="adminNote" className="label mt-4">
        Private note <span className="font-normal text-coffee/60">(only you see this)</span>
      </label>
      <textarea
        id="adminNote"
        rows={2}
        className="input"
        maxLength={1000}
        value={adminNote}
        onChange={(e) => setAdminNote(e.target.value)}
      />

      <button type="button" onClick={save} disabled={saving || !dirty} className="btn-primary mt-4 w-full">
        {saving ? "Saving…" : "Save changes"}
      </button>
      {message && (
        <p className={`mt-2 text-center text-sm font-medium ${message.ok ? "text-tomato" : "text-chilli"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
