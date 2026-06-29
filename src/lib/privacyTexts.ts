// Privacy Policy texts for all 10 languages
export interface PrivacySection {
  title: string;
  body: string[];
  list?: string[];
}

export interface PrivacyText {
  title: string;
  updated: string;
  contact: string;
  sections: PrivacySection[];
}

export const privacyTexts: Record<string, PrivacyText> = {
  ru: {
    title: "Политика конфиденциальности",
    updated: "Последнее обновление: 29 июня 2026 г.",
    contact: "Связь",
    sections: [
      { title: "1. Общие положения", body: ["Настоящая Политика определяет, как HayHome собирает, использует и защищает информацию пользователей платформы hay-home.com.", "Используя Платформу, вы соглашаетесь с условиями настоящей Политики."] },
      { title: "2. Данные, которые мы собираем", body: ["Мы собираем следующие данные:"], list: ["Регистрационные: имя, email, пароль (зашифрован)", "Профиль: страна, язык, предпочтения", "Бронирование: даты, количество гостей, сообщение", "Технические: IP-адрес, браузер, cookie", "Отзывы: текст и оценка", "Телефон: для связи по бронированию"] },
      { title: "3. Как мы используем данные", body: [], list: ["Поиск и бронирование проживания", "Связь по вопросам бронирования", "Улучшение работы Платформы", "Обеспечение безопасности", "Уведомления (при согласии)"] },
      { title: "4. Передача данных третьим лицам", body: ["Мы не продаём данные. Передача возможна:"], list: ["С вашего согласия (контакты семье)", "По требованию госорганов", "Для технической работы (хостинг, платежи)"] },
      { title: "5. Защита данных", body: ["Шифрование паролей, ограниченный доступ, HTTPS, регулярное резервное копирование."] },
      { title: "6. Файлы cookie", body: ["Используем cookie для сессий, языка и аналитики. Можно отключить в настройках браузера."] },
      { title: "7. Права пользователя", body: [], list: ["Право на доступ к данным", "Право на исправление и удаление", "Право на отзыв согласия", "Право на жалобу в надзорный орган"] },
      { title: "8. Удаление аккаунта", body: ["Вы можете удалить аккаунт в настройках профиля. При этом ваши отзывы анонимизируются, а личные данные удаляются."] },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: June 29, 2026",
    contact: "Contact",
    sections: [
      { title: "1. General Provisions", body: ["This Policy defines how HayHome collects, uses and protects user information on hay-home.com.", "By using the Platform, you agree to this Policy."] },
      { title: "2. Data We Collect", body: ["We collect the following data:"], list: ["Registration: name, email, password (encrypted)", "Profile: country, language, preferences", "Booking: dates, number of guests, messages", "Technical: IP address, browser, cookies", "Reviews: text and rating", "Phone: for booking communication"] },
      { title: "3. How We Use Data", body: [], list: ["Search and book accommodation", "Booking-related communication", "Platform improvement", "Security and fraud prevention", "Notifications (with consent)"] },
      { title: "4. Data Sharing with Third Parties", body: ["We do not sell your data. Sharing is limited to:"], list: ["With your consent (contacts to host family)", "Legal requirements from government", "Technical operations (hosting, payments)"] },
      { title: "5. Data Protection", body: ["Password encryption, restricted access, HTTPS, regular backups."] },
      { title: "6. Cookies", body: ["We use cookies for sessions, language and analytics. You can disable them in browser settings."] },
      { title: "7. Your Rights", body: [], list: ["Right to access your data", "Right to correct and delete", "Right to withdraw consent", "Right to file a complaint"] },
      { title: "8. Account Deletion", body: ["You can delete your account in profile settings. Your reviews will be anonymized and personal data deleted."] },
    ],
  },
  hy: {
    title: "Գաղտնիության քաղաքականություն",
    updated: "Վերջին թարմացում: 29 հունիսի, 2026",
    contact: "Կապ",
    sections: [
      { title: "1. Ընդհանուր դրույթներ", body: ["Այս քաղաքականությունը սահմանում է, թե ինչպես HayHome-ը հավաքում և պաշտպանում է օգտատերերի տվյալները hay-home.com-ում։"] },
      { title: "2. Հավաքվող տվյալներ", body: [], list: ["Գրանցում. անուն, email, գաղտնաբառ",  "Պրոֆիլ. երկիր, լեզու", "Ամրագրում. ամսաթվեր, հյուրերի քանակ", "Տեխնիկական. IP, բրաուզեր", "Կարծիքներ. տեքստ և գնահատական", "Հեռախոս. կապի համար"] },
      { title: "3. Տվյալների օգտագործումը", body: [], list: ["Կացարանի որոնում և ամրագրում", "Կապ ամրագրման հարցերով", "Պլատֆորմի բարելավում", "Անվտանգություն"] },
      { title: "4. Տվյալների փոխանցում", body: ["Մենք չենք վաճառում ձեր տվյալները։"] },
      { title: "5. Տվյալների պաշտպանություն", body: ["Գաղտնաբառերի կոդավորում, սահմանափակ մուտք, HTTPS։"] },
      { title: "6. Cookie-ներ", body: ["Օգտագործում ենք cookie սեսիաների և լեզվի համար։"] },
      { title: "7. Օգտատիրոջ իրավունքները", body: [], list: ["Տվյալներին հասանելիություն", "Ուղղման և ջնջման իրավունք", "Համաձայնության հետկանչ"] },
      { title: "8. Հաշվի ջնջում", body: ["Կարող եք ջնջել հաշիվը պրոֆիլի կարգավորումներում։"] },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour: 29 juin 2026",
    contact: "Contact",
    sections: [
      { title: "1. Dispositions générales", body: ["Cette Politique définit comment HayHome collecte et protège les données sur hay-home.com."] },
      { title: "2. Données collectées", body: [], list: ["Inscription: nom, email, mot de passe", "Profil: pays, langue", "Réservation: dates, invités", "Techniques: IP, navigateur", "Avis: texte et note", "Téléphone: pour communication"] },
      { title: "3. Utilisation des données", body: [], list: ["Recherche et réservation", "Communication", "Amélioration de la plateforme", "Sécurité"] },
      { title: "4. Partage avec des tiers", body: ["Nous ne vendons pas vos données."] },
      { title: "5. Protection des données", body: ["Chiffrement, accès restreint, HTTPS."] },
      { title: "6. Cookies", body: ["Cookies pour sessions et langue. Désactivables."] },
      { title: "7. Vos droits", body: [], list: ["Accès aux données", "Correction et suppression", "Retrait du consentement"] },
      { title: "8. Suppression de compte", body: ["Vous pouvez supprimer votre compte dans les paramètres."] },
    ],
  },
  de: {
    title: "Datenschutzerklärung",
    updated: "Letzte Aktualisierung: 29. Juni 2026",
    contact: "Kontakt",
    sections: [
      { title: "1. Allgemeine Bestimmungen", body: ["Diese Richtlinie definiert, wie HayHome Daten auf hay-home.com verarbeitet."] },
      { title: "2. Erhobene Daten", body: [], list: ["Registrierung: Name, E-Mail, Passwort", "Profil: Land, Sprache", "Buchung: Daten, Gäste", "Technisch: IP, Browser", "Bewertungen: Text und Bewertung", "Telefon: für Buchungskommunikation"] },
      { title: "3. Datenverwendung", body: [], list: ["Suche und Buchung", "Kommunikation", "Plattformverbesserung", "Sicherheit"] },
      { title: "4. Weitergabe an Dritte", body: ["Wir verkaufen keine Daten."] },
      { title: "5. Datenschutz", body: ["Verschlüsselung, eingeschränkter Zugriff, HTTPS."] },
      { title: "6. Cookies", body: ["Cookies für Sitzungen und Sprache. Deaktivierbar."] },
      { title: "7. Ihre Rechte", body: [], list: ["Zugriff auf Daten", "Korrektur und Löschung", "Widerruf der Einwilligung"] },
      { title: "8. Kontolöschung", body: ["Sie können Ihr Konto in den Einstellungen löschen."] },
    ],
  },
  es: {
    title: "Política de privacidad",
    updated: "Última actualización: 29 de junio de 2026",
    contact: "Contacto",
    sections: [
      { title: "1. Disposiciones generales", body: ["Esta Política define cómo HayHome recopila y protege datos en hay-home.com."] },
      { title: "2. Datos recopilados", body: [], list: ["Registro: nombre, email, contraseña", "Perfil: país, idioma", "Reserva: fechas, invitados", "Técnicos: IP, navegador", "Reseñas: texto y calificación", "Teléfono: para comunicación"] },
      { title: "3. Uso de datos", body: [], list: ["Búsqueda y reserva", "Comunicación", "Mejora de plataforma", "Seguridad"] },
      { title: "4. Compartir con terceros", body: ["No vendemos sus datos."] },
      { title: "5. Protección de datos", body: ["Cifrado, acceso restringido, HTTPS."] },
      { title: "6. Cookies", body: ["Cookies para sesiones e idioma. Desactivables."] },
      { title: "7. Sus derechos", body: [], list: ["Acceso a datos", "Corrección y eliminación", "Retirar consentimiento"] },
      { title: "8. Eliminación de cuenta", body: ["Puede eliminar su cuenta en configuración."] },
    ],
  },
  it: {
    title: "Informativa sulla privacy",
    updated: "Ultimo aggiornamento: 29 giugno 2026",
    contact: "Contatto",
    sections: [
      { title: "1. Disposizioni generali", body: ["Questa Policy definisce come HayHome raccoglie e protegge i dati su hay-home.com."] },
      { title: "2. Dati raccolti", body: [], list: ["Registrazione: nome, email, password", "Profilo: paese, lingua", "Prenotazione: date, ospiti", "Tecnici: IP, browser", "Recensioni: testo e valutazione", "Telefono: per comunicazione"] },
      { title: "3. Uso dei dati", body: [], list: ["Ricerca e prenotazione", "Comunicazione", "Miglioramento piattaforma", "Sicurezza"] },
      { title: "4. Condivisione con terzi", body: ["Non vendiamo i tuoi dati."] },
      { title: "5. Protezione dati", body: ["Crittografia, accesso limitato, HTTPS."] },
      { title: "6. Cookie", body: ["Cookie per sessioni e lingua. Disattivabili."] },
      { title: "7. I tuoi diritti", body: [], list: ["Accesso ai dati", "Correzione ed eliminazione", "Revoca del consenso"] },
      { title: "8. Eliminazione account", body: ["Puoi eliminare l'account nelle impostazioni."] },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: 29 يونيو 2026",
    contact: "اتصال",
    sections: [
      { title: "1. أحكام عامة", body: ["تحدد هذه السياسة كيفية جمع وحماية HayHome للبيانات على hay-home.com."] },
      { title: "2. البيانات المجمعة", body: [], list: ["التسجيل: الاسم، البريد، كلمة المرور", "الملف: البلد، اللغة", "الحجز: التواريخ، الضيوف", "تقني: IP، المتصفح", "المراجعات: النص والتقييم", "الهاتف: للتواصل"] },
      { title: "3. استخدام البيانات", body: [], list: ["البحث والحجز", "التواصل", "تحسين المنصة", "الأمان"] },
      { title: "4. المشاركة مع أطراف ثالثة", body: ["لا نبيع بياناتك."] },
      { title: "5. حماية البيانات", body: ["تشفير، وصول محدود، HTTPS."] },
      { title: "6. ملفات تعريف الارتباط", body: ["ملفات تعريف الارتباط للجلسات واللغة."] },
      { title: "7. حقوقك", body: [], list: ["الوصول للبيانات", "التصحيح والحذف", "سحب الموافقة"] },
      { title: "8. حذف الحساب", body: ["يمكنك حذف حسابك في الإعدادات."] },
    ],
  },
  zh: {
    title: "隐私政策",
    updated: "最后更新：2026年6月29日",
    contact: "联系",
    sections: [
      { title: "1. 一般条款", body: ["本政策定义了 HayHome 如何在 hay-home.com 上收集和保护数据。"] },
      { title: "2. 收集的数据", body: [], list: ["注册：姓名、邮箱、密码", "资料：国家、语言", "预订：日期、客人", "技术：IP、浏览器", "评论：文本和评分", "电话：用于沟通"] },
      { title: "3. 数据使用", body: [], list: ["搜索和预订", "沟通", "平台改进", "安全"] },
      { title: "4. 与第三方共享", body: ["我们不出售您的数据。"] },
      { title: "5. 数据保护", body: ["加密、受限访问、HTTPS。"] },
      { title: "6. Cookie", body: ["用于会话和语言的 Cookie。可禁用。"] },
      { title: "7. 您的权利", body: [], list: ["访问数据", "更正和删除", "撤回同意"] },
      { title: "8. 账户删除", body: ["您可以在设置中删除账户。"] },
    ],
  },
  fa: {
    title: "سیاست حریم خصوصی",
    updated: "آخرین به‌روزرسانی: 29 ژوئن 2026",
    contact: "تماس",
    sections: [
      { title: "1. مقررات عمومی", body: ["این سیاست نحوه جمع‌آوری و محافظت HayHome از داده‌ها در hay-home.com را تعیین می‌کند."] },
      { title: "2. داده‌های جمع‌آوری شده", body: [], list: ["ثبت‌نام: نام، ایمیل، رمز عبور", "پروفایل: کشور، زبان", "رزرو: تاریخ‌ها، مهمانان", "فنی: IP، مرورگر", "نظرات: متن و امتیاز", "تلفن: برای ارتباط"] },
      { title: "3. استفاده از داده‌ها", body: [], list: ["جستجو و رزرو", "ارتباط", "بهبود پلتفرم", "امنیت"] },
      { title: "4. اشتراک با اشخاص ثالث", body: ["ما داده‌های شما را نمی‌فروشیم."] },
      { title: "5. محافظت داده‌ها", body: ["رمزگذاری، دسترسی محدود، HTTPS."] },
      { title: "6. کوکی‌ها", body: ["کوکی‌ها برای نشست‌ها و زبان."] },
      { title: "7. حقوق شما", body: [], list: ["دسترسی به داده‌ها", "اصلاح و حذف", "لغو رضایت"] },
      { title: "8. حذف حساب", body: ["می‌توانید حساب خود را در تنظیمات حذف کنید."] },
    ],
  },
};
