import type { Metadata } from "next";
import { hurlikattu as product } from "@/lib/product";
import { brand, delivery } from "@/lib/config";
import { BuyBox } from "@/components/BuyBox";
import { Gallery } from "@/components/Gallery";
import { TrustBadges } from "@/components/TrustBadges";

export const metadata: Metadata = {
  title: "Buy Hurlikattu — 500 g",
  description: product.shortDescription,
};

// Product structured data so search engines can show price and stock.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.shortDescription,
  image: product.images.map((i) => new URL(i.src, brand.siteUrl).toString()),
  brand: { "@type": "Brand", name: brand.name },
  offers: {
    "@type": "Offer",
    price: product.price,
    priceCurrency: "INR",
    availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    url: new URL("/shop", brand.siteUrl).toString(),
  },
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="md:sticky md:top-24 md:self-start">
          <Gallery images={product.images} />
        </div>

        <div>
          <p className="eyebrow">Small-batch · Homemade</p>
          <h1 className="mt-2 font-serif text-4xl font-black tracking-tight text-tomato sm:text-5xl md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-1 font-kannada text-xl text-coffee/80">{product.kannadaName}</p>
          <p className="mt-3 text-lg leading-relaxed text-coffee">{product.shortDescription}</p>

          <div className="mt-6">
            <BuyBox product={product} />
          </div>

          <div className="mt-6">
            <TrustBadges compact />
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        <section className="reveal card p-6 md:col-span-2">
          <h2 className="font-serif text-2xl font-black text-tomato">About Hurlikattu</h2>
          <div className="mt-3 space-y-3 leading-relaxed text-coffee">
            {product.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section className="reveal card p-6">
          <h2 className="font-serif text-2xl font-black text-tomato">Ingredients</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {product.ingredients.map((i) => (
              <li key={i} className="rounded-full bg-paper px-3 py-1.5 text-sm font-medium">
                {i}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-coffee/70">
            No preservatives, artificial colours or MSG. Contains garlic.
          </p>
        </section>

        <section id="prepare" className="reveal card scroll-mt-24 p-6 md:col-span-2">
          <h2 className="font-serif text-2xl font-black text-tomato">How to prepare</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {product.preparation.map((prep) => (
              <div key={prep.title}>
                <h3 className="font-semibold text-tomato">{prep.title}</h3>
                <ol className="mt-2 space-y-2">
                  {prep.steps.map((step, i) => (
                    <li key={step} className="flex gap-3 text-coffee">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime/20 text-xs font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section className="reveal card p-6">
          <h2 className="font-serif text-2xl font-black text-tomato">Details</h2>
          <dl className="mt-3 space-y-2 text-sm">
            {[
              ["Quantity", `${product.weight} per packet`],
              ["Serves", "≈ 15–18 bowls of saaru"],
              ["Shelf life", product.shelfLife],
              ["Dispatch", `Within ${delivery.dispatchWithin}`],
              ["Delivery", `Karnataka ${delivery.karnatakaEta} · India ${delivery.restOfIndiaEta}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-coffee/10 pb-2 last:border-0">
                <dt className="shrink-0 font-semibold">{k}</dt>
                <dd className="text-right text-coffee">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
