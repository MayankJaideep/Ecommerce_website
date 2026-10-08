"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./Icons";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {}
      }}
      className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-2.5 text-sm font-semibold"
    >
      {copied ? <CheckIcon className="h-4 w-4 text-tomato" /> : <CopyIcon className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}
