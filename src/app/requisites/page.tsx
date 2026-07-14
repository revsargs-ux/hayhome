"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

type Lang = "ru" | "en" | "hy" | "fr" | "de" | "es" | "it" | "ar" | "zh" | "fa";
type Localized = Record<Lang, string>;

const CONTENT: Record<string, Localized> = {
  backLink: {
    ru: "HayHome",
    en: "HayHome",
    hy: "HayHome",
    fr: "HayHome",
    de: "HayHome",
    es: "HayHome",
    it: "HayHome",
    ar: "HayHome",
    zh: "HayHome",
    fa: "HayHome",
  },
  headerTitle: {
    ru: "Реквизиты",
    en: "Company Details",
    hy: "Ռեկվիզիտներ",
    fr: "Coordonnées de l'entreprise",
    de: "Unternehmensangaben",
    es: "Datos de la empresa",
    it: "Dati aziendali",
    ar: "البيانات الشركة",
    zh: "公司资料",
    fa: "اطلاعات شرکت",
  },
  headerSubtitle: {
    ru: "HayHome · hay-home.com",
    en: "HayHome · hay-home.com",
    hy: "HayHome · hay-home.com",
    fr: "HayHome · hay-home.com",
    de: "HayHome · hay-home.com",
    es: "HayHome · hay-home.com",
    it: "HayHome · hay-home.com",
    ar: "HayHome · hay-home.com",
    zh: "HayHome · hay-home.com",
    fa: "HayHome · hay-home.com",
  },

  // Entity section
  entityTitle: {
    ru: "Реквизиты индивидуального предпринимателя",
    en: "Sole Proprietor Details",
    hy: "Անհատ ձեռնարկատիրոջ ռեկվիզիտներ",
    fr: "Coordonnées de l'entrepreneur individuel",
    de: "Angaben des Einzelunternehmers",
    es: "Datos del empresario individual",
    it: "Dati dell'imprenditore individuale",
    ar: "بيانات رجل الأعمال الفردي",
    zh: "个体经营者资料",
    fa: "اطلاعات کسب‌وکار انحصاری فردی",
  },
  entityName: {
    ru: "ИП Саргсян Ревик Сергеевич (ՍԱՐԳՍՅԱՆ ՐԵՎԻՔ ՍԵՐԳԵԵՎԻՉ)",
    en: "IE Sargsyan Revik Sergeevich (ՍԱՐԳՍՅԱՆ ՐԵՎԻՔ ՍԵՐԳԵԵՎԻՉ)",
    hy: "ԱՁ Սարգսյան Րեվիք Սերգեևիչ (ՍԱՐՂՍՅԱՆ ՐԵՎԻՔ ՍԵՐԳԵԵՎԻՉ)",
    fr: "EI Sargsyan Revik Sergeevich (ՍԱՐԳՍՅԱՆ ՐԵՎԻՔ ՍԵՐԳԵԵՎԻՉ)",
    de: "IE Sargsyan Revik Sergeevich (ՍԱՐԳՍՅԱՆ ՐԵՎԻՔ ՍԵՐԳԵԵՎԻՉ)",
    es: "EI Sargsyan Revik Sergeevich (ՍԱՐԳՍՅԱՆ ՐԵՎԻՔ ՍԵՐԳԵԵՎԻՉ)",
    it: "II Sargsyan Revik Sergeevich (ՍԱՐԳՍՅԱՆ ՐԵՎԻՔ ՍԵՐԳԵԵՎԻՉ)",
    ar: "م.ف سارغسيان ريفيك سيرغييفيتش (ՍԱՐԳՍՅԱՆ ՐԵՎԻՔ ՍԵՐԳԵԵՎԻՉ)",
    zh: "个体企业 萨尔基扬·雷维克·谢尔盖耶维奇 (ՍԱՐԳՍՅԱՆ ՐԵՎԻՔ ՍԵՐԳԵԵՎԻՉ)",
    fa: "ک.ف سارگسیان رویک سرگیویچ (ՍԱՐԳՍՅԱՆ ՐԵՎԻՔ ՍԵՐԳԵԵՎԻՉ)",
  },
  regNumberLabel: {
    ru: "Регистрационный номер:",
    en: "Registration number:",
    hy: "Գրանցման համար:",
    fr: "Numéro d'enregistrement :",
    de: "Registrierungsnummer:",
    es: "Número de registro:",
    it: "Numero di registrazione:",
    ar: "رقم التسجيل:",
    zh: "注册号：",
    fa: "شماره ثبت:",
  },
  taxIdLabel: {
    ru: "ՀՎՀՀ / УНП:",
    en: "Tax ID / VAT:",
    hy: "ՀՎՀՀ / Հաշվառման համար:",
    fr: "N° fiscal / TVA :",
    de: "Steuernr. / USt-IdNr.:",
    es: "NIF / IVA:",
    it: "Cod. fiscale / P.IVA:",
    ar: "الرقم الضريبي / ض.ق.م:",
    zh: "税务编号 / 增值税号：",
    fa: "شناسه مالیاتی / مالیات بر ارزش افزوده:",
  },
  regNumber2Label: {
    ru: "Рег. номер:",
    en: "Reg. number:",
    hy: "Գրանց. համար:",
    fr: "N° d'immatr. :",
    de: "Reg.-Nr.:",
    es: "N° reg.:",
    it: "N° reg.:",
    ar: "رقم السجل:",
    zh: "注册号：",
    fa: "شماره ثبت:",
  },
  activityCodeLabel: {
    ru: "Код деятельности:",
    en: "Activity code:",
    hy: "Գործունեության կոդ:",
    fr: "Code d'activité :",
    de: "Tätigkeitscode:",
    es: "Código de actividad:",
    it: "Codice attività:",
    ar: "رمز النشاط:",
    zh: "活动代码：",
    fa: "کد فعالیت:",
  },
  regDateLabel: {
    ru: "Дата регистрации:",
    en: "Date of registration:",
    hy: "Գրանցման ամսաթիվ:",
    fr: "Date d'enregistrement :",
    de: "Registrierungsdatum:",
    es: "Fecha de registro:",
    it: "Data di registrazione:",
    ar: "تاريخ التسجيل:",
    zh: "注册日期：",
    fa: "تاریخ ثبت:",
  },

  // Bank section
  bankTitle: {
    ru: "Банковские реквизиты",
    en: "Bank Details",
    hy: "Բանկային ռեկվիզիտներ",
    fr: "Coordonnées bancaires",
    de: "Bankverbindung",
    es: "Datos bancarios",
    it: "Coordinate bancarie",
    ar: "البيانات المصرفية",
    zh: "银行信息",
    fa: "اطلاعات بانکی",
  },
  accountLabel: {
    ru: "Расчётный счёт",
    en: "Current account",
    hy: "Հաշվարկային հաշիվ",
    fr: "Compte courant",
    de: "Geschäftskonto",
    es: "Cuenta corriente",
    it: "Conto corrente",
    ar: "الحساب الجاري",
    zh: "往来账户",
    fa: "حساب جاری",
  },
  accountPlaceholder: {
    ru: "(указать после открытия счёта)",
    en: "(to be specified after account opening)",
    hy: "(նշել հաշիվը բացելուց հետո)",
    fr: "(à indiquer après l'ouverture du compte)",
    de: "(nach Kontoeröffnung anzugeben)",
    es: "(a especificar tras la apertura de la cuenta)",
    it: "(da specificare dopo l'apertura del conto)",
    ar: "(يُحدد بعد فتح الحساب)",
    zh: "（开户后注明）",
    fa: "(پس از افتتاح حساب مشخص می‌شود)",
  },
  bankLabel: {
    ru: "Банк",
    en: "Bank",
    hy: "Բանկ",
    fr: "Banque",
    de: "Bank",
    es: "Banco",
    it: "Banca",
    ar: "البنك",
    zh: "银行",
    fa: "بانک",
  },
  bankPlaceholder: {
    ru: "(указать после открытия счёта)",
    en: "(to be specified after account opening)",
    hy: "(նշել հաշիվը բացելուց հետո)",
    fr: "(à indiquer après l'ouverture du compte)",
    de: "(nach Kontoeröffnung anzugeben)",
    es: "(a especificar tras la apertura de la cuenta)",
    it: "(da specificare dopo l'apertura del conto)",
    ar: "(يُحدد بعد فتح الحساب)",
    zh: "（开户后注明）",
    fa: "(پس از افتتاح حساب مشخص می‌شود)",
  },

  // Address section
  addressTitle: {
    ru: "Адрес",
    en: "Address",
    hy: "Հասցե",
    fr: "Adresse",
    de: "Adresse",
    es: "Dirección",
    it: "Indirizzo",
    ar: "العنوان",
    zh: "地址",
    fa: "آدرس",
  },
  addressCity: {
    ru: "Գյունյակ / Город Ереван",
    en: "City of Yerevan",
    hy: "Գյունյակ / Քաղաք Երևան",
    fr: "Ville d'Erevan",
    de: "Stadt Eriwan",
    es: "Ciudad de Ereván",
    it: "Città di Yerevan",
    ar: "مدينة يريفان",
    zh: "埃里温市",
    fa: "شهر ایروان",
  },
  addressFull: {
    ru: "Котайкская обл., Наири, г. Егвард, ул. Арапня, д. 2",
    en: "Kotayk Province, Nairi, Yeghvard, Arapnya St., 2",
    hy: "Կոտայքի մարզ, Նաիրի, ք. Եղվարդ, փ. Արապնյա, տ. 2",
    fr: "Province de Kotayk, Nairi, Eghvard, rue Arapnya, 2",
    de: "Provinz Kotajk, Nairi, Jeghward, Arapnya-Str., 2",
    es: "Provincia de Kotayk, Nairi, Eghvard, calle Arapnya, 2",
    it: "Provincia di Kotayk, Nairi, Yeghvard, via Arapnya, 2",
    ar: "محافظة كوتايك، نايري، يغفارد، شارع أرابنيا، 2",
    zh: "科泰克省，奈里，叶格瓦尔，阿拉普尼亚街 2 号",
    fa: "استان کوتایک، نائیری، یغوارد، خیابان آراپنیا، ۲",
  },

  // Contacts section
  contactsTitle: {
    ru: "Контакты",
    en: "Contacts",
    hy: "Կոնտակտներ",
    fr: "Contacts",
    de: "Kontakte",
    es: "Contactos",
    it: "Contatti",
    ar: "جهات الاتصال",
    zh: "联系方式",
    fa: "تماس‌ها",
  },

  // Footer
  footerCopyright: {
    ru: "© 2026 HayHome — ИП Саргсян Ревик Сергеевич",
    en: "© 2026 HayHome — IE Sargsyan Revik Sergeevich",
    hy: "© 2026 HayHome — ԱՁ Սարգսյան Րեվիք Սերգեևիչ",
    fr: "© 2026 HayHome — EI Sargsyan Revik Sergeevich",
    de: "© 2026 HayHome — IE Sargsyan Revik Sergeevich",
    es: "© 2026 HayHome — EI Sargsyan Revik Sergeevich",
    it: "© 2026 HayHome — II Sargsyan Revik Sergeevich",
    ar: "© 2026 HayHome — م.ف سارغسيان ريفيك سيرغييفيتش",
    zh: "© 2026 HayHome — 个体企业 萨尔基扬·雷维克·谢尔盖耶维奇",
    fa: "© 2026 HayHome — ک.ف سارگسیان رویک سرگیویچ",
  },
};

export default function RequisitesPage() {
  const { lang } = useLang();
  const c = (key: string) => CONTENT[key]?.[lang] ?? CONTENT[key]?.ru ?? key;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} /> {c("backLink")}
        </Link>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div
            className="px-8 py-10 text-center"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              {c("headerTitle")}
            </h1>
            <p className="text-white/80 text-sm">{c("headerSubtitle")}</p>
          </div>

          {/* Body */}
          <div className="p-8 md:p-10 space-y-8">
            {/* Entity */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                {c("entityTitle")}
              </h2>
              <div className="bg-amber-50/50 rounded-xl p-5 space-y-2">
                <p className="text-lg font-bold text-gray-900">
                  {c("entityName")}
                </p>
                <p className="text-sm text-gray-500">
                  {c("regNumberLabel")} 772872487
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-500">{c("taxIdLabel")}</span>
                    <span className="font-mono font-medium text-gray-900">
                      20336085, 286.1594303
                    </span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-500">{c("regNumber2Label")}</span>
                    <span className="font-mono font-medium text-gray-900">
                      269608863
                    </span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-500">{c("activityCodeLabel")}</span>
                    <span className="font-mono font-medium text-gray-900">
                      62.01.0
                    </span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-500">{c("regDateLabel")}</span>
                    <span className="font-mono font-medium text-gray-900">
                      06.07.2026
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Bank */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                {c("bankTitle")}
              </h2>
              <div className="bg-amber-50/50 rounded-xl p-5 space-y-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500">{c("accountLabel")}</span>
                  <span className="font-mono font-medium text-gray-900 italic">
                    {c("accountPlaceholder")}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">{c("bankLabel")}</span>
                  <span className="font-medium text-gray-900 italic">
                    {c("bankPlaceholder")}
                  </span>
                </div>
              </div>
            </section>

            {/* Legal address */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                {c("addressTitle")}
              </h2>
              <div className="bg-amber-50/50 rounded-xl p-5 space-y-2 text-sm">
                <p className="font-medium text-gray-900">
                  {c("addressCity")}
                </p>
                <p className="text-gray-600">
                  {c("addressFull")}
                </p>
              </div>
            </section>

            {/* Contacts */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                {c("contactsTitle")}
              </h2>
              <div className="flex flex-col gap-2 text-sm">
                <a
                  href="tel:+37477712268"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-amber-700 transition-colors"
                >
                  <span className="text-gray-400">📱</span>
                  <span className="font-medium">+374 77-712-268</span>
                </a>
                <a
                  href="mailto:oooplus.ru@yandex.ru"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-amber-700 transition-colors"
                >
                  <span className="text-gray-400">✉️</span>
                  <span className="font-medium">oooplus.ru@yandex.ru</span>
                </a>
                <a
                  href="https://hay-home.com"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-amber-700 transition-colors"
                >
                  <span className="text-gray-400">🌐</span>
                  <span className="font-medium">hay-home.com</span>
                </a>
              </div>
            </section>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          {c("footerCopyright")}
        </p>
      </main>
    </div>
  );
}
