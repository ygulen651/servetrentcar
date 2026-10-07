import type { Metadata } from "next";
import { Footer, Header, WhatsApp } from "../components";
import { getFirebaseListings } from "@/lib/firebase-data";
import { getSiteContent } from "@/lib/site-content";
import { ListingCatalog } from "./listing-catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Güncel Emlak İlanları", description: "Karaman satılık ve kiralık emlak ilanlarını inceleyin.", alternates: { canonical: "/ilanlar" } };

export default async function ListingsPage() {
  const [listings, content] = await Promise.all([getFirebaseListings(), getSiteContent()]);
  return <><Header content={content}/><main><section className="page-hero"><div className="shell"><p className="eyebrow">{content.listingHeroEyebrow}</p><h1>{content.listingHeroTitle}</h1><p>{content.listingHeroText}</p></div></section><ListingCatalog items={listings}/></main><Footer content={content}/><WhatsApp/></>;
}
