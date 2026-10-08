import { FlameIcon, HeartBoxIcon, LeafIcon, ShieldIcon } from "./Icons";

const BADGES = [
  { icon: FlameIcon, title: "Freshly prepared", text: "Roasted in small batches every week" },
  { icon: LeafIcon, title: "Traditional recipe", text: "Our Ajji's recipe, unchanged" },
  { icon: HeartBoxIcon, title: "Packed with care", text: "Sealed kraft pouches, hand-packed" },
  { icon: ShieldIcon, title: "No preservatives", text: "No colour, no MSG, no shortcuts" },
];

export function TrustBadges({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`grid grid-cols-2 gap-3 ${compact ? "" : "sm:grid-cols-4 sm:gap-4"}`}>
      {BADGES.map(({ icon: Icon, title, text }) => (
        <li key={title} className="card flex flex-col gap-2 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tomato/10 text-tomato">
            <Icon className="h-5 w-5" />
          </span>
          <p className="font-semibold leading-tight">{title}</p>
          {!compact && <p className="text-sm text-coffee/80">{text}</p>}
        </li>
      ))}
    </ul>
  );
}
