import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb, adminStorage } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

async function requireUser(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) throw new Error("UNAUTHORIZED");
  return adminAuth.verifyIdToken(authorization.slice(7));
}

export async function GET(request: Request) {
  try {
    await requireUser(request);
    const snapshot = await adminDb.collection("items").orderBy("createdAt", "desc").get();
    return Response.json(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json({ error: "Oturum gerekli." }, { status: 401 });
    }
    return Response.json({ error: "Kayıtlar alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const form = await request.formData();
    const category = String(form.get("category") ?? "");
    const propertyType = String(form.get("propertyType") ?? "");
    const title = String(form.get("title") ?? "").trim();
    const price = Number(form.get("price"));
    const status = String(form.get("status") ?? "");
    const locationOrYear = String(form.get("locationOrYear") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const photos = form.getAll("photos").filter((item): item is File => item instanceof File);

    if (!(["Emlak", "Araç"].includes(category)) || !title || !Number.isFinite(price) || price < 0 || (category === "Emlak" && !["Konut", "Arsa", "Tarla", "İş Yeri"].includes(propertyType))) {
      return Response.json({ error: "Zorunlu alanları kontrol edin." }, { status: 400 });
    }
    if (photos.length > 10 || photos.some((photo) => !allowedImageTypes.has(photo.type) || photo.size > 10_000_000)) {
      return Response.json({ error: "En fazla 10 adet, 10 MB altı JPG, PNG veya WEBP yükleyin." }, { status: 400 });
    }

    const document = adminDb.collection("items").doc();
    const bucket = adminStorage.bucket();
    const imagePaths: string[] = [];
    const imageUrls: string[] = [];

    try {
      for (const [index, photo] of photos.entries()) {
        const extension = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
        const path = `items/${document.id}/${index + 1}.${extension}`;
        const file = bucket.file(path);
        await file.save(Buffer.from(await photo.arrayBuffer()), {
          contentType: photo.type,
          resumable: false,
          metadata: { metadata: { ownerUid: user.uid } },
        });
        const [url] = await file.getSignedUrl({ action: "read", expires: "2500-01-01" });
        imagePaths.push(path);
        imageUrls.push(url);
      }

      await document.set({
        category,
        propertyType: category === "Emlak" ? propertyType : null,
        title,
        price,
        status,
        locationOrYear,
        description,
        imagePaths,
        imageUrls,
        ownerUid: user.uid,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      await Promise.allSettled(imagePaths.map((path) => bucket.file(path).delete()));
      throw error;
    }

    return Response.json({ id: document.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message.includes("ID token"))) {
      return Response.json({ error: "Oturum geçersiz." }, { status: 401 });
    }
    console.error("Firebase item create error", error);
    return Response.json({ error: "Kayıt oluşturulamadı." }, { status: 500 });
  }
}
