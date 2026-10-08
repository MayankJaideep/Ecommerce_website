import { hurlikattu } from "@/lib/product";

const ITEMS = [
  "Slow-roasted",
  "Stone-ground",
  "Small batch",
  "No preservatives",
  ...hurlikattu.ingredients,
];

// A scrolling band of ingredients and promises. The list is rendered twice so
// the CSS animation can loop without a gap; the copy is hidden from screen readers.
export function Marquee() {
  return (
    <div className="marquee overflow-hidden bg-tomato py-4 text-cream">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-6 pr-6 font-serif text-xl font-black whitespace-nowrap sm:text-2xl">
                {item}
                <span aria-hidden className="text-lime">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
