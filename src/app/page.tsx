import Link from "next/link";
import { Open_Sans, Roboto_Condensed } from "next/font/google";
import { Home as HomeIcon, Mail, MapPin, Phone, Play } from "lucide-react";
import { Footer, Header, WhatsApp } from "./components";
import { HomeBanner, type BannerSlide } from "./home-banner";
import { ShowcaseMosaic } from "./showcase-mosaic";
import { CallMe } from "./call-me";
import "./home-v10.css";
import { getFirebaseListings } from "@/lib/firebase-data";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
type Listing = Omit<Awaited<ReturnType<typeof getFirebaseListings>>[number], "type"> & { type: string };

const openSans = Open_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-v10-sans" });
const condensed = Roboto_Condensed({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], variable: "--font-v10-cond" });

const photo = (id: string, width = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
const slides: BannerSlide[] = [
  { image: photo("1600596542815-ffad4c1539a9", 2000), label: "Karaman'ın güvenilir emlak ofisi", top: "Karaman'ın güvenilir", bottom: "Servet Emlak", delay: 6000, transition: "slices" },
  { image: photo("1600585154340-be6161a56a0c", 2000), label: "İlanlarımız en iyi şekilde sizlerle", top: <>İlanlarımız <strong>en iyi</strong> şekilde,</>, bottom: "Sizlerle.", delay: 4000, transition: "tiles" },
  { image: photo("1512917774080-9991f1c4c750", 2000), label: "Emlak ihtiyaçlarınızın anahtarı bizde", top: "Emlak ihtiyaçlarınızın", bottom: "anahtarı bizde...", delay: 4000, transition: "curtain" },
  { image: photo("1486406146926-c627a92ad1ab", 2000), label: "Siz isteyin biz bulalım", top: "Siz isteyin", bottom: "biz bulalım...", delay: 6000, transition: "fade", href: "/ilanlar" },
  { image: photo("1545324418-cc1a3fa10c00", 2000), label: "Servet Emlak'tan satılık daireler", top: "Servet Emlak'tan", bottom: "Satılık Daireler", delay: 4000, transition: "slide", href: "/ilanlar" },
];

const fallback = [
  { id: "ornek-1", type: "Müstakil", propertyType: "Konut", badge: "Kiralık", title: "Bahçelievler - Kiralık Müstakil Ev", location: "Bahçelievler", price: "18.500 TL", meta: ["4+1", "190 m²"], image: photo("1568605114967-8130f3a36994") },
  { id: "ornek-2", type: "Müstakil", propertyType: "Konut", badge: "Kiralık", title: "Sultandere - Kiralık Müstakil", location: "Sultandere", price: "22.000 TL", meta: ["3+1", "160 m²"], image: photo("1570129477492-45c003edd2be") },
  { id: "ornek-3", type: "Daire", propertyType: "Konut", badge: "Kiralık", title: "Hacıalibey - Kiralık Daire", location: "Hacıalibey", price: "14.000 TL", meta: ["2+1", "110 m²"], image: photo("1502672260266-1c1ef2d93688") },
  { id: "ornek-4", type: "Daire", propertyType: "Konut", badge: "Kiralık", title: "Fatih - Kiralık Daire", location: "Fatih", price: "12.500 TL", meta: ["2+1", "95 m²"], image: photo("1522708323590-d24dbb6b0267") },
  { id: "ornek-5", type: "Daire", propertyType: "Konut", badge: "Satılık", title: "Gökmeydan - Satılık Daire", location: "Gökmeydan", price: "3.850.000 TL", meta: ["3+1", "150 m²"], image: photo("1560448204-e02f11c3d0e2") },
  { id: "ornek-6", type: "Dükkan", propertyType: "İş Yeri", badge: "Satılık", title: "Organize Sanayi - Satılık Dükkan", location: "Organize Sanayi Bölgesi", price: "6.250.000 TL", meta: ["210 m²"], image: photo("1441986300917-64674bd600d8") },
  { id: "ornek-7", type: "Taş Ev", propertyType: "Konut", badge: "Satılık", title: "Osmangazi - Satılık Taş Ev", location: "Osmangazi", price: "2.950.000 TL", meta: ["4+1", "180 m²"], image: photo("1449844908441-8829872d2607") },
  { id: "ornek-8", type: "Daire", propertyType: "Konut", badge: "Satılık", title: "Akarbaşı - Satılık Daire", location: "Akarbaşı", price: "2.400.000 TL", meta: ["2+1", "105 m²"], image: photo("1493809842364-78817add7ffb") },
] satisfies Listing[];

const posts = [
  { title: "Evinizi rutubetten nasıl korursunuz?", category: "Aklınızda Bulunsun", image: photo("1484154218962-a197022b5858", 600), text: "Yaşam alanınızı nem ve rutubetten korumak için uygulanabilir öneriler." },
  { title: "Neden bir emlak danışmanıyla çalışmalısınız?", category: "Genel", image: photo("1564013799919-ab600027ffc6", 600), text: "Doğru bilgi ve yerel deneyim, yatırım kararınızın değerini belirler." },
  { title: "Kira mı, konut kredisi mi?", category: "Sektör Haberleri", image: photo("1580587771525-78b9dba3b914", 600), text: "Bütçenize uygun kararı verirken göz önünde bulundurmanız gerekenler." },
  { title: "Ev alacaklar için kontrol listesi", category: "Haberler", image: photo("1600607687939-ce8a6c25118c", 600), text: "Tapudan konuma, satın almadan önce kontrol edilmesi gereken temel noktalar." },
];

const kinds = ["Konut", "İş Yeri", "Arsa", "Müstakil", "Bina", "Yazlık", "Villa", "Residence"];
const districts = ["Merkez", "Ayrancı", "Başyayla", "Ermenek", "Kazımkarabekir", "Sarıveliler"];
const rooms = ["1+0", "1+1", "2+1", "2+2", "3+1", "4+1", "5+1"];
const href = (item: Listing) => item.id.startsWith("ornek-") ? "/ilanlar" : `/ilanlar/${item.id}`;

function SearchFields({ prefix }: { prefix: string }) {
  return <>
    <label htmlFor={`${prefix}-no`}>Emlak Kodu:</label><input id={`${prefix}-no`} name="q" />
    <label htmlFor={`${prefix}-kind`}>Emlak Türü:</label><select id={`${prefix}-kind`} name="type" defaultValue=""><option value="">Seçiniz</option>{kinds.map((kind) => <option key={kind}>{kind}</option>)}</select>
    <label htmlFor={`${prefix}-town`}>İlçe Seçin:</label><select id={`${prefix}-town`} name="district" defaultValue=""><option value="">Seçiniz</option>{districts.map((district) => <option key={district}>{district}</option>)}</select>
    <div className="v10x-pair"><span><label htmlFor={`${prefix}-min`}>En Düşük Fiyat:</label><input id={`${prefix}-min`} name="min" inputMode="numeric" /></span><span><label htmlFor={`${prefix}-max`}>En Yüksek Fiyat:</label><input id={`${prefix}-max`} name="max" inputMode="numeric" /></span></div>
    <div className="v10x-pair"><span><label htmlFor={`${prefix}-m2min`}>Metrekare Aralığı:</label><input id={`${prefix}-m2min`} name="m2min" inputMode="numeric" placeholder="En az" /></span><span><label htmlFor={`${prefix}-m2max`} className="v10x-ghost-label">Metrekare üst sınırı</label><input id={`${prefix}-m2max`} name="m2max" inputMode="numeric" placeholder="En çok" /></span></div>
    <label htmlFor={`${prefix}-room`}>Oda Sayısı:</label><select id={`${prefix}-room`} name="room" defaultValue=""><option value="">Seçiniz</option>{rooms.map((room) => <option key={room}>{room}</option>)}</select>
  </>;
}

function EstateRow({ title, accent, items }: { title: string; accent: string; items: Listing[] }) {
  return <>
    <h2 className="v10x-latest-title"><Play aria-hidden="true" /> <strong>{accent}</strong> {title}</h2>
    <div className="v10x-estates">
      {items.map((item) => <Link href={href(item)} className="v10x-estate" key={item.id}>
        <span className="v10x-estate-img"><span style={{ backgroundImage: `url(${item.image})` }} /></span>
        <span className="v10x-estate-detail"><span className="v10x-estate-price">{item.price}</span><strong>{item.title}</strong></span>
      </Link>)}
    </div>
  </>;
}

export default async function Home() {
  const [liveListings, content] = await Promise.all([getFirebaseListings(), getSiteContent()]);
  const homepageSlides = slides.map((slide, index) => ({ ...slide, image: [content.homeHeroImageUrl, content.homeHeroImageUrl2, content.homeHeroImageUrl3, content.homeHeroImageUrl4, content.homeHeroImageUrl5][index] }));
  const all = [...liveListings, ...fallback];
  const has = (item: Listing, word: string) => item.badge.toLocaleLowerCase("tr-TR").includes(word);
  const rentals = all.filter((item) => has(item, "kiralık")).slice(0, 4);
  const sales = all.filter((item) => has(item, "satılık")).slice(0, 4);
  const showcase = all.filter((item) => item.image).map((item) => ({ id: item.id, href: href(item), image: item.image, price: item.price, district: item.location.split(/[,-]/)[0].trim(), type: item.type }));

  return <div className={`v10-home v10x ${openSans.variable} ${condensed.variable}`}><Header content={content} /><main>
    <HomeBanner slides={homepageSlides}>
      <form className="v10x-search-box" action="/ilanlar">
        <SearchFields prefix="banner" />
        <div className="v10x-search-button"><button type="submit">ARAMA</button></div>
      </form>
    </HomeBanner>

    <section className="v10x-latest shell">
      <EstateRow accent="KİRALIK" title="İLANLAR" items={rentals} />
      <EstateRow accent="SATILIK" title="İLANLAR" items={sales} />
    </section>

    <section className="v10x-main shell">
      <aside className="v10x-side">
        <div className="v10x-box">
          <div className="v10x-box-header">Arama Kriterleri</div>
          <form className="v10x-box-body v10x-filter" action="/ilanlar">
            <SearchFields prefix="side" />
            <div className="v10x-mascot"><span aria-hidden="true"><HomeIcon /></span><button type="submit">ARAMA</button></div>
            <p>Tüm arama kriterlerinizi belirleyerek en hızlı şekilde hayalinizdeki konuta ulaşabilirsiniz.</p>
          </form>
        </div>
        <a className="v10x-estate-add" href="tel:+905354266235"><HomeIcon /><span><strong>Emlakınızı Bize Verin</strong><small>Satılık ya da kiralık, hızlıca yayına alalım</small></span></a>
        <CallMe />
      </aside>

      <div className="v10x-content">
        <ShowcaseMosaic items={showcase} />
        <div className="v10x-box v10x-posts" id="blog">
          <div className="v10x-box-header">Blog</div>
          <div className="v10x-box-body"><div className="v10x-post-grid">
            {posts.map((post) => <article className="v10x-post" key={post.title}>
              <span className="v10x-post-img"><span style={{ backgroundImage: `url(${post.image})` }} /></span>
              <h3>{post.title}</h3><p>{post.text}</p><small>{post.category}</small>
            </article>)}
          </div></div>
        </div>
        <div className="v10x-partners" id="hakkimizda">
          <div><HomeIcon /><strong>GENİŞ PORTFÖY</strong><span>Her bütçeye uygun seçenekler</span></div>
          <div><MapPin /><strong>YEREL UZMANLIK</strong><span>Karaman&apos;ı yakından tanıyoruz</span></div>
          <div><Phone /><strong>HIZLI İLETİŞİM</strong><span>Her zaman yanınızdayız</span></div>
          <div><Mail /><strong>GÜVENİLİR HİZMET</strong><span>Şeffaf ve çözüm odaklı</span></div>
        </div>
      </div>
    </section>
  </main><Footer content={content} /><WhatsApp /></div>;
}
