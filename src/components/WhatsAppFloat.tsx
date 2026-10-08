import { whatsappLink } from "@/lib/config";
import { WhatsAppIcon } from "./Icons";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Hi! I'd like to know more about Hurlikattu.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="wa-float fixed right-4 bottom-5 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 font-semibold text-white shadow-xl shadow-black/15 transition hover:scale-105 sm:bottom-6"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden text-sm sm:inline">Chat with us</span>
    </a>
  );
}
