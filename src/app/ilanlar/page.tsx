import type { Metadata } from "next";
import { Footer, Header, WhatsApp } from "../components";
import { getFirebaseListings } from "@/lib/firebase-data";
import { ListingCatalog } from "./listing-catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Güncel Emlak İlanları", description: "Karaman satılık ve kiralık emlak ilanlarını inceleyin.", alternates: { canonical: "/ilanlar" } };

export default async function ListingsPage() {
  const listings = await getFirebaseListings();
  return <><Header/><main><section className="page-hero"><div className="shell"><p className="eyebrow">SERVET PORTFÖY</p><h1>Güncel İlanlar</h1><p>Satılık ve kiralık emlak seçeneklerimizi inceleyin.</p></div></section><ListingCatalog items={listings}/></main><Footer/><WhatsApp/></>;
}
