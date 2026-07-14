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
  reportViolation: {
    ru: "Сообщить о нарушении или задать вопрос можно по адресу:",
    en: "To report a violation or ask a question, contact us at:",
    hy: "Խախտման մասին տեղեկացնել կամ հարց տալ կարելի է հետևյալ հասցեով՝",
    fr: "Pour signaler une infraction ou poser une question, contactez-nous à l'adresse :",
    de: " Verstöße melden oder Fragen stellen können Sie unter:",
    es: "Para reportar una infracción o hacer una pregunta, contáctenos en:",
    it: "Per segnalare una violazione o porre una domanda, contattaci all'indirizzo:",
    ar: "للإبلاغ عن انتهاك أو طرح سؤال، اتصل بنا على:",
    zh: "如需举报违规或提问，请联系：",
    fa: "برای گزارش تخلف یا پرسش سوال، با ما تماس بگیرید:",
  },

  // Section 1
  s1Title: {
    ru: "1. Назначение Правил",
    en: "1. Purpose of the Rules",
    hy: "1. Կանոնների նպատակը",
    fr: "1. Objet du Règlement",
    de: "1. Zweck der Regeln",
    es: "1. Propósito de las Normas",
    it: "1. Scopo del Regolamento",
    ar: "1. الغرض من القواعد",
    zh: "1. 规则的目的",
    fa: "1. هدف قوانین",
  },
  s1p1: {
    ru: "Настоящие Правила разработаны для обеспечения комфортного, безопасного и уважительного взаимодействия между Пользователями платформы HayHome (далее — «Платформа»).",
    en: "These Rules are designed to ensure comfortable, safe, and respectful interaction between the Users of the HayHome platform (hereinafter — the «Platform»).",
    hy: "Այս Կանոնները մշակվել են HayHome հարթակի (այսուհետ՝ «Հարթակ») Օգտատերերի միջև հարմարավետ, անվտանգ և հարգալից փոխհարաբերություններն ապահովելու համար։",
    fr: "Le présent Règlement est élaboré pour assurer une interaction confortable, sûre et respectueuse entre les Utilisateurs de la plateforme HayHome (ci-après — la « Plateforme »).",
    de: "Diese Regeln wurden entwickelt, um eine angenehme, sichere und respektvolle Interaktion zwischen den Nutzern der Plattform HayHome (nachfolgend — die «Plattform») zu gewährleisten.",
    es: "Las presentes Normas están diseñadas para garantizar una interacción cómoda, segura y respetuosa entre los Usuarios de la plataforma HayHome (en adelante, la «Plataforma»).",
    it: "Il presente Regolamento è elaborato per garantire un'interazione confortevole, sicura e rispettosa tra gli Utenti della piattaforma HayHome (di seguito — la «Piattaforma»).",
    ar: "وُضعت هذه القواعد لضمان تفاعل مريح وآمن ومحترم بين مستخدمي منصة HayHome (المشار إليها فيما يلي بـ «المنصة»).",
    zh: "本规则旨在确保 HayHome 平台（以下简称「平台」）用户之间舒适、安全和尊重的互动。",
    fa: "این قوانین برای تضمین تعامل راحت، ایمن و محترمانه بین کاربران پلتفرم HayHome (از این پس «پلتفرم») تدوین شده است.",
  },

  // Section 2
  s2Title: {
    ru: "2. Основные принципы",
    en: "2. Core Principles",
    hy: "2. Հիմնարար սկզբունքներ",
    fr: "2. Principes fondamentaux",
    de: "2. Grundprinzipien",
    es: "2. Principios fundamentales",
    it: "2. Principi fondamentali",
    ar: "2. المبادئ الأساسية",
    zh: "2. 基本原则",
    fa: "2. اصول بنیادی",
  },
  s2l1b: {
    ru: "Взаимоуважение.",
    en: "Mutual respect.",
    hy: "Փոխադարձ հարգանք։",
    fr: "Respect mutuel.",
    de: "Gegenseitiger Respekt.",
    es: "Respeto mutuo.",
    it: "Rispetto reciproco.",
    ar: "الاحترام المتبادل.",
    zh: "相互尊重。",
    fa: "احترام متقابل.",
  },
  s2l1: {
    ru: "Пользователи обязаны относиться друг к другу с уважением, независимо от национальности, религии и культуры.",
    en: "Users must treat each other with respect, regardless of nationality, religion, or culture.",
    hy: "Օգտատերերը պարտավոր են միմյանց վերաբերվել հարգանքով՝ անկախ ազգությունից, կրոնից և մշակույթից։",
    fr: "Les Utilisateurs doivent se traiter avec respect, sans distinction de nationalité, de religion ou de culture.",
    de: "Nutzer müssen einander mit Respekt begegnen, unabhängig von Nationalität, Religion und Kultur.",
    es: "Los Usuarios deben tratarse con respeto, independientemente de la nacionalidad, religión o cultura.",
    it: "Gli Utenti devono trattarsi con rispetto, indipendentemente dalla nazionalità, religione e cultura.",
    ar: "يجب على المستخدمين معاملة بعضهم البعض باحترام، بغض النظر عن الجنسية أو الدين أو الثقافة.",
    zh: "用户必须相互尊重，不分国籍、宗教和文化。",
    fa: "کاربران موظفند با یکدیگر با احترام رفتار کنند، صرف‌نظر از ملیت، مذهب و فرهنگ.",
  },
  s2l2b: {
    ru: "Честность.",
    en: "Honesty.",
    hy: "Ազնվություն։",
    fr: "Honnêteté.",
    de: "Ehrlichkeit.",
    es: "Honestidad.",
    it: "Onestà.",
    ar: "الصدق.",
    zh: "诚实。",
    fa: "صداقت.",
  },
  s2l2: {
    ru: "Информация в профилях, отзывах и бронированиях должна быть достоверной.",
    en: "Information in profiles, reviews, and bookings must be truthful.",
    hy: "Տեղեկատվությունը պրոֆիլներում, կարծիքներում և ամրագրումներում պետք է լինի վստահելի։",
    fr: "Les informations dans les profils, avis et réservations doivent être véridiques.",
    de: "Informationen in Profilen, Bewertungen und Buchungen müssen wahrheitsgemäß sein.",
    es: "La información en perfiles, reseñas y reservas debe ser veraz.",
    it: "Le informazioni nei profili, recensioni e prenotazioni devono essere veritiere.",
    ar: "يجب أن تكون المعلومات في الملفات الشخصية والمراجعات والحجوزات صادقة.",
    zh: "个人资料、评论和预订中的信息必须真实。",
    fa: "اطلاعات در پروفایل‌ها، نظرات و رزروها باید صادقانه باشد.",
  },
  s2l3b: {
    ru: "Гостеприимство.",
    en: "Hospitality.",
    hy: "Հյուրընկալություն։",
    fr: "Hospitalité.",
    de: "Gastfreundschaft.",
    es: "Hospitalidad.",
    it: "Ospitalità.",
    ar: "الضيافة.",
    zh: "好客。",
    fa: "مهمان‌نوازی.",
  },
  s2l3: {
    ru: "HayHome — это не просто аренда жилья, это культурный обмен. Ожидается открытое и доброжелательное отношение.",
    en: "HayHome is not just about renting accommodation — it is a cultural exchange. An open and friendly attitude is expected.",
    hy: "HayHome-ը միայն բնակարանի վարձակալություն չէ, դա մշակութային փոխանակում է։ Սպասվում է բաց և բարեսիրտ վերաբերմունք։",
    fr: "HayHome n'est pas qu'une simple location de logement — c'est un échange culturel. Une attitude ouverte et bienveillante est attendue.",
    de: "HayHome ist nicht nur eine Wohnungsvermietung — es ist ein kultureller Austausch. Eine offene und herzliche Haltung wird erwartet.",
    es: "HayHome no es solo un alquiler de alojamiento — es un intercambio cultural. Se espera una actitud abierta y amable.",
    it: "HayHome non è solo un affitto di alloggio — è uno scambio culturale. È previsto un atteggiamento aperto e cordiale.",
    ar: "HayHome ليست مجرد استئجار سكن — إنه تبادل ثقافي. يُتوقع موقف منفتح وودود.",
    zh: "HayHome 不仅仅是租房 — 它是文化交流。期望开放和友好的态度。",
    fa: "HayHome فقط اجاره مسکن نیست — یک تبادل فرهنگی است. نگرش باز و خوش‌بینانه انتظار می‌رود.",
  },
  s2l4b: {
    ru: "Безопасность.",
    en: "Safety.",
    hy: "Անվտանգություն։",
    fr: "Sécurité.",
    de: "Sicherheit.",
    es: "Seguridad.",
    it: "Sicurezza.",
    ar: "السلامة.",
    zh: "安全。",
    fa: "ایمنی.",
  },
  s2l4: {
    ru: "Пользователи обязаны соблюдать правила безопасности и не подвергать риску себя и окружающих.",
    en: "Users must follow safety rules and not endanger themselves or others.",
    hy: "Օգտատերերը պարտավոր են պահպանել անվտանգության կանոնները և չեն կարող ռիսկի ենթարկել իրենց և շրջապատին։",
    fr: "Les Utilisateurs doivent respecter les règles de sécurité et ne pas mettre en danger eux-mêmes et autrui.",
    de: "Nutzer müssen Sicherheitsregeln einhalten und sich selbst und andere nicht gefährden.",
    es: "Los Usuarios deben cumplir las normas de seguridad y no poner en peligro a sí mismos ni a los demás.",
    it: "Gli Utenti devono rispettare le regole di sicurezza e non mettere a rischio se stessi e gli altri.",
    ar: "يجب على المستخدمين اتباع قواعد السلامة وعدم تعريض أنفسهم والآخرين للخطر.",
    zh: "用户必须遵守安全规则，不得危及自身和他人。",
    fa: "کاربران موظفند قوانین ایمنی را رعایت کرده و خود و دیگران را در معرض خطر قرار ندهند.",
  },

  // Section 3
  s3Title: {
    ru: "3. Правила для Гостей",
    en: "3. Rules for Guests",
    hy: "3. Կանոններ հյուրերի համար",
    fr: "3. Règles pour les Invités",
    de: "3. Regeln für Gäste",
    es: "3. Normas para Invitados",
    it: "3. Regole per gli Ospiti",
    ar: "3. قواعد للضيوف",
    zh: "3. 客人规则",
    fa: "3. قوانین مهمانان",
  },
  s3l1: {
    ru: "Соблюдайте правила дома принимающей семьи.",
    en: "Follow the house rules of the host family.",
    hy: "Պահպանեք ընդունող ընտանիքի տան կանոնները։",
    fr: "Respectez le règlement intérieur de la famille d'accueil.",
    de: "Beachten Sie die Hausordnung der Gastgeberfamilie.",
    es: "Respete las normas de la casa de la familia anfitriona.",
    it: "Rispettate le regole della casa della famiglia ospitante.",
    ar: "احترم قواعد منزل العائلة المضيفة.",
    zh: "遵守寄宿家庭的房屋规则。",
    fa: "قوانین خانه خانواده میزبان را رعایت کنید.",
  },
  s3l2: {
    ru: "Уважайте распорядок дня, привычки и традиции семьи.",
    en: "Respect the daily routine, habits, and traditions of the family.",
    hy: "Հարգեք ընտանիքի ամենօրյա ռեժիմը, սովորույթներն ու ավանդույթները։",
    fr: "Respectez le rythme de vie, les habitudes et les traditions de la famille.",
    de: "Respektieren Sie den Tagesablauf, die Gewohnheiten und Traditionen der Familie.",
    es: "Respete el ritmo diario, los hábitos y las tradiciones de la familia.",
    it: "Rispettate la routine quotidiana, le abitudini e le tradizioni della famiglia.",
    ar: "احترم الروتين اليومي وعادات وتقاليد العائلة.",
    zh: "尊重家庭的日常作息、习惯和传统。",
    fa: "روتین روزانه، عادات و سنت‌های خانواده را احترام کنید.",
  },
  s3l3: {
    ru: "Не причиняйте ущерб имуществу. В случае ущерба — возместите его.",
    en: "Do not cause damage to property. In case of damage — compensate for it.",
    hy: "Չվնասեք գույքը։ Վնասի դեպքում՝ փոխհատուցեք այն։",
    fr: "Ne causez pas de dommages aux biens. En cas de dommage — compensez-le.",
    de: "Verursachen Sie keine Schäden am Eigentum. Im Schadensfall — entschädigen Sie diesen.",
    es: "No cause daños a la propiedad. En caso de daño — compértalo.",
    it: "Non causare danni alla proprietà. In caso di danno — rimborsalo.",
    ar: "لا تلحق الضرر بالممتلكات. في حالة الضرر — عوض عنه.",
    zh: "不要损坏财产。如有损坏 — 须赔偿。",
    fa: "به اموال خسارت نزنید. در صورت خسارت — جبران کنید.",
  },
  s3l4: {
    ru: "Не допускайте некорректного поведения, насилия или дискриминации.",
    en: "Do not engage in inappropriate behaviour, violence, or discrimination.",
    hy: "Չթույլատրեք սխալ վարքագիծ, բռնություն կամ խտրականություն։",
    fr: "Ne tolérez pas de comportement inapproprié, de violence ou de discrimination.",
    de: "Kein unangemessenes Verhalten, keine Gewalt oder Diskriminierung.",
    es: "No permita comportamiento inapropiado, violencia o discriminación.",
    it: "Non impegnarsi in comportamenti inappropriati, violenza o discriminazione.",
    ar: "لا تسمح بسلوك غير لائق أو عنف أو تمييز.",
    zh: "不得有不当行为、暴力或歧视。",
    fa: "رفتار نامناسب، خشونت یا تبعیض مجاز نیست.",
  },
  s3l5: {
    ru: "При прибытии предъявите документ, удостоверяющий личность.",
    en: "Present an identification document upon arrival.",
    hy: "Ժամանելիս ներկայացրեք անձը հաստատող փաստաթուղթ։",
    fr: "Présentez une pièce d'identité à votre arrivée.",
    de: "Legen Sie bei der Ankunft ein Ausweisdokument vor.",
    es: "Presente un documento de identidad al llegar.",
    it: "Presenta un documento d'identità all'arrivo.",
    ar: "قدم وثيقة إثبات الهوية عند الوصول.",
    zh: "抵达时请出示身份证明文件。",
    fa: "هنگام arrival مدرک شناسایی ارائه دهید.",
  },
  s3l6: {
    ru: "Соблюдайте чистоту и порядок в доме.",
    en: "Maintain cleanliness and order in the house.",
    hy: "Պահպանեք մաքրություն և կարգուկանոն տանը։",
    fr: "Maintenez la propreté et l'ordre dans la maison.",
    de: "Halten Sie Sauberkeit und Ordnung im Haus.",
    es: "Mantenga la limpieza y el orden en la casa.",
    it: "Mantieni pulizia e ordine in casa.",
    ar: "حافظ على النظافة والنظام في المنزل.",
    zh: "保持房屋清洁和整齐。",
    fa: "نظافت و نظم در خانه را حفظ کنید.",
  },

  // Section 4
  s4Title: {
    ru: "4. Правила для Хозяев",
    en: "4. Rules for Hosts",
    hy: "4. Կանոններ տնային տերերի համար",
    fr: "4. Règles pour les Hôtes",
    de: "4. Regeln für Gastgeber",
    es: "4. Normas para Anfitriones",
    it: "4. Regole per gli Ospitanti",
    ar: "4. قواعد للمضيفين",
    zh: "4. 房东规则",
    fa: "4. قوانین میزبانان",
  },
  s4l1: {
    ru: "Предоставляйте достоверную информацию о своём доме и условиях.",
    en: "Provide accurate information about your home and conditions.",
    hy: "Տրամադրեք ձեր տան և պայմանների մասին ճշգրիտ տեղեկատվություն։",
    fr: "Fournissez des informations exactes sur votre domicile et vos conditions.",
    de: "Geben Sie wahrheitsgemäße Informationen über Ihr Zuhause und die Bedingungen.",
    es: "Proporcione información veraz sobre su hogar y sus condiciones.",
    it: "Fornisci informazioni accurate sulla tua casa e sulle condizioni.",
    ar: "قدم معلومات دقيقة عن منزلك والظروف.",
    zh: "提供关于您的房屋和条件的真实信息。",
    fa: "اطلاعات دقیق درباره خانه و شرایط خود ارائه دهید.",
  },
  s4l2: {
    ru: "Обеспечьте базовый уровень комфорта: чистое постельное бельё, горячая вода, безопасность.",
    en: "Ensure a basic level of comfort: clean bed linen, hot water, safety.",
    hy: "Ապահովեք հարմարավետության հիմնական մակարդակ՝ մաքուր անկողնային սպիտակեղեն, տաք ջուր, անվտանգություն։",
    fr: "Assurez un niveau de confort de base : linge de lit propre, eau chaude, sécurité.",
    de: "Gewährleisten Sie einen grundlegenden Komfort: saubere Bettwäsche, warmes Wasser, Sicherheit.",
    es: "Garantice un nivel básico de comodidad: ropa de cama limpia, agua caliente, seguridad.",
    it: "Garantisci un livello base di comfort: biancheria da letto pulita, acqua calda, sicurezza.",
    ar: "اضمن مستوى أساسي من الراحة: أغطية سرير نظيفة، ماء ساخن، أمان.",
    zh: "确保基本的舒适水平：干净的床单、热水、安全。",
    fa: "حداقل سطح راحتی را تضمین کنید: ملحفه تمیز، آب گرم، ایمنی.",
  },
  s4l3: {
    ru: "Уважайте частную жизнь Гостей.",
    en: "Respect the privacy of Guests.",
    hy: "Հարգեք Հյուրերի անձնական կյանքը։",
    fr: "Respectez la vie privée des Invités.",
    de: "Respektieren Sie die Privatsphäre der Gäste.",
    es: "Respete la privacidad de los Invitados.",
    it: "Rispetta la privacy degli Ospiti.",
    ar: "احترم خصوصية الضيوف.",
    zh: "尊重客人的隐私。",
    fa: "حریم خصوصی مهمانان را احترام کنید.",
  },
  s4l4: {
    ru: "Не допускайте дискриминации по любому признаку.",
    en: "Do not allow discrimination on any basis.",
    hy: "Չթույլատրեք խտրականություն որևէ հատկանիշով։",
    fr: "Ne tolérez aucune discrimination sous quelque forme que ce soit.",
    de: "Lassen Sie keine Diskriminierung jeglicher Art zu.",
    es: "No permita discriminación de ningún tipo.",
    it: "Non consentire discriminazioni di alcun tipo.",
    ar: "لا تسمح بالتمييز لأي سبب.",
    zh: "不得以任何理由进行歧视。",
    fa: "اجازه هیچ‌گونه تبعیض را ندهید.",
  },
  s4l5: {
    ru: "Своевременно отвечайте на запросы о бронировании.",
    en: "Respond to booking requests in a timely manner.",
    hy: "Ժամանակին պատասխանեք ամրագրման հարցումներին։",
    fr: "Répondez aux demandes de réservation dans les meilleurs délais.",
    de: "Beantworten Sie Buchungsanfragen rechtzeitig.",
    es: "Responda a las solicitudes de reserva de manera oportuna.",
    it: "Rispondi tempestivamente alle richieste di prenotazione.",
    ar: "رد على طلبات الحجز في الوقت المناسب.",
    zh: "及时回复预订请求。",
    fa: "به درخواست‌های رزرو به‌موقع پاسخ دهید.",
  },
  s4l6: {
    ru: "Сообщайте Платформе о любых инцидентах.",
    en: "Report any incidents to the Platform.",
    hy: "Տեղեկացրեք Հարթակին ցանկացած միջադեպի մասին։",
    fr: "Signalez tout incident à la Plateforme.",
    de: "Melden Sie jegliche Vorfälle der Plattform.",
    es: "Informe a la Plataforma de cualquier incidente.",
    it: "Segnala qualsiasi incidente alla Piattaforma.",
    ar: "أبلغ المنصة عن أي حوادث.",
    zh: "向平台报告任何事件。",
    fa: "هرگونه حادثه را به پلتفرم گزارش دهید.",
  },

  // Section 5
  s5Title: {
    ru: "5. Запрещённые действия",
    en: "5. Prohibited Actions",
    hy: "5. Արգելված գործողություններ",
    fr: "5. Actions interdites",
    de: "5. Verbotene Handlungen",
    es: "5. Acciones prohibidas",
    it: "5. Azioni vietate",
    ar: "5. الإجراءات المحظورة",
    zh: "5. 禁止行为",
    fa: "5. اقدامات ممنوع",
  },
  s5l1: {
    ru: "Размещение недостоверной информации или чужих фотографий.",
    en: "Posting false information or photos belonging to others.",
    hy: "Կեղծ տեղեկատվության կամ ուրիշների լուսանկարների տեղադրում։",
    fr: "La publication d'informations fausses ou de photos appartenant à autrui.",
    de: "Die Veröffentlichung falscher Informationen oder fremder Fotos.",
    es: "Publicar información falsa o fotos de terceros.",
    it: "Pubblicare informazioni false o foto di terzi.",
    ar: "نشر معلومات كاذبة أو صور تنتمي للآخرين.",
    zh: "发布虚假信息或他人的照片。",
    fa: "انتشار اطلاعات نادرست یا عکس‌های دیگران.",
  },
  s5l2: {
    ru: "Организация любых незаконных деятельностей на территории проживания.",
    en: "Organising any illegal activities on the premises.",
    hy: "Ցանկացած անօրինական գործունեության կազմակերպում բնակության տարածքում։",
    fr: "L'organisation de toute activité illégale sur le lieu de résidence.",
    de: "Die Organisation rechtswidriger Aktivitäten in den Wohnräumlichkeiten.",
    es: "Organizar cualquier actividad ilegal en el lugar de residencia.",
    it: "Organizzare qualsiasi attività illegale nei locali di soggiorno.",
    ar: "تنظيم أي أنشطة غير قانونية في مكان الإقامة.",
    zh: "在居住场所组织任何非法活动。",
    fa: "سازماندهی هرگونه فعالیت غیرقانونی در محل اقامت.",
  },
  s5l3: {
    ru: "Курение в доме без разрешения Хозяина.",
    en: "Smoking in the house without the Host's permission.",
    hy: "Ծխել տանը առանց Տնային տիրոջ թույլտվության։",
    fr: "Fumer dans la maison sans l'autorisation de l'Hôte.",
    de: "Rauchen im Haus ohne Erlaubnis des Gastgebers.",
    es: "Fumar en la casa sin el permiso del Anfitrión.",
    it: "Fumare in casa senza il permesso dell'Ospitante.",
    ar: "التدخين في المنزل دون إذن المضيف.",
    zh: "未经房东允许在屋内吸烟。",
    fa: "کشیدن سیگار در خانه بدون اجازه میزبان.",
  },
  s5l4: {
    ru: "Передача бронирования третьим лицам без согласования.",
    en: "Transferring a booking to third parties without consent.",
    hy: "Ամրագրման փոխանցում երրորդ անձանց առանց համաձայնության։",
    fr: "Le transfert de réservation à des tiers sans accord.",
    de: "Die Übertragung einer Buchung an Dritte ohne Zustimmung.",
    es: "Transferir una reserva a terceros sin consentimiento.",
    it: "Trasferire una prenotazione a terzi senza consenso.",
    ar: "نقل الحجز إلى أطراف ثالثة دون موافقة.",
    zh: "未经同意将预订转让给第三方。",
    fa: "انتقال رزرو به اشخاص ثالث بدون رضایت.",
  },
  s5l5: {
    ru: "Мошенничество, включая фиктивные отзывы и бронирования.",
    en: "Fraud, including fake reviews and bookings.",
    hy: "Խարդախություն, ներառյալ կեղծ կարծիքներ և ամրագրումներ։",
    fr: "La fraude, y compris les faux avis et réservations.",
    de: "Betrug, einschließlich gefälschter Bewertungen und Buchungen.",
    es: "Fraude, incluidas reseñas y reservas falsas.",
    it: "Frode, incluse recensioni e prenotazioni false.",
    ar: "الاحتيال، بما في ذلك المراجعات والحجوزات المزيفة.",
    zh: "欺诈，包括虚假评论和预订。",
    fa: "تقلب، از جمله نظرات و رزروهای جعلی.",
  },
  s5l6: {
    ru: "Спам и массовая рассылка через Платформу.",
    en: "Spam and mass mailing through the Platform.",
    hy: "Սպամ և զանգվածային ուղարկում Հարթակի միջոցով։",
    fr: "Le spam et l'envoi massif via la Plateforme.",
    de: "Spam und Massenversand über die Plattform.",
    es: "Spam y envío masivo a través de la Plataforma.",
    it: "Spam e invio massivo tramite la Piattaforma.",
    ar: "الرسائل المزعجة والإرسال الجماعي عبر المنصة.",
    zh: "通过平台发送垃圾邮件和群发邮件。",
    fa: "هرزنامه و ارسال انبوه از طریق پلتفرم.",
  },

  // Section 6
  s6Title: {
    ru: "6. Система рейтинга и отзывов",
    en: "6. Rating and Review System",
    hy: "6. Վարկանիշային և կարծիքների համակարգ",
    fr: "6. Système de notation et d'avis",
    de: "6. Bewertungs- und Rezensionssystem",
    es: "6. Sistema de valoración y reseñas",
    it: "6. Sistema di valutazione e recensioni",
    ar: "6. نظام التقييم والمراجعات",
    zh: "6. 评分和评论系统",
    fa: "6. سیستم امتیازدهی و نظرات",
  },
  s6l1: {
    ru: "Оценки и отзывы — основа доверия на Платформе.",
    en: "Ratings and reviews are the foundation of trust on the Platform.",
    hy: "Գնահատականներն ու կարծիքները Հարթակում վստահության հիմքն են։",
    fr: "Les évaluations et avis sont le fondement de la confiance sur la Plateforme.",
    de: "Bewertungen und Rezensionen sind die Grundlage des Vertrauens auf der Plattform.",
    es: "Las valoraciones y reseñas son la base de la confianza en la Plataforma.",
    it: "Le valutazioni e le recensioni sono la base della fiducia sulla Piattaforma.",
    ar: "التقييمات والمراجعات هي أساس الثقة في المنصة.",
    zh: "评分和评论是平台信任的基础。",
    fa: "امتیازات و نظرات پایه اعتماد در پلتفرم هستند.",
  },
  s6l2: {
    ru: "Отзывы оставляются только после завершённого Визита.",
    en: "Reviews may only be left after a completed Visit.",
    hy: "Կարծիքները թողնվում են միայն ավարտված Այցից հետո։",
    fr: "Les avis ne peuvent être laissés qu'après une Visite terminée.",
    de: "Bewertungen dürfen nur nach einem abgeschlossenen Besuch abgegeben werden.",
    es: "Las reseñas solo pueden dejarse después de una Visita completada.",
    it: "Le recensioni possono essere lasciate solo dopo una Visita completata.",
    ar: "لا يمكن ترك المراجعات إلا بعد زيارة مكتملة.",
    zh: "只有在完成的访问后才能发表评论。",
    fa: "نظرات تنها پس از اتمام بازدید قابل ثبت هستند.",
  },
  s6l3: {
    ru: "Запрещается оставлять отзывы за вознаграждение или под давлением.",
    en: "It is prohibited to leave reviews for a reward or under pressure.",
    hy: "Արգելվում է կարծիքներ թողնել պարգևատրման դիմաց կամ ճնշման տակ։",
    fr: "Il est interdit de laisser des avis contre récompense ou sous la contrainte.",
    de: "Es ist verboten, Bewertungen gegen Belohnung oder unter Druck abzugeben.",
    es: "Está prohibido dejar reseñas a cambio de una recompensa o bajo presión.",
    it: "È vietato lasciare recensioni in cambio di una ricompensa o sotto pressione.",
    ar: "يُحظر ترك مراجعات مقابل مكافأة أو تحت الضغط.",
    zh: "禁止为获取奖励或受到压力而发表评论。",
    fa: "ثبت نظر در قبال پاداش یا تحت فشار ممنوع است.",
  },
  s6l4: {
    ru: "Платформа может удалить отзыв, нарушающий Правила.",
    en: "The Platform may remove a review that violates the Rules.",
    hy: "Հարթակը կարող է հեռացնել Կանոնները խախտող կարծիքը։",
    fr: "La Plateforme peut supprimer un avis qui enfreint le Règlement.",
    de: "Die Plattform kann Bewertungen entfernen, die gegen die Regeln verstoßen.",
    es: "La Plataforma puede eliminar una reseña que infrinja las Normas.",
    it: "La Piattaforma può rimuovere una recensione che viola il Regolamento.",
    ar: "يمكن للمنصة حذف المراجعات التي تنتهك القواعد.",
    zh: "平台可以删除违反规则的评论。",
    fa: "پلتفرم می‌تواند نظری را که قوانین را نقض می‌کند حذف کند.",
  },

  // Section 7
  s7Title: {
    ru: "7. Меры за нарушение",
    en: "7. Penalties for Violations",
    hy: "7. Միջոցներ խախտման համար",
    fr: "7. Mesures en cas d'infraction",
    de: "7. Maßnahmen bei Verstößen",
    es: "7. Medidas por infracciones",
    it: "7. Misure per le violazioni",
    ar: "7. تدابير للانتهاكات",
    zh: "7. 违规处罚",
    fa: "7. اقدامات در صورت تخلف",
  },
  s7l1: {
    ru: "Предупреждение.",
    en: "Warning.",
    hy: "Նախազգուշացում։",
    fr: "Avertissement.",
    de: "Verwarnung.",
    es: "Advertencia.",
    it: "Avvertimento.",
    ar: "تحذير.",
    zh: "警告。",
    fa: "اخطار.",
  },
  s7l2: {
    ru: "Временная блокировка аккаунта.",
    en: "Temporary account suspension.",
    hy: "Հաշվի ժամանակավոր արգելափակում։",
    fr: "Blocage temporaire du compte.",
    de: "Vorübergehende Kontosperrung.",
    es: "Bloqueo temporal de la cuenta.",
    it: "Sospensione temporanea dell'account.",
    ar: "تعليق مؤقت للحساب.",
    zh: "暂时封禁账户。",
    fa: "مسدودسازی موقت حساب.",
  },
  s7l3: {
    ru: "Удаление отзывов или профиля.",
    en: "Removal of reviews or profile.",
    hy: "Կարծիքների կամ պրոֆիլի հեռացում։",
    fr: "Suppression des avis ou du profil.",
    de: "Entfernung von Bewertungen oder Profilen.",
    es: "Eliminación de reseñas o perfil.",
    it: "Rimozione di recensioni o profilo.",
    ar: "حذف المراجعات أو الملف الشخصي.",
    zh: "删除评论或个人资料。",
    fa: "حذف نظرات یا پروفایل.",
  },
  s7l4: {
    ru: "Постоянная блокировка на Платформе.",
    en: "Permanent ban from the Platform.",
    hy: "Մշտական արգելափակում Հարթակում։",
    fr: "Bannissement définitif de la Plateforme.",
    de: "Dauerhafte Sperrung auf der Plattform.",
    es: "Bloqueo permanente en la Plataforma.",
    it: "Divieto permanente dalla Piattaforma.",
    ar: "حظر دائم من المنصة.",
    zh: "永久封禁平台。",
    fa: "مسدودسازی دائمی در پلتفرم.",
  },
  s7l5: {
    ru: "Передача информации в правоохранительные органы (при необходимости).",
    en: "Referral of information to law enforcement authorities (if necessary).",
    hy: "Տեղեկատվության փոխանցում իրավապահպան մարմիններին (անհրաժեշտության դեպքում)։",
    fr: "Transmission des informations aux autorités compétentes (si nécessaire).",
    de: "Weiterleitung von Informationen an die Strafverfolgungsbehörden (falls erforderlich).",
    es: "Remisión de información a las autoridades competentes (si es necesario).",
    it: "Trasferimento delle informazioni alle autorità di contrasto (se necessario).",
    ar: "إحالة المعلومات إلى سلطات إنفاذ القانون (عند الضرورة).",
    zh: "向执法机关移交信息（如有必要）。",
    fa: "ارجاع اطلاعات به مراجع انتظامی (در صورت لزوم).",
  },

  // Section 8
  s8Title: {
    ru: "8. Обратная связь",
    en: "8. Feedback",
    hy: "8. Հետադարձ կապ",
    fr: "8. Retour d'information",
    de: "8. Rückmeldung",
    es: "8. Comentarios",
    it: "8. Feedback",
    ar: "8. الملاحظات",
    zh: "8. 反馈",
    fa: "8. بازخورد",
  },
  s8p1: {
    ru: "Сообщить о нарушении или задать вопрос можно по адресу:",
    en: "To report a violation or ask a question, contact us at:",
    hy: "Խախտման մասին տեղեկացնել կամ հարց տալ կարելի է հետևյալ հասցեով՝",
    fr: "Pour signaler une infraction ou poser une question, contactez-nous à :",
    de: "Um einen Verstoß zu melden oder eine Frage zu stellen, kontaktieren Sie uns unter:",
    es: "Para reportar una infracción o hacer una pregunta, contáctenos en:",
    it: "Per segnalare una violazione o fare una domanda, contattaci all'indirizzo:",
    ar: "للإبلاغ عن انتهاك أو طرح سؤال، اتصل بنا على:",
    zh: "如需举报违规或提问，请联系：",
    fa: "برای گزارش تخلف یا پرسش سوال، با ما تماس بگیرید:",
  },
};

export default function RulesPage() {
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{l.rules}</h1>
          <p className="text-gray-500 text-sm mb-8">HayHome · hay-home.com</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s1Title")}</h2>
              <p>{c("s1p1")}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s2Title")}</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li><strong>{c("s2l1b")}</strong> {c("s2l1")}</li>
                <li><strong>{c("s2l2b")}</strong> {c("s2l2")}</li>
                <li><strong>{c("s2l3b")}</strong> {c("s2l3")}</li>
                <li><strong>{c("s2l4b")}</strong> {c("s2l4")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s3Title")}</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>{c("s3l1")}</li>
                <li>{c("s3l2")}</li>
                <li>{c("s3l3")}</li>
                <li>{c("s3l4")}</li>
                <li>{c("s3l5")}</li>
                <li>{c("s3l6")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s4Title")}</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>{c("s4l1")}</li>
                <li>{c("s4l2")}</li>
                <li>{c("s4l3")}</li>
                <li>{c("s4l4")}</li>
                <li>{c("s4l5")}</li>
                <li>{c("s4l6")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s5Title")}</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>{c("s5l1")}</li>
                <li>{c("s5l2")}</li>
                <li>{c("s5l3")}</li>
                <li>{c("s5l4")}</li>
                <li>{c("s5l5")}</li>
                <li>{c("s5l6")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s6Title")}</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>{c("s6l1")}</li>
                <li>{c("s6l2")}</li>
                <li>{c("s6l3")}</li>
                <li>{c("s6l4")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s7Title")}</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>{c("s7l1")}</li>
                <li>{c("s7l2")}</li>
                <li>{c("s7l3")}</li>
                <li>{c("s7l4")}</li>
                <li>{c("s7l5")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c("s8Title")}</h2>
              <p>
                {c("s8p1")}{" "}
                <a href="mailto:info@hayhome.am" className="text-red-600 hover:underline">info@hayhome.am</a>
              </p>
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
