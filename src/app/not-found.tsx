import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
export default function NotFound(){return <main className="not-found-page"><div><span>404</span><h1>Aradığınız sayfa bulunamadı</h1><p>Bağlantı değişmiş veya içerik yayından kaldırılmış olabilir.</p><nav><Link className="button gold" href="/"><Home/>Ana sayfaya dön</Link><Link className="button outline" href="/ilanlar"><ArrowLeft/>İlanları incele</Link></nav></div></main>}
