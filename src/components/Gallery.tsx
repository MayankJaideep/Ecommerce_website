"use client";

import { useState } from "react";
import { Photo } from "./Photo";

export function Gallery({ images }: { images: { src: string; alt: string }[] }) {
  const [active, setActive] = useState(0);
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-[1.5rem] bg-gradient-to-br from-peach via-blush to-tomato/20 flex items-center justify-center shadow-xl shadow-bark/10">
        <span className="font-serif text-3xl font-black text-tomato/50">Hurlikattu</span>
      </div>
    );
  }
  const current = images[active] || images[0];

  return (
    <div>
      <Photo
        src={current.src}
        alt={current.alt}
        width={800}
        height={800}
        sizes="(min-width: 768px) 50vw, 100vw"
        priority
        className="aspect-square w-full rounded-[1.5rem] object-cover shadow-xl shadow-bark/10"
      />
      <div className="mt-3 grid grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show image: ${img.alt}`}
            aria-current={i === active}
            className={`overflow-hidden rounded-2xl ring-2 transition ${i === active ? "ring-tomato" : "ring-transparent opacity-70 hover:opacity-100"}`}
          >
            <Photo src={img.src} alt="" width={240} height={240} className="aspect-square w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
