"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type Listing = { id: string; type: string; propertyType: string; badge: string; title: string; location: string; price: string; meta: string[]; image: string };

function amount(value: string) {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
}

export function ListingCatalog({ items, fixedStatus }: { items: Listing[]; fixedStatus?: "Satılık" | "Kiralık" }) {
  const [code, setCode] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [status, setStatus] = useState(fixedStatus ?? "");
  const [district, setDistrict] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [rooms, setRooms] = useState("");

  const propertyTypes = [...new Set(items.map((item) => item.propertyType).filter(Boolean))];
  const statuses = [...new Set(items.map((item) => item.badge).filter(Boolean))];
  const districts = [...new Set(items.map((item) => item.location).filter(Boolean))];

  const visible = useMemo(() => items.filter((item) => {
    const haystack = `${item.id} ${item.title}`.toLocaleLowerCase("tr-TR");
    const price = amount(item.price);
    const areaText = item.meta.find((entry) => entry.includes("m²")) ?? "";
    const area = amount(areaText);
    return (!code || haystack.includes(code.toLocaleLowerCase("tr-TR")))
      && (!propertyType || item.propertyType === propertyType)
      && (!status || item.badge === status)
      && (!district || item.location === district)
      && (!minPrice || price >= Number(minPrice))
      && (!maxPrice || price <= Number(maxPrice))
      && (!minArea || area >= Number(minArea))
      && (!maxArea || area <= Number(maxArea))
      && (!rooms || item.meta.some((entry) => entry === rooms));
  }), [items, code, propertyType, status, district, minPrice, maxPrice, minArea, maxArea, rooms]);

  const rentalOnly = status.toLocaleLowerCase("tr-TR").includes("kiralık");

  return <section className="v10-catalog-shell shell">
    <aside className="v10-filter">
      <h2>Arama Kriterleri</h2>
      <div className="v10-filter-body">
        <label>İlan Kodu<input value={code} onChange={(e) => setCode(e.target.value)} /></label>
        <label>Emlak Türü<select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}><option value="">Seçiniz</option>{propertyTypes.map((value) => <option key={value}>{value}</option>)}</select></label>
        {!fixedStatus && <label>İlan Durumu<select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Seçiniz</option>{statuses.map((value) => <option key={value}>{value}</option>)}</select></label>}
        <label>Semt Seçin<select value={district} onChange={(e) => setDistrict(e.target.value)}><option value="">İlçe Seçiniz</option>{districts.map((value) => <option key={value}>{value}</option>)}</select></label>
        <div className="v10-filter-pair"><label>Düşük Fiyat<input inputMode="numeric" value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))}/></label><label>Yüksek Fiyat<input inputMode="numeric" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}/></label></div>
        <div className="v10-filter-pair"><label>Metrekare Aralığı<input inputMode="numeric" value={minArea} onChange={(e) => setMinArea(e.target.value.replace(/\D/g, ""))}/></label><label><span aria-hidden="true">&nbsp;</span><input inputMode="numeric" value={maxArea} onChange={(e) => setMaxArea(e.target.value.replace(/\D/g, ""))}/></label></div>
        <label>Oda Sayısı<select value={rooms} onChange={(e) => setRooms(e.target.value)}><option value="">Seçiniz</option><option>1+1</option><option>2+1</option><option>3+1</option><option>4+1</option></select></label>
        <div className="v10-filter-action"><Search/><button type="button">ARAMA</button></div>
        <p>Tüm arama kriterlerinizi belirleyebilir, en hızlı şekilde hayalinizdeki konuta ulaşabilirsiniz.</p>
      </div>
    </aside>

    <div className="v10-results">
      <h1>{rentalOnly ? "Tüm Kiralık İlanlar" : status ? `Tüm ${status} İlanlar` : "Tüm Emlak İlanları"}</h1>
      <div className="v10-results-grid">
        {visible.map((item) => <Link href={`/ilanlar/${item.id}`} className="v10-result-card" key={item.id}>
          <div className="v10-result-image" style={{backgroundImage:`url(${item.image})`}}><b>{item.price}</b></div>
          <div className="v10-result-caption"><strong>{item.location}</strong><span>{item.badge} {item.propertyType}</span></div>
        </Link>)}
        {!visible.length && <div className="v10-no-results"><Search/><strong>İlan bulunamadı</strong><span>Arama kriterlerinizi değiştirip tekrar deneyin.</span></div>}
      </div>
    </div>
  </section>;
}
