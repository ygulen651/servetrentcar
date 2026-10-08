"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type BannerTransition = "fade" | "slide" | "slices" | "tiles" | "curtain";
export type BannerSlide = { image: string; label: string; top: ReactNode; bottom: ReactNode; delay: number; transition: BannerTransition; href?: string };

const pieceLayout: Partial<Record<BannerTransition, { cols: number; rows: number }>> = { slices: { cols: 10, rows: 1 }, tiles: { cols: 8, rows: 4 } };
const TRANSITION_MS = 1300;

function Pieces({ image, cols, rows }: { image: string; cols: number; rows: number }) {
  return <div className="hb-pieces" aria-hidden="true">
    {Array.from({ length: cols * rows }, (_, n) => {
      const col = n % cols, row = Math.floor(n / cols);
      const style = { left: `${(col * 100) / cols}%`, top: `${(row * 100) / rows}%`, width: `${100 / cols}%`, height: `${100 / rows}%`, "--d": `${(rows > 1 ? col + row : col) * 70}ms` } as CSSProperties;
      return <span key={n} style={style}><i style={{ width: `${cols * 100}%`, height: `${rows * 100}%`, left: `${-col * 100}%`, top: `${-row * 100}%`, backgroundImage: `url(${image})` }} /></span>;
    })}
  </div>;
}

export function HomeBanner({ slides, children }: { slides: BannerSlide[]; children?: ReactNode }) {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const go = useCallback((next: number) => {
    const target = (next + slides.length) % slides.length;
    if (target === active) return;
    setLeaving(active);
    setActive(target);
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setLeaving(null), TRANSITION_MS);
  }, [active, slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => go(active + 1), slides[active].delay + TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [active, paused, go, slides]);

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  return <section className="hb" aria-roledescription="carousel" aria-label="Öne çıkan görseller" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className="hb-stage">
      {slides.map((slide, index) => {
        const layout = pieceLayout[slide.transition];
        const state = index === active ? "is-active" : index === leaving ? "is-leaving" : "";
        return <div key={slide.image} className={`hb-slide hb-t-${slide.transition} ${state}`} aria-hidden={index !== active} style={{ "--hold": `${slide.delay + TRANSITION_MS}ms` } as CSSProperties}>
          <div className="hb-media">
            <div className="hb-bg" style={{ backgroundImage: `url(${slide.image})` }} />
            {layout && <Pieces image={slide.image} {...layout} />}
          </div>
          <div className="hb-layers"><div className="hb-layers-inner">
            <div className="hb-text"><span>{slide.top}</span></div>
            <div className="hb-text hb-text-2"><span>{slide.bottom}</span></div>
          </div></div>
          {slide.href && <a className="hb-link" href={slide.href} tabIndex={index === active ? 0 : -1} aria-label={slide.label} />}
        </div>;
      })}
      <div className="hb-timer" key={`${active}-${paused}`} style={{ "--hold": `${slides[active].delay + TRANSITION_MS}ms` } as CSSProperties} data-paused={paused} />
      <button type="button" className="hb-arrow hb-prev" onClick={() => go(active - 1)} aria-label="Önceki görsel"><ChevronLeft /></button>
      <button type="button" className="hb-arrow hb-next" onClick={() => go(active + 1)} aria-label="Sonraki görsel"><ChevronRight /></button>
      <div className="hb-dots">{slides.map((slide, index) => <button type="button" key={slide.image} className={index === active ? "on" : ""} onClick={() => go(index)} aria-label={`${index + 1}. görsel`} />)}</div>
    </div>
    {children && <div className="hb-search-wrap"><div className="hb-search-shell">{children}</div></div>}
  </section>;
}
