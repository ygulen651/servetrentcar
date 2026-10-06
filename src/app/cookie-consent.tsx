"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";

type Consent = "accepted" | "rejected" | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent | undefined>(undefined);
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setConsent(localStorage.getItem("cookie-consent") as Consent));
    return () => cancelAnimationFrame(frame);
  }, []);
  function choose(value: Exclude<Consent, null>) { localStorage.setItem("cookie-consent", value); setConsent(value); }

  return <>
    {consent === "accepted" && measurementId && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}</Script>
    </>}
    {consent === null && <aside className="cookie-banner" aria-label="Çerez tercihi" aria-live="polite"><div><strong>Çerez tercihiniz</strong><p>Site deneyimini ve anonim ziyaret istatistiklerini geliştirmek için çerez kullanıyoruz. Ayrıntılar için <Link href="/gizlilik">Gizlilik Politikası</Link> sayfasını inceleyebilirsiniz.</p></div><div className="cookie-actions"><button onClick={() => choose("rejected")}>Reddet</button><button onClick={() => choose("accepted")}>Kabul et</button></div></aside>}
  </>;
}
