import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function DELETE(request: Request, context: RouteContext<"/api/admin/callback-requests/[id]">) {
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
    await adminAuth.verifyIdToken(authorization.slice(7));
    const { id } = await context.params;
    await adminDb.collection("callbackRequests").doc(id).delete();
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Talep silinemedi." }, { status: 500 });
  }
}
