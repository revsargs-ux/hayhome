"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Target, MapPin, DollarSign, ChevronRight, Star, Gift, Shield } from "lucide-react";

function PartnerContent() {
  const { tr, lang } = useLang();
  const { user } = useAuth();
  const [tab, setTab] = useState<"ambassador" | "hunter">("ambassador");

  const T: Record<string, Record<string, string>> = {
    title: { ru: "Станьте партнёром HayHome", en: "Become a HayHome Partner", hy: "Դարձեք HayHome գործընկեր", fr: "Devenez partenaire HayHome", de: "HayHome-Partner werden", es: "Hágase socio de HayHome" },
    subtitle: { ru: "Зарабатывайте, помогая людям находить настоящее армянское гостеприимство", en: "Earn by helping people find authentic Armenian hospitality", hy: "Աշխատեք օգնելով մարդկանց գտնել իրական հայկական գրավիչ", fr: "Gagnez en aidant à trouver l'hospitalité arménienne", de: "Verdienen Sie, indem Sie echte armenische Gastfreundschaft vermitteln", es: "Gane ayudando a encontrar hospitalidad armenia auténtica" },
    how: { ru: "Как это работает", en: "How it works", hy: "Ինչպես է այն աշխատում", fr: "Comment ça marche", de: "So funktioniert's", es: "Cómo funciona" },
    step1Title: { ru: "Зарегистрируйтесь", en: "Sign Up", hy: "Գրանցվել", fr: "Inscrivez-vous", de: "Registrieren", es: "Regístrese" },
    step1Desc: { ru: "Выберите роль партнёра и получите уникальный код", en: "Choose your partner role and get a unique code", hy: "Ընտրեք գործընկերի դեր և ստացեք յուրահատուկ կոդ", fr: "Choisissez votre rôle et obtenez un code unique", de: "Wählen Sie eine Rolle und erhalten Sie einen Code", es: "Elija su rol y obtenga un código" },
    step2Title: { ru: "Привлекайте людей", en: "Invite People", hy: "Հրավիրել մարդկանց", fr: "Invitez des gens", de: "Gewinnen Sie Leute", es: "Invite a la gente" },
    step2Desc: { ru: "Делитесь ссылкой с друзьями, туристами, знакомыми", en: "Share your link with friends, tourists, acquaintances", hy: "Կիսվեք հղումով ընկերների, զբոսաշրջիկների հետ", fr: "Partagez votre lien", de: "Teilen Sie Ihren Link", es: "Comparta su enlace" },
    step3Title: { ru: "Получайте доход", en: "Earn Income", hy: "Ստանալ եկամուտ", fr: "Gagnez de l'argent", de: "Verdienen Sie Geld", es: "Gane dinero" },
    step3Desc: { ru: "5% от каждого бронирования — 2 года. Минимальный вывод $30", en: "5% from every booking — 2 years. Min payout $30", hy: "5% ամեն ամրագրումից — 2 տարի. Նվազագույն տրամադրություն $30", fr: "5% par réservation — 2 ans. Min $30", de: "5% pro Buchung — 2 Jahre. Min $30", es: "5% por reserva — 2 años. Mín $30" },
    ambassadorTitle: { ru: "Амбассадор", en: "Ambassador", hy: "Ամբասադոր", fr: "Ambassadeur", de: "Botschafter", es: "Embajador" },
    ambassadorDesc: { ru: "Привлекайте туристов и гостей. Они регистрируются по вашей ссылке — вы получаете 5% от каждого их бронирования в течение 2 лет.", en: "Invite tourists and guests. They register via your link — you get 5% from each booking for 2 years.", hy: "Հրավիրեք զբոսաշրջիկների. Նրանք գրանցվում են ձեր հղումով — դուք ստանում եք 5% ամեն ամրագրումից 2 տարի:", fr: "Invitez des touristes. Ils s'inscrivent via votre lien — 5% par réservation pendant 2 ans.", de: "Laden Sie Touristen ein. Sie registrieren sich über Ihren Link — 5% pro Buchung für 2 Jahre.", es: "Invite turistas. Se registran por su enlace — 5% de cada reserva por 2 años." },
    scoutTitle: { ru: "Агент", en: "Agent", hy: "Սկաուտ", fr: "Agent", de: "Agent", es: "Agent" },
    scoutDesc: { ru: "Находите семьи и мастеров, помогаете им зарегистрироваться на платформе. 5% от бронирований — 2 года.", en: "Find families and artisans, help them register. 5% from bookings — 2 years.", hy: "Գտեք ընտանիքներ և վարպետներ, օգնեք նրանց գրանցվել։ 5% ամրագրումներից — 2 տարի.", fr: "Trouvez des familles et artisans. 5% des réservations — 2 ans.", de: "Finden Sie Familien und Handwerker. 5% von Buchungen — 2 Jahre.", es: "Encuentre familias y artesanos. 5% de reservas — 2 años." },
    cta: { ru: "Стать партнёром", en: "Become a Partner", hy: "Դարձել գործընկեր", fr: "Devenir partenaire", de: "Partner werden", es: "Hacerse socio" },
    faq1q: { ru: "Когда я получу первую выплату?", en: "When do I get my first payout?" },
    faq1a: { ru: "После первого бронирования от вашего реферала. Выплаты раз в месяц при накоплении от $30.", en: "After the first booking by your referral. Payouts monthly from $30." },
    faq2q: { ru: "Как долго длится программа?", en: "How long does the program last?" },
    faq2a: { ru: "2 года с момента первого бронирования реферала. После — комиссия прекращается.", en: "2 years from the referral's first booking. After that, commission stops." },
    faq3q: { ru: "Как я получаю деньги?", en: "How do I receive money?" },
    faq3a: { ru: "Через Idram, банковский перевод или криптовалюту. Вывод раз в месяц.", en: "Via Idram, bank transfer, or crypto. Monthly payouts." },
  };

  const t = (key: string) => (T[key]?.[lang] || T[key]?.en || key) as string;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20 text-center relative z-10">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">{t("title")}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">{t("subtitle")}</p>
          <Link href="/partner/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white hover:opacity-90 transition shadow-lg text-lg"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
            {t("cta")} <ChevronRight size={20} />
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* How it works */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t("how")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Users size={28} />, title: t("step1Title"), desc: t("step1Desc"), num: "01" },
              { icon: <Target size={28} />, title: t("step2Title"), desc: t("step2Desc"), num: "02" },
              { icon: <DollarSign size={28} />, title: t("step3Title"), desc: t("step3Desc"), num: "03" },
            ].map((s) => (
              <div key={s.num} className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <div className="text-4xl font-bold text-gray-100 mb-3">{s.num}</div>
                <div className="text-red-600 mb-3 flex justify-center">{s.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            {lang === "ru" ? "Что делает партнёр" : "What partners do"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
              <Users size={28} className="text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm mb-1">{lang === "ru" ? "Привлекает туристов" : "Invites tourists"}</h3>
              <p className="text-gray-500 text-xs">{lang === "ru" ? "Делится ссылкой с туристами и диаспорой" : "Shares link with tourists & diaspora"}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
              <MapPin size={28} className="text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm mb-1">{lang === "ru" ? "Находит семьи" : "Finds families"}</h3>
              <p className="text-gray-500 text-xs">{lang === "ru" ? "Помогает семьям и мастерам зарегистрироваться" : "Helps families & artisans register"}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
              <DollarSign size={28} className="text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm mb-1">5% × 2 {lang === "ru" ? "года" : "years"}</h3>
              <p className="text-gray-500 text-xs">{lang === "ru" ? "С первой сделки, вывод от $30/мес" : "From first deal, min $30/mo"}</p>
            </div>
          </div>
          </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">FAQ</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { q: t("faq1q"), a: t("faq1a") },
              { q: t("faq2q"), a: t("faq2a") },
              { q: t("faq3q"), a: t("faq3a") },
            ].map((f, i) => (
              <details key={i} className="bg-white rounded-xl shadow-sm">
                <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer">{f.q}</summary>
                <div className="px-6 pb-4 text-gray-600 text-sm">{f.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8">
          <Link href="/partner/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-lg font-bold text-white shadow-lg hover:opacity-90 transition"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
            {t("cta")} <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PartnerPage() {
  return (
    <Suspense fallback={null}>
      <PartnerContent />
    </Suspense>
  );
}
