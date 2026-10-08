import { Search } from "lucide-react";

export function ClassicDetailSidebar({ vehicle = false }: { vehicle?: boolean }) {
  return <aside className="v10-filter v10-detail-filter"><h2>{vehicle ? "Araç Arama Kriterleri" : "Arama Kriterleri"}</h2><div className="v10-filter-body">
    <label>{vehicle ? "Araç Kodu" : "İlan Kodu"}<input/></label>
    <label>{vehicle ? "Araç Durumu" : "Emlak Türü"}<select defaultValue=""><option value="">Seçiniz</option>{vehicle ? <><option>Şu an boşta</option><option>Şu an kirada</option></> : <><option>Konut</option><option>Arsa</option><option>İş Yeri</option></>}</select></label>
    <label>{vehicle ? "Model Yılı" : "İlçe Seçin"}<select defaultValue=""><option value="">Seçiniz</option></select></label>
    <label>{vehicle ? "Vites Türü" : "Semt Seçin"}<select defaultValue=""><option value="">Seçiniz</option></select></label>
    {!vehicle && <><div className="v10-filter-pair"><label>Düşük Fiyat<input inputMode="numeric"/></label><label>Yüksek Fiyat<input inputMode="numeric"/></label></div><div className="v10-filter-pair"><label>Metrekare Aralığı<input inputMode="numeric"/></label><label><span aria-hidden="true">&nbsp;</span><input inputMode="numeric"/></label></div></>}
    <label>{vehicle ? "Kiralama Süresi" : "Oda Sayısı"}<select defaultValue=""><option value="">Seçiniz</option>{vehicle ? <><option>Günlük</option><option>Haftalık</option><option>Aylık</option></> : <><option>2+1</option><option>3+1</option><option>4+1</option></>}</select></label>
    <div className="v10-filter-action"><Search/><button type="button">ARAMA</button></div><p>{vehicle ? "İhtiyacınıza uygun aracı seçmek için kriterleri belirleyebilirsiniz." : "Tüm arama kriterlerinizi belirleyebilir, hayalinizdeki konuta hızla ulaşabilirsiniz."}</p>
  </div></aside>;
}
