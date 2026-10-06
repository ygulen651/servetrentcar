import { adminAuth, adminDb, adminStorage } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

async function requireUser(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) throw new Error("UNAUTHORIZED");
  return adminAuth.verifyIdToken(authorization.slice(7));
}

export async function PATCH(request: Request, context: RouteContext<"/api/admin/items/[id]">) {
  try {
    await requireUser(request);
    const { id } = await context.params;
    const body = await request.json() as Record<string, unknown>;
    const category = String(body.category ?? "");
    const propertyType = String(body.propertyType ?? "");
    const title = String(body.title ?? "").trim();
    const price = Number(body.price);
    const status = String(body.status ?? "");
    const locationOrYear = String(body.locationOrYear ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (!["Emlak", "Araç"].includes(category) || !title || !locationOrYear || !Number.isFinite(price) || price < 0 || (category === "Emlak" && !["Konut", "Arsa", "Tarla", "İş Yeri"].includes(propertyType))) {
      return Response.json({ error: "Zorunlu alanları kontrol edin." }, { status: 400 });
    }

    const reference = adminDb.collection("items").doc(id);
    if (!(await reference.get()).exists) return Response.json({ error: "Kayıt bulunamadı." }, { status: 404 });

    await reference.update({ category, propertyType: category === "Emlak" ? propertyType : null, title, price, status, locationOrYear, description, updatedAt: FieldValue.serverTimestamp() });
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
