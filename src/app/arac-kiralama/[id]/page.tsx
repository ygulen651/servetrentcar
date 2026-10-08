import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Footer, Header, WhatsApp } from "../../components";
import { getFirebaseItem } from "@/lib/firebase-data";
import { DetailGallery } from "../../detail-gallery";
import { getSiteContent } from "@/lib/site-content";
import { ClassicDetailSidebar } from "../../classic-detail-sidebar";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: PageProps<"/arac-kiralama/[id]">): Promise<Metadata> { const { id } = await params; const item = await getFirebaseItem(id); return { title: item?.title ?? "Araç bulunamadı" }; }

export default async function VehicleDetailPage({ params }: PageProps<"/arac-kiralama/[id]">) {
  const { id } = await params; const item = await getFirebaseItem(id); if (!item || item.category !== "Araç") notFound();
  const content = await getSiteContent(); const available = item.status !== "rented"; const message = encodeURIComponent(`Merhaba, ${item.title} aracı için müsaitlik ve fiyat bilgisi almak istiyorum.`);
  const rows = [["Fiyat", `${item.price.toLocaleString("tr-TR")} TL`], ["Araç No", item.id], ["Model Yılı", item.locationOrYear], ["Araç Tipi", "Kiralık Araç"], ["Müsaitlik", available ? "Şu an boşta" : "Şu an kirada"], ["Kiralama", "Günlük / Haftalık / Aylık"]];
  return <div className="v10-detail-page v10-vehicle-detail"><Header content={content}/><main><div className="shell v10-detail-shell"><ClassicDetailSidebar vehicle/><section className="v10-detail-content"><h1>{item.title} / Kiralık Araç</h1><div className="v10-detail-columns"><div><DetailGallery images={item.imageUrls ?? []} title={item.title}/><article className="v10-classic-description"><h2>Açıklama</h2><p>{item.description || "Araç özellikleri ve kiralama şartları hakkında ayrıntılı bilgi için bizimle iletişime geçebilirsiniz."}</p></article></div><aside className="v10-detail-facts"><dl>{rows.map(([label,value]) => <div key={label}><dt>{label}:</dt><dd className={label === "Fiyat" ? "v10-fact-price" : ""}>{value}</dd></div>)}</dl><section className="v10-advisor"><h2>Rent A Car</h2><strong>Servet Saltan</strong><p><MapPin/>Karaman Merkez</p><a href="tel:+905051977070"><Phone/>0505 197 70 70</a><a href={`https://wa.me/905354266235?text=${message}`} target="_blank" rel="noreferrer"><MessageCircle/>WhatsApp</a></section></aside></div></section></div></main><Footer content={content}/><WhatsApp/></div>;
}
