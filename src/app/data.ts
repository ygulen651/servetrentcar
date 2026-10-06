export const listings = [
  { id: "SVT-1001", type: "Emlak", badge: "Satılık", title: "Karaman Merkezde Ferah 3+1 Daire", location: "Merkez, Karaman", price: "3.850.000 TL", meta: ["3+1", "145 m²", "3. Kat"], image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85" },
  { id: "SVT-1002", type: "Araç", badge: "Günlük Kiralık", title: "Konforlu ve Ekonomik Araç Seçenekleri", location: "Karaman Merkez", price: "Fiyat için arayın", meta: ["Otomatik", "Dizel", "2023"], image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=85" },
  { id: "SVT-1003", type: "Emlak", badge: "Kiralık", title: "İşlek Konumda Geniş Ticari Dükkan", location: "Rauf Denktaş Mah., Karaman", price: "32.000 TL / Ay", meta: ["Dükkan", "180 m²", "Cadde üzeri"], image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85" },
];

export const projects = [
  { title: "Modern Yaşam Konutları", text: "Güvenli, çağdaş ve kullanışlı yaşam alanları.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85" },
  { title: "Anahtar Teslim Yapılar", text: "Planlamadan teslimata özenli inşaat çözümleri.", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85" },
];

export const rentalCars = [
  {
    id: "SVT-A01",
    name: "Ekonomik Sedan",
    model: "Manuel · Dizel",
    year: "2023",
    seats: "5 kişilik",
    status: "available" as const,
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1400&q=88",
  },
  {
    id: "SVT-A02",
    name: "Konfor Sedan",
    model: "Otomatik · Benzin",
    year: "2024",
    seats: "5 kişilik",
    status: "available" as const,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=88",
  },
  {
    id: "SVT-A03",
    name: "Şehir Otomatiği",
    model: "Otomatik · Benzin",
    year: "2023",
    seats: "5 kişilik",
    status: "available" as const,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=88",
  },
  {
    id: "SVT-A04",
    name: "Geniş Aile Sedanı",
    model: "Otomatik · Dizel",
    year: "2022",
    seats: "5 kişilik",
    status: "rented" as const,
    availableFrom: "Yakında müsait",
    image: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1400&q=88",
  },
];

export const turkeyCities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin",
  "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur",
  "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan",
  "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul",
  "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kilis", "Kırıkkale", "Kırklareli",
  "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş",
  "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas",
  "Şanlıurfa", "Şırnak", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak",
];
