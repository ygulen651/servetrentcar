"use client";

import Link from "next/link";
import { CarFront, Search } from "lucide-react";
import { useMemo, useState } from "react";

type Car = { id: string; name: string; model: string; year: string; seats: string; status: "available" | "rented"; image: string; availableFrom?: string };

export function RentalCatalog({ items }: { items: Car[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [year, setYear] = useState("");
  const [transmission, setTransmission] = useState("");
  const years = [...new Set(items.map((item) => item.year).filter(Boolean))].sort().reverse();
  const transmissions = [...new Set(items.map((item) => item.model.split("·")[0]?.trim()).filter(Boolean))];
  const visible = useMemo(() => items.filter((car) => {
    const text = `${car.id} ${car.name} ${car.model}`.toLocaleLowerCase("tr-TR");
    return (!query || text.includes(query.toLocaleLowerCase("tr-TR")))
      && (!status || car.status === status)
      && (!year || car.year === year)
      && (!transmission || car.model.includes(transmission));
  }), [items, query, status, year, transmission]);

  return <section className="v10-catalog-shell shell v10-car-catalog">
    <aside className="v10-filter">
      <h2>Araç Arama Kriterleri</h2>
      <div className="v10-filter-body">
        <label>Araç Kodu<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Araç kodu veya model"/></label>
        <label>Müsaitlik<select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Tümü</option><option value="available">Şu an boşta</option><option value="rented">Şu an kirada</option></select></label>
        <label>Model Yılı<select value={year} onChange={(e) => setYear(e.target.value)}><option value="">Seçiniz</option>{years.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Vites Türü<select value={transmission} onChange={(e) => setTransmission(e.target.value)}><option value="">Seçiniz</option>{transmissions.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Kiralama Süresi<select defaultValue=""><option value="">Seçiniz</option><option>Günlük</option><option>Haftalık</option><option>Aylık</option></select></label>
        <div className="v10-filter-action"><CarFront/><button type="button">ARAMA</button></div>
        <p>İhtiyacınıza uygun aracı seçebilir, günlük, haftalık veya aylık kiralama için bize ulaşabilirsiniz.</p>
      </div>
    </aside>
    <div className="v10-results">
      <h1>Tüm Kiralık Araçlarımız</h1>
      <div className="v10-results-grid">
        {visible.map((car) => <Link href={`/arac-kiralama/${car.id}`} className="v10-result-card v10-car-result" key={car.id}>
          <div className="v10-result-image" style={{backgroundImage:`url(${car.image})`}}><b>{car.status === "available" ? "ŞU AN BOŞTA" : "ŞU AN KİRADA"}</b></div>
          <div className="v10-result-caption"><strong>{car.name}</strong><span>{car.year} · {car.model}</span><small>{car.seats}</small></div>
        </Link>)}
        {!visible.length && <div className="v10-no-results"><Search/><strong>Araç bulunamadı</strong><span>Arama kriterlerinizi değiştirip tekrar deneyin.</span></div>}
      </div>
    </div>
  </section>;
}
