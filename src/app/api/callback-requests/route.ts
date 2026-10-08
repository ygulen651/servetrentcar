import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: unknown; phone?: unknown };
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : "";
    if (!name || phone.replace(/\D/g, "").length < 10) return Response.json({ error: "Ad soyad ve geçerli telefon numarası gerekli." }, { status: 400 });
    await adminDb.collection("callbackRequests").add({ name, phone, status: "new", createdAt: FieldValue.serverTimestamp() });
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Talep kaydedilemedi." }, { status: 500 });
  }
}
