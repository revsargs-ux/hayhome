"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

type Lang = "ru" | "en" | "hy" | "fr" | "de" | "es" | "it" | "ar" | "zh" | "fa";
type Localized = Record<Lang, string>;

const CONTENT: Record<string, Localized> = {
  lastUpdate: {
    ru: "Последнее обновление: 22 июня 2026 г.",
    en: "Last updated: June 22, 2026",
    hy: "Վերջին թարմացում: 22 հունիսի, 2026 թ.",
    fr: "Dernière mise à jour : 22 juin 2026",
    de: "Letzte Aktualisierung: 22. Juni 2026",
    es: "Última actualización: 22 de junio de 2026",
    it: "Ultimo aggiornamento: 22 giugno 2026",
    ar: "آخر تحديث: 22 يونيو 2026",
    zh: "最后更新：2026年6月22日",
    fa: "آخرین به‌روزرسانی: ۲۲ ژوئن ۲۰۲۶",
  },
  contactLink: {
    ru: "Связь:",
    en: "Contact:",
    hy: "Կապ:",
    fr: "Contact :",
    de: "Kontakt:",
    es: "Contacto:",
    it: "Contatto:",
    ar: "اتصل بنا:",
    zh: "联系方式：",
    fa: "تماس:",
  },

  // Section 1
  s1Title: {
    ru: "1. Общие положения",
    en: "1. General Provisions",
    hy: "1. Ընդհանուր դրույթներ",
    fr: "1. Dispositions générales",
    de: "1. Allgemeine Bestimmungen",
    es: "1. Disposiciones generales",
    it: "1. Disposizioni generali",
    ar: "1. الأحكام العامة",
    zh: "1. 一般规定",
    fa: "1. مقررات کلی",
  },
  s1p1: {
    ru: "Настоящие Условия использования (далее — «Условия») регулируют отношения между компанией HayHome (далее — «Платформа») и пользователями платформы hay-home.com (далее — «Пользователи»).",
    en: "These Terms of Use (hereinafter — the «Terms») govern the relationship between HayHome (hereinafter — the «Platform») and the users of the hay-home.com platform (hereinafter — the «Users»).",
    hy: "Այս Օգտագործման պայմանները (այսուհետ՝ «Պայմաններ») կարգավորում են HayHome ընկերության (այսուհետ՝ «Հարթակ») և hay-home.com հարթակի օգտատերերի (այսուհետ՝ «Օգտատերեր») միջև հարաբերությունները։",
    fr: "Les présentes Conditions d'utilisation (ci-après — les « Conditions ») régissent les relations entre la société HayHome (ci-après — la « Plateforme ») et les utilisateurs de la plateforme hay-home.com (ci-après — les « Utilisateurs »).",
    de: "Diese Nutzungsbedingungen (nachfolgend — die «Bedingungen») regeln die Beziehung zwischen dem Unternehmen HayHome (nachfolgend — die «Plattform») und den Nutzern der Plattform hay-home.com (nachfolgend — die «Nutzer»).",
    es: "Los presentes Términos de Uso (en adelante, los «Términos») regulan la relación entre la empresa HayHome (en adelante, la «Plataforma») y los usuarios de la plataforma hay-home.com (en adelante, los «Usuarios»).",
    it: "I presenti Termini di Utilizzo (di seguito — i «Termini») regolano i rapporti tra la società HayHome (di seguito — la «Piattaforma») e gli utenti della piattaforma hay-home.com (di seguito — gli «Utenti»).",
    ar: "تحكم شروط الاستخدام هذه (المشار إليها فيما يلي بـ «الشروط») العلاقة بين شركة HayHome (المشار إليها فيما يلي بـ «المنصة») ومستخدمي منصة hay-home.com (المشار إليهم فيما يلي بـ «المستخدمون»).",
    zh: "本使用条款（以下简称「条款」）管辖 HayHome 公司（以下简称「平台」）与 hay-home.com 平台用户（以下简称「用户」）之间的关系。",
    fa: "این شرایط استفاده (از این پس «شرایط») روابط بین شرکت HayHome (از این پس «پلتفرم») و کاربران پلتفرم hay-home.com (از این پس «کاربران») را تنظیم می‌کند.",
  },
  s1p2: {
    ru: "Регистрируясь и используя Платформу, Пользователь подтверждает своё согласие с настоящими Условиями.",
    en: "By registering and using the Platform, the User confirms their agreement with these Terms.",
    hy: "Գրանցվելով և օգտագործելով Հարթակը՝ Օգտատերը հաստատում է իր համաձայնությունը այս Պայմանների հետ։",
    fr: "En s'inscrivant et en utilisant la Plateforme, l'Utilisateur confirme son accord avec les présentes Conditions.",
    de: "Mit der Registrierung und Nutzung der Plattform bestätigt der Nutzer seine Zustimmung zu diesen Bedingungen.",
    es: "Al registrarse y utilizar la Plataforma, el Usuario confirma su conformidad con los presentes Términos.",
    it: "Registrandosi e utilizzando la Piattaforma, l'Utente conferma la propria accettazione dei presenti Termini.",
    ar: "بالتسجيل واستخدام المنصة، يؤكد المستخدم موافقته على هذه الشروط.",
    zh: "注册并使用平台即表示用户同意本条款。",
    fa: "با ثبت‌نام و استفاده از پلتفرم، کاربر موافقت خود را با این شرایط تأیید می‌کند.",
  },

  // Section 2
  s2Title: {
    ru: "2. Определения",
    en: "2. Definitions",
    hy: "2. Սահմանումներ",
    fr: "2. Définitions",
    de: "2. Definitionen",
    es: "2. Definiciones",
    it: "2. Definizioni",
    ar: "2. التعريفات",
    zh: "2. 定义",
    fa: "2. تعاریف",
  },
  s2l1: {
    ru: "Гость — Пользователь, ищущий проживание у принимающей семьи.",
    en: "Guest — a User seeking accommodation with a host family.",
    hy: "Հյուր — Օգտատեր, ով փնտրում է բնակություն ընդունող ընտանիքի մոտ։",
    fr: "Invité — un Utilisateur cherchant un hébergement auprès d'une famille d'accueil.",
    de: "Gast — ein Nutzer, der eine Unterkunft bei einer Gastgeberfamilie sucht.",
    es: "Invitado — un Usuario que busca alojamiento con una familia anfitriona.",
    it: "Ospite — un Utente che cerca alloggio presso una famiglia ospitante.",
    ar: "ضيف — مستخدم يبحث عن إقامة لدى عائلة مضيفة.",
    zh: "客人 — 寻找寄宿家庭住宿的用户。",
    fa: "مهمان — کاربری که به دنبال اقامت در یک خانواده میزبان است.",
  },
  s2l1b: {
    ru: "Гость",
    en: "Guest",
    hy: "Հյուր",
    fr: "Invité",
    de: "Gast",
    es: "Invitado",
    it: "Ospite",
    ar: "ضيف",
    zh: "客人",
    fa: "مهمان",
  },
  s2l2: {
    ru: "Хозяин — Пользователь, предоставляющий проживание в своём доме.",
    en: "Host — a User providing accommodation in their home.",
    hy: "Տնային տեր — Օգտատեր, ով տրամադրում է բնակություն իր տանը։",
    fr: "Hôte — un Utilisateur offrant un hébergement dans son domicile.",
    de: "Gastgeber — ein Nutzer, der eine Unterkunft in seinem Zuhause anbietet.",
    es: "Anfitrión — un Usuario que ofrece alojamiento en su hogar.",
    it: "Ospitante — un Utente che offre alloggio nella propria casa.",
    ar: "مضيف — مستخدم يوفر إقامة في منزله.",
    zh: "房东 — 在自己家中提供住宿的用户。",
    fa: "میزبان — کاربری که اقامت در خانه خود را ارائه می‌دهد.",
  },
  s2l2b: {
    ru: "Хозяин",
    en: "Host",
    hy: "Տնային տեր",
    fr: "Hôte",
    de: "Gastgeber",
    es: "Anfitrión",
    it: "Ospitante",
    ar: "مضيف",
    zh: "房东",
    fa: "میزبان",
  },
  s2l3: {
    ru: "Бронирование — запрос Гостя на проживание в семье Хозяина.",
    en: "Booking — a Guest's request to stay with a Host's family.",
    hy: "Ամրագրում — Հյուրի հարցումը Տնային տիրոջ ընտանիքում բնակվելու համար։",
    fr: "Réservation — la demande d'un Invité pour séjourner dans la famille d'un Hôte.",
    de: "Buchung — die Anfrage eines Gastes nach einem Aufenthalt in der Familie eines Gastgebers.",
    es: "Reserva — la solicitud de un Invitado para alojarse en la familia de un Anfitrión.",
    it: "Prenotazione — la richiesta di un Ospite di soggiornare nella famiglia di un Ospitante.",
    ar: "الحجز — طلب الضيف للإقامة مع عائلة المضيف.",
    zh: "预订 — 客人要求入住房东家庭。",
    fa: "رزرو — درخواست مهمان برای اقامت در خانواده میزبان.",
  },
  s2l3b: {
    ru: "Бронирование",
    en: "Booking",
    hy: "Ամրագրում",
    fr: "Réservation",
    de: "Buchung",
    es: "Reserva",
    it: "Prenotazione",
    ar: "الحجز",
    zh: "预订",
    fa: "رزرو",
  },
  s2l4: {
    ru: "Визит — фактическое проживание Гостя в семье Хозяина.",
    en: "Visit — the actual stay of a Guest with a Host's family.",
    hy: "Այց — Հյուրի փաստացի բնակությունը Տնային տիրոջ ընտանիքում։",
    fr: "Visite — le séjour effectif d'un Invité dans la famille d'un Hôte.",
    de: "Besuch — der tatsächliche Aufenthalt eines Gastes in der Familie eines Gastgebers.",
    es: "Visita — la estancia efectiva de un Invitado en la familia de un Anfitrión.",
    it: "Visita — il soggiorno effettivo di un Ospite nella famiglia di un Ospitante.",
    ar: "الزيارة — إقامة الضيف الفعلية مع عائلة المضيف.",
    zh: "访问 — 客人在房东家庭中的实际居住。",
    fa: "بازدید — اقامت واقعی مهمان در خانواده میزبان.",
  },
  s2l4b: {
    ru: "Визит",
    en: "Visit",
    hy: "Այց",
    fr: "Visite",
    de: "Besuch",
    es: "Visita",
    it: "Visita",
    ar: "الزيارة",
    zh: "访问",
    fa: "بازدید",
  },

  // Section 3
  s3Title: {
    ru: "3. Регистрация и аккаунт",
    en: "3. Registration and Account",
    hy: "3. Գրանցում և հաշիվ",
    fr: "3. Inscription et compte",
    de: "3. Registrierung und Konto",
    es: "3. Registro y cuenta",
    it: "3. Registrazione e account",
    ar: "3. التسجيل والحساب",
    zh: "3. 注册和账户",
    fa: "3. ثبت‌نام و حساب کاربری",
  },
  s3l1: {
    ru: "Регистрация на Платформе бесплатна.",
    en: "Registration on the Platform is free of charge.",
    hy: "Գրանցումը Հարթակում անվճար է։",
    fr: "L'inscription sur la Plateforme est gratuite.",
    de: "Die Registrierung auf der Plattform ist kostenlos.",
    es: "El registro en la Plataforma es gratuito.",
    it: "La registrazione sulla Piattaforma è gratuita.",
    ar: "التسجيل في المنصة مجاني.",
    zh: "平台注册免费。",
    fa: "ثبت‌نام در پلتفرم رایگان است.",
  },
  s3l2: {
    ru: "Пользователь обязан указывать достоверную информацию.",
    en: "The User is obliged to provide accurate information.",
    hy: "Օգտատերը պարտավոր է ներկայացնել ճշգրիտ տեղեկատվություն։",
    fr: "L'Utilisateur est tenu de fournir des informations exactes.",
    de: "Der Nutzer ist verpflichtet, wahrheitsgemäße Angaben zu machen.",
    es: "El Usuario está obligado a proporcionar información veraz.",
    it: "L'Utente è tenuto a fornire informazioni accurate.",
    ar: "يلتزم المستخدم بتقديم معلومات دقيقة.",
    zh: "用户有义务提供真实信息。",
    fa: "کاربر موظف است اطلاعات دقیق ارائه دهد.",
  },
  s3l3: {
    ru: "Пользователь несёт ответственность за безопасность своего аккаунта.",
    en: "The User is responsible for the security of their account.",
    hy: "Օգտատերը պատասխանատու է իր հաշվի անվտանգության համար։",
    fr: "L'Utilisateur est responsable de la sécurité de son compte.",
    de: "Der Nutzer ist für die Sicherheit seines Kontos verantwortlich.",
    es: "El Usuario es responsable de la seguridad de su cuenta.",
    it: "L'Utente è responsabile della sicurezza del proprio account.",
    ar: "المستخدم مسؤول عن أمان حسابه.",
    zh: "用户对其账户的安全负责。",
    fa: "کاربر مسئولیت امنیت حساب خود را بر عهده دارد.",
  },
  s3l4: {
    ru: "Один Пользователь — один аккаунт. Передача аккаунта запрещена.",
    en: "One User — one account. Account transfer is prohibited.",
    hy: "Մեկ Օգտատեր — մեկ հաշիվ։ Հաշվի փոխանցումն արգելված է։",
    fr: "Un Utilisateur — un compte. Le transfert de compte est interdit.",
    de: "Ein Nutzer — ein Konto. Die Kontoübertragung ist untersagt.",
    es: "Un Usuario — una cuenta. La transferencia de cuentas está prohibida.",
    it: "Un Utente — un account. Il trasferimento dell'account è vietato.",
    ar: "مستخدم واحد — حساب واحد. يُحظر نقل الحساب.",
    zh: "一个用户 — 一个账户。禁止转让账户。",
    fa: "یک کاربر — یک حساب. انتقال حساب ممنوع است.",
  },

  // Section 4
  s4Title: {
    ru: "4. Права и обязанности сторон",
    en: "4. Rights and Obligations of the Parties",
    hy: "4. Կողմերի իրավունքները և պարտականությունները",
    fr: "4. Droits et obligations des parties",
    de: "4. Rechte und Pflichten der Parteien",
    es: "4. Derechos y obligaciones de las partes",
    it: "4. Diritti e obblighi delle parti",
    ar: "4. حقوق والتزامات الأطراف",
    zh: "4. 各方的权利和义务",
    fa: "4. حقوق و تعهدات طرفین",
  },
  s4aTitle: {
    ru: "4.1. Платформа обязуется:",
    en: "4.1. The Platform undertakes to:",
    hy: "4.1. Հարթակը պարտավորվում է՝",
    fr: "4.1. La Plateforme s'engage à :",
    de: "4.1. Die Plattform verpflichtet sich:",
    es: "4.1. La Plataforma se compromete a:",
    it: "4.1. La Piattaforma si impegna a:",
    ar: "4.1. تلتزم المنصة بـ:",
    zh: "4.1. 平台承诺：",
    fa: "4.1. پلتفرم متعهد می‌شود به:",
  },
  s4a1: {
    ru: "Предоставлять инструменты поиска и бронирования.",
    en: "Provide search and booking tools.",
    hy: "Տրամադրել որոնման և ամրագրման գործիքներ։",
    fr: "Fournir des outils de recherche et de réservation.",
    de: "Such- und Buchungstools bereitzustellen.",
    es: "Proporcionar herramientas de búsqueda y reserva.",
    it: "Fornire strumenti di ricerca e prenotazione.",
    ar: "تقديم أدوات البحث والحجز.",
    zh: "提供搜索和预订工具。",
    fa: "ارائه ابزارهای جستجو و رزرو.",
  },
  s4a2: {
    ru: "Обеспечивать техническую поддержку.",
    en: "Provide technical support.",
    hy: "Ապահովել տեխնիկական աջակցություն։",
    fr: "Assurer un support technique.",
    de: "Technischen Support zu gewährleisten.",
    es: "Proporcionar soporte técnico.",
    it: "Garantire supporto tecnico.",
    ar: "تقديم الدعم الفني.",
    zh: "提供技术支持。",
    fa: "ارائه پشتیبانی فنی.",
  },
  s4a3: {
    ru: "Защищать личные данные Пользователей.",
    en: "Protect the personal data of Users.",
    hy: "Պաշտպանել Օգտատերերի անձնական տվյալները։",
    fr: "Protéger les données personnelles des Utilisateurs.",
    de: "Die persönlichen Daten der Nutzer zu schützen.",
    es: "Proteger los datos personales de los Usuarios.",
    it: "Proteggere i dati personali degli Utenti.",
    ar: "حماية البيانات الشخصية للمستخدمين.",
    zh: "保护用户的个人数据。",
    fa: "حفاظت از داده‌های شخصی کاربران.",
  },
  s4bTitle: {
    ru: "4.2. Хозяин обязуется:",
    en: "4.2. The Host undertakes to:",
    hy: "4.2. Տնային տերը պարտավորվում է՝",
    fr: "4.2. L'Hôte s'engage à :",
    de: "4.2. Der Gastgeber verpflichtet sich:",
    es: "4.2. El Anfitrión se compromete a:",
    it: "4.2. L'Ospitante si impegna a:",
    ar: "4.2. يلتزم المضيف بـ:",
    zh: "4.2. 房东承诺：",
    fa: "4.2. میزبان متعهد می‌شود به:",
  },
  s4b1: {
    ru: "Предоставлять достоверную информацию о своём доме.",
    en: "Provide accurate information about their home.",
    hy: "Տրամադրել իր տան մասին ճշգրիտ տեղեկատվություն։",
    fr: "Fournir des informations exactes sur son domicile.",
    de: "Wahrheitsgemäße Angaben über sein Zuhause zu machen.",
    es: "Proporcionar información veraz sobre su hogar.",
    it: "Fornire informazioni accurate sulla propria casa.",
    ar: "تقديم معلومات دقيقة عن منزله.",
    zh: "提供关于其房屋的真实信息。",
    fa: "ارائه اطلاعات دقیق درباره خانه خود.",
  },
  s4b2: {
    ru: "Обеспечивать безопасность и комфорт Гостя.",
    en: "Ensure the safety and comfort of the Guest.",
    hy: "Ապահովել Հյուրի անվտանգությունն ու հարմարավետությունը։",
    fr: "Garantir la sécurité et le confort de l'Invité.",
    de: "Die Sicherheit und den Komfort des Gastes zu gewährleisten.",
    es: "Garantizar la seguridad y comodidad del Invitado.",
    it: "Garantire la sicurezza e il comfort dell'Ospite.",
    ar: "ضمان سلامة وراحة الضيف.",
    zh: "确保客人的安全和舒适。",
    fa: "تضمین ایمنی و راحتی مهمان.",
  },
  s4b3: {
    ru: "Соблюдать законы Республики Армения.",
    en: "Comply with the laws of the Republic of Armenia.",
    hy: "Պահպանել Հայաստանի Հանրապետության օրենքները։",
    fr: "Respecter les lois de la République d'Arménie.",
    de: "Die Gesetze der Republik Armenien einzuhalten.",
    es: "Cumplir con las leyes de la República de Armenia.",
    it: "Rispettare le leggi della Repubblica di Armenia.",
    ar: "الامتثال لقوانين جمهورية أرمينيا.",
    zh: "遵守亚美尼亚共和国法律。",
    fa: "رعایت قوانین جمهوری ارمنستان.",
  },
  s4cTitle: {
    ru: "4.3. Гость обязуется:",
    en: "4.3. The Guest undertakes to:",
    hy: "4.3. Հյուրը պարտավորվում է՝",
    fr: "4.3. L'Invité s'engage à :",
    de: "4.3. Der Gast verpflichtet sich:",
    es: "4.3. El Invitado se compromete a:",
    it: "4.3. L'Ospite si impegna a:",
    ar: "4.3. يلتزم الضيف بـ:",
    zh: "4.3. 客人承诺：",
    fa: "4.3. مهمان متعهد می‌شود به:",
  },
  s4c1: {
    ru: "Соблюдать правила дома принимающей семьи.",
    en: "Follow the house rules of the host family.",
    hy: "Պահպանել ընդունող ընտանիքի տան կանոնները։",
    fr: "Respecter le règlement intérieur de la famille d'accueil.",
    de: "Die Hausordnung der Gastgeberfamilie einzuhalten.",
    es: "Respetar las normas de la casa de la familia anfitriona.",
    it: "Rispettare le regole della casa della famiglia ospitante.",
    ar: "احترام قواعد منزل العائلة المضيفة.",
    zh: "遵守寄宿家庭的房屋规则。",
    fa: "رعایت قوانین خانه خانواده میزبان.",
  },
  s4c2: {
    ru: "Уважать культуру и традиции хозяев.",
    en: "Respect the culture and traditions of the hosts.",
    hy: "Հարգել տերերի մշակույթն ու ավանդույթները։",
    fr: "Respecter la culture et les traditions des hôtes.",
    de: "Die Kultur und die Traditionen der Gastgeber zu respektieren.",
    es: "Respetar la cultura y las tradiciones de los anfitriones.",
    it: "Rispettare la cultura e le tradizioni degli ospitanti.",
    ar: "احترام ثقافة وتقاليد المضيفين.",
    zh: "尊重房东的文化和传统。",
    fa: "احترام فرهنگ و سنت‌های میزبان.",
  },
  s4c3: {
    ru: "Не причинять ущерб имуществу семьи.",
    en: "Not cause damage to the family's property.",
    hy: "Չվնասել ընտանիքի գույքը։",
    fr: "Ne pas causer de dommages aux biens de la famille.",
    de: "Keine Schäden am Eigentum der Familie zu verursachen.",
    es: "No causar daños a la propiedad de la familia.",
    it: "Non causare danni alla proprietà della famiglia.",
    ar: "عدم إلحاق الضرار بممتلكات العائلة.",
    zh: "不对家庭财产造成损害。",
    fa: "عدم وارد کردن خسارت به اموال خانواده.",
  },

  // Section 5
  s5Title: {
    ru: "5. Бронирование и оплата",
    en: "5. Booking and Payment",
    hy: "5. Ամրագրում և վճարում",
    fr: "5. Réservation et paiement",
    de: "5. Buchung und Zahlung",
    es: "5. Reserva y pago",
    it: "5. Prenotazione e pagamento",
    ar: "5. الحجز والدفع",
    zh: "5. 预订和付款",
    fa: "5. رزرو و پرداخت",
  },
  s5l1: {
    ru: "Бронирование осуществляется через Платформу.",
    en: "Booking is made through the Platform.",
    hy: "Ամրագրումն իրականացվում է Հարթակի միջոցով։",
    fr: "La réservation s'effectue via la Plateforme.",
    de: "Die Buchung erfolgt über die Plattform.",
    es: "La reserva se realiza a través de la Plataforma.",
    it: "La prenotazione viene effettuata tramite la Piattaforma.",
    ar: "يتم الحجز عبر المنصة.",
    zh: "预订通过平台进行。",
    fa: "رزرو از طریق پلتفرم انجام می‌شود.",
  },
  s5l2: {
    ru: "Стоимость и условия проживания определяются Хозяином.",
    en: "The cost and conditions of stay are determined by the Host.",
    hy: "Բնակության արժեքն ու պայմանները որոշվում են Տնային տիրոջ կողմից։",
    fr: "Le coût et les conditions de séjour sont déterminés par l'Hôte.",
    de: "Die Kosten und Bedingungen des Aufenthalts werden vom Gastgeber festgelegt.",
    es: "El coste y las condiciones de estancia son determinados por el Anfitrión.",
    it: "Il costo e le condizioni del soggiorno sono determinati dall'Ospitante.",
    ar: "يحدد المضيف تكلفة وشروط الإقامة.",
    zh: "住宿费用和条件由房东决定。",
    fa: "هزینه و شرایط اقامت توسط میزبان تعیین می‌شود.",
  },
  s5l3: {
    ru: "Комиссия Платформы: 15% от стоимости бронирования + 1% за обработку платежа.",
    en: "Platform Commission: 15% of the booking value + 1% for payment processing.",
    hy: "Հարթակի միջնորդավճարը՝ ամրագրման արժեքի 15% + 1% վճարման մշակման համար։",
    fr: "Commission de la Plateforme : 15 % du montant de la réservation + 1 % pour le traitement du paiement.",
    de: "Plattformprovision: 15 % des Buchungswertes + 1 % für die Zahlungsabwicklung.",
    es: "Comisión de la Plataforma: 15 % del valor de la reserva + 1 % por el procesamiento del pago.",
    it: "Commissione della Piattaforma: 15% del valore della prenotazione + 1% per l'elaborazione del pagamento.",
    ar: "عمولة المنصة: 15% من قيمة الحجز + 1% مقابل معالجة الدفع.",
    zh: "平台佣金：预订价值的 15% + 1% 支付处理费。",
    fa: "کمیسیون پلتفرم: ۱۵٪ از ارزش رزرو + ۱٪ برای پردازش پرداخت.",
  },
  s5l3b: {
    ru: "Комиссия Платформы:",
    en: "Platform Commission:",
    hy: "Հարթակի միջնորդավճարը՝",
    fr: "Commission de la Plateforme :",
    de: "Plattformprovision:",
    es: "Comisión de la Plataforma:",
    it: "Commissione della Piattaforma:",
    ar: "عمولة المنصة:",
    zh: "平台佣金：",
    fa: "کمیسیون پلتفرم:",
  },
  s5l4: {
    ru: "Отмена бронирования: бесплатно, если отменено не позднее чем за 48 часов до заезда. При отмене менее чем за 48 часов удерживается 50% от стоимости проживания.",
    en: "Cancellation: free if cancelled no later than 48 hours before check-in. If cancelled less than 48 hours before, 50% of the stay cost is retained.",
    hy: "Չեղարկում՝ անվճար, եթե չեղարկվել է ոչ ուշ քան ժամանումից 48 ժամ առաջ։ 48 ժամից պակաս ժամանակում չեղարկման դեպքում պահվում է բնակության արժեքի 50%-ը։",
    fr: "Annulation : gratuite si effectuée au plus tard 48 heures avant l'arrivée. En cas d'annulation moins de 48 heures avant, 50 % du coût du séjour est retenu.",
    de: "Stornierung: kostenlos bei Stornierung spätestens 48 Stunden vor Anreise. Bei Stornierung weniger als 48 Stunden vorher werden 50 % der Aufenthaltskosten einbehalten.",
    es: "Cancelación: gratuita si se cancela como mínimo 48 horas antes de la entrada. Si se cancela con menos de 48 horas de antelación, se retiene el 50 % del coste de la estancia.",
    it: "Cancellazione: gratuita se effettuata non oltre 48 ore prima del check-in. In caso di cancellazione con meno di 48 ore di preavviso, viene trattenuto il 50% del costo del soggiorno.",
    ar: "الإلغاء: مجاني إذا تم الإلغاء قبل 48 ساعة على الأقل من تاريخ الوصول. عند الإلغاء بأقل من 48 ساعة، يُحتفظ بـ 50% من تكلفة الإقامة.",
    zh: "取消：在入住前 48 小时之前取消免费。如在 48 小时内取消，将扣除 50% 的住宿费用。",
    fa: "لغو: در صورت لغو حداقل ۴۸ ساعت قبل از ورود رایگان است. در صورت لغو کمتر از ۴۸ ساعت، ۵۰٪ هزینه اقامت کسر می‌شود.",
  },
  s5l4b: {
    ru: "Отмена бронирования:",
    en: "Cancellation:",
    hy: "Չեղարկում՝",
    fr: "Annulation :",
    de: "Stornierung:",
    es: "Cancelación:",
    it: "Cancellazione:",
    ar: "الإلغاء:",
    zh: "取消：",
    fa: "لغو:",
  },
  s5l5: {
    ru: "Платформа является посредником между Гостем и Хозяином и не несёт ответственности за действия принимающей стороны.",
    en: "The Platform acts as an intermediary between the Guest and the Host and is not liable for the actions of the receiving party.",
    hy: "Հարթակը միջնորդ է Հյուրի և Տնային տիրոջ միջև և պատասխանատվություն չի կրում ընդունող կողմի գործողությունների համար։",
    fr: "La Plateforme sert d'intermédiaire entre l'Invité et l'Hôte et n'est pas responsable des actions de la partie d'accueil.",
    de: "Die Plattform vermittelt zwischen Gast und Gastgeber und haftet nicht für die Handlungen der aufnehmenden Partei.",
    es: "La Plataforma actúa como intermediario entre el Invitado y el Anfitrión y no se responsabiliza de las acciones de la parte receptora.",
    it: "La Piattaforma agisce come intermediario tra l'Ospite e l'Ospitante e non è responsabile delle azioni della parte ricevente.",
    ar: "تعمل المنصة كوسيط بين الضيف والمضيف ولا تتحمل مسؤولية أفعال الطرف المستقبل.",
    zh: "平台作为客人和房东之间的中介，不对接待方的行为承担责任。",
    fa: "پلتفرم به عنوان واسطه بین مهمان و میزبان عمل می‌کند و مسئولیتی در قبال اقدامات طرف میزبان ندارد.",
  },

  // Section 6
  s6Title: {
    ru: "6. Отзывы и оценки",
    en: "6. Reviews and Ratings",
    hy: "6. Կարծիքներ և գնահատականներ",
    fr: "6. Avis et évaluations",
    de: "6. Bewertungen und Rezensionen",
    es: "6. Reseñas y valoraciones",
    it: "6. Recensioni e valutazioni",
    ar: "6. المراجعات والتقييمات",
    zh: "6. 评论和评分",
    fa: "6. نظرات و امتیازات",
  },
  s6l1: {
    ru: "Гости могут оставлять отзывы после завершения Визита.",
    en: "Guests may leave reviews after the completion of the Visit.",
    hy: "Հյուրերը կարող են կարծիքներ թողնել Այցի ավարտից հետո։",
    fr: "Les Invités peuvent laisser des avis après la fin de la Visite.",
    de: "Gäste können nach Abschluss des Besuchs Bewertungen abgeben.",
    es: "Los Invitados pueden dejar reseñas después de completar la Visita.",
    it: "Gli Ospiti possono lasciare recensioni dopo il completamento della Visita.",
    ar: "يمكن للضيوف ترك مراجعات بعد انتهاء الزيارة.",
    zh: "客人在访问结束后可以发表评论。",
    fa: "مهمانان می‌توانند پس از پایان بازدید نظر ثبت کنند.",
  },
  s6l2: {
    ru: "Отзывы должны быть честными и корректными.",
    en: "Reviews must be honest and appropriate.",
    hy: "Կարծիքները պետք է լինեն ազնիվ և ճիշտ։",
    fr: "Les avis doivent être honnêtes et respectueux.",
    de: "Bewertungen müssen ehrlich und sachlich sein.",
    es: "Las reseñas deben ser honestas y respetuosas.",
    it: "Le recensioni devono essere oneste e appropriate.",
    ar: "يجب أن تكون المراجعات صادقة ومناسبة.",
    zh: "评论必须诚实和恰当。",
    fa: "نظرات باید صادقانه و مناسب باشند.",
  },
  s6l3: {
    ru: "Платформа оставляет за собой право удалять оскорбительные отзывы.",
    en: "The Platform reserves the right to remove offensive reviews.",
    hy: "Հարթակը պահպանում է իրեն իրավունքը հեռացնել վիրավորական կարծիքները։",
    fr: "La Plateforme se réserve le droit de supprimer les avis injurieux.",
    de: "Die Plattform behält sich das Recht vor, beleidigende Bewertungen zu entfernen.",
    es: "La Plataforma se reserva el derecho de eliminar reseñas ofensivas.",
    it: "La Piattaforma si riserva il diritto di rimuovere le recensioni offensive.",
    ar: "تحتفظ المنصة بالحق في حذف المراجعات المسيئة.",
    zh: "平台保留删除不当评论的权利。",
    fa: "پلتفرم حق حذف نظرات توهین‌آمیز را محفوظ می‌دارد.",
  },

  // Section 7
  s7Title: {
    ru: "7. Ограничение ответственности",
    en: "7. Limitation of Liability",
    hy: "7. Պատասխանատվության սահմանափակում",
    fr: "7. Limitation de responsabilité",
    de: "7. Haftungsbeschränkung",
    es: "7. Limitación de responsabilidad",
    it: "7. Limitazione di responsabilità",
    ar: "7. حدود المسؤولية",
    zh: "7. 责任限制",
    fa: "7. محدودیت مسئولیت",
  },
  s7p1: {
    ru: "Платформа является посредником между Гостем и Хозяином и не несёт ответственности за качество проживания, поведение сторон и возможные материальные убытки. Платформа прилагает усилия по верификации Хозяев, но не гарантирует отсутствие проблемных ситуаций.",
    en: "The Platform acts as an intermediary between the Guest and the Host and is not liable for the quality of accommodation, the behaviour of the parties, or any possible material losses. The Platform makes efforts to verify Hosts but does not guarantee the absence of problematic situations.",
    hy: "Հարթակը միջնորդ է Հյուրի և Տնային տիրոջ միջև և պատասխանատվություն չի կրում բնակության որակի, կողմերի վարքագծի և հնարավոր նյութական վնասների համար։ Հարթակը ջանքեր է գործադրում Տնային տերերի ստուգման ուղղությամբ, սակայն չի երաշխավորում խնդրային իրավիճակների բացակայությունը։",
    fr: "La Plateforme sert d'intermédiaire entre l'Invité et l'Hôte et n'est pas responsable de la qualité de l'hébergement, du comportement des parties ni d'éventuelles pertes matérielles. La Plateforme s'efforce de vérifier les Hôtes mais ne garantit pas l'absence de situations problématiques.",
    de: "Die Plattform vermittelt zwischen Gast und Gastgeber und haftet nicht für die Qualität der Unterkunft, das Verhalten der Parteien oder mögliche materielle Verluste. Die Plattform bemüht sich um die Verifizierung der Gastgeber, garantiert jedoch nicht das Ausbleiben problematischer Situationen.",
    es: "La Plataforma actúa como intermediario entre el Invitado y el Anfitrión y no se responsabiliza de la calidad del alojamiento, del comportamiento de las partes ni de posibles pérdidas materiales. La Plataforma se esfuerza por verificar a los Anfitriones pero no garantiza la ausencia de situaciones problemáticas.",
    it: "La Piattaforma agisce come intermediario tra l'Ospite e l'Ospitante e non è responsabile della qualità dell'alloggio, del comportamento delle parti o di eventuali perdite materiali. La Piattaforma si impegna a verificare gli Ospitanti ma non garantisce l'assenza di situazioni problematiche.",
    ar: "تعمل المنصة كوسيط بين الضيف والمضيف ولا تتحمل مسؤولية جودة الإقامة أو سلوك الأطراف أو الخسائر المادية المحتملة. تبذل المنصة جهودًا للتحقق من المضيفين لكنها لا تضمن عدم وجود حالات problematic.",
    zh: "平台作为客人和房东之间的中介，不对住宿质量、各方行为及可能的物质损失承担责任。平台努力验证房东，但不保证不会出现问题情况。",
    fa: "پلتفرم به عنوان واسطه بین مهمان و میزبان عمل می‌کند و مسئولیتی در قبال کیفیت اقامت، رفتار طرفین و زیان‌های مادی احتمالی ندارد. پلتفرم در راستای تأیید میزبانان تلاش می‌کند، اما تضمین عدم بروز مشکلات را نمی‌دهد.",
  },

  // Section 8
  s8Title: {
    ru: "8. Блокировка аккаунта",
    en: "8. Account Blocking",
    hy: "8. Հաշվի արգելափակում",
    fr: "8. Blocage de compte",
    de: "8. Kontosperrung",
    es: "8. Bloqueo de cuenta",
    it: "8. Blocco dell'account",
    ar: "8. حظر الحساب",
    zh: "8. 账户封禁",
    fa: "8. مسدودسازی حساب",
  },
  s8p1: {
    ru: "Платформа оставляет за собой право заблокировать аккаунт Пользователя в случае нарушения настоящих Условий, мошенничества, нарушения законодательства Республики Армения или недобросовестного поведения.",
    en: "The Platform reserves the right to block a User's account in the event of a breach of these Terms, fraud, violation of the legislation of the Republic of Armenia, or bad-faith conduct.",
    hy: "Հարթակը պահպանում է իրեն իրավունքը արգելափակել Օգտատիրոջ հաշիվը այս Պայմանների խախտման, խարդախության, Հայաստանի Հանրապետության օրենսդրության խախտման կամ վատ կամքով վարքագծի դեպքում։",
    fr: "La Plateforme se réserve le droit de bloquer le compte d'un Utilisateur en cas de violation des présentes Conditions, de fraude, d'infraction à la législation de la République d'Arménie ou de comportement de mauvaise foi.",
    de: "Die Plattform behält sich das Recht vor, das Konto eines Nutzers bei Verstößen gegen diese Bedingungen, Betrug, Verstößen gegen die Gesetzgebung der Republik Armenien oder unredlichem Verhalten zu sperren.",
    es: "La Plataforma se reserva el derecho de bloquear la cuenta de un Usuario en caso de incumplimiento de los presentes Términos, fraude, violación de la legislación de la República de Armenia o conducta de mala fe.",
    it: "La Piattaforma si riserva il diritto di bloccare l'account di un Utente in caso di violazione dei presenti Termini, frode, violazione della legislazione della Repubblica di Armenia o condotta di mala fede.",
    ar: "تحتفظ المنصة بالحق في حظر حساب المستخدم في حالة انتهاك هذه الشروط أو الاحتيال أو مخالفة تشريعات جمهورية أرمينيا أو السلوك السيئ.",
    zh: "平台保留在违反本条款、欺诈、违反亚美尼亚共和国法律或不诚信行为时封锁用户账户的权利。",
    fa: "پلتفرم حق مسدودسازی حساب کاربر را در صورت نقض این شرایط، تقلب، نقض قوانین جمهوری ارمنستان یا رفتار بدنهد محفوظ می‌دارد.",
  },
  s8p2: {
    ru: "Запрещено: мошенничество (фиктивные отзывы, ложные данные о жилье), любые действия, нарушающие законы Армении, а также передача аккаунта третьим лицам.",
    en: "Prohibited: fraud (fake reviews, false property data), any actions violating the laws of Armenia, as well as transferring an account to third parties.",
    hy: "Արգելված է՝ խարդախություն (կեղծ կարծիքներ, բնակարանի մասին կեղծ տվյալներ), Հայաստանի օրենքները խախտող ցանկացած գործողություն, ինչպես նաև հաշվի փոխանցում երրորդ անձանց։",
    fr: "Sont interdits : la fraude (faux avis, fausses données sur le logement), toute action violant les lois arméniennes, ainsi que le transfert de compte à des tiers.",
    de: "Verboten: Betrug (gefälschte Bewertungen, falsche Angaben zur Unterkunft), alle Handlungen, die gegen die armenischen Gesetze verstoßen, sowie die Übertragung des Kontos an Dritte.",
    es: "Está prohibido: el fraude (reseñas falsas, datos falsos sobre la vivienda), cualquier acción que viole las leyes de Armenia, así como la transferencia de la cuenta a terceros.",
    it: "È vietato: frode (recensioni false, dati falsi sull'alloggio), qualsiasi azione che violi le leggi armene, nonché il trasferimento dell'account a terzi.",
    ar: "يُحظر: الاحتيال (مراجعات مزيفة، بيانات كاذبة عن المسكن)، أي إجراءات تنتهك القوانين الأرمينية، وكذلك نقل الحساب إلى أطراف ثالثة.",
    zh: "禁止：欺诈（虚假评论、虚假房屋信息）、任何违反亚美尼亚法律的行为，以及向第三方转让账户。",
    fa: "ممنوع است: تقلب (نظرات جعلی، اطلاعات نادرست درباره مسکن)، هرگونه اقدامی که قوانین ارمنستان را نقض کند، و همچنین انتقال حساب به اشخاص ثالث.",
  },
  s8p2b: {
    ru: "Запрещено:",
    en: "Prohibited:",
    hy: "Արգելված է՝",
    fr: "Interdit :",
    de: "Verboten:",
    es: "Prohibido:",
    it: "Vietato:",
    ar: "يُحظر:",
    zh: "禁止：",
    fa: "ممنوع:",
  },

  // Section 9
  s9Title: {
    ru: "9. Изменение Условий",
    en: "9. Amendment of Terms",
    hy: "9. Պայմանների փոփոխում",
    fr: "9. Modification des Conditions",
    de: "9. Änderung der Bedingungen",
    es: "9. Modificación de los Términos",
    it: "9. Modifica dei Termini",
    ar: "9. تعديل الشروط",
    zh: "9. 条款变更",
    fa: "9. اصلاح شرایط",
  },
  s9p1: {
    ru: "Платформа вправе изменять настоящие Условия. Актуальная версия всегда доступна на данной странице.",
    en: "The Platform may amend these Terms. The current version is always available on this page.",
    hy: "Հարթակը իրավունք ունի փոփոխել այս Պայմանները։ Գործող տարբերակը միշտ հասանելի է այս էջում։",
    fr: "La Plateforme peut modifier les présentes Conditions. La version en vigueur est toujours disponible sur cette page.",
    de: "Die Plattform kann diese Bedingungen ändern. Die jeweils aktuelle Version ist stets auf dieser Seite verfügbar.",
    es: "La Plataforma puede modificar los presentes Términos. La versión vigente está siempre disponible en esta página.",
    it: "La Piattaforma può modificare i presenti Termini. La versione aggiornata è sempre disponibile su questa pagina.",
    ar: "يجوز للمنصة تعديل هذه الشروط. النسخة الحالية متاحة دائمًا على هذه الصفحة.",
    zh: "平台可修改本条款。最新版本始终在此页面上提供。",
    fa: "پلتفرم مجاز به اصلاح این شرایط است. نسخه فعلی همیشه در این صفحه در دسترس است.",
  },

  // Section 10
  s10Title: {
    ru: "10. Применимое право",
    en: "10. Governing Law",
    hy: "10. Կիրառելի իրավունք",
    fr: "10. Droit applicable",
    de: "10. Anwendbares Recht",
    es: "10. Legislación aplicable",
    it: "10. Legge applicabile",
    ar: "10. القانون الواجب التطبيق",
    zh: "10. 适用法律",
    fa: "10. قانون حاکم",
  },
  s10p1: {
    ru: "Настоящие Условия регулируются законодательством Республики Армения. Все споры разрешаются путём переговоров, при невозможности — в компетентном суде города Ереван, Республика Армения.",
    en: "These Terms are governed by the legislation of the Republic of Armenia. All disputes shall be resolved through negotiations; failing that — in the competent court of the city of Yerevan, Republic of Armenia.",
    hy: "Այս Պայմանները կարգավորվում են Հայաստանի Հանրապետության օրենսդրությամբ։ Բոլոր վեճերը լուծվում են բանակցությունների միջոցով, իսկ անհնարինության դեպքում՝ Երևան քաղաքի իրազեկ դատարանում, Հայաստանի Հանրապետություն։",
    fr: "Les présentes Conditions sont régies par la législation de la République d'Arménie. Tout litige sera résolu par voie de négociation ; à défaut — devant le tribunal compétent de la ville d'Erevan, République d'Arménie.",
    de: "Diese Bedingungen unterliegen der Gesetzgebung der Republik Armenien. Alle Streitigkeiten werden durch Verhandlungen gelöst; ist dies nicht möglich — vor dem zuständigen Gericht der Stadt Eriwan, Republik Armenien.",
    es: "Los presentes Términos se rigen por la legislación de la República de Armenia. Toda disputa se resolverá mediante negociaciones; de no ser posible — ante el tribunal competente de la ciudad de Ereván, República de Armenia.",
    it: "I presenti Termini sono regolati dalla legislazione della Repubblica di Armenia. Tutte le controversie saranno risolte tramite negoziazione; in caso contrario — presso il tribunale competente della città di Yerevan, Repubblica di Armenia.",
    ar: "تخضع هذه الشروط لتشريعات جمهورية أرمينيا. تُحل جميع النزاعات عن طريق المفاوضات، وفي حال تعذر ذلك — أمام المحكمة المختصة في مدينة يريفان، جمهورية أرمينيا.",
    zh: "本条款受亚美尼亚共和国法律管辖。所有争议通过谈判解决；如无法解决 — 在亚美尼亚共和国埃里温市主管法院裁决。",
    fa: "این شرایط تابع قوانین جمهوری ارمنستان است. تمامی اختلافات از طریق مذاکره حل و فصل می‌شود؛ در غیر این صورت — در دادگاه صالح شهر ایروان، جمهوری ارمنستان.",
  },
};

export default function TermsPage() {
  const { tr, lang } = useLang();
  const l = tr.legal;
  const c = (key: string) => CONTENT[key]?.[lang] ?? CONTENT[key]?.ru ?? key;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
          <ChevronLeft size={16} /> {l.back}
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{l.terms}</h1>
          <p className="text-gray-500 text-sm mb-8">HayHome · hay-home.com</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s1Title")}</h2>
              <p>{c("s1p1")}</p>
              <p className="mt-2">{c("s1p2")}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s2Title")}</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li><strong>{c("s2l1b")}</strong> — {c("s2l1")}</li>
                <li><strong>{c("s2l2b")}</strong> — {c("s2l2")}</li>
                <li><strong>{c("s2l3b")}</strong> — {c("s2l3")}</li>
                <li><strong>{c("s2l4b")}</strong> — {c("s2l4")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s3Title")}</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>{c("s3l1")}</li>
                <li>{c("s3l2")}</li>
                <li>{c("s3l3")}</li>
                <li>{c("s3l4")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s4Title")}</h2>
              <p className="font-semibold text-gray-900 mt-3 mb-1">{c("s4aTitle")}</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>{c("s4a1")}</li>
                <li>{c("s4a2")}</li>
                <li>{c("s4a3")}</li>
              </ol>
              <p className="font-semibold text-gray-900 mt-4 mb-1">{c("s4bTitle")}</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>{c("s4b1")}</li>
                <li>{c("s4b2")}</li>
                <li>{c("s4b3")}</li>
              </ol>
              <p className="font-semibold text-gray-900 mt-4 mb-1">{c("s4cTitle")}</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>{c("s4c1")}</li>
                <li>{c("s4c2")}</li>
                <li>{c("s4c3")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s5Title")}</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>{c("s5l1")}</li>
                <li>{c("s5l2")}</li>
                <li><strong>{c("s5l3b")}</strong> {c("s5l3")}</li>
                <li><strong>{c("s5l4b")}</strong> {c("s5l4")}</li>
                <li>{c("s5l5")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s6Title")}</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>{c("s6l1")}</li>
                <li>{c("s6l2")}</li>
                <li>{c("s6l3")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s7Title")}</h2>
              <p>{c("s7p1")}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s8Title")}</h2>
              <p>{c("s8p1")}</p>
              <p className="mt-2">
                <strong>{c("s8p2b")}</strong> {c("s8p2")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s9Title")}</h2>
              <p>{c("s9p1")}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s10Title")}</h2>
              <p>{c("s10p1")}</p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-gray-400">
            <p>{c("lastUpdate")}</p>
            <p className="mt-1">{c("contactLink")} <a href="mailto:info@hayhome.am" className="text-red-600 hover:underline">info@hayhome.am</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
