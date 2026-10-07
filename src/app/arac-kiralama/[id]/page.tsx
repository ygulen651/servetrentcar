import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarCheck2, CarFront, CheckCircle2, Clock3, MessageCircle, Phone } from "lucide-react";
import { Footer, Header, WhatsApp } from "../../components";
import { getFirebaseItem } from "@/lib/firebase-data";
import { SocialShare } from "../../social-share";
import { DetailGallery } from "../../detail-gallery";
import { getSiteContent } from "@/lib/site-content";

const phoneNumber = "+905354266235";
const vehiclePhoneNumber = "+905051977070";
const whatsappNumber = "905354266235";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/arac-kiralama/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = await getFirebaseItem(id);
  if (!item || item.category !== "Araç") return { title: "Araç bulunamadı" };
  return { title: `${item.title} | Servet Rent A Car`, description: item.description || `${item.locationOrYear} model kiralık araç.`, alternates: { canonical: `/arac-kiralama/${id}` }, openGraph: { title: item.title, description: item.description || `${item.locationOrYear} model kiralık araç`, images: item.imageUrls?.[0] ? [item.imageUrls[0]] : [] } };
}

export default async function VehicleDetailPage({ params }: PageProps<"/arac-kiralama/[id]">) {
  const { id } = await params;
  const item = await getFirebaseItem(id);
  if (!item || item.category !== "Araç") notFound();
  const content = await getSiteContent();
  const images = item.imageUrls ?? [];
  const available = item.status !== "rented";
  const message = encodeURIComponent(`Merhaba, ${item.title} aracı için müsaitlik ve fiyat bilgisi almak istiyorum.`);

  return <><Header content={content} /><main className="detail-page">
    <section className="detail-top shell"><Link href="/arac-kiralama"><ArrowLeft /> Araçlara dön</Link><div><SocialShare title={item.title}/></div></section>
    <section className="detail-layout shell">
      <div className="detail-main"><DetailGallery images={images} title={item.title} />
        <article className="detail-description"><p className="eyebrow dark">ARAÇ AÇIKLAMASI</p><h2>Konforlu yolculuk için hazır</h2><p>{item.description || "Araç özellikleri ve kiralama şartları hakkında ayrıntılı bilgi için bizimle iletişime geçebilirsiniz."}</p></article></div>
      <aside className="detail-summary"><span className={`detail-status ${available ? "available" : "rented"}`}>{available ? "ŞU AN BOŞTA" : "ŞU AN KİRADA"}</span><h1>{item.title}</h1><p className="detail-location"><CalendarCheck2 />{item.locationOrYear} model</p><strong className="detail-price">{item.price.toLocaleString("tr-TR")} TL</strong><small className="price-note">Güncel fiyat ve kiralama süresi için arayın.</small>
        <dl><div><dt><CalendarCheck2 /> Model yılı</dt><dd>{item.locationOrYear}</dd></div><div><dt><CarFront /> Kategori</dt><dd>Kiralık araç</dd></div><div><dt>{available ? <CheckCircle2 /> : <Clock3 />} Durum</dt><dd>{available ? "Müsait" : "Kirada"}</dd></div></dl>
        <div className="detail-actions vehicle-detail-actions"><a className="button gold" href={`tel:${phoneNumber}`}><Phone /> 0535 426 62 35</a><a className="button secondary-phone-button" href={`tel:${vehiclePhoneNumber}`}><Phone /> 0505 197 70 70</a><a className="button whatsapp-button" href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></div>
      </aside>
    </section>
  </main><Footer content={content} /><WhatsApp /></>;
}
