import Link from "next/link";
import { delivery } from "@/lib/config";

export function AnnouncementBar() {
  return (
    <div className="bg-lime px-4 py-2 text-center font-mono text-[11px] font-bold tracking-wider text-bark uppercase sm:text-xs">
      <Link href="/shop" className="hover:underline inline-flex items-center gap-2 py-2">
        <span aria-hidden className="text-tomato">✦</span>
        <span>
          <span className="hidden sm:inline">
            Fresh batch roasting this week · Free delivery on {delivery.freeShippingMinQty}+ packets
          </span>
          <span className="sm:hidden">
            Fresh batch · Free delivery on {delivery.freeShippingMinQty}+
          </span>
        </span>
        <span aria-hidden className="hidden text-tomato sm:inline">✦</span>
      </Link>
    </div>
  );
}
