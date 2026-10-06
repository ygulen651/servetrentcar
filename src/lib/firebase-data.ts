import "server-only";

import { adminDb } from "./firebase-admin";

export type StoredItem = {
  category: "Emlak" | "Araç";
  title: string;
  price: number;
  status: string;
  locationOrYear: string;
  description?: string;
  imageUrls?: string[];
};

export type StoredItemWithId = StoredItem & { id: string };

async function getItems() {
  const snapshot = await adminDb.collection("items").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((document) => ({ id: document.id, ...(document.data() as StoredItem) }));
}

export async function getFirebaseItem(id: string): Promise<StoredItemWithId | null> {
  const snapshot = await adminDb.collection("items").doc(id).get();
  if (!snapshot.exists) return null;
  return { id: snapshot.id, ...(snapshot.data() as StoredItem) };
}

export async function getFirebaseListings() {
  const items = await getItems();
  return items.filter((item) => item.category === "Emlak").map((item) => ({
    id: item.id, type: "Emlak", badge: item.status, title: item.title,
    location: item.locationOrYear, price: `${item.price.toLocaleString("tr-TR")} TL`,
    meta: item.description ? [item.description] : [], image: item.imageUrls?.[0] ?? "",
  }));
}

export async function getFirebaseRentalCars() {
  const items = await getItems();
  return items.filter((item) => item.category === "Araç").map((item) => ({
    id: item.id, name: item.title, model: item.description || "Detay için arayın",
    year: item.locationOrYear, seats: "5 kişilik",
    status: item.status === "rented" ? "rented" as const : "available" as const,
    availableFrom: item.status === "rented" ? "Yakında müsait" : undefined,
    image: item.imageUrls?.[0] ?? "",
  }));
}

export async function getFirebaseSearchItems() {
  const items = await getItems();
  return items.map((item) => ({
    id: item.id,
    category: item.category,
    title: item.title,
    status: item.status,
    location: item.locationOrYear,
    description: item.description ?? "",
    price: `${item.price.toLocaleString("tr-TR")} TL`,
    image: item.imageUrls?.[0] ?? "",
    href: item.category === "Araç" ? `/arac-kiralama/${item.id}` : `/ilanlar/${item.id}`,
  }));
}
