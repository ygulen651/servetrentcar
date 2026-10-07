"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

type DetailGalleryProps = { images: string[]; title: string };

export function DetailGallery({ images, title }: DetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const close = () => setActiveIndex(null);
  const previous = () => setActiveIndex((current) => current === null ? null : (current - 1 + images.length) % images.length);
  const next = () => setActiveIndex((current) => current === null ? null : (current + 1) % images.length);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") setActiveIndex((current) => current === null ? null : (current - 1 + images.length) % images.length);
      if (event.key === "ArrowRight") setActiveIndex((current) => current === null ? null : (current + 1) % images.length);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length]);

  if (images.length === 0) return <div className="detail-gallery detail-gallery-empty"><Images aria-hidden="true" /><span>Fotoğraf bulunmuyor</span></div>;

  return <>
    <div className={`detail-gallery ${images.length < 2 ? "single" : ""}`}>
      {images.slice(0, 3).map((image, index) => <button className={index === 0 ? "detail-cover" : "detail-thumb"} type="button" aria-label={`${title} fotoğraf ${index + 1} büyüt`} style={{ backgroundImage: `url(${image})` }} onClick={() => setActiveIndex(index)} key={`${image}-${index}`}>
        {index === 2 && images.length > 3 && <span>+{images.length - 3} fotoğraf</span>}
      </button>)}
    </div>
    {activeIndex !== null && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${title} fotoğraf galerisi`} onClick={close}>
      <button className="gallery-close" type="button" aria-label="Galeriyi kapat" onClick={close}><X /></button>
      {images.length > 1 && <button className="gallery-arrow gallery-previous" type="button" aria-label="Önceki fotoğraf" onClick={(event) => { event.stopPropagation(); previous(); }}><ChevronLeft /></button>}
      <div className="gallery-lightbox-image" role="img" aria-label={`${title} fotoğraf ${activeIndex + 1}`} style={{ backgroundImage: `url(${images[activeIndex]})` }} onClick={(event) => event.stopPropagation()} />
      {images.length > 1 && <button className="gallery-arrow gallery-next" type="button" aria-label="Sonraki fotoğraf" onClick={(event) => { event.stopPropagation(); next(); }}><ChevronRight /></button>}
      <span className="gallery-counter">{activeIndex + 1} / {images.length}</span>
    </div>}
  </>;
}
