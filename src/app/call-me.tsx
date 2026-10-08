"use client";

import { FormEvent, useEffect, useState } from "react";
import { PhoneCall, X } from "lucide-react";

export function CallMe() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("fullname") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    if (!name || phone.replace(/\D/g, "").length < 10) { setError("Lütfen adınızı ve geçerli bir telefon numarası girin."); return; }
    const text = `Merhaba, beni arayabilir misiniz?\nAd Soyad: ${name}\nTelefon: ${phone}`;
    window.open(`https://wa.me/905354266235?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setOpen(false);
  }

  return <>
    <button type="button" className="v10x-callme" onClick={() => { setError(""); setOpen(true); }}>
      <PhoneCall /><span><strong>Biz Sizi Arayalım</strong><small>Numaranızı bırakın, hemen dönelim</small></span>
    </button>
    {open && <div className="v10x-modal" role="dialog" aria-modal="true" aria-labelledby="callme-title" onClick={(event) => event.target === event.currentTarget && setOpen(false)}>
      <form className="v10x-modal-box" onSubmit={submit}>
        <div className="v10x-modal-head"><strong id="callme-title">Biz Sizi Arayalım</strong><button type="button" onClick={() => setOpen(false)} aria-label="Kapat"><X /></button></div>
        <div className="v10x-modal-body">
          <p>Telefon numaranızı bırakın, hemen sizinle irtibata geçelim.</p>
          <label>Adınız Soyadınız<input name="fullname" autoComplete="name" autoFocus required /></label>
          <label>Telefon Numaranız<input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="05xx xxx xx xx" required /></label>
          {error && <p className="v10x-modal-error" role="alert">{error}</p>}
        </div>
        <div className="v10x-modal-foot"><button type="submit">Gönder</button></div>
      </form>
    </div>}
  </>;
}
