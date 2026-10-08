"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, useCartSummary } from "@/components/CartProvider";
import { OrderSummary } from "@/components/OrderSummary";
import { UpiPayment } from "@/components/UpiPayment";
import { ShieldIcon, UploadIcon } from "@/components/Icons";
import { INDIAN_STATES, MAX_SCREENSHOT_BYTES } from "@/lib/validation";
import { formatINR } from "@/lib/pricing";
import { delivery } from "@/lib/config";

type Fields = {
  customerName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  customerNote: string;
  upiTxnId: string;
};

const EMPTY: Fields = {
  customerName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "Karnataka",
  pincode: "",
  customerNote: "",
  upiTxnId: "",
};

const DRAFT_KEY = "hk-checkout-draft-v1";
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

function loadDraft(): Fields {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (saved && typeof saved === "object") return { ...EMPTY, ...saved };
  } catch {}
  return EMPTY;
}

function saveDraft(fields: Fields) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...fields, upiTxnId: "" }));
  } catch {}
}

function omit(obj: Record<string, string>, key: string) {
  const copy = { ...obj };
  delete copy[key];
  return copy;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { clear } = useCart();
  const { ready, line, product, totals } = useCartSummary();

  // Restore the draft so switching to a UPI app and back doesn't lose details.
  // The form only renders once the cart is ready (client-side), so this can't
  // cause a hydration mismatch.
  const [fields, setFields] = useState<Fields>(loadDraft);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const placed = useRef(false);

  // Release the preview object URL when it changes or the page unmounts.
  useEffect(() => (preview ? () => URL.revokeObjectURL(preview) : undefined), [preview]);

  // Empty cart (e.g. direct visit): send them to the shop — unless we just placed an order.
  useEffect(() => {
    if (ready && !line && !placed.current) router.replace("/shop");
  }, [ready, line, router]);

  if (!ready || !line || !product || !totals) {
    return <div className="mx-auto min-h-[60vh] max-w-xl px-4 py-10" />;
  }

  const set = (key: keyof Fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const next = { ...fields, [key]: e.target.value };
    setFields(next);
    saveDraft(next);
    if (errors[key]) setErrors((er) => omit(er, key));
  };

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setErrors((er) => omit(er, "screenshot"));
    // Always drop the previous selection first so a rejected file can never be
    // submitted in place of the one the customer thinks they just picked.
    if (preview) setPreview(null);
    setFile(null);
    if (f && !ACCEPTED.includes(f.type)) {
      e.target.value = "";
      setErrors((er) => ({ ...er, screenshot: "Please choose a JPG, PNG or WEBP image." }));
      return;
    }
    if (f && f.size > MAX_SCREENSHOT_BYTES) {
      e.target.value = "";
      setErrors((er) => ({ ...er, screenshot: "Image is larger than 5 MB." }));
      return;
    }
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!line || !product) return;
    setFormError(null);
    if (!file) {
      setErrors((er) => ({ ...er, screenshot: "Please upload your payment screenshot." }));
      document.getElementById("step-3")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const body = new FormData();
    Object.entries(fields).forEach(([k, v]) => body.append(k, v));
    body.append("productSlug", product.slug);
    body.append("quantity", String(line.quantity));
    body.append("screenshot", file);

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(data.fieldErrors ?? {});
        setFormError(data.error ?? "Could not place your order. Please try again.");
        const first = Object.keys(data.fieldErrors ?? {})[0];
        if (first) document.getElementsByName(first)[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      placed.current = true;
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      clear();
      router.push(`/order/${data.orderCode}?placed=1`);
    } catch {
      setFormError("Network problem — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const err = (k: string) =>
    errors[k] ? <p className="mt-1 text-sm font-medium text-chilli">{errors[k]}</p> : null;

  return (
    <div data-hide-wa className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      <h1 className="font-serif text-3xl font-black text-tomato sm:text-4xl">Checkout</h1>
      <p className="mt-1 flex items-center gap-2 text-sm text-coffee">
        <ShieldIcon className="h-4 w-4 text-tomato" /> Three quick steps. No account needed.
      </p>

      <form onSubmit={submit} noValidate className="mt-6 grid gap-6 md:grid-cols-[1fr_340px] md:items-start">
        <div className="space-y-6">
          {/* Summary first on mobile so the total is always clear */}
          <div className="md:hidden">
            <OrderSummary product={product} quantity={line.quantity} totals={totals}>
              <Link href="/cart" className="text-sm font-semibold text-tomato">
                Edit
              </Link>
            </OrderSummary>
          </div>

          <section className="card p-5 sm:p-6">
            <StepTitle n={1} title="Delivery details" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="customerName">Full name</label>
                <input id="customerName" name="customerName" autoComplete="name" className="input" value={fields.customerName} onChange={set("customerName")} required />
                {err("customerName")}
              </div>
              <div>
                <label className="label" htmlFor="phone">Mobile number (WhatsApp)</label>
                <div className="flex">
                  <span className="flex shrink-0 items-center rounded-l-xl border border-r-0 border-coffee/20 bg-paper px-3 text-coffee">+91</span>
                  <input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} className="input min-w-0 flex-1 rounded-l-none" value={fields.phone} onChange={set("phone")} required />
                </div>
                {err("phone")}
              </div>
              <div>
                <label className="label" htmlFor="email">Email <span className="font-normal text-coffee/60">(optional)</span></label>
                <input id="email" name="email" type="email" autoComplete="email" className="input" value={fields.email} onChange={set("email")} />
                {err("email")}
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="addressLine1">House no., building, street</label>
                <input id="addressLine1" name="addressLine1" autoComplete="address-line1" className="input" value={fields.addressLine1} onChange={set("addressLine1")} required />
                {err("addressLine1")}
              </div>
              <div>
                <label className="label" htmlFor="addressLine2">Area / locality <span className="font-normal text-coffee/60">(optional)</span></label>
                <input id="addressLine2" name="addressLine2" autoComplete="address-line2" className="input" value={fields.addressLine2} onChange={set("addressLine2")} />
              </div>
              <div>
                <label className="label" htmlFor="landmark">Landmark <span className="font-normal text-coffee/60">(optional)</span></label>
                <input id="landmark" name="landmark" className="input" value={fields.landmark} onChange={set("landmark")} />
              </div>
              <div>
                <label className="label" htmlFor="pincode">Pincode</label>
                <input id="pincode" name="pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} className="input" value={fields.pincode} onChange={set("pincode")} required />
                {err("pincode")}
              </div>
              <div>
                <label className="label" htmlFor="city">City / town</label>
                <input id="city" name="city" autoComplete="address-level2" className="input" value={fields.city} onChange={set("city")} required />
                {err("city")}
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="state">State</label>
                <select id="state" name="state" autoComplete="address-level1" className="input" value={fields.state} onChange={set("state")} required>
                  {INDIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {err("state")}
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="customerNote">Note for us <span className="font-normal text-coffee/60">(optional)</span></label>
                <textarea id="customerNote" name="customerNote" rows={2} className="input" placeholder="Gift message, delivery instructions…" value={fields.customerNote} onChange={set("customerNote")} />
              </div>
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <StepTitle n={2} title="Pay with UPI" />
            <div className="mt-5">
              <UpiPayment amount={totals.total} />
            </div>
          </section>

          <section id="step-3" className="card scroll-mt-24 p-5 sm:p-6">
            <StepTitle n={3} title="Upload payment screenshot" />
            <label
              htmlFor="screenshot"
              className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition ${errors.screenshot ? "border-chilli bg-chilli/5" : "border-coffee/25 bg-paper/50 hover:border-tomato"}`}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                <img src={preview} alt="Payment screenshot preview" className="max-h-64 rounded-xl" />
              ) : (
                <UploadIcon className="h-10 w-10 text-coffee/60" />
              )}
              <span className="font-semibold">{file ? "Change screenshot" : "Tap to upload screenshot"}</span>
              <span className="text-xs text-coffee/85">JPG, PNG or WEBP · up to 5 MB</span>
              <input id="screenshot" name="screenshot" type="file" accept={ACCEPTED.join(",")} className="sr-only" onChange={pickFile} />
            </label>
            {err("screenshot")}

            <div className="mt-4">
              <label className="label" htmlFor="upiTxnId">
                UPI transaction ID / UTR <span className="font-normal text-coffee/60">(optional, helps us verify faster)</span>
              </label>
              <input id="upiTxnId" name="upiTxnId" className="input font-mono" placeholder="e.g. 4281 5567 1209" value={fields.upiTxnId} onChange={set("upiTxnId")} />
            </div>
          </section>

          {formError && (
            <p role="alert" className="rounded-2xl bg-chilli/10 px-4 py-3 font-medium text-chilli">
              {formError}
            </p>
          )}

          <div className="md:hidden">
            <PlaceOrderButton submitting={submitting} total={totals.total} />
          </div>
        </div>

        <aside className="hidden space-y-4 md:sticky md:top-24 md:block">
          <OrderSummary product={product} quantity={line.quantity} totals={totals}>
            <Link href="/cart" className="text-sm font-semibold text-tomato">
              Edit
            </Link>
          </OrderSummary>
          <PlaceOrderButton submitting={submitting} total={totals.total} />
        </aside>
      </form>
    </div>
  );
}

function StepTitle({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="flex items-center gap-3 font-serif text-xl font-black sm:text-2xl">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tomato font-sans text-sm font-bold text-cream">
        {n}
      </span>
      {title}
    </h2>
  );
}

function PlaceOrderButton({ submitting, total }: { submitting: boolean; total: number }) {
  return (
    <div>
      <button type="submit" disabled={submitting} className="btn-primary w-full text-lg">
        {submitting ? "Placing your order…" : `Place Order · ${formatINR(total)}`}
      </button>
      <p className="mt-2 text-center text-xs text-coffee/85">
        We verify your payment and confirm on WhatsApp. Dispatch within {delivery.dispatchWithin}.
      </p>
    </div>
  );
}
