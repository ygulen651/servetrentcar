import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Servet İnşaat Emlak Rent A Car | Karaman",
  description: "Karaman emlak, inşaat ve araç kiralama hizmetleri. Servet Saltan: 0535 426 62 35",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
