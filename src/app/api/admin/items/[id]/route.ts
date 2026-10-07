import { adminAuth, adminDb, adminStorage } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

async function requireUser(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) throw new Error("UNAUTHORIZED");
  return adminAuth.verifyIdToken(authorization.slice(7));
}

export async function PATCH(request: Request, context: RouteContext<"/api/admin/items/[id]">) {
  try {
    await requireUser(request);
    const { id } = await context.params;
    const form = await request.formData();
    const category = String(form.get("category") ?? "");
    const propertyType = String(form.get("propertyType") ?? "");
    const title = String(form.get("title") ?? "").trim();
    const price = Number(form.get("price"));
    const status = String(form.get("status") ?? "");
    const locationOrYear = String(form.get("locationOrYear") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const newPhotoIsCover = form.get("newPhotoIsCover") === "true";
    const photos = form.getAll("photos").filter((item): item is File => item instanceof File);
    let requestedPaths: string[];
    try { requestedPaths = JSON.parse(String(form.get("existingImagePaths") ?? "[]")); }
    catch { return Response.json({ error: "Fotoğraf listesi geçersiz." }, { status: 400 }); }

    if (!["Emlak", "Araç"].includes(category) || !title || !locationOrYear || !Number.isFinite(price) || price < 0 || (category === "Emlak" && !["Konut", "Arsa", "Tarla", "İş Yeri"].includes(propertyType))) {
      return Response.json({ error: "Zorunlu alanları kontrol edin." }, { status: 400 });
    }

    const reference = adminDb.collection("items").doc(id);
    const snapshot = await reference.get();
    if (!snapshot.exists) return Response.json({ error: "Kayıt bulunamadı." }, { status: 404 });
    const currentPaths = (snapshot.data()?.imagePaths ?? []) as string[];
    const currentUrls = (snapshot.data()?.imageUrls ?? []) as string[];
    if (!Array.isArray(requestedPaths) || requestedPaths.some((path) => typeof path !== "string" || !currentPaths.includes(path))) {
      return Response.json({ error: "Fotoğraf listesi geçersiz." }, { status: 400 });
    }
    if (requestedPaths.length + photos.length > 10 || photos.some((photo) => !allowedImageTypes.has(photo.type) || photo.size > 600_000_000)) {
      return Response.json({ error: "En fazla 10 adet ve fotoğraf başına 600 MB sınırını kontrol edin." }, { status: 400 });
    }

    const bucket = adminStorage.bucket();
    const newPaths: string[] = [];
    const newUrls: string[] = [];
    try {
      for (const photo of photos) {
        const extension = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
        const path = `items/${id}/${crypto.randomUUID()}.${extension}`;
        const file = bucket.file(path);
        await file.save(Buffer.from(await photo.arrayBuffer()), { contentType: photo.type, resumable: false });
        const [url] = await file.getSignedUrl({ action: "read", expires: "2500-01-01" });
        newPaths.push(path); newUrls.push(url);
      }
      const keptUrls = requestedPaths.map((path) => currentUrls[currentPaths.indexOf(path)]).filter(Boolean);
      const imagePaths = newPhotoIsCover ? [...newPaths, ...requestedPaths] : [...requestedPaths, ...newPaths];
      const imageUrls = newPhotoIsCover ? [...newUrls, ...keptUrls] : [...keptUrls, ...newUrls];
      await reference.update({ category, propertyType: category === "Emlak" ? propertyType : null, title, price, status, locationOrYear, description, imagePaths, imageUrls, updatedAt: FieldValue.serverTimestamp() });
    } catch (error) {
      await Promise.allSettled(newPaths.map((path) => bucket.file(path).delete()));
      throw error;
    }
    const removedPaths = currentPaths.filter((path) => !requestedPaths.includes(path));
    await Promise.allSettled(removedPaths.map((path) => bucket.file(path).delete()));
    return Response.json({ id });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message.includes("ID token"))) {
      return Response.json({ error: "Oturum geçersiz." }, { status: 401 });
    }
    console.error("Firebase item update error", error);
    return Response.json({ error: "Kayıt güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext<"/api/admin/items/[id]">) {
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return Response.json({ error: "Oturum gerekli." }, { status: 401 });
    }
    await adminAuth.verifyIdToken(authorization.slice(7));

    const { id } = await context.params;
    const reference = adminDb.collection("items").doc(id);
    const snapshot = await reference.get();
    if (!snapshot.exists) return Response.json({ error: "Kayıt bulunamadı." }, { status: 404 });

    const imagePaths = (snapshot.data()?.imagePaths ?? []) as string[];
    await Promise.allSettled(imagePaths.map((path) => adminStorage.bucket().file(path).delete()));
    await reference.delete();
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Firebase item delete error", error);
    return Response.json({ error: "Kayıt silinemedi." }, { status: 500 });
  }
}
