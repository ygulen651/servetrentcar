import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb, adminStorage } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const allowedKeys = new Set(["homeHeroImageUrl", "rentalHeroImageUrl"]);
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

async function requireUser(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) throw new Error("UNAUTHORIZED");
  return adminAuth.verifyIdToken(authorization.slice(7));
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const form = await request.formData();
    const key = String(form.get("key") ?? "");
    const image = form.get("image");
    if (!allowedKeys.has(key) || !(image instanceof File) || !allowedTypes.has(image.type) || image.size > 10_000_000) {
      return Response.json({ error: "10 MB altında JPG, PNG veya WEBP seçin." }, { status: 400 });
    }
    const extension = image.type === "image/png" ? "png" : image.type === "image/webp" ? "webp" : "jpg";
    const file = adminStorage.bucket().file(`site-content/${key}.${extension}`);
    await file.save(Buffer.from(await image.arrayBuffer()), { contentType: image.type, resumable: false, metadata: { metadata: { ownerUid: user.uid } } });
    const [url] = await file.getSignedUrl({ action: "read", expires: "2500-01-01" });
    await adminDb.collection("settings").doc("site-content").set({ [key]: url, updatedAt: FieldValue.serverTimestamp(), updatedBy: user.uid }, { merge: true });
    return Response.json({ key, url });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message.includes("ID token"))) return Response.json({ error: "Oturum geçersiz." }, { status: 401 });
    return Response.json({ error: "Hero görseli yüklenemedi." }, { status: 500 });
  }
}
