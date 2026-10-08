"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

export function Header({ content }: { content?: SiteContent }) {
  const [open, setOpen] = useState(false);
  return <>
    <div className="topline">
      <span>{content?.topLine ?? "Karaman'da güvenilir çözüm ortağınız"}</span>
      <span className="top-social"><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">i</a></span>
    </div>
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Servet Emlak ana sayfa">
        <span className="brand-mark">SE</span>
        <span>
          <strong>SERVET EMLAK</strong>
          <small>{content?.brandSubtitle ?? "EMLAK · RENT A CAR · İNŞAAT"}</small>
        </span>
      </Link>
      <nav className={open ? "nav open" : "nav"} aria-label="Site navigasyonu">
        <Link href="/">{content?.navHome ?? "Ana Sayfa"}</Link>
        <Link href="/#hakkimizda">Kurumsal</Link>
        <Link href="/ilanlar">Kiralıklar</Link>
        <Link href="/ilanlar">Satılıklar</Link>
        <Link href="/arac-kiralama">Rent A Car</Link>
        <Link href="/#blog">Blog</Link>
        <Link href="/#iletisim">{content?.navContact ?? "İletişim"}</Link>
      </nav>
      <div className="header-phones" aria-label="Telefon numaraları">
        <a className="header-phone" href="tel:+905354266235" aria-label="Telefon: 0535 426 62 35"><Phone size={18}/><span><small>BİZİ ARAYIN</small>0535 426 62 35</span></a>
      </div>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Menü aç">
        {open ? <X /> : <Menu />}
      </button>
    </header>
  </>;
}

export function Footer({ content }: { content?: SiteContent }) {
  return (
    <footer id="iletisim">
      <div className="footer-grid shell">
        <div>
          <div className="footer-brand">SERVET</div>
          <p>{content?.footerDescription ?? "İnşaat, emlak ve araç kiralamada güvenilir hizmet."}</p>
        </div>
        <div>
          <h3>Hızlı Bağlantılar</h3>
          <Link href="/ilanlar">Emlak İlanları</Link>
          <Link href="/arac-kiralama">Kiralık Araçlar</Link>
          <Link href="/#projeler">Projelerimiz</Link>
          <Link href="/gizlilik">Gizlilik Politikası</Link>
          <Link href="/kullanim-sartlari">Kullanım Şartları</Link>
        </div>
        <div>
          <h3>İletişim</h3>
          <p>{content?.footerAddress ?? "Rauf Denktaş Mah. 2. İstasyon Cad. No: 39/A, Karaman"}</p>
          <a href="tel:+905354266235" aria-label="Telefon: 0535 426 62 35">0535 426 62 35</a>
          <a href="tel:+905051977070" aria-label="Araç kiralama telefonu: 0505 197 70 70">0505 197 70 70</a>
        </div>
      </div>
      <div className="copyright">
        <div className="shell copyright-inner">
          <span>{content?.footerCopyright ?? "© 2026 Servet İnşaat Emlak Rent A Car. Tüm hakları saklıdır."}</span>
          <a href="https://www.entekdigital.com/" target="_blank" rel="noopener noreferrer">
            Entek Digital tarafından yapılmıştır
          </a>
        </div>
      </div>
    </footer>
  );
}

export function WhatsApp() {
  return (
    <a
      className="whatsapp"
      href="https://wa.me/905354266235"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp ile iletişime geç"
    >
      <MessageCircle size={18} /> <span>WhatsApp</span>
    </a>
  );
}
