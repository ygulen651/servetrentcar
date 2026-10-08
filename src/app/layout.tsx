import type { Metadata } from "next";
import "./globals.css";
import { CookieConsent } from "./cookie-consent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://servetrentcar.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Servet Emlak | Karaman Satılık ve Kiralık İlanlar", template: "%s | Servet Emlak" },
  description: "Karaman satılık ve kiralık emlak ilanları. Servet Emlak: 0535 426 62 35",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "tr_TR", siteName: "Servet İnşaat Emlak Rent A Car", title: "Servet İnşaat Emlak Rent A Car | Karaman", description: "Karaman'da emlak, inşaat ve araç kiralama hizmetleri.", url: siteUrl },
  twitter: { card: "summary_large_image", title: "Servet İnşaat Emlak Rent A Car", description: "Karaman'da emlak, inşaat ve araç kiralama hizmetleri." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}<CookieConsent /></body>
    </html>
  );
}
