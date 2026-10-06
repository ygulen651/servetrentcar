import Link from "next/link";
import { ArrowRight, MapPin, SlidersHorizontal } from "lucide-react";
import { Footer, Header, WhatsApp } from "../components";
import { turkeyCities } from "../data";
import { getFirebaseListings } from "@/lib/firebase-data";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const allListings = await getFirebaseListings();
  return <><Header/><main><section className="page-hero"><div className="shell"><p className="eyebrow">SERVET PORTFÖY</p><h1>Güncel İlanlar</h1><p>Satılık, kiralık ve günlük kiralık seçeneklerimizi inceleyin.</p></div></section><section className="catalog shell"><aside><h3><SlidersHorizontal size={18}/> İlanları Filtrele</h3><label>Hizmet Türü<select><option>Tümü</option><option>Emlak</option><option>Araç Kiralama</option></select></label><label>İşlem Türü<select><option>Tümü</option><option>Satılık</option><option>Kiralık</option><option>Günlük Kiralık</option></select></label><label>Konum<select defaultValue="Karaman"><option value="">Tüm Türkiye</option>{turkeyCities.map(city => <option key={city}>{city}</option>)}</select></label><button>Filtrele</button></aside><div className="catalog-main"><div className="catalog-head"><strong>{allListings.length} ilan bulundu</strong><select><option>En yeni ilanlar</option><option>Fiyat: Artan</option><option>Fiyat: Azalan</option></select></div><div className="listing-grid catalog-grid">{allListings.map(item=><Link className="listing-card" href={`/ilanlar/${item.id}`} key={item.id}><div className="listing-image" style={{backgroundImage:`url(${item.image})`}}><span>{item.badge}</span><small>{item.id}</small></div><div className="listing-body"><p className="listing-type">{item.type}</p><h3>{item.title}</h3><p className="location"><MapPin size={15}/>{item.location}</p><div className="meta">{item.meta.map(x=><span key={x}>{x}</span>)}</div><div className="price">{item.price}<ArrowRight size={20}/></div></div></Link>)}</div></div></section></main><Footer/><WhatsApp/></>;
}
