import type { Metadata } from "next";
import { Footer, Header, WhatsApp } from "../components";
import { ListingCatalog } from "../ilanlar/listing-catalog";
import { getFirebaseListings } from "@/lib/firebase-data";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Satılık Emlak İlanları",
  description: "Karaman'daki güncel satılık emlak ilanlarını inceleyin.",
  alternates: { canonical: "/satilik" },
};

export default async function SaleListingsPage() {
  const [listings, content] = await Promise.all([getFirebaseListings(), getSiteContent()]);
  return <div className="listings-page v10-listings-page"><Header content={content}/><main><ListingCatalog items={listings} fixedStatus="Satılık"/></main><Footer content={content}/><WhatsApp/></div>;
}
