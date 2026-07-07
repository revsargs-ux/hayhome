"use client";
import { useState, useEffect, useMemo } from "react";
import { FileText, Printer, Globe, Search } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

type Host = {
  id: string;
  name: string;
  familyName: string;
  patronymic?: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  status: string;
  verified: boolean;
  pricePerNight: number;
  createdAt: string;
};

const T: Record<string, Record<string, string>> = {
  title: { ru:"Договоры партнёров", en:"Partner Contracts", hy:"Գործընկերների պայտագրություններ", fr:"Contrats des partenaires", de:"Partnerverträge", es:"Contratos de socios", it:"Contratti dei partner", ar:"عقود الشركاء", zh:"合作伙伴合同", fa:"قراردادهای شرکا" },
  name: { ru:"Партнёр", en:"Partner", hy:"Գործընկեր", fr:"Partenaire", de:"Partner", es:"Socio", it:"Partner", ar:"الشريك", zh:"合作伙伴", fa:"شریک" },
  city: { ru:"Город", en:"City", hy:"Քաղաք", fr:"Ville", de:"Stadt", es:"Ciudad", it:"Città", ar:"المدينة", zh:"城市", fa:"شهر" },
  price: { ru:"Цена/ночь", en:"Price/night", hy:"Գին/գիշեր", fr:"Prix/nuit", de:"Preis/Nacht", es:"Precio/noche", it:"Prezzo/notte", ar:"السعر/ليلة", zh:"价格/晚", fa:"قیمت/شب" },
  status: { ru:"Статус", en:"Status", hy:"Կարգավորություն", fr:"Statut", de:"Status", es:"Estado", it:"Stato", ar:"الحالة", zh:"状态", fa:"وضعیت" },
  print: { ru:"Печать", en:"Print", hy:"Տպել", fr:"Imprimer", de:"Drucken", es:"Imprimir", it:"Stampa", ar:"طباعة", zh:"打印", fa:"چاپ" },
  verified: { ru:"Проверен", en:"Verified", hy:"Հաստատված", fr:"Vérifié", de:"Verifiziert", es:"Verificado", it:"Verificato", ar:"مُتحقق", zh:"已验证", fa:"تایید شده" },
  pending: { ru:"Ожидает", en:"Pending", hy:"Սպասում", fr:"En attente", de:"Ausstehend", es:"Pendiente", it:"In attesa", ar:"قيد الانتظار", zh:"待审核", fa:"در انتظار" },
  loading: { ru:"Загрузка...", en:"Loading...", hy:"Բեռնում...", fr:"Chargement...", de:"Laden...", es:"Cargando...", it:"Caricamento...", ar:"جاري التحميل...", zh:"加载中...", fa:"در حال بارگذاری..." },
  noHosts: { ru:"Нет партнёров с заполненными данными", en:"No partners with complete data", hy:"Ամբողջական տվյալներով գործընկերներ չկան", fr:"Aucun partenaire avec des données complètes", de:"Keine Partner mit vollständigen Daten", es:"No hay socios con datos completos", it:"Nessun partner con dati completi", ar:"لا يوجد شركاء ببيانات مكتملة", zh:"没有数据完整的合作伙伴", fa:"شریکی با داده‌های کامل وجود ندارد" },
  back: { ru:"← Назад", en:"← Back", hy:"← Վերադարձ", fr:"← Retour", de:"← Zurück", es:"← Volver", it:"← Indietro", ar:"← رجوع", zh:"← 返回", fa:"← بازگشت" },
  search: { ru:"Поиск по имени, городу...", en:"Search by name, city...", hy:"Որոնել անունով, քաղաքով...", fr:"Rechercher par nom, ville...", de:"Nach Name, Stadt suchen...", es:"Buscar por nombre, ciudad...", it:"Cerca per nome, città...", ar:"البحث بالاسم، المدينة...", zh:"按姓名、城市搜索...", fa:"جستجو بر اساس نام، شهر..." },
  allStatus: { ru:"Все статусы", en:"All statuses", hy:"Բոլորը", fr:"Tous les statuts", de:"Alle Status", es:"Todos los estados", it:"Tutti gli stati", ar:"جميع الحالات", zh:"所有状态", fa:"همه وضعیت‌ها" },
  allCities: { ru:"Все города", en:"All cities", hy:"Բոլոր քաղաքները", fr:"Toutes les villes", de:"Alle Städte", es:"Todas las ciudades", it:"Tutte le città", ar:"جميع المدن", zh:"所有城市", fa:"همه شهرها" },
  noResults: { ru:"Ничего не найдено", en:"No results found", hy:"Անդրազատցված չկան", fr:"Aucun résultat", de:"Keine Ergebnisse", es:"Sin resultados", it:"Nessun risultato", ar:"لا توجد نتائج", zh:"未找到结果", fa:"نتیجه‌ای یافت نشد" },
};

function ct(key: string, lang: string) { return T[key]?.[lang] || T[key]?.en || key; }

const LANGS = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "hy", label: "ՀԱ" },
  { code: "fr", label: "FR" },
  { code: "de", label: "DE" },
  { code: "es", label: "ES" },
  { code: "it", label: "IT" },
  { code: "ar", label: "AR" },
  { code: "zh", label: "ZH" },
  { code: "fa", label: "FA" },
];

export default function AdminContractsPage() {
  const { lang } = useLang();
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/hosts?all=true")
      .then(r => r.ok ? r.json() : [])
      .then((data: Host[]) => {
        setHosts(data.filter(h => h.status === "active" || h.status === "pending"));
      })
      .catch(() => setHosts([]))
      .finally(() => setLoading(false));
  }, []);

  const cities = useMemo(() =>
    [...new Set(hosts.map(h => h.city))].sort(),
    [hosts]
  );

  const filtered = useMemo(() => {
    return hosts.filter(h => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        h.name.toLowerCase().includes(q) ||
        h.familyName.toLowerCase().includes(q) ||
        (h.patronymic || "").toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.region.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" ||
        (statusFilter === "verified" && h.verified) ||
        (statusFilter === "pending" && !h.verified);
      const matchCity = cityFilter === "all" || h.city === cityFilter;
      return matchSearch && matchStatus && matchCity;
    });
  }, [hosts, search, statusFilter, cityFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <a href="/admin" className="text-gray-500 hover:text-gray-700">{ct("back", lang)}</a>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-red-600" size={28} />
        <h1 className="text-2xl font-bold">{ct("title", lang)}</h1>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={ct("search", lang)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 bg-white"
        >
          <option value="all">{ct("allStatus", lang)}</option>
          <option value="verified">{ct("verified", lang)}</option>
          <option value="pending">{ct("pending", lang)}</option>
        </select>
        {cities.length > 1 && (
          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 bg-white"
          >
            <option value="all">{ct("allCities", lang)}</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">{ct("loading", lang)}</p>
      ) : hosts.length === 0 ? (
        <p className="text-gray-500">{ct("noHosts", lang)}</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{ct("noResults", lang)}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3">{ct("name", lang)}</th>
                <th className="text-left px-4 py-3">{ct("city", lang)}</th>
                <th className="text-left px-4 py-3">{ct("price", lang)}</th>
                <th className="text-left px-4 py-3">{ct("status", lang)}</th>
                <th className="text-center px-4 py-3">PDF</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(host => (
                <tr key={host.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{host.familyName}</div>
                    <div className="text-xs text-gray-500">{host.name}{host.patronymic ? ` ${host.patronymic}` : ""}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{host.city}, {host.region}</td>
                  <td className="px-4 py-3 text-gray-600">${host.pricePerNight}</td>
                  <td className="px-4 py-3">
                    {host.verified ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        ✓ {ct("verified", lang)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                        ⏳ {ct("pending", lang)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {LANGS.map(l => (
                        <a
                          key={l.code}
                          href={`/contract/print?hostId=${host.id}&lang=${l.code}`}
                          target="_blank"
                          className="inline-flex items-center gap-0.5 text-xs bg-red-50 text-red-700 hover:bg-red-100 px-1.5 py-0.5 rounded transition-colors"
                          title={l.label}
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length !== hosts.length && (
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td colSpan={5} className="px-4 py-2 text-sm text-gray-500 text-center">
                    {filtered.length} / {hosts.length}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
