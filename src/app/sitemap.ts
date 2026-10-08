import type { MetadataRoute } from "next";
import { getFirebaseSearchItems } from "@/lib/firebase-data";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://servetrentcar.vercel.app";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const items = await getFirebaseSearchItems(); const now = new Date(); return ["", "/ilanlar", "/satilik", "/kiralik", "/arac-kiralama", "/gizlilik", "/kullanim-sartlari"].map((path) => ({ url: `${siteUrl}${path}`, lastModified: now, changeFrequency: path ? "weekly" as const : "daily" as const, priority: path ? .8 : 1 })).concat(items.map((item) => ({ url: `${siteUrl}${item.href}`, lastModified: now, changeFrequency: "weekly" as const, priority: .7 }))); }
