import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, CheckCircle2, MapPin, MessageCircle, Phone, Tag } from "lucide-react";
import { Footer, Header, WhatsApp } from "../../components";
import { getFirebaseItem } from "@/lib/firebase-data";
import { SocialShare } from "../../social-share";
import { DetailGallery } from "../../detail-gallery";
import { getSiteContent } from "@/lib/site-content";

const phoneNumber = "+905354266235";
const whatsappNumber = "905354266235";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/ilanlar/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = await getFirebaseItem(id);
  if (!item || item.category !== "Emlak") return { title: "İlan bulunamadı" };
  return { title: `${item.title} | Servet Emlak`, description: item.description || `${item.locationOrYear} konumundaki ${item.status.toLocaleLowerCase("tr-TR")} emlak ilanı.`, alternates: { canonical: `/ilanlar/${id}` }, openGraph: { title: item.title, description: item.description || `${item.locationOrYear} emlak ilanı`, images: item.imageUrls?.[0] ? [item.imageUrls[0]] : [] } };
}

export default async function ListingDetailPage({ params }: PageProps<"/ilanlar/[id]">) {
  const { id } = await params;
  const item = await getFirebaseItem(id);
  if (!item || item.category !== "Emlak") notFound();
  const content = await getSiteContent();
  const images = item.imageUrls ?? [];
  const message = encodeURIComponent(`Merhaba, ${item.id} kodlu “${item.title}” ilanı hakkında bilgi almak istiyorum.`);

  return <><Header content={content} /><main className="detail-page">
    <section className="detail-top shell"><Link href="/ilanlar"><ArrowLeft /> İlanlara dön</Link><div><span>İlan kodu: {item.id}</span><SocialShare title={item.title}/></div></section>
    <section className="detail-layout shell">
      <div className="detail-main">
        <DetailGallery images={images} title={item.title} />
        <article className="detail-description"><p className="eyebrow dark">İLAN AÇIKLAMASI</p><h2>İlan hakkında</h2><p>{item.description || "Bu ilanla ilgili ayrıntılı bilgi için bizimle iletişime geçebilirsiniz."}</p></article>
      </div>
      <aside className="detail-summary"><span className="detail-status">{item.status}</span><h1>{item.title}</h1><p className="detail-location"><MapPin />{item.locationOrYear}</p><strong className="detail-price">{item.price.toLocaleString("tr-TR")} TL</strong>
        <dl><div><dt><Tag /> İşlem türü</dt><dd>{item.status}</dd></div><div><dt><Building2 /> Emlak türü</dt><dd>{item.propertyType ?? "Konut"}</dd></div><div><dt><CheckCircle2 /> Durum</dt><dd>Yayında</dd></div></dl>
        <div className="detail-actions"><a className="button gold" href={`tel:${phoneNumber}`}><Phone /> Hemen ara</a><a className="button whatsapp-button" href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></div>
      </aside>
    </section>
  </main><Footer content={content} /><WhatsApp /></>;
}
