import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { defaultSiteContent } from "@/lib/site-content";

export const runtime = "nodejs";

async function requireUser(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) throw new Error("UNAUTHORIZED");
  return adminAuth.verifyIdToken(authorization.slice(7));
}

export async function GET(request: Request) {
  try {
    await requireUser(request);
    const snapshot = await adminDb.collection("settings").doc("site-content").get();
    return Response.json({ ...defaultSiteContent, ...(snapshot.exists ? snapshot.data() : {}) });
  } catch {
    return Response.json({ error: "Site yazıları alınamadı." }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser(request);
    const body = await request.json() as Record<string, unknown>;
    const content: Record<string, string> = {};
    for (const key of Object.keys(defaultSiteContent)) {
      const value = body[key];
      if (typeof value !== "string" || !value.trim() || value.length > 2000) return Response.json({ error: "Tüm metin alanlarını kontrol edin." }, { status: 400 });
      content[key] = value.trim();
    }
    await adminDb.collection("settings").doc("site-content").set({ ...content, updatedAt: FieldValue.serverTimestamp(), updatedBy: user.uid }, { merge: true });
    return Response.json(content);
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message.includes("ID token"))) return Response.json({ error: "Oturum geçersiz." }, { status: 401 });
    return Response.json({ error: "Site yazıları kaydedilemedi." }, { status: 500 });
  }
}
