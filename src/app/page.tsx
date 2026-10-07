import Link from "next/link";
import { ArrowRight, Building2, CarFront, CheckCircle2, HardHat, MapPin, Phone } from "lucide-react";
import { Footer, Header, WhatsApp } from "./components";
import { HomeSearch } from "./home-search";
import { projects } from "./data";
import { getFirebaseListings, getFirebaseSearchItems } from "@/lib/firebase-data";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [listings, searchItems, content] = await Promise.all([
    getFirebaseListings().then((items) => items.slice(0, 3)),
    getFirebaseSearchItems(),
    getSiteContent(),
  ]);
  return <div className="home-page"><Header content={content} /><main>
    <section className="hero" style={{ backgroundImage: `url(${content.homeHeroImageUrl})` }}>
      <div className="hero-overlay" />
      <div className="hero-content shell">
        <p className="eyebrow fade-in-up">{content.homeHeroEyebrow}</p>
        <h1 className="fade-in-up editable-lines">{content.homeHeroTitle}</h1>
        <p className="hero-copy fade-in-up delay-2">{content.homeHeroText}</p>
        <div className="hero-actions fade-in-up delay-3">
          <Link className="button gold fade-in-up" href="/ilanlar">{content.homeListingsButton} <ArrowRight size={18}/></Link>
          <a className="button ghost fade-in-up" href="tel:+905354266235"><Phone size={18}/> {content.homeCallButton}</a>
        </div>
      </div>
      <HomeSearch items={searchItems} />
    </section>

    <section className="intro-strip"><div className="shell"><p>Aradığınız hizmete hızlıca ulaşın</p><nav aria-label="Hizmet bağlantıları"><Link href="/ilanlar"><Building2/> Emlak ilanları <ArrowRight/></Link><Link href="#projeler"><HardHat/> İnşaat projeleri <ArrowRight/></Link><Link href="/arac-kiralama"><CarFront/> Kiralık araçlar <ArrowRight/></Link></nav></div></section>

    <section className="services-wrap"><div className="services shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">{content.servicesEyebrow}</p>
          <h2 className="editable-lines">{content.servicesTitle}</h2>
        </div>
        <p>{content.servicesText}</p>
      </div>
      <div className="service-grid">
        <article className="service-item fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Building2 className="service-icon" />
          <span>01</span>
          <h3>{content.realEstateTitle}</h3>
          <p>{content.realEstateText}</p>
          <Link href="/ilanlar">İlanları gör <ArrowRight size={16}/></Link>
        </article>
        <article className="service-item fade-in-up" style={{ animationDelay: '0.2s' }}>
          <HardHat className="service-icon" />
          <span>02</span>
          <h3>{content.constructionTitle}</h3>
          <p>{content.constructionText}</p>
          <Link href="#projeler">Projeleri gör <ArrowRight size={16}/></Link>
        </article>
        <article className="service-item fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CarFront className="service-icon" />
          <span>03</span>
          <h3>{content.rentalServiceTitle}</h3>
          <p>{content.rentalServiceText}</p>
          <Link href="/arac-kiralama">Araçları gör <ArrowRight size={16}/></Link>
        </article>
      </div>
    </div></section>

    <section className="listings-section">
      <div className="shell">
        <div className="section-title-row">
          <div>
            <p className="eyebrow dark">GÜNCEL PORTFÖY</p>
            <h2>Öne çıkan ilanlar</h2>
          </div>
          <Link href="/ilanlar">Tüm ilanlar <ArrowRight size={18}/></Link>
        </div>
        <div className="listing-grid">
          {listings.map((item) => <Link href={`/ilanlar/${item.id}`} className="listing-card fade-in" style={{ animationDelay: `${item.id.length * 0.1}s` }} key={item.id}>
            <div className="listing-image" role="img" aria-label={`${item.title} ilan fotoğrafı`} style={{ backgroundImage: `url(${item.image})` }}>
              <span>{item.badge}</span>
              <small>{item.id}</small>
            </div>
            <div className="listing-body">
              <p className="listing-type">{item.type}</p>
              <h3>{item.title}</h3>
              <p className="location"><MapPin size={15}/>{item.location}</p>
              <div className="meta">{item.meta.map(x => <span key={x}>{x}</span>)}</div>
              <div className="price">{item.price}<ArrowRight size={20}/></div>
            </div>
          </Link>)}
        </div>
      </div>
    </section>

    <section id="projeler" className="projects shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">SERVET İNŞAAT</p>
          <h2 className="editable-lines">{content.projectsTitle}</h2>
        </div>
        <p>{content.projectsText}</p>
      </div>
      <div className="project-grid">
        {projects.map((p, i) => <article key={p.title} className="project-item fade-in-up" role="img" aria-label={`${p.title} proje görseli`} style={{ animationDelay: `${i * 0.2}s`, backgroundImage: `url(${p.image})` }}>
          <div>
            <span>{i + 1}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </div>
        </article>)}
      </div>
    </section>

    <section id="hakkimizda" className="about">
      <div className="shell about-grid">
        <div className="about-image fade-in-up">
          <div className="experience">
            <strong>3</strong>
            <span>Hizmet<br/>Tek Adres</span>
          </div>
        </div>
        <div>
          <p className="eyebrow">BİZİ TANIYIN</p>
          <h2>{content.aboutTitle}</h2>
          <p>{content.aboutText}</p>
          <ul>
            <li><CheckCircle2/>Yerel pazar deneyimi</li>
            <li><CheckCircle2/>Şeffaf ve güvenilir hizmet</li>
            <li><CheckCircle2/>Satış sonrası destek</li></ul>
          <a className="button gold" href="tel:+905354266235">Servet Saltan ile görüşün</a>
        </div>
      </div>
    </section>

    <section className="faq-section shell" id="sss">
      <div className="section-heading"><div><p className="eyebrow dark">SIK SORULAN SORULAR</p><h2>Merak ettikleriniz</h2></div><p>İlanlar, kiralama ve hizmet süreci hakkında kısa yanıtlar.</p></div>
      <div className="faq-list">
        <details><summary>Araçların müsaitlik bilgisi güncel mi?</summary><p>Panelde gösterilen durum güncel filoyu yansıtır. Kesin rezervasyon için bizi aramanızı öneririz.</p></details>
        <details><summary>Emlak ilanları hakkında nasıl bilgi alabilirim?</summary><p>İlan detayındaki telefon veya WhatsApp butonunu kullanarak ilan koduyla doğrudan bilgi alabilirsiniz.</p></details>
        <details><summary>Araç kiralamak için hangi bilgiler gerekiyor?</summary><p>Ehliyet, kimlik ve kiralama koşullarına uygunluk gerekir. Güncel şartlar için bizimle iletişime geçebilirsiniz.</p></details>
        <details><summary>İnşaat projeleri için keşif yapıyor musunuz?</summary><p>Evet. İhtiyacı değerlendirmek ve görüşme planlamak için telefonla bize ulaşabilirsiniz.</p></details>
      </div>
    </section>

    <section className="contact-band">
      <div className="shell">
        <div>
          <p>Size uygun çözümü birlikte bulalım</p>
          <h2>{content.contactTitle}</h2>
        </div>
        <a className="button light" href="https://wa.me/905354266235">WhatsApp&apos;tan Yazın <ArrowRight size={18}/></a>
      </div>
    </section>
  </main><Footer content={content} /><WhatsApp /></div>;
}
