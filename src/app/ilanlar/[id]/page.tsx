import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Footer, Header, WhatsApp } from "../../components";
import { getFirebaseItem } from "@/lib/firebase-data";
import { DetailGallery } from "../../detail-gallery";
import { getSiteContent } from "@/lib/site-content";
import { ClassicDetailSidebar } from "../../classic-detail-sidebar";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: PageProps<"/ilanlar/[id]">): Promise<Metadata> { const { id } = await params; const item = await getFirebaseItem(id); return { title: item?.title ?? "İlan bulunamadı" }; }

export default async function ListingDetailPage({ params }: PageProps<"/ilanlar/[id]">) {
  const { id } = await params; const item = await getFirebaseItem(id); if (!item || item.category !== "Emlak") notFound();
  const content = await getSiteContent(); const message = encodeURIComponent(`Merhaba, ${item.id} kodlu ${item.title} ilanı hakkında bilgi almak istiyorum.`);
  const rows = [["Fiyat", `${item.price.toLocaleString("tr-TR")} TL`], ["Emlak No", item.id], ["Konum", item.locationOrYear], ["Emlak Türü", item.propertyType ?? "Konut"], ["İlan Tipi", `${item.status} ${item.propertyType ?? "Konut"}`], ["Durum", "Yayında"]];
  return <div className="v10-detail-page"><Header content={content}/><main><div className="shell v10-detail-shell"><ClassicDetailSidebar/><section className="v10-detail-content"><h1>{item.title} / {item.locationOrYear}</h1><div className="v10-detail-columns"><div><DetailGallery images={item.imageUrls ?? []} title={item.title}/><article className="v10-classic-description"><h2>Açıklama</h2><p>{item.description || "Bu ilanla ilgili ayrıntılı bilgi için bizimle iletişime geçebilirsiniz."}</p></article></div><aside className="v10-detail-facts"><dl>{rows.map(([label,value]) => <div key={label}><dt>{label}:</dt><dd className={label === "Fiyat" ? "v10-fact-price" : ""}>{value}</dd></div>)}</dl><section className="v10-advisor"><h2>Danışmanımız</h2><strong>Servet Saltan</strong><p><MapPin/>Karaman Merkez</p><a href="tel:+905354266235"><Phone/>0535 426 62 35</a><a href={`https://wa.me/905354266235?text=${message}`} target="_blank" rel="noreferrer"><MessageCircle/>WhatsApp</a></section></aside></div></section></div></main><Footer content={content}/><WhatsApp/></div>;
}
