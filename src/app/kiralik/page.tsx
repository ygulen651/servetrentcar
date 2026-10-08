import type { Metadata } from "next";
import { Footer, Header, WhatsApp } from "../components";
import { ListingCatalog } from "../ilanlar/listing-catalog";
import { getFirebaseListings } from "@/lib/firebase-data";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Kiralık Emlak İlanları",
  description: "Karaman'daki güncel kiralık emlak ilanlarını inceleyin.",
  alternates: { canonical: "/kiralik" },
};

export default async function RentalListingsPage() {
  const [listings, content] = await Promise.all([getFirebaseListings(), getSiteContent()]);
  const liveRentals = listings.filter((item) => item.badge.toLocaleLowerCase("tr-TR").includes("kiralık"));
  return <div className="listings-page v10-listings-page"><Header content={content}/><main><ListingCatalog items={liveRentals} fixedStatus="Kiralık"/></main><Footer content={content}/><WhatsApp/></div>;
}
