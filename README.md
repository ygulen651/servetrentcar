# Servet Rent A Car

Servet İnşaat Emlak Rent A Car için hazırlanmış Next.js web sitesi ve yönetim paneli.

## Geliştirme

```bash
npm install
npm run dev
```

- Web sitesi: `http://localhost:3000`
- İlanlar: `http://localhost:3000/ilanlar`
- Yönetim paneli: `http://localhost:3000/admin`

## Teknolojiler

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide Icons
- Firebase (Authentication, Firestore, Storage)

## Firebase kurulumu

1. `.env.example` dosyasını `.env.local` adıyla kopyalayın.
2. Firebase Console'da bir Web uygulaması oluşturun.
3. Uygulama yapılandırmasındaki değerleri `.env.local` dosyasına ekleyin.
4. Firebase Console'dan kullanacağınız Authentication, Firestore ve Storage servislerini etkinleştirin.

Firebase servisleri `src/lib/firebase.ts` üzerinden kullanılabilir:

```ts
import { auth, db, storage } from "@/lib/firebase";
```

Sunucu tarafında Admin SDK servisleri `src/lib/firebase-admin.ts` üzerinden kullanılabilir. Servis hesabı JSON dosyasının adı `.env.local` içindeki `FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH` değişkeninde tutulur ve dosya Git tarafından yok sayılır.
