import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

async function requireUser(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) throw new Error("UNAUTHORIZED");
  return adminAuth.verifyIdToken(authorization.slice(7));
}

export async function GET(request: Request) {
  try {
    await requireUser(request);
    const snapshot = await adminDb.collection("callbackRequests").orderBy("createdAt", "desc").get();
    return Response.json(snapshot.docs.map((document) => {
      const data = document.data();
      return { id: document.id, name: data.name, phone: data.phone, status: data.status, createdAt: data.createdAt?.toDate?.().toISOString() ?? null };
    }));
  } catch (error) {
    return Response.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Oturum gerekli." : "Talepler alınamadı." }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500 });
  }
}
