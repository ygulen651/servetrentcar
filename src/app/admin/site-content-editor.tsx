"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { Check, ImagePlus, Save } from "lucide-react";

const fields = [
  ["Genel", "topLine", "Üst bilgi yazısı"], ["Genel", "brandSubtitle", "Logo alt yazısı"],
  ["Menü", "navHome", "Ana sayfa bağlantısı"], ["Menü", "navConstruction", "İnşaat bağlantısı"], ["Menü", "navRealEstate", "Emlak bağlantısı"], ["Menü", "navRental", "Araç kiralama bağlantısı"], ["Menü", "navAbout", "Hakkımızda bağlantısı"], ["Menü", "navContact", "İletişim bağlantısı"],
  ["Alt Bilgi", "footerDescription", "Firma açıklaması", "long"], ["Alt Bilgi", "footerAddress", "Adres", "long"], ["Alt Bilgi", "footerCopyright", "Telif yazısı"],
  ["Ana Sayfa", "homeHeroEyebrow", "Karşılama üst başlığı"], ["Ana Sayfa", "homeHeroTitle", "Karşılama başlığı", "long"], ["Ana Sayfa", "homeHeroText", "Karşılama açıklaması", "long"], ["Ana Sayfa", "homeListingsButton", "İlan butonu"], ["Ana Sayfa", "homeCallButton", "Arama butonu"],
  ["Hizmetler", "servicesEyebrow", "Hizmetler üst başlığı"], ["Hizmetler", "servicesTitle", "Hizmetler başlığı", "long"], ["Hizmetler", "servicesText", "Hizmetler açıklaması", "long"], ["Hizmetler", "realEstateTitle", "Emlak başlığı"], ["Hizmetler", "realEstateText", "Emlak açıklaması", "long"], ["Hizmetler", "constructionTitle", "İnşaat başlığı"], ["Hizmetler", "constructionText", "İnşaat açıklaması", "long"], ["Hizmetler", "rentalServiceTitle", "Araç kiralama başlığı"], ["Hizmetler", "rentalServiceText", "Araç kiralama açıklaması", "long"],
  ["Ana Sayfa", "projectsTitle", "Projeler başlığı", "long"], ["Ana Sayfa", "projectsText", "Projeler açıklaması", "long"], ["Ana Sayfa", "aboutTitle", "Hakkımızda başlığı", "long"], ["Ana Sayfa", "aboutText", "Hakkımızda açıklaması", "long"], ["Ana Sayfa", "contactTitle", "İletişim çağrısı", "long"],
  ["Emlak", "listingHeroEyebrow", "Sayfa üst başlığı"], ["Emlak", "listingHeroTitle", "Sayfa başlığı"], ["Emlak", "listingHeroText", "Sayfa açıklaması", "long"],
  ["Araç Kiralama", "rentalHeroEyebrow", "Karşılama üst başlığı"], ["Araç Kiralama", "rentalHeroTitle", "Karşılama başlığı", "long"], ["Araç Kiralama", "rentalHeroText", "Karşılama açıklaması", "long"], ["Araç Kiralama", "rentalHeroButton", "Karşılama butonu"], ["Araç Kiralama", "rentalAvailableEyebrow", "Müsait araçlar üst başlığı"], ["Araç Kiralama", "rentalAvailableTitle", "Müsait araçlar başlığı"], ["Araç Kiralama", "rentalAvailableText", "Müsait araçlar açıklaması", "long"], ["Araç Kiralama", "rentalCardNote", "Araç kartı açıklaması", "long"], ["Araç Kiralama", "rentalDetailLink", "Detay bağlantısı"], ["Araç Kiralama", "rentalRentedEyebrow", "Kiradaki araçlar üst başlığı"], ["Araç Kiralama", "rentalRentedTitle", "Kiradaki araçlar başlığı"], ["Araç Kiralama", "rentalRentedText", "Kiradaki araçlar açıklaması", "long"],
] as const;

export function SiteContentEditor({ user }: { user: User }) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void user.getIdToken().then((token) => fetch("/api/admin/site-content", { headers: { Authorization: `Bearer ${token}` } })).then(async (response) => {
      if (!response.ok) throw new Error("Site yazıları yüklenemedi.");
      setContent(await response.json());
    }).catch((error) => setMessage(error instanceof Error ? error.message : "Site yazıları yüklenemedi.")).finally(() => setBusy(false));
  }, [user]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("Kaydediliyor...");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/admin/site-content", { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(content) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setContent(result); setMessage("Site yazıları güncellendi.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Yazılar kaydedilemedi."); }
    finally { setBusy(false); }
  }

  async function uploadHero(event: ChangeEvent<HTMLInputElement>, key: "homeHeroImageUrl" | "homeHeroImageUrl2" | "homeHeroImageUrl3" | "homeHeroImageUrl4" | "homeHeroImageUrl5" | "rentalHeroImageUrl") {
    const image = event.target.files?.[0];
    event.target.value = "";
    if (!image) return;
    setBusy(true); setMessage("Hero görseli yükleniyor...");
    try {
      const token = await user.getIdToken();
      const form = new FormData(); form.set("key", key); form.set("image", image);
      const response = await fetch("/api/admin/site-content/image", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setContent((current) => ({ ...current, [key]: result.url }));
      setMessage("Hero görseli güncellendi.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Hero görseli yüklenemedi."); }
    finally { setBusy(false); }
  }

  if (busy && Object.keys(content).length === 0) return <div className="content-editor-loading">Site yazıları yükleniyor...</div>;
  const groups = [...new Set(fields.map(([group]) => group))];
  return <form className="site-content-editor" onSubmit={save}>
    <div className="content-editor-head"><div><h2>Site Yazıları</h2><p>Sitede görünen başlık ve açıklamaları bölüm bölüm düzenleyin.</p></div><button type="submit" disabled={busy}><Save />{busy ? "Kaydediliyor..." : "Tümünü Kaydet"}</button></div>
    {message && <p className="admin-message" role="status"><Check />{message}</p>}
    <section className="content-editor-group"><h3>Ana Sayfa Slider Görselleri</h3><p className="image-slot-help">Ana sayfadaki büyük görseller aşağıdaki sırayla gösterilir. Her alanın numarası, görselin slider içindeki yerini belirtir.</p><div className="hero-image-editor slider-image-editor">
      {([ ["homeHeroImageUrl", "1. Slider Görseli"], ["homeHeroImageUrl2", "2. Slider Görseli"], ["homeHeroImageUrl3", "3. Slider Görseli"], ["homeHeroImageUrl4", "4. Slider Görseli"], ["homeHeroImageUrl5", "5. Slider Görseli"] ] as const).map(([key, label], index) => <article key={key}>
        <div className="hero-image-preview" role="img" aria-label={`${label} önizlemesi`} style={{ backgroundImage: `url(${content[key] ?? ""})` }} />
        <span className="slider-slot-number">{index + 1}</span><div><strong>{label}</strong><small>Bu fotoğraf ana sayfada {index + 1}. sırada görünür. Yatay JPG, PNG veya WEBP kullanın.</small><label className="hero-upload-button"><ImagePlus />Görseli Değiştir<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => uploadHero(event, key)} /></label></div>
      </article>)}
    </div></section>
    <section className="content-editor-group"><h3>Ana Sayfa İlan Görsel Yerleri</h3><div className="homepage-placement-guide"><div><strong>4 Kiralık İlan</strong><span>En yeni dört kiralık ilanın kapak fotoğrafı kullanılır.</span></div><div><strong>4 Satılık İlan</strong><span>En yeni dört satılık ilanın kapak fotoğrafı kullanılır.</span></div><div><strong>5 Vitrin Görseli</strong><span>İlanlardaki ilk kapak fotoğrafları mozaik vitrinde gösterilir.</span></div></div><p className="image-slot-help">Bu alanlardaki fotoğrafları değiştirmek için “Emlak İlanları” bölümünden ilgili ilanı düzenleyin. İlanın 1. fotoğrafı kapak ve ana sayfa görselidir.</p></section>
    <section className="content-editor-group"><h3>Diğer Sayfa Görselleri</h3><div className="hero-image-editor"><article><div className="hero-image-preview" role="img" aria-label="Araç kiralama kapak görseli" style={{backgroundImage:`url(${content.rentalHeroImageUrl ?? ""})`}}/><div><strong>Araç kiralama kapak görseli</strong><small>Rent A Car sayfasının kapak alanında kullanılır.</small><label className="hero-upload-button"><ImagePlus/>Görseli Değiştir<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => uploadHero(event, "rentalHeroImageUrl")}/></label></div></article></div></section>
    {groups.map((group) => <section className="content-editor-group" key={group}><h3>{group}</h3><div className="content-editor-grid">
      {fields.filter(([fieldGroup]) => fieldGroup === group).map(([, key, label, kind]) => <label className={kind === "long" ? "wide" : ""} key={key}>{label}{kind === "long" ? <textarea rows={3} value={content[key] ?? ""} onChange={(event) => setContent((current) => ({ ...current, [key]: event.target.value }))} required /> : <input value={content[key] ?? ""} onChange={(event) => setContent((current) => ({ ...current, [key]: event.target.value }))} required />}</label>)}
    </div></section>)}
  </form>;
}
