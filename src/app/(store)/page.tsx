
import Link from "next/link";
import { brand, delivery, whatsappLink } from "@/lib/config";
import { hurlikattu, servingIdeas, testimonials } from "@/lib/product";
import { formatINR } from "@/lib/pricing";
import { Marquee } from "@/components/Marquee";
import { BagIcon, FlameIcon, HeartBoxIcon, LeafIcon, ShieldIcon, TruckIcon, WhatsAppIcon } from "@/components/Icons";
import { Photo } from "@/components/Photo";

const STEPS = [
  { n: "1", title: "Choose packets", text: "Pick how many 500 g packets you'd like." },
  { n: "2", title: "Pay by UPI", text: "Scan our QR with GPay, PhonePe, Paytm or any UPI app." },
  { n: "3", title: "Upload screenshot", text: "Share the payment screenshot and place your order." },
  { n: "4", title: "We roast & ship", text: "We verify, pack fresh and send it to your door." },
];

const CARD_QTY = 2;

export default function HomePage() {
  return (
    <>
      {/* Hero Banner from new.png */}
      <section className="relative w-full overflow-hidden bg-[#e8d5ba]">
        <div className="relative mx-auto w-full max-w-[2000px]">
          {/* Desktop & Tablet Display */}
          <div className="relative aspect-[2880/893] w-full hidden sm:block">
            <Photo
              src="/images/hero-banner.png"
              alt="Hurlikattu — The taste of a Karnataka kitchen, in every spoon"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Interactive button hotspots matching the banner buttons */}
            <div className="absolute inset-0">
              <Link
                href="/shop"
                aria-label="Buy Now ₹400"
                className="absolute left-[8.26%] top-[76.37%] h-[10.41%] min-h-11 w-[14.2%] rounded-full transition hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-tomato cursor-pointer"
              />
              <a
                href={whatsappLink("Hi! I'd like to order Hurlikattu.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order on WhatsApp"
                className="absolute left-[23.26%] top-[76.37%] h-[10.41%] min-h-11 w-[14.2%] rounded-full transition hover:brightness-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-whatsapp cursor-pointer"
              />
            </div>
          </div>

          {/* Mobile Display: Responsive with focused artwork and readable text */}
          <div className="sm:hidden flex flex-col bg-[#eedec8]">
            <div className="relative h-[260px] w-full overflow-hidden">
              <Photo
                src="/images/hero-banner.png"
                alt="Hurlikattu — The taste of a Karnataka kitchen"
                fill
                priority
                sizes="100vw"
                className="object-cover object-[70%_center]"
              />
            </div>
            <div className="px-5 pt-4 pb-8 text-center">
              <p className="eyebrow text-xs uppercase tracking-wider text-bark/80">Homemade in {brand.fromCity}</p>
              <h1 className="mt-2 font-serif text-3xl font-black leading-tight text-tomato">
                The taste of a Karnataka kitchen, in every spoon.
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-coffee">
                {hurlikattu.shortDescription}
              </p>
              <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 font-mono text-xs font-bold text-coffee/85">
                <li className="flex items-center gap-1.5">
                  <LeafIcon className="h-3.5 w-3.5 text-tomato" /> 100% Natural
                </li>
                <li className="flex items-center gap-1.5">
                  <TruckIcon className="h-3.5 w-3.5 text-tomato" /> Flat ₹{delivery.fee} Delivery
                </li>
                <li className="flex items-center gap-1.5">
                  <FlameIcon className="h-3.5 w-3.5 text-tomato" /> Ready in 10 min
                </li>
              </ul>
              <div className="mt-5 flex flex-col gap-2.5">
                <Link href="/shop" className="btn-primary py-3.5 text-sm">
                  Buy Now · {formatINR(hurlikattu.price)} →
                </Link>
                <a
                  href={whatsappLink("Hi! I'd like to order Hurlikattu.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary py-3 text-sm justify-center"
                >
                  <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> Order on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* Closing call to action — peach band with an order preview card */}
      <section className="bg-gradient-to-b from-cream via-blush to-peach px-4 py-16 md:py-24">
        <div className="reveal mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          <div className="text-center md:text-left">
            <p className="font-kannada text-lg text-coffee/80">{brand.kannadaName}</p>
            <h2 className="mt-2 font-serif text-[2.4rem] leading-[0.95] font-black tracking-tight text-tomato sm:text-6xl">
              Bring home a bowl of comfort.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-coffee md:mx-0">
              {formatINR(hurlikattu.price)} for {hurlikattu.weight}. Roasted fresh, packed by hand and
              shipped across India.
            </p>
            <a
              href={whatsappLink("Hi! I'd like to order Hurlikattu.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mt-7"
            >
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" /> Ask on WhatsApp
            </a>
          </div>

          <div className="mx-auto w-full max-w-sm rounded-3xl bg-cream/90 p-4 shadow-2xl shadow-tomato/15 ring-1 ring-tomato/10">
            <div className="aspect-[10/7] w-full overflow-hidden rounded-2xl bg-paper">
              <Photo
                src="/images/pack-sauce.jpg"
                alt="Hurlikattu serving"
                width={400}
                height={280}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-4 font-mono text-sm font-bold">
              {hurlikattu.name} × {CARD_QTY}
            </p>
            <dl className="mt-3 space-y-1.5 font-mono text-xs text-coffee">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatINR(hurlikattu.price * CARD_QTY)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Delivery</dt>
                <dd className="font-bold text-tomato">{formatINR(delivery.fee)}</dd>
              </div>
              <div className="flex justify-between border-t border-coffee/15 pt-2 text-sm font-bold text-bark">
                <dt>Total</dt>
                <dd>{formatINR(hurlikattu.price * CARD_QTY + delivery.fee)}</dd>
              </div>
            </dl>
            <Link
              href="/shop"
              className="btn mt-4 w-full rounded-xl! bg-bark py-3! text-cream hover:bg-black"
            >
              <BagIcon className="h-4 w-4" /> Checkout
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 font-mono text-xs font-bold text-coffee">
              <ShieldIcon className="h-3.5 w-3.5" /> Secure UPI payment
            </p>
          </div>
        </div>
      </section>

      {/* Why you'll love it — bento grid */}
      <section className="mx-auto max-w-6xl px-4 pb-12 md:pb-16">
        <div className="reveal text-center">
          <p className="eyebrow">Why you&apos;ll love it</p>
          <h2 className="mt-3 font-serif text-4xl font-black tracking-tight text-tomato sm:text-5xl">
            One packet. Many comforting meals.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:grid-rows-2">
          <Link
            href="/shop"
            className="reveal group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-paper p-6 ring-1 ring-coffee/10 md:row-span-2"
          >
            <div>
              <p className="eyebrow">The packet</p>
              <p className="mt-2 font-serif text-4xl font-black text-tomato">{hurlikattu.name}</p>
              <p className="mt-1 text-coffee">
                {hurlikattu.weight} · {formatINR(hurlikattu.price)} · serves 15–18 bowls
              </p>
            </div>
            <div className="relative mx-auto mt-6 flex aspect-square w-full max-w-64 overflow-hidden rounded-3xl md:max-w-none transition duration-500 group-hover:scale-[1.03] shadow-md bg-paper">
              <Photo
                src="/images/pack.jpg"
                alt="Hurlikattu 500 g pouch"
                width={500}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="mt-5 inline-flex items-center gap-2 font-semibold text-tomato">
              Shop now <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </Link>
          <BentoTile
            icon={<FlameIcon className="h-6 w-6" />}
            title="Freshly roasted every week"
            text="Small batches over a low flame, so every packet smells like it just left the kadai."
            className="bg-lime/50"
          />
          <BentoTile
            icon={<LeafIcon className="h-6 w-6" />}
            title="Ajji's recipe, unchanged"
            text="Horse gram, Byadgi chillies, pepper and curry leaves — the way it has always been made."
            className="bg-blush"
          />
          <BentoTile
            icon={<ShieldIcon className="h-6 w-6" />}
            title="Nothing artificial"
            text="No preservatives, no colours, no MSG. Just whole ingredients you can pronounce."
            className="bg-white/70"
          />
          <BentoTile
            icon={<HeartBoxIcon className="h-6 w-6" />}
            title="Hand-packed with care"
            text={`Sealed kraft pouches, dispatched within ${delivery.dispatchWithin} anywhere in India.`}
            className="bg-peach/40"
          />
        </div>
      </section>

      {/* Story */}
      <section id="story" className="scroll-mt-20 bg-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
          <div className="reveal aspect-square w-full overflow-hidden rounded-[2rem] shadow-xl shadow-bark/10">
            <Photo
              src="/images/cooking.jpg"
              alt="Traditional iron kadai cooking over firewood"
              width={700}
              height={700}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="reveal">
            <p className="eyebrow">Our story</p>
            <h2 className="mt-3 font-serif text-4xl font-black tracking-tight text-tomato sm:text-5xl">
              From Ajji&apos;s iron kadai to your kitchen
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-coffee">
              <p>
                Every monsoon, our grandmother would roast huruli in a heavy iron kadai until the
                whole street smelled of it. That powder became saaru on cold evenings, kattu for
                tired afternoons, and comfort whenever someone was unwell.
              </p>
              <p>
                We still make Hurlikattu the same way — slow-roasted in small batches, ground with
                whole spices, packed by hand. It is the food we grew up on, and now we share it with
                you.
              </p>
            </div>
            <p className="mt-6 font-serif text-2xl font-black text-tomato">— Amma &amp; family</p>
          </div>
        </div>
      </section>

      {/* Serving ideas */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="reveal flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Ways to enjoy</p>
            <h2 className="mt-3 font-serif text-4xl font-black tracking-tight text-tomato sm:text-5xl">
              From pantry to plate in minutes
            </h2>
          </div>
          <Link href="/shop#prepare" className="inline-block py-2.5 font-semibold text-tomato hover:underline">
            See full recipes →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {servingIdeas.map((idea, i) => (
            <article
              key={idea.title}
              className={`reveal flex flex-col rounded-[2rem] p-6 ring-1 ring-coffee/10 ${
                i === 1 ? "bg-tomato text-cream" : "bg-white/70"
              }`}
            >
              <span
                className={`self-start rounded-full px-3 py-1 font-mono text-xs font-bold uppercase ${
                  i === 1 ? "bg-lime text-bark" : "bg-lime/60 text-bark"
                }`}
              >
                {idea.tag}
              </span>
              <h3 className="mt-6 font-serif text-3xl font-black">{idea.title}</h3>
              <p className={`mt-2 leading-relaxed ${i === 1 ? "text-cream/80" : "text-coffee"}`}>
                {idea.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-grain border-y border-coffee/10">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="reveal text-center">
            <p className="eyebrow">Simple ordering</p>
            <h2 className="mt-3 font-serif text-4xl font-black tracking-tight text-tomato sm:text-5xl">
              Order in under 2 minutes
            </h2>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="reveal card relative overflow-hidden p-6">
                <span className="absolute top-1 right-4 font-serif text-7xl leading-none font-black text-tomato/10">
                  {s.n}
                </span>
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-tomato font-mono text-base font-bold text-cream">
                  {s.n}
                </span>
                <p className="relative mt-4 font-serif text-xl font-black">{s.title}</p>
                <p className="relative mt-1 text-coffee/80">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Link href="/shop" className="btn-primary px-8 text-lg">
              Start your order
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews — only shown once real reviews are added in src/lib/product.ts */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="reveal text-center font-serif text-4xl font-black tracking-tight text-tomato sm:text-5xl">
            Loved in kitchens across India
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name + t.quote} className="reveal card p-6">
                <p aria-hidden className="text-lime">★★★★★</p>
                <blockquote className="mt-3 font-serif text-xl leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-coffee">
                  {t.name} · {t.city}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

    </>
  );
}

function BentoTile({
  icon,
  title,
  text,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  className: string;
}) {
  return (
    <div className={`reveal flex flex-col rounded-[2rem] p-5 ring-1 sm:p-6 ring-coffee/10 ${className}`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-tomato shadow-sm">
        {icon}
      </span>
      <p className="mt-4 font-serif text-xl leading-tight font-black sm:mt-5 sm:text-2xl">{title}</p>
      <p className="mt-2 leading-relaxed text-coffee">{text}</p>
    </div>
  );
}


