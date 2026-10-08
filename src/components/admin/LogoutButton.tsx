"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
      }}
      className="rounded-full px-3 py-1.5 text-sm font-semibold text-coffee ring-1 ring-coffee/20 hover:bg-paper"
    >
      Log out
    </button>
  );
}
