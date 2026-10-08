import Link from "next/link";
import { brand, delivery, whatsappLink } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-16 bg-tomato pb-20 text-cream/85 sm:pb-10">
      <div className="h-2 bg-lime" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-serif text-4xl font-black text-cream">{brand.shortName.toLowerCase()}</p>
          <p className="mt-1 font-kannada text-cream/60">{brand.kannadaName}</p>
          <p className="mt-3 text-sm leading-relaxed">
            Made in small batches in our home kitchen in {brand.fromCity}. Shipped across India.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-mono font-bold text-lime uppercase">Delivery</p>
          <ul className="space-y-1.5">
            <li>Dispatched within {delivery.dispatchWithin}</li>
            <li>Karnataka: {delivery.karnatakaEta}</li>
            <li>Rest of India: {delivery.restOfIndiaEta}</li>
            <li>Flat ₹{delivery.fee} delivery across India</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-mono font-bold text-lime uppercase">Help</p>
          <ul className="space-y-1">
            <li>
              <Link href="/track" className="-mx-2 inline-block px-2 py-2.5 hover:text-cream">
                Track your order
              </Link>
            </li>
            <li>
              <a
                href={whatsappLink("Hi! I have a question about Hurlikattu.")}
                target="_blank"
                rel="noopener noreferrer"
                className="-mx-2 inline-block px-2 py-2.5 hover:text-cream"
              >
                WhatsApp us
              </a>
            </li>
            <li>UPI: {brand.upiId}</li>
          </ul>
        </div>
      </div>
      <p className="px-4 text-center font-mono text-xs text-cream/60">
        © {brand.name}. Made with love and a lot of slow roasting.
      </p>
    </footer>
  );
}
