"use client";

import { FormEvent, useEffect, useState } from "react";
import { PhoneCall, X } from "lucide-react";

export function CallMe() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("fullname") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    if (!name || phone.replace(/\D/g, "").length < 10) { setError("Lütfen adınızı ve geçerli bir telefon numarası girin."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/callback-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error);
      form.reset(); setSent(true);
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Talep gönderilemedi."); }
    finally { setBusy(false); }
  }

  return <>
    <button type="button" className="v10x-callme" onClick={() => { setError(""); setSent(false); setOpen(true); }}>
      <PhoneCall /><span><strong>Biz Sizi Arayalım</strong><small>Numaranızı bırakın, hemen dönelim</small></span>
    </button>
    {open && <div className="v10x-modal" role="dialog" aria-modal="true" aria-labelledby="callme-title" onClick={(event) => event.target === event.currentTarget && setOpen(false)}>
      <form className="v10x-modal-box" onSubmit={submit}>
        <div className="v10x-modal-head"><strong id="callme-title">Biz Sizi Arayalım</strong><button type="button" onClick={() => setOpen(false)} aria-label="Kapat"><X /></button></div>
        <div className="v10x-modal-body">
          {sent ? <p className="v10x-modal-success" role="status">Talebiniz alındı. En kısa sürede sizi arayacağız.</p> : <p>Telefon numaranızı bırakın, hemen sizinle irtibata geçelim.</p>}
          {!sent && <>
          <label>Adınız Soyadınız<input name="fullname" autoComplete="name" autoFocus required /></label>
          <label>Telefon Numaranız<input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="05xx xxx xx xx" required /></label>
          {error && <p className="v10x-modal-error" role="alert">{error}</p>}
          </>}
        </div>
        <div className="v10x-modal-foot">{sent ? <button type="button" onClick={() => setOpen(false)}>Kapat</button> : <button type="submit" disabled={busy}>{busy ? "Gönderiliyor..." : "Gönder"}</button>}</div>
      </form>
    </div>}
  </>;
}
