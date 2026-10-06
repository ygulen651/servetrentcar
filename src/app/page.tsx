import Link from "next/link";
import { ArrowRight, Building2, CarFront, CheckCircle2, HardHat, MapPin, Phone } from "lucide-react";
import { Footer, Header, WhatsApp } from "./components";
import { projects, turkeyCities } from "./data";
import { getFirebaseListings } from "@/lib/firebase-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const listings = (await getFirebaseListings()).slice(0, 3);
  return <div className="home-page"><Header /><main>
    <section className="hero">
      <div className="hero-overlay" />
      <div className="hero-content shell">
        <p className="eyebrow fade-in-up">KARAMAN&apos;DA YEREL VE GÜVENİLİR HİZMET</p>
        <h1 className="fade-in-up">Servet İnşaat<br />Emlak & Rent A Car</h1>
        <p className="hero-copy fade-in-up delay-2">Gayrimenkul, inşaat ve araç kiralama ihtiyaçlarınız için doğrudan, şeffaf ve hızlı çözümler.</p>
        <div className="hero-actions fade-in-up delay-3">
          <Link className="button gold fade-in-up" href="/ilanlar">İlanları İncele <ArrowRight size={18}/></Link>
          <a className="button ghost fade-in-up" href="tel:+905354266235"><Phone size={18}/> Hemen Ara</a>
        </div>
      </div>
      <div className="search-panel shell">
        <div>
          <label>Hizmet</label>
          <select>
            <option>Emlak</option>
            <option>Araç Kiralama</option>
          </select>
        </div>
        <div>
          <label>İşlem Türü</label>
          <select>
            <option>Tümü</option>
            <option>Satılık</option>
            <option>Kiralık</option>
          </select>
        </div>
        <div>
          <label>Konum</label>
          <select defaultValue="Karaman">
            <option value="">Tüm Türkiye</option>
            {turkeyCities.map(city => <option key={city}>{city}</option>)}
          </select>
        </div>
        <Link href="/ilanlar" className="search-button">İlan Ara <ArrowRight size={18}/></Link>
      </div>
    </section>

    <section className="intro-strip"><div className="shell"><p>Aradığınız hizmete hızlıca ulaşın</p><nav aria-label="Hizmet bağlantıları"><Link href="/ilanlar"><Building2/> Emlak ilanları <ArrowRight/></Link><Link href="#projeler"><HardHat/> İnşaat projeleri <ArrowRight/></Link><Link href="/arac-kiralama"><CarFront/> Kiralık araçlar <ArrowRight/></Link></nav></div></section>

    <section className="services-wrap"><div className="services shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">HİZMETLERİMİZ</p>
          <h2>Tek çatı altında<br />üç güçlü hizmet</h2>
        </div>
        <p>İhtiyacınız ne olursa olsun, deneyim ve güvenle yanınızdayız.</p>
      </div>
      <div className="service-grid">
        <article className="service-item fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Building2 className="service-icon" />
          <span>01</span>
          <h3>Emlak Danışmanlığı</h3>
          <p>Satılık ve kiralık konut, arsa ve iş yeri seçenekleri.</p>
          <Link href="/ilanlar">İlanları gör <ArrowRight size={16}/></Link>
        </article>
        <article className="service-item fade-in-up" style={{ animationDelay: '0.2s' }}>
          <HardHat className="service-icon" />
          <span>02</span>
          <h3>İnşaat Projeleri</h3>
          <p>Planlamadan anahtar teslimine güvenilir yapı çözümleri.</p>
          <Link href="#projeler">Projeleri gör <ArrowRight size={16}/></Link>
        </article>
        <article className="service-item fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CarFront className="service-icon" />
          <span>03</span>
          <h3>Rent A Car</h3>
          <p>Bakımlı, konforlu ve ihtiyacınıza uygun kiralık araçlar.</p>
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
            <div className="listing-image" style={{ backgroundImage: `url(${item.image})` }}>
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
          <h2>Sağlam temeller,<br />değerli yaşamlar</h2>
        </div>
        <p>Kaliteli malzeme, titiz işçilik ve zamanında teslim prensibiyle çalışıyoruz.</p>
      </div>
      <div className="project-grid">
        {projects.map((p, i) => <article key={p.title} className="project-item fade-in-up" style={{ animationDelay: `${i * 0.2}s`, backgroundImage: `url(${p.image})` }}>
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
          <h2>Karaman&apos;da işinize değer katan güvenilir çözüm ortağı</h2>
          <p>Servet İnşaat Emlak Rent A Car olarak gayrimenkul, yapı ve araç kiralama ihtiyaçlarınızda dürüst, hızlı ve çözüm odaklı hizmet sunuyoruz.</p>
          <ul>
            <li><CheckCircle2/>Yerel pazar deneyimi</li>
            <li><CheckCircle2/>Şeffaf ve güvenilir hizmet</li>
            <li><CheckCircle2/>Satış sonrası destek</li></ul>
          <a className="button gold" href="tel:+905354266235">Servet Saltan ile görüşün</a>
        </div>
      </div>
    </section>

    <section className="contact-band">
      <div className="shell">
        <div>
          <p>Size uygun çözümü birlikte bulalım</p>
          <h2>Eviniz, projeniz veya aracınız için hemen iletişime geçin.</h2>
        </div>
        <a className="button light" href="https://wa.me/905354266235">WhatsApp&apos;tan Yazın <ArrowRight size={18}/></a>
      </div>
    </section>
  </main><Footer /><WhatsApp /></div>;
}
