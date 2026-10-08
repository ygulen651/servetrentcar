import type { Metadata } from "next";
import { Footer, Header, WhatsApp } from "../components";
import { getFirebaseRentalCars } from "@/lib/firebase-data";
import { getSiteContent } from "@/lib/site-content";
import { RentalCatalog } from "./rental-catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kiralık Araçlar", description: "Karaman'da güncel kiralık araç seçeneklerini inceleyin.", alternates: { canonical: "/arac-kiralama" } };

export default async function CarRentalPage() {
  const [cars, content] = await Promise.all([getFirebaseRentalCars(), getSiteContent()]);
  return <div className="rental-page v10-rental-page"><Header content={content}/><main><RentalCatalog items={cars}/></main><Footer content={content}/><WhatsApp/></div>;
}
