import { ArrowRight, CalendarCheck2, Check, Clock3, MessageCircle, Phone, UsersRound } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Footer, Header, WhatsApp } from "../components";
import { getFirebaseRentalCars } from "@/lib/firebase-data";

const phoneNumber = "+905354266235";
const vehiclePhoneNumber = "+905051977070";
const whatsappNumber = "905354266235";

type RentalCar = Awaited<ReturnType<typeof getFirebaseRentalCars>>[number];

function VehicleCard({ car }: { car: RentalCar }) {
  const isAvailable = car.status === "available";
  const message = encodeURIComponent(
    `Merhaba, ${car.id} kodlu ${car.name} aracını kiralamak istiyorum. Müsaitlik ve fiyat bilgisi alabilir miyim?`,
  );

  return (
    <article className={`rental-card ${isAvailable ? "is-available" : "is-rented"}`}>
      <div className="rental-card-image" role="img" aria-label={`${car.name} araç fotoğrafı`} style={{ backgroundImage: `url(${car.image})` }}>
        <span className={`availability-badge ${isAvailable ? "available" : "rented"}`}>
          {isAvailable ? <Check size={15} /> : <Clock3 size={15} />}
          {isAvailable ? "Şu an boşta" : "Şu an kirada"}
        </span>
        <small>{car.id}</small>
      </div>
      <div className="rental-card-body">
        <p className="rental-kicker">Servet Rent A Car</p>
        <h2>{car.name}</h2>
        <div className="rental-specs">
          <span><CalendarCheck2 size={16} />{car.year}</span>
          <span><UsersRound size={16} />{car.seats}</span>
          <span>{car.model}</span>
        </div>
        <Link className="detail-link" href={`/arac-kiralama/${car.id}`}>Araç detaylarını incele <ArrowRight size={16} /></Link>
        {isAvailable ? (
          <>
            <p className="rental-note">Aradığınızda <strong>{car.id}</strong> araç kodunu söylemeniz yeterli.</p>
            <div className="rental-actions">
              <a className="button gold" href={`tel:${phoneNumber}`}><Phone size={17} /> Bu araç için ara</a>
              <a className="button secondary-phone-button" href={`tel:${vehiclePhoneNumber}`}><Phone size={17} /> 0505 197 70 70</a>
              <a className="button whatsapp-button" href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noreferrer">
                <MessageCircle size={17} /> WhatsApp
              </a>
            </div>
          </>
        ) : (
          <p className="rental-unavailable"><Clock3 size={17} />{car.availableFrom}</p>
        )}
      </div>
    </article>
  );
}

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kiralık Araçlar", description: "Karaman'da güncel ve müsait kiralık araç seçeneklerini inceleyin.", alternates: { canonical: "/arac-kiralama" } };

export default async function CarRentalPage() {
  const allCars: RentalCar[] = await getFirebaseRentalCars();
  const availableCars = allCars.filter((car) => car.status === "available");
  const rentedCars = allCars.filter((car) => car.status === "rented");

  return (
    <>
      <Header />
      <main className="rental-page">
        <section className="rental-hero">
          <div className="rental-hero-overlay" />
          <div className="shell rental-hero-content">
            <p className="eyebrow">SERVET RENT A CAR · KARAMAN</p>
            <h1>Aracınız hazır,<br />yolculuğunuz başlasın.</h1>
            <p>Şu an müsait araçlarımızı görün, araç koduyla hemen arayın veya hazır WhatsApp mesajıyla bize ulaşın.</p>
            <a href="#musait-araclar" className="button gold">Boştaki araçları gör <ArrowRight size={18} /></a>
          </div>
        </section>

        <section className="availability-summary">
          <div className="shell">
            <div><Check size={20} /><strong>{availableCars.length} araç</strong><span>şu an kiralamaya hazır</span></div>
            <p>Müsaitlik bilgileri güncel filoya göre gösterilir. Kesin rezervasyon için bizi arayın.</p>
            <div className="rental-phone-list"><a href={`tel:${phoneNumber}`}><Phone size={17} /> 0535 426 62 35</a><a href={`tel:${vehiclePhoneNumber}`}><Phone size={17} /> 0505 197 70 70</a></div>
          </div>
        </section>

        <section id="musait-araclar" className="rental-inventory shell">
          <div className="section-title-row rental-title-row">
            <div>
              <p className="eyebrow dark">HEMEN KİRALAYABİLİRSİNİZ</p>
              <h2>Şu an boştaki araçlarımız</h2>
            </div>
            <p>Beğendiğiniz aracın kodunu söyleyin, işlemleri hızlıca başlatalım.</p>
          </div>
          <div className="rental-grid">
            {availableCars.map((car) => <VehicleCard car={car} key={car.id} />)}
          </div>
        </section>

        {rentedCars.length > 0 && (
          <section className="rented-section">
            <div className="shell">
              <div className="rented-heading">
                <div>
                  <p className="eyebrow dark">FİLODAKİ DİĞER ARAÇLAR</p>
                  <h2>Şu an kirada olanlar</h2>
                </div>
                <p>Bu araçlar yeniden müsait olduğunda bilgi almak için bizi arayabilirsiniz.</p>
              </div>
              <div className="rental-grid rented-grid">
                {rentedCars.map((car) => <VehicleCard car={car} key={car.id} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
