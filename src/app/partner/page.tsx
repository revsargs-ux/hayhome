"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import getUI from "@/lib/ui";
import { Users, Target, MapPin, DollarSign, ChevronRight, Star, Gift, Shield } from "lucide-react";

function PartnerContent() {
  const { tr, lang } = useLang();
  const { user } = useAuth();
  const u = getUI(lang);
  const [tab, setTab] = useState<"ambassador" | "hunter">("ambassador");

  const T: Record<string, Record<string, string>> = {
    title: { ru: "Станьте партнёром HayHome", en: "Become a HayHome Partner", hy: "Դարձեք HayHome գործընկեր", fr: "Devenez partenaire HayHome", de: "HayHome-Partner werden", es: "Hágase socio de HayHome" },
    subtitle: { ru: "Зарабатывайте, помогая людям найти настоящее армянское гостеприимство", en: "Earn by helping people find authentic Armenian homestay", hy: "Աշխատեք օգնելով մարդկանց գտնել իրական հայկական գրավիչ", fr: "Gagnez en aidant à trouver des séjours chez des familles arméniennes", de: "Verdienen Sie, indem Sie echte armenische Gastfreundschaft vermitteln", es: "Gana ayudando a encontrar estancias con familias armenias" },
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
    faq1q: { ru: "Когда я получу первую выплату?", en: "When do I get my first payout?", hy: "Երբ կստանամ առաջին վճարումը?", fr: "Quand recevrai-ji mon premier paiement?", de: "Wann erhalte ich die erste Auszahlung?", es: "¿Cuándo recibiré mi primer pago?", it: "Quando ricevo il primo pagamento?", ar: "متى أحصل على أول دفعة؟", zh: "我什么时候能收到第一笔付款？", fa: "کی اولین پرداخت را دریافت کنم؟" },
    faq1a: { ru: "После первого бронирования от вашего реферала. Выплаты раз в месяц при накоплении от $30.", en: "After the first booking by your referral. Payouts monthly from $30.", hy: "Ձեր referral-ի առաջին ամրագրումից հետո: Ամսական վճարումներ $30-ից:", fr: "Après la première réservation de votre filleul. Paiements mensuels à partir de 30 $.", de: "Nach der ersten Buchung Ihres Geworbenen. Monatliche Auszahlungen ab 30 $.", es: "Después de la primera reserva de tu referido. Pagos mensuales desde $30.", it: "Dopo la prima prenotazione del tuo referral. Pagamenti mensili da $30.", ar: "بعد أول حجز من المُحال إليه. مدفوعات شهرية من 30 $.", zh: "在您的推荐人首次预订后。每月付款从30美元起。", fa: "پس از اولین رزرو معرف شما. پرداخت‌های ماهانه از 30 دلار." },
    faq2q: { ru: "Как долго длится программа?", en: "How long does the program last?", hy: "Որքա՞ն է տևում ծրագիրը:", fr: "Combien de temps dure le programme?", de: "Wie lange dauert das Programm?", es: "¿Cuánto dura el programa?", it: "Quanto dura il programma?", ar: "كم مدة البرنامج؟", zh: "项目持续多久？", fa: "این برنامه چقدر طول می‌کشد؟" },
    faq2a: { ru: "2 года с момента первого бронирования реферала. После — комиссия прекращается.", en: "2 years from the referral's first booking. After that, commission stops.", hy: "2 տարի referral-ի առաջին ամրագրումից: Դրանից հետո — պրովիզիան դադարում է:", fr: "2 ans après la première réservation du filleul. Ensuite, la commission s'arrête.", de: "2 Jahre ab der ersten Buchung des Geworbenen. Danach endet die Provision.", es: "2 años desde la primera reserva del referido. Después, la comisión se detiene.", it: "2 anni dalla prima prenotazione del referral. Poi, la commissione si ferma.", ar: "سنتان من أول حجز للمُحال إليه. بعد ذلك، تتوقف العمولة.", zh: "从推荐人首次预订起2年。之后佣金停止。", fa: "۲ سال از اولین رزرو معرف. پس از آن، کمیسیون متوقف می‌شود." },
    faq3q: { ru: "Как я получаю деньги?", en: "How do I receive money?", hy: "Ինչպե՞ս եմ ստանում գումարը:", fr: "Comment reçois-je l'argent?", de: "Wie erhalte ich Geld?", es: "¿Cómo recibo el dinero?", it: "Come ricevo i soldi?", ar: "كيف أستلم الأموال؟", zh: "我如何收到钱？", fa: "چگونه پول دریافت می‌کنم؟" },
    faq3a: { ru: "Через Idram, банковский перевод или криптовалюту. Вывод раз в месяц.", en: "Via Idram, bank transfer, or crypto. Monthly payouts.", hy: "Idram-ով, բանկային փոխանցումով կամ կրիպտոարժույթով: Ամսական վճարումներ:", fr: "Via Idram, virement bancaire ou crypto. Paiements mensuels.", de: "Über Idram, Banküberweisung oder Krypto. Monatliche Auszahlungen.", es: "Vía Idram, transferencia bancaria o cripto. Pagos mensuales.", it: "Tramite Idram, bonifico o crypto. Pagamenti mensili.", ar: "عبر Idram أو تحويل بنكي أو كريبتو. مدفوعات شهرية.", zh: "通过Idram、银行转账或加密货币。每月付款。", fa: "از طریق Idram، انتقال بانکی یا کریپتو. پرداخت‌های ماهانه." },
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
            {u.whatPartnersDo}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
              <Users size={28} className="text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm mb-1">{u.invitesTourists}</h3>
              <p className="text-gray-500 text-xs">{u.sharesLinkDiaspora}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
              <MapPin size={28} className="text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm mb-1">{u.findsFamilies}</h3>
              <p className="text-gray-500 text-xs">{u.helpsRegister}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
              <DollarSign size={28} className="text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm mb-1">5% × 2 {u.yearsLabel}</h3>
              <p className="text-gray-500 text-xs">{u.fromFirstDeal}</p>
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
