import { ArrowRight, CalendarCheck2, Check, Clock3, MessageCircle, Phone, UsersRound } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Footer, Header, WhatsApp } from "../components";
import { getFirebaseRentalCars } from "@/lib/firebase-data";
import { getSiteContent, type SiteContent } from "@/lib/site-content";

const phoneNumber = "+905354266235";
const vehiclePhoneNumber = "+905051977070";
const whatsappNumber = "905354266235";

type RentalCar = Awaited<ReturnType<typeof getFirebaseRentalCars>>[number];

function VehicleCard({ car, content }: { car: RentalCar; content: SiteContent }) {
  const isAvailable = car.status === "available";
  const message = encodeURIComponent(
    `Merhaba, ${car.name} aracını kiralamak istiyorum. Müsaitlik ve fiyat bilgisi alabilir miyim?`,
  );

  return (
    <article className={`rental-card ${isAvailable ? "is-available" : "is-rented"}`}>
      <div className="rental-card-image" role="img" aria-label={`${car.name} araç fotoğrafı`} style={{ backgroundImage: `url(${car.image})` }}>
        <span className={`availability-badge ${isAvailable ? "available" : "rented"}`}>
          {isAvailable ? <Check size={15} /> : <Clock3 size={15} />}
          {isAvailable ? "ŞU AN BOŞTA" : "ŞU AN KİRADA"}
        </span>
      </div>
      <div className="rental-card-body">
        <p className="rental-kicker">Servet Rent A Car</p>
        <h2>{car.name}</h2>
        <div className="rental-specs">
          <span><CalendarCheck2 size={16} />{car.year}</span>
          <span><UsersRound size={16} />{car.seats}</span>
          <span>{car.model}</span>
        </div>
        <Link className="detail-link" href={`/arac-kiralama/${car.id}`}>{content.rentalDetailLink} <ArrowRight size={16} /></Link>
        {isAvailable ? (
          <>
            <p className="rental-note">{content.rentalCardNote}</p>
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
  const [allCars, content]: [RentalCar[], SiteContent] = await Promise.all([getFirebaseRentalCars(), getSiteContent()]);
  const availableCars = allCars.filter((car) => car.status === "available");
  const rentedCars = allCars.filter((car) => car.status === "rented");

  return (
    <>
      <Header content={content} />
      <main className="rental-page">
        <section className="rental-hero">
          <div className="rental-hero-overlay" />
          <div className="shell rental-hero-content">
            <p className="eyebrow">{content.rentalHeroEyebrow}</p>
            <h1 className="editable-lines">{content.rentalHeroTitle}</h1>
            <p>{content.rentalHeroText}</p>
            <a href="#musait-araclar" className="button gold">{content.rentalHeroButton} <ArrowRight size={18} /></a>
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
              <p className="eyebrow dark">{content.rentalAvailableEyebrow}</p>
              <h2>{content.rentalAvailableTitle}</h2>
            </div>
            <p>{content.rentalAvailableText}</p>
          </div>
          <div className="rental-grid">
            {availableCars.map((car) => <VehicleCard car={car} content={content} key={car.id} />)}
          </div>
        </section>

        {rentedCars.length > 0 && (
          <section className="rented-section">
            <div className="shell">
              <div className="rented-heading">
                <div>
                  <p className="eyebrow dark">{content.rentalRentedEyebrow}</p>
                  <h2>{content.rentalRentedTitle}</h2>
                </div>
                <p>{content.rentalRentedText}</p>
              </div>
              <div className="rental-grid rented-grid">
                {rentedCars.map((car) => <VehicleCard car={car} content={content} key={car.id} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer content={content} />
      <WhatsApp />
    </>
  );
}
