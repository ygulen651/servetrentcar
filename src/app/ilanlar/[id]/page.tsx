import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, CheckCircle2, MapPin, MessageCircle, Phone, Tag } from "lucide-react";
import { Footer, Header, WhatsApp } from "../../components";
import { getFirebaseItem } from "@/lib/firebase-data";
import { SocialShare } from "../../social-share";

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
  const images = item.imageUrls ?? [];
  const message = encodeURIComponent(`Merhaba, ${item.id} kodlu “${item.title}” ilanı hakkında bilgi almak istiyorum.`);

  return <><Header /><main className="detail-page">
    <section className="detail-top shell"><Link href="/ilanlar"><ArrowLeft /> İlanlara dön</Link><div><span>İlan kodu: {item.id}</span><SocialShare title={item.title}/></div></section>
    <section className="detail-layout shell">
      <div className="detail-main">
        <div className={`detail-gallery ${images.length < 2 ? "single" : ""}`}>
          <div className="detail-cover" role="img" aria-label={`${item.title} kapak fotoğrafı`} style={{ backgroundImage: `url(${images[0] ?? ""})` }}>{images.length === 0 && <Building2 />}</div>
          {images.slice(1, 3).map((image, index) => <div className="detail-thumb" role="img" aria-label={`${item.title} fotoğraf ${index + 2}`} style={{ backgroundImage: `url(${image})` }} key={image}>{index === 1 && images.length > 3 && <span>+{images.length - 3} fotoğraf</span>}</div>)}
        </div>
        <article className="detail-description"><p className="eyebrow dark">İLAN AÇIKLAMASI</p><h2>İlan hakkında</h2><p>{item.description || "Bu ilanla ilgili ayrıntılı bilgi için bizimle iletişime geçebilirsiniz."}</p></article>
      </div>
      <aside className="detail-summary"><span className="detail-status">{item.status}</span><h1>{item.title}</h1><p className="detail-location"><MapPin />{item.locationOrYear}</p><strong className="detail-price">{item.price.toLocaleString("tr-TR")} TL</strong>
        <dl><div><dt><Tag /> İlan türü</dt><dd>{item.status}</dd></div><div><dt><Building2 /> Kategori</dt><dd>Emlak</dd></div><div><dt><CheckCircle2 /> Durum</dt><dd>Yayında</dd></div></dl>
        <div className="detail-actions"><a className="button gold" href={`tel:${phoneNumber}`}><Phone /> Hemen ara</a><a className="button whatsapp-button" href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></div>
      </aside>
    </section>
  </main><Footer /><WhatsApp /></>;
}
