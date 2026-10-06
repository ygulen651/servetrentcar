"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, CarFront, Menu, MessageCircle, Phone, X } from "lucide-react";

export function Header() {
  const [open, setOpen] = useState(false);
  return <>
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Servet ana sayfa">
        <span className="brand-mark">S</span>
        <span>
          <strong>SERVET</strong>
          <small>İNŞAAT · EMLAK · RENT A CAR</small>
        </span>
      </Link>
      <nav className={open ? "nav open" : "nav"} aria-label="Site navigasyonu">
        <Link href="/">Ana Sayfa</Link>
        <Link href="/ilanlar">Emlak</Link>
        <Link href="/arac-kiralama">Rent A Car</Link>
        <Link href="/#projeler">İnşaat</Link>
        <Link href="/#hakkimizda">Hakkımızda</Link>
        <Link href="/#iletisim">İletişim</Link>
      </nav>
      <a className="header-phone" href="tel:+905354266235" aria-label="Telefon: 0535 426 62 35">
        <Phone size={17} /> 0535 426 62 35
      </a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Menü aç">
        {open ? <X /> : <Menu />}
      </button>
    </header>
    <div className="topline">
      <span>Karaman&apos;da güvenilir çözüm ortağınız</span>
      <span>
        <Building2 size={14} /> Emlak
        <CarFront size={14} /> Araç Kiralama
      </span>
    </div>
  </>;
}

export function Footer() {
  return (
    <footer id="iletisim">
      <div className="footer-grid shell">
        <div>
          <div className="footer-brand">SERVET</div>
          <p>İnşaat, emlak ve araç kiralamada güvenilir hizmet.</p>
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
          <p>Rauf Denktaş Mah. 2. İstasyon Cad. No: 39/A, Karaman</p>
          <a href="tel:+905354266235">0535 426 62 35</a>
        </div>
      </div>
      <div className="copyright">
        <div className="shell copyright-inner">
          <span>© 2026 Servet İnşaat Emlak Rent A Car. Tüm hakları saklıdır.</span>
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
