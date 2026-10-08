// Public brand settings. Values come from NEXT_PUBLIC_* env vars so they can be
// changed per deployment without code edits.
export const brand = {
  name: "Amma's Hurlikattu",
  shortName: "Hurlikattu",
  tagline: "Slow-roasted horse gram, the way Ajji made it.",
  kannadaName: "ಹುರಳಿ ಕಟ್ಟು",
  upiId: process.env.NEXT_PUBLIC_UPI_ID || "pallavijaideep28-1@okhdfcbank",
  upiPayeeName: process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "Amma's Hurlikattu",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  fromCity: "Sakaleshpur, Karnataka",
};

export const delivery = {
  // Flat delivery fee, waived when the order reaches freeShippingMinQty packets.
  fee: 60,
  freeShippingMinQty: 2,
  dispatchWithin: "1–2 days",
  karnatakaEta: "2–4 days",
  restOfIndiaEta: "4–7 days",
  maxQtyPerOrder: 20,
};

export function whatsappLink(message: string) {
  return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
