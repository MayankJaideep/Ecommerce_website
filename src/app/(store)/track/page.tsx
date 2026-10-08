"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeOrderCode, ORDER_CODE_PATTERN } from "@/lib/orders";
import { whatsappLink } from "@/lib/config";

export default function TrackPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeOrderCode(code);
    if (!ORDER_CODE_PATTERN.test(normalized)) {
      setError("Order IDs look like HK-AB12-CD34. Please check and try again.");
      return;
    }
    router.push(`/order/${normalized}`);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 md:py-20">
      <h1 className="text-center font-serif text-3xl font-black text-tomato sm:text-4xl">Track your order</h1>
      <p className="mt-2 text-center text-coffee">Enter the order ID we showed you after checkout.</p>
      <form onSubmit={submit} className="card mt-8 p-5">
        <label htmlFor="code" className="label">
          Order ID
        </label>
        <input
          id="code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          placeholder="HK-AB12-CD34"
          autoCapitalize="characters"
          autoComplete="off"
          className="input font-mono text-lg tracking-wider uppercase"
        />
        {error && <p className="mt-2 text-sm font-medium text-chilli">{error}</p>}
        <button type="submit" className="btn-primary mt-4 w-full">
          Track order
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-coffee">
        Lost your order ID?{" "}
        <a
          href={whatsappLink("Hi! I need help finding my Hurlikattu order.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block py-1.5 font-semibold text-tomato underline"
        >
          Message us on WhatsApp
        </a>
      </p>
    </div>
  );
}
