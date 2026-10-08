"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Building2, House, LandPlot, MapPin, Store } from "lucide-react";
import { turkeyCities } from "../data";

type Listing = { id: string; type: string; propertyType: string; badge: string; title: string; location: string; price: string; meta: string[]; image: string };

export function ListingCatalog({ items }: { items: Listing[] }) {
  const [propertyType, setPropertyType] = useState(""); const [status, setStatus] = useState(""); const [city, setCity] = useState(""); const [sort, setSort] = useState("new");
  const visible = useMemo(() => {
    const filtered = items.filter((item) => (!propertyType || item.propertyType === propertyType) && (!status || item.badge === status) && (!city || item.location.includes(city)));
    if (sort === "asc" || sort === "desc") filtered.sort((a,b) => (Number(a.price.replace(/\D/g,"")) - Number(b.price.replace(/\D/g,""))) * (sort === "asc" ? 1 : -1));
    return filtered;
  }, [items, propertyType, status, city, sort]);
  const chooseType = (value: string) => setPropertyType(value);
  return <section className="catalog shell">
    <nav className="catalog-categories" aria-label="Emlak türleri">
      <button className={!propertyType ? "active" : ""} type="button" onClick={()=>chooseType("")}><Building2/><span>Tümü</span></button>
      <button className={propertyType === "Konut" ? "active" : ""} type="button" onClick={()=>chooseType("Konut")}><House/><span>Konut</span></button>
      <button className={propertyType === "Arsa" ? "active" : ""} type="button" onClick={()=>chooseType("Arsa")}><LandPlot/><span>Arsa</span></button>
      <button className={propertyType === "İş Yeri" ? "active" : ""} type="button" onClick={()=>chooseType("İş Yeri")}><Store/><span>İşyeri</span></button>
    </nav>
    <div className="catalog-toolbar"><strong>{visible.length} ilan bulundu</strong><div><label>İşlem<select value={status} onChange={(e)=>setStatus(e.target.value)}><option value="">Tümü</option><option>Satılık</option><option>Kiralık</option></select></label><label>Konum<select value={city} onChange={(e)=>setCity(e.target.value)}><option value="">Tüm Türkiye</option>{turkeyCities.map((value)=><option key={value}>{value}</option>)}</select></label><label>Sıralama<select value={sort} onChange={(e)=>setSort(e.target.value)}><option value="new">En yeni</option><option value="asc">Fiyat: Artan</option><option value="desc">Fiyat: Azalan</option></select></label></div></div>
    <div className="listing-grid catalog-grid">{visible.map((item)=><Link className="listing-card" href={`/ilanlar/${item.id}`} key={item.id}><div className="listing-image" role="img" aria-label={`${item.title} ilan fotoğrafı`} style={{backgroundImage:`url(${item.image})`}}><span>{item.badge}</span><b>{item.price}</b></div><div className="listing-body"><p className="listing-type">{item.type}</p><h3>{item.title}</h3><p className="location"><MapPin size={15}/>{item.location}</p><div className="meta">{item.meta.map(x=><span key={x}>{x}</span>)}</div><div className="price">İlanı incele<ArrowRight size={20}/></div></div></Link>)}{visible.length===0&&<p className="catalog-empty">Bu filtrelere uygun ilan bulunamadı.</p>}</div>
  </section>;
}
