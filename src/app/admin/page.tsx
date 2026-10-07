"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { Building2, Camera, CarFront, Check, ChevronDown, Eye, FileText, ImagePlus, LayoutDashboard, LogOut, Menu, Pencil, Plus, Search, Settings, Trash2, X } from "lucide-react";
import { turkeyCities } from "../data";
import { auth } from "@/lib/firebase";
import { SiteContentEditor } from "./site-content-editor";

type ListingCategory = "Emlak" | "Araç";
type View = "overview" | "content" | ListingCategory;
type SelectedPhoto = { file: File; name: string; url: string };
type ExistingPhoto = { path: string; url: string };
type FirebaseItem = { id: string; category: ListingCategory; propertyType?: string; title: string; price: number; status: string; locationOrYear: string; description?: string; imagePaths?: string[]; imageUrls?: string[] };

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [items, setItems] = useState<FirebaseItem[]>([]);
  const [view, setView] = useState<View>("overview");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<FirebaseItem | null>(null);
  const [category, setCategory] = useState<ListingCategory>("Emlak");
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>([]);
  const [newPhotoIsCover, setNewPhotoIsCover] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => onAuthStateChanged(auth, (nextUser) => {
    setUser(nextUser); setAuthReady(true);
    if (nextUser) void loadItems(nextUser); else setItems([]);
  }), []);

  async function authorizedFetch(url: string, options: RequestInit = {}, activeUser = user) {
    if (!activeUser) throw new Error("Oturum gerekli.");
    const token = await activeUser.getIdToken();
    return fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });
  }

  async function loadItems(activeUser = user) {
    if (!activeUser) return;
    const response = await authorizedFetch("/api/admin/items", {}, activeUser);
    if (!response.ok) throw new Error("Kayıtlar yüklenemedi.");
    setItems(await response.json());
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    try { await signInWithEmailAndPassword(auth, String(form.get("email")), String(form.get("password"))); }
    catch { setMessage("E-posta veya şifre hatalı."); }
    finally { setBusy(false); }
  }

  function openCreate(nextCategory: ListingCategory = "Emlak") { setEditing(null); setCategory(nextCategory); setPhotos([]); setExistingPhotos([]); setNewPhotoIsCover(false); setModal(true); setMessage(""); }
  function openEdit(item: FirebaseItem) {
    setEditing(item); setCategory(item.category); setPhotos([]);
    setExistingPhotos((item.imageUrls ?? []).map((url, index) => ({ url, path: item.imagePaths?.[index] ?? "" })));
    setNewPhotoIsCover(false); setModal(true); setMessage("");
  }
  function closeModal() { photos.forEach((photo) => URL.revokeObjectURL(photo.url)); setPhotos([]); setExistingPhotos([]); setNewPhotoIsCover(false); setModal(false); setEditing(null); }
  function selectView(nextView: View) { setView(nextView); setMobileMenuOpen(false); }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(editing ? "Değişiklikler kaydediliyor..." : "Kayıt oluşturuluyor...");
    const form = new FormData(event.currentTarget); form.set("category", category);
    try {
      let response: Response;
      photos.forEach((photo) => form.append("photos", photo.file));
      if (editing) {
        form.set("existingImagePaths", JSON.stringify(existingPhotos.map((photo) => photo.path).filter(Boolean)));
        form.set("newPhotoIsCover", String(newPhotoIsCover));
        response = await authorizedFetch(`/api/admin/items/${editing.id}`, { method: "PATCH", body: form });
      } else response = await authorizedFetch("/api/admin/items", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      const wasEditing = Boolean(editing); closeModal(); await loadItems(); setMessage(wasEditing ? "Kayıt güncellendi." : "Yeni kayıt yayına alındı.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "İşlem tamamlanamadı."); }
    finally { setBusy(false); }
  }

  async function deleteItem(item: FirebaseItem) {
    if (!window.confirm(`“${item.title}” kaydını ve fotoğraflarını silmek istiyor musunuz?`)) return;
    setBusy(true);
    try { const response = await authorizedFetch(`/api/admin/items/${item.id}`, { method: "DELETE" }); if (!response.ok) throw new Error("Kayıt silinemedi."); await loadItems(); setMessage("Kayıt silindi."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Kayıt silinemedi."); }
    finally { setBusy(false); }
  }

  async function preparePhoto(file: File) {
    if (file.size > 100_000_000) throw new Error("Fotoğraf 100 MB sınırını aşıyor.");
    if (["image/jpeg", "image/png", "image/webp"].includes(file.type)) return file;
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", .86));
    if (!blob || blob.size > 100_000_000) throw new Error("Fotoğraf telefonda işlenemedi.");
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "fotograf"}.jpg`, { type: "image/jpeg" });
  }

  async function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, 10 - existingPhotos.length - photos.length);
    event.target.value = "";
    try {
      const prepared = await Promise.all(files.map(preparePhoto));
      setPhotos((current) => [...current, ...prepared.map((file) => ({ file, name: file.name, url: URL.createObjectURL(file) }))]);
      setMessage("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Seçilen görsel biçimi bu cihazda açılamadı."); }
  }
  function removePhoto(index: number) { setPhotos((current) => { URL.revokeObjectURL(current[index].url); if (index === 0 && newPhotoIsCover) setNewPhotoIsCover(false); return current.filter((_, i) => i !== index); }); }
  function removeExistingPhoto(index: number) { setExistingPhotos((current) => current.filter((_, i) => i !== index)); }
  function makeExistingCover(index: number) { setNewPhotoIsCover(false); setExistingPhotos((current) => { const next = [...current]; const [cover] = next.splice(index, 1); return [cover, ...next]; }); }
  function makeNewCover(index: number) {
    setPhotos((current) => { const next = [...current]; const [cover] = next.splice(index, 1); return [cover, ...next]; });
    setNewPhotoIsCover(true);
  }

  const filteredItems = useMemo(() => items.filter((item) => {
    const needle = search.trim().toLocaleLowerCase("tr-TR");
    return (view === "overview" || item.category === view) && (!needle || `${item.title} ${item.propertyType ?? ""} ${item.locationOrYear} ${item.id}`.toLocaleLowerCase("tr-TR").includes(needle));
  }), [items, search, view]);
  const emlakCount = items.filter((item) => item.category === "Emlak").length;
  const carCount = items.filter((item) => item.category === "Araç").length;
  const title = view === "overview" ? "Genel Bakış" : view === "content" ? "Site Yazıları" : view === "Emlak" ? "Emlak İlanları" : "Araç Filosu";

  if (!authReady) return <main className="admin-login"><p>Yönetim paneli yükleniyor...</p></main>;
  if (!user) return <main className="admin-login"><form onSubmit={login}>
    <div className="admin-logo"><span>S</span><div><strong>SERVET</strong><small>YÖNETİM PANELİ</small></div></div><h1>Yönetici girişi</h1>
    <p className="login-intro">Sitenizdeki ilanları ve araçları tek panelden yönetin.</p>
    <label>E-posta<input name="email" type="email" autoComplete="email" required /></label><label>Şifre<input name="password" type="password" autoComplete="current-password" required /></label>
    {message && <p className="admin-message error" role="alert">{message}</p>}<button type="submit" disabled={busy}>{busy ? "Giriş yapılıyor..." : "Giriş yap"}</button>
  </form></main>;

  return <div className="admin-layout">
    {mobileMenuOpen && <button className="admin-sidebar-backdrop" aria-label="Menüyü kapat" onClick={() => setMobileMenuOpen(false)} />}
    <aside className={`admin-sidebar ${mobileMenuOpen ? "open" : ""}`}><div className="admin-logo"><span>S</span><div><strong>SERVET</strong><small>YÖNETİM PANELİ</small></div><button className="admin-sidebar-close" aria-label="Menüyü kapat" onClick={() => setMobileMenuOpen(false)}><X /></button></div>
      <nav aria-label="Yönetim menüsü">
        <button className={view === "overview" ? "active" : ""} onClick={() => selectView("overview")}><LayoutDashboard />Genel Bakış</button>
        <button className={view === "Emlak" ? "active" : ""} onClick={() => selectView("Emlak")}><Building2 />Emlak İlanları <b>{emlakCount}</b></button>
        <button className={view === "Araç" ? "active" : ""} onClick={() => selectView("Araç")}><CarFront />Araç Filosu <b>{carCount}</b></button>
        <button className={view === "content" ? "active" : ""} onClick={() => selectView("content")}><FileText />Site Yazıları</button>
        <a href="/" target="_blank"><Eye />Siteyi Görüntüle</a><a href="mailto:info@servetinsaat.com"><Settings />Destek</a>
      </nav><button className="logout" type="button" onClick={() => signOut(auth)}><LogOut />Çıkış Yap</button>
    </aside>
    <main className="admin-main"><header><button className="admin-menu" aria-label="Menüyü aç" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(true)}><Menu /></button><div><h1>{title}</h1><p>{items.length} içerik panelden yönetiliyor.</p></div><button className="admin-user" title={user.email ?? "Yönetici"}>{(user.email?.slice(0, 2) ?? "SS").toUpperCase()} <ChevronDown /></button></header>
      <section className="admin-content">
        {view === "content" ? <SiteContentEditor user={user} /> : <>
        <div className="stats"><article><span><Building2 /></span><div><small>Yayındaki emlak ilanı</small><strong>{emlakCount}</strong></div></article><article><span><CarFront /></span><div><small>Filodaki araç</small><strong>{carCount}</strong></div></article><article><span><Check /></span><div><small>Toplam yönetilen içerik</small><strong>{items.length}</strong></div></article></div>
        <div className="admin-toolbar"><div><h2>{title}</h2><p>İçerikleri arayın, düzenleyin veya yayından kaldırın.</p></div><button onClick={() => openCreate(view === "Araç" ? "Araç" : "Emlak")}><Plus /> Yeni {view === "Araç" ? "Araç" : "İlan"}</button></div>
        {message && <p className="admin-message" role="status">{message}</p>}
        <div className="admin-table"><div className="table-search"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Başlık, konum veya kod ara..." /></div><div className="table-scroll"><table><thead><tr><th>İçerik</th><th>Tür</th><th>Durum</th><th>Fiyat</th><th>İşlemler</th></tr></thead><tbody>
          {filteredItems.map((item) => <tr key={item.id}><td><div className="table-listing"><div style={{ backgroundImage: `url(${item.imageUrls?.[0] ?? ""})` }}>{!item.imageUrls?.[0] && <Camera />}</div><span><strong>{item.title}</strong><small>{item.locationOrYear} · {item.id}</small></span></div></td><td>{item.category === "Emlak" ? (item.propertyType ?? "Konut") : item.category}</td><td><span className="status">{item.category === "Araç" ? (item.status === "rented" ? "Kirada" : "Boşta") : item.status}</span></td><td><strong>{item.price.toLocaleString("tr-TR")} TL</strong></td><td><div className="actions"><button title="Düzenle" onClick={() => openEdit(item)}><Pencil /></button><button title="Sil" disabled={busy} onClick={() => deleteItem(item)}><Trash2 /></button></div></td></tr>)}
          {filteredItems.length === 0 && <tr><td className="empty-state" colSpan={5}>Bu görünümde kayıt bulunamadı. Yeni bir içerik ekleyebilirsiniz.</td></tr>}
        </tbody></table></div></div></>}
      </section>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="item-modal-title"><div className="modal-head"><div><h2 id="item-modal-title">{editing ? "Kaydı Düzenle" : category === "Araç" ? "Yeni Araç Ekle" : "Yeni İlan Ekle"}</h2><p>Burada kaydettiğiniz bilgiler sitede yayınlanır.</p></div><button onClick={closeModal} aria-label="Pencereyi kapat">×</button></div>
      <form key={editing?.id ?? "new"} onSubmit={saveItem}>
        <label>{category === "Araç" ? "Müsaitlik" : "İşlem türü"}<select name="status" defaultValue={editing?.status ?? (category === "Araç" ? "available" : "Satılık")}>{category === "Araç" ? <><option value="available">Şu an boşta</option><option value="rented">Şu an kirada</option></> : <><option>Satılık</option><option>Kiralık</option></>}</select></label>
        {category === "Emlak" && <label>Emlak türü<select name="propertyType" defaultValue={editing?.propertyType ?? "Konut"}><option>Konut</option><option>Arsa</option><option>Tarla</option><option>İş Yeri</option></select></label>}
        <label>{category === "Araç" ? "Araç adı / modeli" : "İlan başlığı"}<input name="title" defaultValue={editing?.title ?? ""} required /></label>
        <div className="form-row"><label>Fiyat (TL)<input name="price" type="number" min="0" defaultValue={editing?.price ?? ""} required /></label><label>{category === "Araç" ? "Model yılı" : "Konum"}{category === "Araç" ? <input name="locationOrYear" type="number" defaultValue={editing?.locationOrYear ?? new Date().getFullYear()} required /> : <select name="locationOrYear" defaultValue={editing?.locationOrYear ?? "Karaman"}>{turkeyCities.map((city) => <option key={city}>{city}</option>)}</select>}</label></div>
        <label>Açıklama<textarea name="description" rows={4} defaultValue={editing?.description ?? ""} placeholder="Öne çıkan özellikleri ve detayları yazın." /></label>
        <div className="listing-photo-uploader"><div className="photo-upload-heading"><div><strong>Fotoğraflar</strong><small>İlk fotoğraf kapak olur. Fotoğraf ekleyebilir, silebilir veya kapağı değiştirebilirsiniz.</small></div><span>{existingPhotos.length + photos.length}/10</span></div>
          {existingPhotos.length > 0 && <div className="photo-preview-grid">{existingPhotos.map((photo, index) => <div className="photo-preview" key={photo.path || photo.url}><img src={photo.url} alt={`${index + 1}. mevcut fotoğraf`} />{!newPhotoIsCover && index === 0 && <span className="cover-label">Kapak</span>}<div className="photo-preview-actions">{(newPhotoIsCover || index > 0) && <button type="button" title="Kapak yap" onClick={() => makeExistingCover(index)}><Camera /></button>}<button type="button" title="Fotoğrafı sil" onClick={() => removeExistingPhoto(index)}><Trash2 /></button></div></div>)}</div>}
          {existingPhotos.length + photos.length < 10 && <label className="upload"><ImagePlus /><strong>Telefondan veya bilgisayardan fotoğraf seçin</strong><small>Tüm görsel biçimleri · fotoğraf başına en fazla 100 MB</small><input type="file" accept="image/*" multiple onChange={addPhotos} /></label>}
          {photos.length > 0 && <div className="photo-preview-grid">{photos.map((photo, index) => <div className="photo-preview" key={`${photo.name}-${index}`}><img src={photo.url} alt={`${index + 1}. yeni fotoğraf önizlemesi`} />{index === 0 && (newPhotoIsCover || existingPhotos.length === 0) && <span className="cover-label">Kapak</span>}<div className="photo-preview-actions">{(!(index === 0 && newPhotoIsCover) && (existingPhotos.length > 0 || index > 0)) && <button type="button" title="Kapak yap" onClick={() => makeNewCover(index)}><Camera /></button>}<button type="button" title="Kaldır" onClick={() => removePhoto(index)}><X /></button></div></div>)}</div>}
        </div>
        <div className="modal-actions"><button type="button" onClick={closeModal}>Vazgeç</button><button type="submit" disabled={busy}><Check />{busy ? "Kaydediliyor..." : editing ? "Değişiklikleri Kaydet" : "Yayınla"}</button></div>
      </form></div></div>}
  </div>;
}
