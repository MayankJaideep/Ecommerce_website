// All product copy lives here so the owner can edit it in one place.
export type Product = {
  slug: string;
  name: string;
  kannadaName: string;
  price: number; // rupees per packet
  weight: string;
  shortDescription: string;
  description: string[];
  ingredients: string[];
  preparation: { title: string; steps: string[] }[];
  images: { src: string; alt: string }[];
  shelfLife: string;
  inStock: boolean;
};

export type Testimonial = { quote: string; name: string; city: string };

export const hurlikattu: Product = {
  slug: "hurlikattu",
  name: "Hurlikattu",
  kannadaName: "ಹುರಳಿ ಕಟ್ಟು",
  price: 400,
  weight: "500 g",
  shortDescription:
    "Stone-ground, slow-roasted horse gram mix for a soul-warming huruli saaru — ready in 10 minutes.",
  description: [
    "Hurlikattu is our family's horse gram (huruli) mix — the earthy, peppery base of the kattu and saaru that every Karnataka home knows from rainy evenings and grandmother's kitchens.",
    "We hand-pick the huruli, dry-roast it slowly in small batches over a low flame, and grind it with roasted spices, curry leaves and a touch of jaggery. No preservatives, no colours, nothing you can't pronounce.",
  ],
  ingredients: [
    "Horse gram (huruli)",
    "Byadgi red chillies",
    "Coriander seeds",
    "Cumin",
    "Black pepper",
    "Curry leaves",
    "Garlic",
    "Tamarind",
    "Jaggery",
    "Asafoetida (hing)",
    "Rock salt",
  ],
  preparation: [
    {
      title: "Huruli saaru (rasam)",
      steps: [
        "Boil 2 cups of water and whisk in 3 tbsp Hurlikattu.",
        "Simmer for 5–7 minutes, stirring now and then.",
        "Temper with ghee, mustard, garlic and curry leaves. Pour over hot rice.",
      ],
    },
    {
      title: "Quick kattu-anna",
      steps: [
        "Mix 1 tbsp Hurlikattu into a plate of hot rice.",
        "Add a spoon of ghee and a squeeze of lemon. Enjoy with happala (papad).",
      ],
    },
  ],
  images: [
    { src: "/images/pack.jpg", alt: "Hurlikattu 500 g sealed pouch" },
    { src: "/images/pack-sauce.jpg", alt: "Hurlikattu pouches with dark horse gram sauce" },
    { src: "/images/cooking.jpg", alt: "Iron kadai pots slow-cooking on a wood fire" },
  ],
  shelfLife: "Best within 3 months. Store in an airtight jar, away from moisture.",
  inStock: true,
};

// Short facts shown as big numbers on the home page. Keep them true to the product.
export const highlights = [
  { value: "11", label: "whole ingredients" },
  { value: "0", label: "preservatives or colours" },
  { value: "10 min", label: "to a pot of saaru" },
  { value: "3", label: "generations of the recipe" },
];

// Ways to use one packet, shown as cards on the home page.
export const servingIdeas = [
  { title: "Huruli saaru", text: "A peppery rasam to pour over steaming rice with ghee.", tag: "Classic" },
  { title: "Kattu-anna", text: "Stir a spoon into hot rice with ghee and lemon for a 2-minute meal.", tag: "Quick" },
  { title: "Monsoon soup", text: "Thin it out, add a squeeze of lime, and sip it from a mug.", tag: "Comfort" },
];

// Real customer reviews only. The reviews section on the home page stays hidden
// until at least one is added here.
export const testimonials: Testimonial[] = [
  // { quote: "Tastes exactly like my Ajji's.", name: "Priya", city: "Bengaluru" },
];

export const products = [hurlikattu];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
