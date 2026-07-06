"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Printer, Share2, MessageCircle } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

type Host = {
  id: string; name: string; familyName: string; patronymic?: string;
  phone: string; email: string; location?: string; city?: string; region?: string;
  passportSeries?: string; passportNumber?: string; passportDate?: string;
  passportIssued?: string; inn?: string; bankAccount?: string; bankName?: string;
};

function Ct(key: string, lang: string): string {
  const T: Record<string, Record<string, string>> = {
    title: { ru:"ДОГОВОР О СОТРУДНИЧЕСТВЕ", en:"COOPERATION AGREEMENT", hy:"ՀԱՄԱԳՈՐԾՈՒԹՅԱՆ ՊԱՅՏԱԳՐՈՒԹՅՈՒՆ", fr:"ACCORD DE COOPÉRATION", de:"KOOPERATIONSVERTRAG", es:"ACUERDO DE COOPERACIÓN", it:"ACCORDO DI COOPERAZIONE", ar:"عقد تعاون", zh:"合作协议", fa:"قرارداد همکاری" },
    subtitle: { ru:"по оказанию услуг приёма гостей в Армении", en:"on guest hospitality services in Armenia", hy:"հյուրերի ընդունելու ծառայություններ Հայաստանում", fr:"de services d'hospitalité en Arménie", de:"über Gastfreundschaftsdienste in Armenien", es:"sobre servicios de hospitalidad en Armenia", it:"sui servizi di ospitalità in Armenia", ar:"على خدمات الضيافة في أرمينيا", zh:"关于亚美尼亚的接待服务", fa:"درباره خدمات مهمانداری در ارمنستان" },
    platform: { ru:"ИП Саркисян Ревик Сергеевич", en:"Individual Entrepreneur Sargisyan Revik Sergeevich", hy:"Սարգսյան Ռեվիկ Սերգեյի ԻԱ\Ԁ", fr:"Entrepreneur individuel Sargisyan Revik Sergeevich", de:"Einzelunternehmer Sargisyan Revik Sergeevich", es:"Empresario individual Sargisyan Revik Sergeevich", it:"Imprenditore individuale Sargisyan Revik Sergeevich", ar:"رجل أعمال فردي سارغيسيان ريفيك سيرجيفيتش", zh:"个体经营者 Sargisyan Revik Sergeevich", fa:"فرد کارآفرین Sargisyan Revik Sergeevich" },
    partyPlatform: { ru:"«Платформа»", en:"«Platform»", hy:"«հարթակ»", fr:"«Plateforme»", de:"«Plattform»", es:"«Plataforma»", it:"«Piattaforma»", ar:"«المنصة»", zh:"«平台»", fa:"«پلتفرم»" },
    partyPartner: { ru:"«Партнёр»", en:"«Partner»", hy:"«Գործընկեր»", fr:"«Partenaire»", de:"«Partner»", es:"«Socio»", it:"«Partner»", ar:"«الشريك»", zh:"«合作伙伴»", fa:"«شریک»" },
    actingAs: { ru:"действующий в качестве индивидуального предпринимателя", en:"acting as an individual entrepreneur", hy:"գործող որպես ձինված ձեռնարկային", fr:"agissant en tant qu'entrepreneur individuel", de:"handelnd als Einzelunternehmer", es:"actuando como empresario individual", it:"agendo come imprenditore individuale", ar:"كرجل أعمال فردي", zh:"以个体经营者身份", fa:"به عنوان کارآفرین فردی" },
    actingAsPerson: { ru:"действующий в качестве физического лица", en:"acting as an individual", hy:"գործող որպես ֆիզիկական անձ", fr:"agissant en tant que personne physique", de:"handelnd als natürliche Person", es:"actuando como persona física", it:"agendo come persona fisica", ar:"كشخص طبيعي", zh:"以个人身份", fa:"به عنوان شخص حقیقی" },
    together: { ru:"совместно именуемые «Стороны», заключили настоящий Договор о нижеследующем:", en:"hereinafter jointly referred to as the «Parties», have concluded this Agreement:", hy:"միաստակաբանված որպես «Կողմեր», կնքել են այս պայտագրությունը.", fr:"ci-après dénommés conjointement les «Parties», ont conclu le présent Accord:", de:"gemeinsam als «Vertragsparteien» bezeichnet, haben folgenden Vertrag geschlossen:", es:"en adelante denominados conjuntamente las «Partes», han concluido el presente Acuerdo:", it:"di seguito denominati congiuntamente le «Parti», hanno concluso il seguente Accordo:", ar:"المشار إليهما معاً بـ «الطرفان»، وافقا على هذا العقد:", zh:"以下简称为「双方」，订立本协议：", fa:"که در ادامه به صورت مشترک «طرفین» نامیده می‌شوند، این قرارداد را منعقد کرده‌اند:" },
    oneSide: { ru:"с одной стороны, и", en:"on the one hand, and", hy:"մի կողմից, և", fr:"d'une part, et", de:"einerseits, und", es:"por una parte, y", it:"da una parte, e", ar:"من جهة، و", zh:"一方，和", fa:"از یک طرف، و" },
    s1_1: { ru:"Платформа предоставляет Партнёру доступ к онлайн-платформе HayHome (hay-home.com hay-home.com) для размещения информации об услугах приёма гостей.", en:"The Platform provides the Partner with access to the online platform HayHome (hay-home.com) for posting information about guest hospitality services.", hy:"հարթակը գործընկերուհին տրամադրում է HayHome (hay-home.com) օնլայն հարթակի հասանելիություն՝ հյուրերի ընդունելու ծառայությունների մասին տեղեկատվություն տեղադրելու համար.", fr:"La Plateforme fournit au Partenaire l'accès à la plateforme en ligne HayHome (hay-home.com) pour publier des informations sur les services d'hospitalité.", de:"Die Plattform gewährt dem Partner Zugang zur Online-Plattform HayHome (hay-home.com) zur Veröffentlichung von Informationen über Gastfreundschaftsdienste.", es:"La Plataforma proporciona al Socio acceso a la plataforma en línea HayHome (hay-home.com) para publicar información sobre servicios de hospitalidad.", it:"La Piattaforma fornisce al Partner l'accesso alla piattaforma online HayHome (hay-home.com) per pubblicare informazioni sui servizi di ospitalità.", ar:"توفر المنصة للشريك الوصول إلى منصة HayHome عبر الإنترنت لنشر معلومات عن خدمات الضيافة.", zh:"平台向合作伙伴提供在线平台HayHome (hay-home.com)的访问权限，用于发布接待服务信息。", fa:"پلتفرم به شریک دسترسی به پلتفرم آنلاین HayHome (hay-home.com) را برای انتشار اطلاعات خدمات مهمانداری ارائه می‌دهد." },
    s1_2: { ru:"Партнёр обязуется предоставлять услуги приёма гостей на территории Республики Армения.", en:"The Partner undertakes to provide guest hospitality services on the territory of the Republic of Armenia.", hy:"Գործընկերը պարտավորվում է տրամադրել հյուրերի ընդունելու ծառայություններ Հայաստանի Հանրապետության տարածքում.", fr:"Le Partenaire s'engage à fournir des services d'hospitalité sur le territoire de la République d'Arménie.", de:"Der Partner verpflichtet sich, Gastfreundschaftsdienste auf dem Gebiet der Republik Armenien anzubieten.", es:"El Socio se compromete a proporcionar servicios de hospitalidad en el territorio de la República de Armenia.", it:"Il Partner si impegna a fornire servizi di ospitalità sul territorio della Repubblica di Armenia.", ar:"يلتزم الشريك بتقديم خدمات الضيافة على أراضي جمهورية أرمينيا.", zh:"合作伙伴承诺在亚美尼亚共和国境内提供接待服务。", fa:"شریک متعهد است خدمات مهمانداری را در قلمرو جمهوری ارمنستان ارائه دهد." },
    s1_3: { ru:"Платформа обеспечивает техническое сопровождение, продвижение и обработку бронирований.", en:"The Platform provides technical support, promotion and booking processing.", hy:"հարթակը ապահովում է տեխնիկական աջակցություն, խթանգնդում և ամրագրումների մշակում.", fr:"La Plateforme assure le support technique, la promotion et le traitement des réservations.", de:"Die Plattform bietet technische Unterstützung, Werbung und Buchungsverarbeitung.", es:"La Plataforma proporciona soporte técnico, promoción y procesamiento de reservas.", it:"La Piattaforma fornisce supporto tecnico, promozione e elaborazione delle prenotazioni.", ar:"توفر المنصة الدعم الفني والترويج ومعالجة الحجوزات.", zh:"平台提供技术支持、推广和预订处理。", fa:"پلتفرم پشتیبانی فنی، تبلیغات و پردازش رزرو را فراهم می‌کند." },
    s2_1: { ru:"Предоставить Партнёру доступ к личному кабинету на платформе.", en:"Provide the Partner with access to the personal account on the platform.", hy:"Տրամադրել գործընկերուհին հասանելիություն անձնական հաշվին հարթակում.", fr:"Fournir au Partenaire l'accès au compte personnel sur la plateforme.", de:"Dem Partner Zugang zum persönlichen Konto auf der Plattform gewähren.", es:"Proporcionar al Socio acceso a la cuenta personal en la plataforma.", it:"Fornire al Partner l'accesso all'account personale sulla piattaforma.", ar:"توفير للشريك الوصول إلى الحساب الشخصي على المنصة.", zh:"向合作伙伴提供平台上个人账户的访问权限。", fa:"به شریک دسترسی به حساب شخصی در پلتفرم را ارائه دهد." },
    s2_2: { ru:"Обеспечивать техническую работоспособность платформы hay-home.com hay-home.com.", en:"Ensure the technical operability of the platform hay-home.com.", hy:"Ապահովել hay-home.com հարթակի տեխնիկական աշխատանքը.", fr:"Assurer le fonctionnement technique de la plateforme hay-home.com.", de:"Die technische Funktionsfähigkeit der Plattform hay-home.com sicherstellen.", es:"Garantizar el funcionamiento técnico de la plataforma hay-home.com.", it:"Garantire il funzionamento tecnico della piattaforma hay-home.com.", ar:"ضمان التشغيل الفني لمنصة hay-home.com.", zh:"确保平台hay-home.com的技术运行。", fa:"عملکرد فنی پلتفرم hay-home.com را تضمین کند." },
    s2_3: { ru:"Осуществлять продвижение платформы и услуг Партнёра.", en:"Promote the platform and the Partner's services.", hy:"Կատարել հարթակի և գործընկերուհի ծառայությունների խթանգնդումը.", fr:"Promouvoir la plateforme et les services du Partenaire.", de:"Die Plattform und die Dienste des Partners bewerben.", es:"Promocionar la plataforma y los servicios del Socio.", it:"Promuovere la piattaforma e i servizi del Partner.", ar:"الترويج للمنصة وخدمات الشريك.", zh:"推广平台及合作伙伴的服务。", fa:"تبلیغ پلتفرم و خدمات شریک." },
    s2_4: { ru:"Обрабатывать и передавать Партнёру информацию о бронированиях.", en:"Process and forward booking information to the Partner.", hy:"Մշակել և փոխանցել գործընկերուհին ամրագրման տեղեկատվությունը.", fr:"Traiter et transmettre les informations de réservation au Partenaire.", de:"Buchungsinformationen verarbeiten und an den Partner weiterleiten.", es:"Procesar y transmitir al Socio la información de reservas.", it:"Elaborare e inoltrare le informazioni di prenotazione al Partner.", ar:"معالجة وإرسال معلومات الحجوزات إلى الشريك.", zh:"处理并向合作伙伴转达预订信息。", fa:"پردازش و ارسال اطلاعات رزرو به شریک." },
    s2_5: { ru:"Производить выплаты Партнёру в размере 84% от суммы каждого бронирования.", en:"Pay the Partner 84% of each booking amount.", hy:"Վճարել գործընկերուհին յուրաքանչյուր ամրագրման գումարի 84%-ը.", fr:"Payer au Partenaire 84% du montant de chaque réservation.", de:"Dem Partner 84% jedes Buchungsbetrages auszahlen.", es:"Pagar al Socio el 84% del monto de cada reserva.", it:"Pagare al Partner il 84% dell'importo di ogni prenotazione.", ar:"دفع للشريك 84% من مبلغ كل حجز.", zh:"向合作伙伴支付每笔预订金额的84%。", fa:"به شریک 84% مبلغ هر رزرو را پرداخت کند." },
    s3_1: { ru:"Предоставлять услуги приёма гостей в соответствии с описанием на платформе.", en:"Provide hospitality services in accordance with the description on the platform.", hy:"Տրամադրել հյուրերի ընդունելու ծառայություններ՝ համապատասխան հարթակում տրված նկարագրությանը.", fr:"Fournir des services d'hospitalité conformément à la description sur la plateforme.", de:"Gastfreundschaftsdienste gemäß der Beschreibung auf der Plattform anbieten.", es:"Proporcionar servicios de hospitalidad conforme a la descripción en la plataforma.", it:"Fornire servizi di ospitalità in conformità con la descrizione sulla piattaforma.", ar:"تقديم خدمات الضيافة وفقاً للوصف على المنصة.", zh:"按照平台上的描述提供接待服务。", fa:"خدمات مهمانداری را مطابق با توضیحات پلتفرم ارائه دهد." },
    s3_2: { ru:"Обеспечивать безопасность и комфорт гостей.", en:"Ensure the safety and comfort of guests.", hy:"Ապահովել հյուրերի անվտանգությունը և հարմարավետությունը.", fr:"Assurer la sécurité et le confort des invités.", de:"Die Sicherheit und den Komfort der Gäste gewährleisten.", es:"Garantizar la seguridad y comodidad de los huéspedes.", it:"Garantire la sicurezza e il comfort degli ospiti.", ar:"ضمان سلامة وراحة الضيوف.", zh:"确保客人的安全和舒适。", fa:"امنیت و راحتی مهمانان را تضمین کند." },
    s3_3: { ru:"Своевременно обновлять информацию о доступности и ценах.", en:"Timely update availability and pricing information.", hy:"Ժամանակին թարմացնել հասանելիության և գների տեղեկատվությունը.", fr:"Mettre à jour en temps utile les informations de disponibilité et de prix.", de:"Verfügbarkeits- und Preisinformationen rechtzeitig aktualisieren.", es:"Actualizar oportunamente la información de disponibilidad y precios.", it:"Aggiornare tempestivamente le informazioni su disponibilità e prezzi.", ar:"تحديث معلومات التوافر والأسعار في الوقت المناسب.", zh:"及时更新可用性和价格信息。", fa:"اطلاعات در دسترس بودن و قیمت‌ها را به موقع به‌روز کند." },
    s3_4: { ru:"Не предлагать услуги в обход платформы.", en:"Not offer services bypassing the platform.", hy:"Չառաջարկել ծառայություններ՝ հարթակից դուրս:", fr:"Ne pas offrir de services en contournant la plateforme.", de:"Keine Dienstleistungen außerhalb der Plattform anbieten.", es:"No ofrecer servicios evitando la plataforma.", it:"Non offrire servizi aggirando la piattaforma.", ar:"عدم تقديم خدمات خارج المنصة.", zh:"不得绕开平台提供服务。", fa:"خدمات را بدون استفاده از پلتفرم ارائه ندهد." },
    s3_5: { ru:"Соблюдать законодательство Республики Армения.", en:"Comply with the legislation of the Republic of Armenia.", hy:"Հետևել Հայաստանի Հանրապետության օրենսդրությանը.", fr:"Se conformer à la législation de la République d'Arménie.", de:"Die Gesetzgebung der Republik Armenien einhalten.", es:"Cumplir con la legislación de la República de Armenia.", it:"Rispettare la legislazione della Repubblica di Armenia.", ar:"الالتزام بقوانين جمهورية أرمينيا.", zh:"遵守亚美尼亚共和国法律。", fa:"رعایت قوانین جمهوری ارمنستان." },
    s4_1: { ru:"Комиссия платформы — 16% от суммы бронирования (15% платформа + 1% банковский перевод).", en:"Platform commission — 16% of the booking amount (15% platform + 1% bank transfer).", hy:"հարթակի հանգիստը՝ ամրագրման գումարի 16%-ը (15%՝ հարթակ + 1%՝ բանկային փոխանցում).", fr:"Commission de la plateforme — 16% du montant de la réservation (15% plateforme + 1% virement bancaire).", de:"Plattformkommission — 16% des Buchungsbetrages (15% Plattform + 1% Banküberweisung).", es:"Comisión de la plataforma — 16% del monto de la reserva (15% plataforma + 1% transferencia bancaria).", it:"Commissione della piattaforma — 16% dell'importo della prenotazione (15% piattaforma + 1% bonifico bancario).", ar:"عمولة المنصة — 16% من مبلغ الحجز (15% منصة + 1% تحويل بنكي).", zh:"平台佣金 — 每笔预订金额的16%（15%平台 + 1%银行转账）。", fa:"کارمزد پلتفرم — 16% مبلغ رزرو (15% پلتفرم + 1% انتقال بانکی)." },
    s4_2: { ru:"Выплата Партнёру — 84% от суммы бронирования.", en:"Payment to Partner — 84% of the booking amount.", hy:"Գործընկերուհին վճարում՝ ամրագրման գումարի 84%-ը.", fr:"Paiement au Partenaire — 84% du montant de la réservation.", de:"Auszahlung an den Partner — 84% des Buchungsbetrages.", es:"Pago al Socio — 84% del monto de la reserva.", it:"Pagamento al Partner — 84% dell'importo della prenotazione.", ar:"الدفع للشريك — 84% من مبلغ الحجز.", zh:"向合作伙伴支付 — 预订金额的84%。", fa:"پرداخت به شریک — 84% مبلغ رزرو." },
    s4_3: { ru:"Выплаты в течение 5 рабочих дней после завершения бронирования.", en:"Payments within 5 business days after booking completion.", hy:"Վճարումներ՝ ամրագրման ավարտից հետո 5 աշխատանքային օրվա ընթացքում.", fr:"Paiements dans les 5 jours ouvrables après l'achèvement de la réservation.", de:"Auszahlung innerhalb von 5 Werktagen nach Abschluss der Buchung.", es:"Pagos dentro de los 5 días hábiles después de la finalización de la reserva.", it:"Pagamenti entro 5 giorni lavorativi dopo il completamento della prenotazione.", ar:"الدفع خلال 5 أيام عمل بعد اكتمال الحجز.", zh:"预订完成后5个工作日内付款。", fa:"پرداخت در 5 روز کاری پس از تکمیل رزرو." },
    s4_4: { ru:"Расчёты в USD или AMD по соглашению Сторон.", en:"Settlements in USD or AMD by mutual agreement of the Parties.", hy:"Հաշվարկներ՝ USD կամ AMD՝ Կողմերի փոխհամաձայնությամբ.", fr:"Règlements en USD ou AMD par accord mutuel des Parties.", de:"Abrechnungen in USD oder AMD nach beiderseitigem Einverständnis.", es:"Pagos en USD o AMD por acuerdo mutuo de las Partes.", it:"Regolamenti in USD o AMD di comune accordo tra le Parti.", ar:"التسوية بالدولار أو الدرام باتفاق الطرفين.", zh:"以美元或亚姆（AMD）结算，由双方协商确定。", fa:"تسویه به USD یا AMD با توافق طرفین." },
    s5_1: { ru:"За неисполнение обязательств — ответственность по законодательству РА.", en:"For failure to fulfill obligations — liability under RA legislation.", hy:"Պարտավորությունների չկատարման դեպքում՝ պատասխանատվություն ՀՀ օրենսդրությամբ.", fr:"En cas de non-respect des obligations — responsabilité selon la législation RA.", de:"Bei Nichterfüllung von Verpflichtungen — Haftung nach RA-Gesetzgebung.", es:"Por incumplimiento de obligaciones — responsabilidad según la legislación de RA.", it:"Per inadempiimento delle obbligazioni — responsabilità secondo la legislazione RA.", ar:"في حالة عدم الوفاء بالالتزامات — مسؤولية وفق تشريعات RA.", zh:"未履行义务的，依照亚美尼亚共和国法律承担法律责任。", fa:"در صورت عدم انجام تعهدات — مسئولیت بر اساس قوانین ارمنستان." },
    s5_2: { ru:"Платформа не несёт ответственности за качество услуг Партнёра.", en:"The Platform is not responsible for the quality of the Partner's services.", hy:"հարթակը պատասխանատվություն չի կրում գործընկերուհի ծառայությունների որակի համար.", fr:"La Plateforme n'est pas responsable de la qualité des services du Partenaire.", de:"Die Plattform haftet nicht für die Qualität der Dienste des Partners.", es:"La Plataforma no es responsable de la calidad de los servicios del Socio.", it:"La Piattaforma non è responsabile della qualità dei servizi del Partner.", ar:"المنصة غير مسؤولة عن جودة خدمات الشريك.", zh:"平台不对合作伙伴的服务质量负责。", fa:"پلتفرم مسئول کیفیت خدمات شریک نیست." },
    s5_3: { ru:"Партнёр несёт полную ответственность за безопасность гостей.", en:"The Partner bears full responsibility for the safety of guests.", hy:"Գործընկերը կրում է լիական պատասխանատվություն հյուրերի անվտանգության համար.", fr:"Le Partenaire est pleinement responsable de la sécurité des invités.", de:"Der Partner trägt die volle Verantwortung für die Sicherheit der Gäste.", es:"El Socio asume toda la responsabilidad por la seguridad de los huéspedes.", it:"Il Partner è pienamente responsabile della sicurezza degli ospiti.", ar:"الشريك يتحمل المسؤولية الكاملة عن سلامة الضيوف.", zh:"合作伙伴对客人的安全承担全部责任。", fa:"شریک مسئولیت کامل امنیت مهمانان را بر عهده دارد." },
    s6_1: { ru:"Договор вступает в силу с момента подписания обеими Сторонами.", en:"The Agreement enters into force upon signature by both Parties.", hy:"Պայտագրությունը ուժի մեջ է մտնում երկու Կողմերի կողմից ստորագրելու պահից.", fr:"L'Accord entre en vigueur dès la signature par les deux Parties.", de:"Der Vertrag tritt mit der Unterschrift beider Vertragsparteien in Kraft.", es:"El Acuerdo entra en vigor tras la firma por ambas Partes.", it:"L'Accordo entra in vigore upon firma di entrambe le Parti.", ar:"يدخل العقد حيز النفاذ عند توقيع الطرفين.", zh:"本协议自双方签署之日起生效。", fa:"قرارداد پس از امضای هر دو طرف لازمالاجرا می‌شود." },
    s6_2: { ru:"Срок — 1 (один) год.", en:"Duration — 1 (one) year.", hy:"Ժամկետը՝ 1 (մեկ) տարի.", fr:"Durée — 1 (un) an.", de:"Laufzeit — 1 (ein) Jahr.", es:"Duración — 1 (un) año.", it:"Durata — 1 (un) anno.", ar:"المدة — 1 (واحد) سنة.", zh:"期限 — 1（一）年。", fa:"مدت — 1 (یک) سال." },
    s6_3: { ru:"Продлевается автоматически при отсутствии уведомления за 30 дней.", en:"Automatically extended if no notice 30 days before expiry.", hy:"Ավտոմատ երկարաձգվում է, եթե ժամկետից 30 օր առաջ չգրավություն:", fr:"Prolongé automatiquement sans notification 30 jours avant l'expiration.", de:"Verlängert sich automatisch bei fehlender Mitteilung 30 Tage vor Ablauf.", es:"Se renueva automáticamente si no hay aviso 30 días antes del vencimiento.", it:"Prorogato automaticamente in assenza di preavviso 30 giorni prima della scadenza.", ar:"يتجدد تلقائياً إذا لم يكن هناك إشعار قبل 30 يوم من الانتهاء.", zh:"如到期前30天未通知，则自动续期。", fa:"در صورت عدم اعلام 30 روز قبل از سررسید، خودکار تمدید می‌شود." },
    s6_4: { ru:"Расторжение в одностороннем порядке с уведомлением за 30 дней.", en:"Termination by either party with 30 days notice.", hy:"Դադարել՝ միակողմանի կարգով՝ 30 օրվա նախազգումատվությամբ.", fr:"Résiliation unilatérale avec préavis de 30 jours.", de:"Kündigung einseitig mit 30 Tagen Kündigungsfrist.", es:"Rescisión unilateral con preaviso de 30 días.", it:"Risoluzione unilaterale con preavviso di 30 giorni.", ar:"الفسخ من طرف واحد بإشعار مسبق 30 يوماً.", zh:"任何一方可提前30天通知解除合同。", fa:"فسخ یک‌طرفه با اعلام 30 روزه." },
    s7_1: { ru:"Стороны сохраняют конфиденциальность полученной информации.", en:"The Parties shall maintain the confidentiality of the information received.", hy:"Կողմերը պահպանում են ստացված տեղեկատվության գաղտնիությունը.", fr:"Les Parties maintiennent la confidentialité des informations reçues.", de:"Die Vertragsparteien wahren die Vertraulichkeit der erhaltenen Informationen.", es:"Las Partes mantienen la confidencialidad de la información recibida.", it:"Le Parti mantengono la riservatezza delle informazioni ricevute.", ar:"يحافظ الطرفان على سرية المعلومات المتلقاة.", zh:"双方应对收到的信息保密。", fa:"طرفین محرمانگی اطلاعات دریافتی را حفظ می‌کنند." },
    s7_2: { ru:"Персональные данные обрабатываются по закону РА.", en:"Personal data is processed in accordance with RA law.", hy:"Անձնական տվյալները մշակվում են ՀՀ օրենսդրությամբ.", fr:"Les données personnelles sont traitées conformément à la loi RA.", de:"Personen werden gemäß RA-Gesetzgebung verarbeitet.", es:"Los datos personales se procesan según la legislación de RA.", it:"I dati personali sono trattati secondo la legislazione RA.", ar:"يتم معالجة البيانات الشخصية وفق قانون RA.", zh:"个人数据依照亚美尼亚共和国法律处理。", fa:"داده‌های شخصی بر اساس قوانین ارمنستان پردازش می‌شوند." },
    s8: { ru:"Споры решаются переговорами, при отсутствии соглашения — в суде РА.", en:"Disputes are resolved through negotiations; if unresolved — in RA court.", hy:"Վեճականները լուծվում են բանակցություններով, անհաջողության դեպքում՝ ՀՀ դատարարությունում:", fr:"Les litiges sont résolus par négociation; en cas d'échec — au tribunal RA.", de:"Streitigkeiten werden durch Verhandlung beigelegt; bei Scheitern — vor RA-Gericht.", es:"Las disputas se resuelven por negociación; sin acuerdo — en tribunal de RA.", it:"Le controversie sono risolte tramite negoziazione; in mancanza — in tribunale RA.", ar:"تحل النزاعات بالتفاوض، في حالة عدم الاتفاق — في محكمة RA.", zh:"争议通过协商解决；协商不成 — 提交亚美尼亚共和国法院。", fa:"اختلافات از طریق مذاکره حل می‌شوند، در صورت عدم توافق — در دادگاه ارمنستان." },
    s9_1: { ru:"Договор составлен в двух экземплярах на русском языке.", en:"The Agreement is drawn up in two copies in English.", hy:"Պայտագրությունը կազմված է երկու օրինակով՝ հայերեն.", fr:"L'Accord est rédigé en deux exemplaires en français.", de:"Der Vertrag ist in zwei Ausfertigungen in deutscher Sprache verfasst.", es:"El Acuerdo se redacta en dos ejemplares en español.", it:"L'Accordo è redatto in due copie in italiano.", ar:"تم إعداد العقد في نسختين باللغة العربية.", zh:"本协议一式两份，以中文书写。", fa:"قرارداد در دو نسخه به زبان فارسی تهیه شده است." },
    s9_2: { ru:"Изменения — по взаимному согласию в письменной форме.", en:"Amendments — by mutual written consent.", hy:"Փոփոխություններ՝ փոխադարձ գրավի փոխհամաձայնությամբ:", fr:"Modifications — par consentement mutuel écrit.", de:"Änderungen — durch beiderseitige schriftliche Zustimmung.", es:"Modificaciones — por consentimiento mutuo por escrito.", it:"Modifiche — con consenso scritto reciproco.", ar:"التعديلات — بموافقة كتابية متبادلة.", zh:"修改 — 经双方书面同意。", fa:"تغییرات — با توافق کتبی متقابل." },
    passport: { ru:"Паспорт", en:"Passport", hy:"Անձամահություն", fr:"Passeport", de:"Reisepass", es:"Pasaporte", it:"Passaporto", ar:"جواز السفر", zh:"护照", fa:"پاسپورت" },
    issued: { ru:"Дата выдачи", en:"Date of issue", hy:"Տրման ամսաթիվ", fr:"Date de délivrance", de:"Ausstellungsdatum", es:"Fecha de emisión", it:"Data di rilascio", ar:"تاريخ الإصدار", zh:"签发日期", fa:"تاریخ صدور" },
    issuedBy: { ru:"Кем выдан", en:"Issued by", hy:"Տրում է", fr:"Délivré par", de:"Ausgestellt von", es:"Emitido por", it:"Rilasciato da", ar:"صادر من", zh:"签发机关", fa:"صادرکننده" },
    inn: { ru:"РНН", en:"Tax ID", hy:"ՀՀՀ", fr:"N° fiscal", de:"Steuer-ID", es:"NIF", it:"Cod. fisc.", ar:"الرقم الضريبي", zh:"税号", fa:"کد مالیاتی" },
    address: { ru:"Адрес", en:"Address", hy:"Հասցե", fr:"Adresse", de:"Adresse", es:"Dirección", it:"Indirizzo", ar:"العنوان", zh:"地址", fa:"آدرس" },
    printBtn: { ru:"Печать / PDF", en:"Print / PDF", hy:"Տպել / PDF", fr:"Imprimer / PDF", de:"Drucken / PDF", es:"Imprimir / PDF", it:"Stampa / PDF", ar:"طباعة / PDF", zh:"打印 / PDF", fa:"چاپ / PDF" },
    telegram: { ru:"Telegram", en:"Telegram", hy:"Telegram", fr:"Telegram", de:"Telegram", es:"Telegram", it:"Telegram", ar:"تلغرام", zh:"Telegram", fa:"تلگرام" },
    whatsapp: { ru:"WhatsApp", en:"WhatsApp", hy:"WhatsApp", fr:"WhatsApp", de:"WhatsApp", es:"WhatsApp", it:"WhatsApp", ar:"واتساب", zh:"WhatsApp", fa:"واتساپ" },
    shareText: { ru:"Договор о сотрудничестве HayHome", en:"HayHome Cooperation Agreement", hy:"HayHome համագործության պայտագրություն", fr:"Accord de coopération HayHome", de:"HayHome Kooperationsvertrag", es:"Acuerdo de cooperación HayHome", it:"Accordo di cooperazione HayHome", ar:"عقد تعاون HayHome", zh:"HayHome合作协议", fa:"قرارداد همکاری HayHome" },
    platformLabel: { ru:"ПЛАТФОРМА:", en:"PLATFORM:", hy:"ՀԱՐԹԱԿ:", fr:"PLATEFORME:", de:"PLATTFORM:", es:"PLATAFORMA:", it:"PIATTAFORMA:", ar:"المنصة:", zh:"平台:", fa:"پلتفرم:" },
    partnerLabel: { ru:"ПАРТНЁР:", en:"PARTNER:", hy:"ԳՈՐԾԸՆԿԵՐ:", fr:"PARTENAIRE:", de:"PARTNER:", es:"SOCIO:", it:"PARTNER:", ar:"الشريك:", zh:"合作伙伴:", fa:"شریک:" },
    signature: { ru:"Подпись: ________________", en:"Signature: ________________", hy:"Ստորագրություն: ________________", fr:"Signature: ________________", de:"Unterschrift: ________________", es:"Firma: ________________", it:"Firma: ________________", ar:"التوقيع: ________________", zh:"签名：________________", fa:"امضا: ________________" },
    fio: { ru:"ФИО:", en:"Full Name:", hy:"Ա.Ա.Ա.", fr:"Nom complet:", de:"Vollständiger Name:", es:"Nombre completo:", it:"Nome completo:", ar:"الاسم الكامل:", zh:"姓名：", fa:"نام کامل:" },
    city: { ru:"Ереван", en:"Yerevan", hy:"Երևան", fr:"Erevan", de:"Eriwan", es:"Ereván", it:"Erevan", ar:"يريوان", zh:"埃里温", fa:"ایروان" },
    platformAddress: { ru:"Котайкская обл., Наири, г. Егвард, ул. Арапня, д. 2", en:"Kotayk region, Nairi, Yegvard, Arapnya st., 2", hy:"Կոտայքի մարզ, Նաիրի, Եղվարդ, Առափնյա փ., 2", fr:"Région de Kotayk, Nairi, Yegvard, rue Arapnya, 2", de:"Kotayk-Region, Nairi, Jegward, Arapnya-Str. 2", es:"Región de Kotayk, Nairi, Yegvard, calle Arapnya, 2", it:"Regione Kotayk, Nairi, Yegvard, via Arapnya, 2", ar:"منطقة كوتايك، نایری، یغفارد، شارع أرابنيا، 2", zh:"科塔伊克地区，纳伊里，叶格瓦尔德，阿拉普尼亚街2号", fa:"منطقه کوتیاک، نایری، یگورد، خیابان آراپنیا، ۲" },
    rnnp: { ru:"РНН", en:"Tax ID", hy:"ՀՀՀ", fr:"N° fiscal", de:"Steuer-ID", es:"NIF", it:"Cod. fisc.", ar:"الرقم الضريبي", zh:"税号", fa:"کد مالیاتی" },
    phone: { ru:"Тел.", en:"Phone", hy:"Tel.", fr:"Tél.", de:"Tel.", es:"Tel.", it:"Tel.", ar:"هاتف", zh:"电话", fa:"تلفن" },
    emailLabel: { ru:"Email", en:"Email", hy:"Էլ. փոստ", fr:"Email", de:"E-Mail", es:"Email", it:"Email", ar:"البريد", zh:"邮箱", fa:"ایمیل" },
    website: { ru:"Сайт", en:"Website", hy:"Կայք", fr:"Site", de:"Website", es:"Sitio", it:"Sito", ar:"الموقع", zh:"网站", fa:"وب‌سایت" },
    account: { ru:"Счёт", en:"Account", hy:"Հաշվեիվ", fr:"Compte", de:"Konto", es:"Cuenta", it:"Conto", ar:"حساب", zh:"账号", fa:"حساب" },
    loading: { ru:"Загрузка...", en:"Loading...", hy:"Բեռնում...", fr:"Chargement...", de:"Laden...", es:"Cargando...", it:"Caricamento...", ar:"جاري التحميل...", zh:"加载中...", fa:"در حال بارگذاری..." },
  };
  return (T[key] && T[key][lang]) || T[key]?.en || key;
}

export default function ContractPrint() {
  const searchParams = useSearchParams();
  const hostId = searchParams.get("hostId");
  const { lang: contextLang } = useLang();
  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const lang = searchParams.get("lang") || contextLang;

  useEffect(() => {
    setShareUrl(window.location.href);
    if (!hostId) { setLoading(false); return; }
    fetch("/api/hosts/" + hostId)
      .then(r => r.ok ? r.json() : Promise.reject("Not found"))
      .then(setHost)
      .catch(() => setError("Хозяин не найден"))
      .finally(() => setLoading(false));
  }, [hostId]);

  const fio = (() => {
    if (!host) return "";
    const i18n = (host as any).i18nPersonal;
    const localized = i18n && i18n[lang];
    const n = localized?.name || host.name;
    const fn = localized?.familyName || host.familyName;
    const p = host.patronymic;
    return [fn, n, p].filter(Boolean).join(" ");
  })();
  const isRtl = lang === "ar" || lang === "fa";
  const dir = isRtl ? "rtl" : "ltr";

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-500">{Ct("loading",lang)}</div>;
  if (error || !host) return <div className="flex justify-center items-center min-h-screen text-red-500">{error || "Not found"}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center" dir={dir}>
      <div className="w-full bg-white border-b p-3 flex flex-wrap justify-center gap-2 sticky top-0 z-10 print:hidden">
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 text-sm">
          <Printer size={16} /> {Ct("printBtn", lang)}
        </button>
        <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(Ct("shareText",lang))}`}
          target="_blank" className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
          <MessageCircle size={16} /> {Ct("telegram", lang)}
        </a>
        <a href={`https://wa.me/?text=${encodeURIComponent(Ct("shareText",lang) + " " + shareUrl)}`}
          target="_blank" className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
          <Share2 size={16} /> {Ct("whatsapp", lang)}
        </a>
      </div>

      <div className="max-w-3xl w-full px-8 py-10 bg-white shadow-lg print:shadow-none" style={{ fontFamily: "serif", fontSize: "14px", lineHeight: "1.7" }}>
        <p className="text-center font-bold text-lg mb-1">{Ct("title", lang)}</p>
        <p className="text-center mb-8">{Ct("subtitle", lang)}</p>
        <p>{Ct("city", lang)}</p>
        <p>&laquo;{String(new Date().getDate()).padStart(2,"0")}&raquo; {String(new Date().getMonth()+1).padStart(2,"0")} 2026 г.</p>

        <p className="mt-8"><strong>{Ct("platform", lang)}</strong>, {Ct("partyPlatform", lang)} {Ct("oneSide", lang)} {Ct("actingAs", lang)},</p>
        <p className="mt-2"><strong>{fio}</strong>, {Ct("partyPartner", lang)} {Ct("actingAsPerson", lang)},</p>
        <p className="font-bold mt-4">{Ct("together", lang)}</p>

        <hr className="my-6" />

        <h2 className="text-base font-bold mt-6 mb-3">1.</h2>
        <p>1.1. {Ct("s1_1", lang)}</p>
        <p>1.2. {Ct("s1_2", lang)}</p>
        <p>1.3. {Ct("s1_3", lang)}</p>

        <h2 className="text-base font-bold mt-6 mb-3">2.</h2>
        <p>2.1. {Ct("s2_1", lang)}</p>
        <p>2.2. {Ct("s2_2", lang)}</p>
        <p>2.3. {Ct("s2_3", lang)}</p>
        <p>2.4. {Ct("s2_4", lang)}</p>
        <p>2.5. {Ct("s2_5", lang)}</p>

        <h2 className="text-base font-bold mt-6 mb-3">3.</h2>
        <p>3.1. {Ct("s3_1", lang)}</p>
        <p>3.2. {Ct("s3_2", lang)}</p>
        <p>3.3. {Ct("s3_3", lang)}</p>
        <p>3.4. {Ct("s3_4", lang)}</p>
        <p>3.5. {Ct("s3_5", lang)}</p>

        <h2 className="text-base font-bold mt-6 mb-3">4.</h2>
        <p>4.1. {Ct("s4_1", lang)}</p>
        <p>4.2. {Ct("s4_2", lang)}</p>
        <p>4.3. {Ct("s4_3", lang)}</p>
        <p>4.4. {Ct("s4_4", lang)}</p>

        <h2 className="text-base font-bold mt-6 mb-3">5.</h2>
        <p>5.1. {Ct("s5_1", lang)}</p>
        <p>5.2. {Ct("s5_2", lang)}</p>
        <p>5.3. {Ct("s5_3", lang)}</p>

        <h2 className="text-base font-bold mt-6 mb-3">6.</h2>
        <p>6.1. {Ct("s6_1", lang)}</p>
        <p>6.2. {Ct("s6_2", lang)}</p>
        <p>6.3. {Ct("s6_3", lang)}</p>
        <p>6.4. {Ct("s6_4", lang)}</p>

        <h2 className="text-base font-bold mt-6 mb-3">7.</h2>
        <p>7.1. {Ct("s7_1", lang)}</p>
        <p>7.2. {Ct("s7_2", lang)}</p>

        <h2 className="text-base font-bold mt-6 mb-3">8.</h2>
        <p>8. {Ct("s8", lang)}</p>

        <h2 className="text-base font-bold mt-6 mb-3">9.</h2>
        <p>9.1. {Ct("s9_1", lang)}</p>
        <p>9.2. {Ct("s9_2", lang)}</p>

        <hr className="my-8" />

        <div className="grid grid-cols-2 gap-8 mt-6">
          <div>
            <p className="font-bold mb-2">{Ct("platformLabel", lang)}</p>
            <p>{Ct("platform", lang)}</p>
            <p>{Ct("rnnp", lang)} 20336085</p>
            <p>{Ct("address", lang)}: {Ct("platformAddress", lang)}</p>
            <p>{Ct("phone", lang)} +374 77-712-268</p>
            <p>{Ct("emailLabel", lang)} oooplus.ru@yandex.ru</p>
            <p>hay-home.com hay-home.com</p>
            <p className="mt-8">{Ct("signature", lang)}</p>
          </div>
          <div>
            <p className="font-bold mb-2">{Ct("partnerLabel", lang)}</p>
            <p>{Ct("fio", lang)} {fio}</p>
            <p>{Ct("passport", lang)}: {host.passportSeries || "___"} {host.passportNumber || "___"}</p>
            {host.passportDate && <p>{Ct("issued", lang)}: {host.passportDate}</p>}
            {host.passportIssued && <p>{Ct("issuedBy", lang)}: {host.passportIssued}</p>}
            {host.inn && <p>{Ct("inn", lang)}: {host.inn}</p>}
            <p>{Ct("address", lang)}: {host.location || "___"}, {host.city || "___"}</p>
            <p>{host.phone}</p>
            <p>{host.email}</p>
            {host.bankAccount && <p>{Ct("account", lang)}: {host.bankAccount}</p>}
            {host.bankName && <p>{Ct("bank", lang)}: {host.bankName}</p>}
            <p className="mt-8">{Ct("signature", lang)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
