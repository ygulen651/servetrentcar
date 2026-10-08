"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type ShowcaseItem = { id: string; href: string; image: string; price: string; district: string; type: string };

const tiles = [
  { size: "large", pause: 4200 },
  { size: "small", pause: 5200 },
  { size: "small", pause: 4500 },
  { size: "large", pause: 5500 },
  { size: "medium", pause: 3000 },
] as const;
const SPEED = 500;

function Showcase({ items, size, pause, area }: { items: ShowcaseItem[]; size: string; pause: number; area: number }) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const loop = items.length > 1;
  const track = loop ? [...items, items[0]] : items;

  useEffect(() => {
    if (!loop || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => { setAnimate(true); setIndex((value) => value + 1); }, pause + SPEED);
    return () => clearInterval(timer);
  }, [loop, pause]);

  useEffect(() => {
    if (index < items.length) return;
    const reset = setTimeout(() => { setAnimate(false); setIndex(0); }, SPEED);
    return () => clearTimeout(reset);
  }, [index, items.length]);

  return <div className={`sc sc-${size} sc-${area}`}>
    <ul style={{ transform: `translateX(-${index * 100}%)`, transition: animate ? `transform ${SPEED}ms ease` : "none" }}>
      {track.map((item, n) => <li key={`${item.id}-${n}`} aria-hidden={n !== index % items.length}>
        <Link href={item.href} tabIndex={n === index ? 0 : -1}>
          <span className="sc-img" style={{ backgroundImage: `url(${item.image})` }} />
          <span className="sc-content"><span className="sc-price">{item.price}</span><span className="sc-district">{item.district}</span><span className="sc-type">{item.type}</span></span>
        </Link>
      </li>)}
    </ul>
  </div>;
}

export function ShowcaseMosaic({ items }: { items: ShowcaseItem[] }) {
  if (!items.length) return null;
  const pool = items.length >= tiles.length * 2 ? items : Array.from({ length: tiles.length * 2 }, (_, n) => items[(n + Math.floor(n / items.length)) % items.length]);
  const groups = tiles.map((_, tile) => pool.filter((_, n) => n % tiles.length === tile));
  return <div className="showcases">
    {tiles.map((tile, n) => <Showcase key={n} area={n + 1} size={tile.size} pause={tile.pause} items={groups[n].map((item, i) => ({ ...item, id: `${item.id}-${i}` }))} />)}
  </div>;
}
