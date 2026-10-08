import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Noto_Serif_Kannada, Space_Mono } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/config";
import { CartProvider } from "@/components/CartProvider";

const display = Fraunces({ variable: "--font-display", subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"] });
const body = Manrope({ variable: "--font-body", subsets: ["latin"] });
const mono = Space_Mono({ variable: "--font-mono-face", subsets: ["latin"], weight: ["400", "700"] });
const kannada = Noto_Serif_Kannada({
  variable: "--font-kn",
  subsets: ["kannada"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: { default: `${brand.name} — Homemade Horse Gram Mix`, template: `%s · ${brand.name}` },
  description:
    "Freshly roasted, stone-ground Hurlikattu (horse gram mix) from a Karnataka home kitchen. ₹400 for 500 g. Pay by UPI, delivered across India.",
  openGraph: {
    title: brand.name,
    description: brand.tagline,
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f1df",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} ${kannada.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
