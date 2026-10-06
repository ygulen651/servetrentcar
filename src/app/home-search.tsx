"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Building2, CarFront, MapPin, Search, X } from "lucide-react";

export type SearchItem = {
  id: string;
  category: "Emlak" | "Araç";
  propertyType: string;
  title: string;
  status: string;
  location: string;
  description: string;
  price: string;
  image: string;
  href: string;
};

function normalize(value: string) {
  return value.toLocaleLowerCase("tr-TR").replace(/\s+/g, " ").trim();
}

export function HomeSearch({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalize(query);
  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    return items.filter((item) => normalize(`${item.category} ${item.propertyType} ${item.category === "Araç" ? "araba otomobil rent a car kiralık" : "emlak ev daire arsa tarla iş yeri konut"} ${item.title} ${item.status} ${item.location} ${item.description}`).includes(normalizedQuery)).slice(0, 6);
  }, [items, normalizedQuery]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results[0]) window.location.assign(results[0].href);
  }

  return <form className="search-panel home-live-search shell" role="search" onSubmit={submit}>
    <div className="home-search-field">
      <label htmlFor="home-search">İlan veya araç ara</label>
      <span><Search aria-hidden="true" /><input id="home-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Örn. kiralık araç, satılık daire, Karaman..." autoComplete="off" /></span>
      {query && <button className="search-clear" type="button" onClick={() => setQuery("")} aria-label="Aramayı temizle"><X /></button>}
    </div>
    <button className="search-button" type="submit" disabled={!results.length}>Ara <ArrowRight /></button>
    {normalizedQuery && <div className="search-results" aria-live="polite">
      <div className="search-results-head"><strong>{results.length ? `${results.length} sonuç bulundu` : "Sonuç bulunamadı"}</strong><small>{results.length ? "Detayları görmek için seçin" : "Farklı bir kelime deneyin"}</small></div>
      {results.map((item) => <Link href={item.href} className="search-result" key={item.id}>
        <span className="search-result-image" role="img" aria-label={`${item.title} görseli`} style={{ backgroundImage: `url(${item.image})` }}>{!item.image && (item.category === "Araç" ? <CarFront /> : <Building2 />)}</span>
        <span className="search-result-copy"><small>{item.propertyType || item.category} · {item.status}</small><strong>{item.title}</strong><span><MapPin />{item.location}</span></span>
        <b>{item.price}</b><ArrowRight />
      </Link>)}
    </div>}
  </form>;
}
