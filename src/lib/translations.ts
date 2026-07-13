export type LangCode = "ru" | "en" | "hy" | "fr" | "de" | "es" | "it" | "ar" | "zh" | "fa";

export interface Lang {
  code: LangCode;
  label: string;
  flag: string;
  rtl?: boolean;
}

export const LANGUAGES: Lang[] = [
  { code: "ru", label: "Русский",    flag: "🇷🇺" },
  { code: "en", label: "English",    flag: "🇺🇸" },
  { code: "hy", label: "Հայերեն",   flag: "🇦🇲" },
  { code: "fr", label: "Français",   flag: "🇫🇷" },
  { code: "de", label: "Deutsch",    flag: "🇩🇪" },
  { code: "es", label: "Español",    flag: "🇪🇸" },
  { code: "it", label: "Italiano",   flag: "🇮🇹" },
  { code: "ar", label: "العربية",    flag: "🇸🇦", rtl: true },
  { code: "zh", label: "中文",       flag: "🇨🇳" },
  { code: "fa", label: "فارسی",      flag: "🇮🇷", rtl: true },
];

export interface Translations {
  about?: {
    heroTitle: string; heroSub: string;
    missionLabel: string; missionTitle: string; missionSub: string; missionTitle2: string;
    card1title: string; card1desc: string;
    card2title: string; card2desc: string;
    card3title: string; card3desc: string;
    storyLabel: string; storyTitle: string;
    story1: string; story2: string; story3: string;
    valuesLabel: string; valuesTitle: string;
    v1t: string; v1d: string; v2t: string; v2d: string; v3t: string; v3d: string;
    v4t: string; v4d: string; v5t: string; v5d: string; v6t: string; v6d: string;
    statsTitle: string; s1: string; s2: string; s3: string; s4: string;
    toneLabel: string; toneTitle: string; toneSub: string;
    secTitle: string; secDesc: string;
    ctaTitle: string; ctaSub: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    registerSub: string;
    password: string;
    confirmPassword: string;
    name: string;
    loginBtn: string;
    loggingIn: string;
    registerBtn: string;
    registering: string;
    noAccount: string;
    hasAccount: string;
    wantToHost: string;
    wrongCreds: string;
    passMismatch: string;
    minPass: string;
    socialOr: string;
    socialAutoCreate: string;
    consentPD: string;
  };
  nav: {
    findFamily: string;
    hostGuests: string;
    about: string;
    login: string;
    register: string;
    logout: string;
    partner?: string;
  };
  hero: {
    greeting: string;
    title1: string;
    title2: string;
    subtitle: string;
    searchPlaceholder: string;
    searchBtn: string;
    familiesWaiting: string;
  };
  hosts: {
    pageTitle: string;
    searchPlaceholder: string;
    filters: string;
    byRating: string;
    byPriceAsc: string;
    byPriceDesc: string;
    region: string;
    allRegions: string;
    minStars: string;
    anyStars: string;
    priceTo: string;
    resetFilters: string;
    notFound: string;
    notFoundSub: string;
    verified: string;
    perNight: string;
    guests: string;
    upTo: string;
    book: string;
    backToList: string;
    aboutFamily: string;
    amenities: string;
    experiences: string;
    languages: string;
    reviews: string;
    newGuest: string;
    freeCancel: string;
    directContact: string;
    noHidden: string;
    writeReview: string;
    reviewPlaceholder: string;
    submitReview: string;
    reviewSuccess: string;
    mustBeGuest: string;
    // Calendar
    calendarTitle: string;
    mon: string; tue: string; wed: string; thu: string; fri: string; sat: string; sun: string;
    available: string; booked: string; blocked: string;
    noCalendar: string;
    listView: string;
    mapView: string;
  };
  home: {
    whyTitle: string;
    whySub: string;
    realHome: string;
    realHomeDesc: string;
    verified: string;
    verifiedDesc: string;
    unite: string;
    uniteDesc: string;
    ourFamilies: string;
    ourFamiliesSub: string;
    allFamilies: string;
    howTitle: string;
    step1: string; step1desc: string;
    step2: string; step2desc: string;
    step3: string; step3desc: string;
    becomeTitle: string;
    becomeSub: string;
    becomeCta: string;
    browseBtn: string;
    freeStay: string;
    freeStayDesc: string;
    bookForFree: string;
    paidServices: string;
    experiencesLabel: string;
  };
  become: {
    title: string;
    subtitle: string;
    step0: string; step1: string; step2: string; step3: string;
    familyName: string; yourName: string; patronymic: string; phone: string; email: string;
    passportTitle: string; passportSeries: string; passportNumber: string; passportDate: string; passportIssued: string;
    inn: string; bankTitle: string; bankAccount: string; bankName: string;
    city: string; region: string; address: string; pickRegion: string;
    priceNight: string; maxGuests: string; rooms: string;
    shortDesc: string; longDesc: string;
    amenitiesLabel: string; experiencesLabel: string; langsLabel: string;
    submit: string; submitting: string;
    successTitle: string; successText: string;
    next: string; back: string; toHome: string;
    aiBtn: string; aiLoading: string; restore: string;
    aiHint: string; aiImproved: string; aiImprovedLong: string;
  };
  common: {
    loading: string;
    error: string;
    rating: string;
    newHost: string;
    cookieText: string;
    cookieAccept: string;
  };
  legal: {
    privacy: string;
    terms: string;
    rules: string;
    back: string;
  };
  welcome?: {
    title: string;
    subtitle: string;
    step1title: string;
    step1desc: string;
    step2title: string;
    step2desc: string;
    step3title: string;
    step3desc: string;
    startBtn: string;
    skipBtn: string;
  };
  dashboard?: {
    profileInfo: string;
    profileInfoDesc: string;
    partner: string;
  };
}

const t: Record<LangCode, Translations> = {
  ru: {
    nav: {
      findFamily: "Найти семью",
      hostGuests: "Принять гостей",
      about: "О нас",
      login: "Войти",
      register: "Регистрация",
      logout: "Выйти",
      partner: "Партнёры",
    },
    hero: {
      greeting: "Добро пожаловать!",
      title1: "Присоединяйтесь",
      title2: "к нашей семье",
      subtitle: "Армения открывается через сердце семьи. Настоящий ужин, живые истории, вид на Арарат. Не отель — дом.",
      searchPlaceholder: "Ереван, Дилижан, Севан...",
      searchBtn: "Найти семью",
      familiesWaiting: "семей ждут вас",
    },
    hosts: {
      pageTitle: "семей в Армении",
      searchPlaceholder: "Поиск по семье, городу, региону...",
      filters: "Фильтры",
      byRating: "По рейтингу",
      byPriceAsc: "Цена: дешевле",
      byPriceDesc: "Цена: дороже",
      region: "Регион",
      allRegions: "Все регионы",
      minStars: "Минимум звёзд",
      anyStars: "Любые",
      priceTo: "Цена до",
      resetFilters: "Сбросить фильтры",
      notFound: "Семьи не найдены",
      notFoundSub: "Попробуйте изменить фильтры",
      verified: "Верифицировано",
      perNight: "/ночь",
      guests: "гостей",
      upTo: "до",
      book: "Забронировать визит",
      backToList: "Все семьи",
      aboutFamily: "О семье",
      amenities: "Удобства",
      experiences: "Что вас ждёт",
      languages: "Языки общения",
      reviews: "Отзывы",
      newGuest: "Станьте первым гостем!",
      freeCancel: "Бесплатная отмена за 48 часов",
      directContact: "Прямой контакт с семьёй",
      noHidden: "Без скрытых платежей",
      writeReview: "Написать отзыв",
      reviewPlaceholder: "Расскажите о вашем опыте... (минимум 10 символов)",
      submitReview: "Отправить отзыв",
      reviewSuccess: "Спасибо за отзыв!",
      mustBeGuest: "Только гости с завершённым бронированием могут оставить отзыв",
      calendarTitle: "Календарь доступности",
      mon: "Пн", tue: "Вт", wed: "Ср", thu: "Чт", fri: "Пт", sat: "Сб", sun: "Вс",
      available: "Свободно", booked: "Забронировано", blocked: "Заблокировано",
      noCalendar: "У вас нет календаря. Станьте хозяином, чтобы управлять датами.",
      listView: "Список", mapView: "Карта",
    },
    home: {
      whyTitle: "Почему HayHome?",
      whySub: "Это не Airbnb. Это нечто большее — связь между людьми разных культур.",
      realHome: "Настоящий дом",
      realHomeDesc: "Живёте в семье, а не в отеле. Едите то, что едят они. Слышите истории, которые не написаны в путеводителях.",
      verified: "Верифицированные хозяева",
      verifiedDesc: "Каждая семья проходит проверку. Система звёзд гарантирует качество.",
      unite: "Объединяем народы",
      uniteDesc: "Гости из 40+ стран уже познакомились с Арменией через наших хозяев.",
      ourFamilies: "Наши семьи",
      ourFamiliesSub: "Настоящее армянское гостеприимство",
      allFamilies: "Все семьи",
      howTitle: "Как это работает",
      step1: "Выбери семью", step1desc: "Фильтруй по городу, звёздам, цене и языкам",
      step2: "Забронируй визит", step2desc: "Выбери даты и отправь заявку семье",
      step3: "Стань своим", step3desc: "Уедешь другом. Вернёшься снова.",
      becomeTitle: "У вас есть дом и желание принять гостей?",
      becomeSub: "Зарегистрируйтесь бесплатно. Первые 12 месяцев — без комиссии.",
      becomeCta: "Принять гостей",
      browseBtn: "Посмотреть семьи",
      freeStay: "Бесплатное проживание",
      freeStayDesc: "Живите в армянской семье бесплатно",
      bookForFree: "Забронировать бесплатно",
      paidServices: "Платные услуги",
      experiencesLabel: "Впечатления",
    },
    become: {
      title: "Принять гостей в HayHome",
      subtitle: "Поделитесь армянским гостеприимством с миром",
      step0: "Контакты", step1: "Локация", step2: "Условия", step3: "Опыт",
      familyName: "Название семьи", yourName: "Ваше имя", phone: "Телефон", email: "Email",
        patronymic: "Отчество",         passportTitle: "📝 Паспортные данные",         passportSeries: "Серия паспорта",         passportNumber: "Номер паспорта",         passportDate: "Дата выдачи",         passportIssued: "Кем выдан",         inn: "РНН / ИНН (опционально)",         bankTitle: "🏦 Банковские реквизиты для выплат",         bankAccount: "Номер счёта / карты",         bankName: "Банк",
      city: "Город", region: "Регион", address: "Адрес", pickRegion: "Выберите регион",
      priceNight: "Цена за ночь", maxGuests: "Максимум гостей", rooms: "Комнат для гостей",
      shortDesc: "Краткое описание", longDesc: "Расскажите о себе подробнее",
      amenitiesLabel: "Удобства", experiencesLabel: "Опыт для гостей", langsLabel: "Языки общения",
      submit: "Отправить заявку", submitting: "Отправляем...",
      successTitle: "Заявка отправлена!", successText: "Наш менеджер свяжется с вами в течение 24–48 часов.",
      next: "Далее", back: "Назад", toHome: "На главную",
      aiBtn: "Улучшить с ИИ", aiLoading: "Пишет...", restore: "Восстановить",
      aiHint: "Напишите текст своими словами — ИИ сделает его теплее и привлекательнее для гостей.",
      aiImproved: "ИИ улучшил текст",
      aiImprovedLong: "ИИ улучшил текст — проверьте и отредактируйте при необходимости",
    },
    common: { loading: "Загрузка...", error: "Ошибка", rating: "рейтинг", newHost: "Новый", cookieText: "Мы используем cookies для работы сайта", cookieAccept: "Принять" },
    legal: { privacy: "Политика конфиденциальности", terms: "Условия использования", rules: "Правила платформы", back: "На главную" },
    welcome: { title: "Добро пожаловать в HayHome! 🏔️", subtitle: "Начните своё культурное путешествие", step1title: "Найдите семью", step1desc: "Выберите армянскую семью, которая встретит вас с теплотой и гостеприимством.", step2title: "Забронируйте", step2desc: "Оформите бронирование в пару кликов, безопасно и надёжно.", step3title: "Погрузитесь в культуру", step3desc: "Живите, как местные: традиции, кухня, настоящие истории у большого стола.", startBtn: "Начать знакомство", skipBtn: "Пропустить" },
    dashboard: { profileInfo: "Профиль гостя", profileInfoDesc: "Ваши данные аккаунта", partner: "Партнёры" },
    auth: { loginTitle: "Войти в аккаунт", registerTitle: "Создать аккаунт", registerSub: "Регистрация гостя — бесплатно", password: "Пароль", confirmPassword: "Повторите пароль", name: "Ваше имя", loginBtn: "Войти", loggingIn: "Вход...", registerBtn: "Зарегистрироваться", registering: "Регистрация...", noAccount: "Нет аккаунта?", hasAccount: "Уже есть аккаунт?", wantToHost: "Хотите принимать гостей?", wrongCreds: "Неверный email или пароль", passMismatch: "Пароли не совпадают", minPass: "Минимум 6 символов", socialOr: "или", socialAutoCreate: "При входе через соцсеть аккаунт создаётся автоматически", consentPD: "Я согласен на обработку персональных данных" },
    about: { heroTitle: "О нас", heroSub: "Мы не строим платформу для аренды жилья. Мы строим живую культурную сеть.", missionLabel: "Наша миссия", missionTitle: "Армения открывается", missionTitle2: "через сердце семьи", missionSub: "HayHome — это не Airbnb. Это культурная экосистема национального масштаба. Мы сохраняем армянские семейные ценности и укрепляем образ Армении как самого гостеприимного народа мира.", card1title: "Сохранение традиций", card1desc: "Каждая семья — хранитель культурного кода. Мы помогаем этому коду жить и передаваться поколениям.", card2title: "Объединение народов", card2desc: "Гости из 40+ стран уже познакомились с Арменией через наших хозяев. Каждый визит — мост между культурами.", card3title: "Гордость за страну", card3desc: "Армянские семьи зарабатывают статус «Хранителя традиций» — признание всего сообщества.", storyLabel: "Как всё началось", storyTitle: "Идея, которая родилась за ужином", story1: "Всё началось с простого наблюдения: в Армении живут сотни семей, готовых принять гостей и показать настоящее гостеприимство. Но у них не было инструмента рассказать об этом миру.", story2: "А туристы со всего мира хотят именно этого — не отельный сервис, а живой опыт. Настоящие истории за большим столом.", story3: "HayHome создан, чтобы соединить этих людей. Это платформа доверия, культуры и тепла. Не просто бизнес — движение.", valuesLabel: "Наши ценности", valuesTitle: "Чем мы не Airbnb", v1t: "Хозяин — не арендодатель", v1d: "Каждый хозяин — «Хранитель традиций». Он презентует свой уклад жизни, культуру и историю.", v2t: "Опыт, а не кровать", v2d: "Гость ищет не место для ночлега, а уникальный опыт: мастер-классы, ужины, истории.", v3t: "Доверие через верификацию", v3d: "Каждая семья проходит проверку. Система звёзд гарантирует качество.", v4t: "Армяне знакомят армян", v4d: "Армянские семьи из разных регионов знакомятся между собой через платформу.", v5t: "Геймификация и статусы", v5d: "Бейджи «Лучшая кухня», «Мастер вина» — признание сообщества.", v6t: "Истории, не отзывы", v6d: "«Я приехал туристом, а уехал сыном этой семьи» — вот настоящий отзыв.", statsTitle: "HayHome сегодня", s1: "Семей в сети", s2: "Регионов Армении", s3: "Стран гостей", s4: "Средний рейтинг", toneLabel: "Наш голос", toneTitle: "Как мы говорим", toneSub: "Мы говорим как старший брат, гостеприимный хозяин, патриот без пафоса — не как корпорация.", secTitle: "Безопасность и доверие", secDesc: "Каждая семья проходит верификацию документов. Страхование и поддержка 24/7.", ctaTitle: "Присоединяйтесь к нашей семье", ctaSub: "Неважно, откуда вы. Армянская семья всегда рада гостям." },
  },

  en: {
    nav: { findFamily: "Find a Family", hostGuests: "Host Guests", about: "About", partner: "Partners", login: "Log In", register: "Sign Up", logout: "Sign Out" },
    hero: {
      greeting: "Welcome!",
      title1: "Join",
      title2: "our family",
      subtitle: "Armenia opens through the heart of a family. A real dinner, living stories, a view of Ararat. Not a hotel — a home.",
      searchPlaceholder: "Yerevan, Dilijan, Sevan...",
      searchBtn: "Find a Family",
      familiesWaiting: "families await you",
    },
    hosts: {
      pageTitle: "families in Armenia",
      searchPlaceholder: "Search by family, city, region...",
      filters: "Filters", byRating: "By rating", byPriceAsc: "Price: low to high", byPriceDesc: "Price: high to low",
      region: "Region", allRegions: "All regions", minStars: "Min stars", anyStars: "Any",
      priceTo: "Price up to", resetFilters: "Reset filters", notFound: "No families found",
      notFoundSub: "Try adjusting your filters", verified: "Verified", perNight: "/night",
      guests: "guests", upTo: "up to", book: "Book a Visit", backToList: "All Families",
      aboutFamily: "About the Family", amenities: "Amenities", experiences: "What awaits you",
      languages: "Languages", reviews: "Reviews", newGuest: "Be the first guest!",
      freeCancel: "Free cancellation within 48 hours", directContact: "Direct contact with the family", noHidden: "No hidden fees",
      writeReview: "Write a Review",
      reviewPlaceholder: "Tell us about your experience... (min 10 characters)",
      submitReview: "Submit Review",
      reviewSuccess: "Thank you for your review!",
      mustBeGuest: "Only guests with a completed booking can leave a review",
      calendarTitle: "Availability Calendar",
      mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
      available: "Available", booked: "Booked", blocked: "Blocked",
      noCalendar: "You don't have a calendar. Become a host to manage dates.",
      listView: "List", mapView: "Map",
    },
    home: {
      whyTitle: "Why HayHome?",
      whySub: "This is not Airbnb. It's something more — a connection between people of different cultures.",
      realHome: "A Real Home", realHomeDesc: "You live with the family, not in a hotel. You eat what they eat. You hear stories not written in guidebooks.",
      verified: "Verified Hosts", verifiedDesc: "Every family is verified. The star system guarantees quality.",
      unite: "Uniting People", uniteDesc: "Guests from 40+ countries have already discovered Armenia through our hosts.",
      ourFamilies: "Our Families", ourFamiliesSub: "Authentic Armenian homestay",
      allFamilies: "All Families",
      howTitle: "How It Works",
      step1: "Choose a family", step1desc: "Filter by city, stars, price and languages",
      step2: "Book a visit", step2desc: "Select dates and send a request to the family",
      step3: "Become one of them", step3desc: "You'll leave as a friend. And come back again.",
      becomeTitle: "Do you have a home and want to welcome guests?",
      becomeSub: "Register for free. First 12 months — no commission.",
      becomeCta: "Host Guests",
      browseBtn: "Browse Families",
      freeStay: "Free stay",
      freeStayDesc: "Stay with an Armenian family for free",
      bookForFree: "Book for free",
      paidServices: "Paid services",
      experiencesLabel: "Experiences",
    },
    become: {
      title: "Host Guests in HayHome",
      subtitle: "Share the warmth of Armenian families with the world",
      step0: "Contacts", step1: "Location", step2: "Terms", step3: "Experience",
      familyName: "Family Name", yourName: "Your Name", phone: "Phone", email: "Email",
        patronymic: "Patronymic",         passportTitle: "📝 Passport",         passportSeries: "Passport series",         passportNumber: "Passport number",         passportDate: "Date of issue",         passportIssued: "Issued by",         inn: "Tax ID (optional)",         bankTitle: "🏦 Bank details for payouts",         bankAccount: "Account / Card number",         bankName: "Bank",
      city: "City", region: "Region", address: "Address", pickRegion: "Select region",
      priceNight: "Price per night", maxGuests: "Max guests", rooms: "Guest rooms",
      shortDesc: "Short description", longDesc: "Tell us more about yourself",
      amenitiesLabel: "Amenities", experiencesLabel: "Guest experiences", langsLabel: "Languages",
      submit: "Submit Application", submitting: "Submitting...",
      successTitle: "Application sent!", successText: "Our manager will contact you within 24–48 hours.",
      next: "Next", back: "Back", toHome: "Home",
      aiBtn: "Improve with AI", aiLoading: "Writing...", restore: "Restore",
      aiHint: "Write your text in your own words — AI will make it warmer and more attractive to guests.",
      aiImproved: "AI improved the text",
      aiImprovedLong: "AI improved the text — review and edit if needed",
    },
    common: { loading: "Loading...", error: "Error", rating: "rating", newHost: "New", cookieText: "We use cookies for the site to work", cookieAccept: "Accept" },
    legal: { privacy: "Privacy Policy", terms: "Terms of Service", rules: "Platform Rules", back: "Back to Home" },
    welcome: { title: "Welcome to HayHome! 🏔️", subtitle: "Begin your cultural journey", step1title: "Find a Family", step1desc: "Choose an Armenian family that will greet you with warmth and a welcome home.", step2title: "Book", step2desc: "Complete your booking in a few clicks, safely and reliably.", step3title: "Immerse in Culture", step3desc: "Live like a local: traditions, cuisine, real stories around a big table.", startBtn: "Start Exploring", skipBtn: "Skip" },
    dashboard: { profileInfo: "Guest Profile", profileInfoDesc: "Your account details", partner: "Partners" },
    auth: { loginTitle: "Sign In", registerTitle: "Create Account", registerSub: "Guest registration — free", password: "Password", confirmPassword: "Confirm Password", name: "Your Name", loginBtn: "Sign In", loggingIn: "Signing in...", registerBtn: "Create Account", registering: "Registering...", noAccount: "No account?", hasAccount: "Already have an account?", wantToHost: "Want to host guests?", wrongCreds: "Invalid email or password", passMismatch: "Passwords don't match", minPass: "Minimum 6 characters", socialOr: "or", socialAutoCreate: "Signing in via social network creates an account automatically", consentPD: "I consent to the processing of personal data" },
    about: { heroTitle: "About Us", heroSub: "We are not building a rental platform. We are building a living cultural network.", missionLabel: "Our Mission", missionTitle: "Armenia opens up", missionTitle2: "through the heart of a family", missionSub: "HayHome is not Airbnb. It is a cultural ecosystem of national scale. We preserve Armenian family values and strengthen Armenia's image as the most hospitable people in the world.", card1title: "Preserving Traditions", card1desc: "Every family is a keeper of cultural heritage. We help this heritage live and pass on to future generations.", card2title: "Uniting People", card2desc: "Guests from 40+ countries have already discovered Armenia through our hosts. Every visit is a bridge between cultures.", card3title: "Pride in the Country", card3desc: "Armenian families earn the status of 'Tradition Keeper' — recognition from the whole community.", storyLabel: "How It Started", storyTitle: "An idea born over dinner", story1: "It all started with a simple observation: hundreds of Armenian families are ready to welcome guests and welcome guests — but had no tool to tell the world.", story2: "And tourists from around the world want exactly this — not hotel service, but a living experience. Real stories around a big table.", story3: "HayHome was created to connect these people. It is a platform of trust, culture and warmth. Not just a business — a movement.", valuesLabel: "Our Values", valuesTitle: "Why We Are Not Airbnb", v1t: "Host, Not Landlord", v1d: "Every host is a 'Tradition Keeper'. They present their way of life, culture and history.", v2t: "Experience, Not a Bed", v2d: "The guest seeks not a place to sleep, but a unique experience: masterclasses, dinners, stories.", v3t: "Trust Through Verification", v3d: "Every family is verified. The star system guarantees quality.", v4t: "Armenians Meet Armenians", v4d: "Armenian families from different regions meet each other through the platform.", v5t: "Gamification & Status", v5d: "Badges like 'Best Kitchen', 'Wine Master' are community recognition.", v6t: "Stories, Not Reviews", v6d: "'I came as a tourist and left as their son' — that's a real review.", statsTitle: "HayHome Today", s1: "Families in the network", s2: "Regions of Armenia", s3: "Guest countries", s4: "Average rating", toneLabel: "Our Voice", toneTitle: "How We Speak", toneSub: "We speak like an older brother, a welcoming host, a patriot without pomposity — not like a corporation.", secTitle: "Safety & Trust", secDesc: "Every family goes through document verification. Insurance and 24/7 support.", ctaTitle: "Join our family", ctaSub: "It doesn't matter where you're from. An Armenian family is always happy to welcome guests." },
  },

  hy: {
    nav: { findFamily: "Գտնել ընտանիք", hostGuests: "Ընդունել հյուրեր", about: "Մեր մասին", partner: "Գործընկերներ", login: "Մուտք", register: "Գրանցում" , logout: "Ելք" },
    hero: {
      greeting: "Բարի գալուստ!",
      title1: "Միացիր",
      title2: "մեր ընտանիքին",
      subtitle: "Հայաստանը բացվում է ընտանիքի սրտի միջոցով: Իրական ընթրիք, կենդանի պատմություններ, Արարատի տեսարան:",
      searchPlaceholder: "Երևան, Դիլիջան, Սևան...",
      searchBtn: "Գտնել ընտանիք",
      familiesWaiting: "ընտանիք սպասում է ձեզ",
    },
    hosts: {
      pageTitle: "ընտանիք Հայաստանում",
      searchPlaceholder: "Որոնել ըստ ընտանիքի, քաղաքի...",
      filters: "Ֆիլտրեր", byRating: "Ըստ վարկանիշի", byPriceAsc: "Գին: էժան", byPriceDesc: "Գին: թանկ",
      region: "Մարզ", allRegions: "Բոլոր մարզերը", minStars: "Նվազ. աստղ", anyStars: "Ցանկացած",
      priceTo: "Գինը մինչև", resetFilters: "Մաքրել ֆիլտրերը", notFound: "Ընտանիքներ չեն գտնվել",
      notFoundSub: "Փոփոխեք ֆիլտրերը", verified: "Ստուգված", perNight: "/գիշեր",
      guests: "հյուր", upTo: "մինչև", book: "Ամրագրել այց", backToList: "Բոլոր ընտանիքները",
      aboutFamily: "Ընտանիքի մասին", amenities: "Հարմարություններ", experiences: "Ինչ է սպասվում",
      languages: "Լեզուներ", reviews: "Կարծիքներ", newGuest: "Եղեք առաջին հյուրը!",
      freeCancel: "Անվճար չեղարկում 48 ժամ", directContact: "Ուղղակի կապ ընտանիքի հետ", noHidden: "Թաքնված վճարներ չկան",
      writeReview: "Գրել կարծիք",
      reviewPlaceholder: "Պատմեք ձեր փորձի մասին... (նվազագույնը 10 նիշ)",
      submitReview: "Ուղարկել կարծիքը",
      reviewSuccess: "Շնորհակալություն ձեր կարծիքի համար!",
      mustBeGuest: "Միայն ավարտված ամրագրմամբ հյուրերը կարող են կարծիք թողնել",
      calendarTitle: "Հասանելիության օրացույց",
      mon: "Երկ", tue: "Երք", wed: "Չրք", thu: "Հնգ", fri: "Ուր", sat: "Շբթ", sun: "Կիր",
      available: "Հասանելի", booked: "Ամրագրված", blocked: "Արգելափակված",
      noCalendar: "Դուք չունեք օրացույց: Դառմավ տանտեր՝ ամսաթիվները կառավարելու համար:",
      listView: "Ցանկ", mapView: "Քարտեզ",
    },
    home: {
      whyTitle: "Ինչու՞ HayHome?",
      whySub: "Սա Airbnb չէ: Սա ավելին է — կապ տարբեր մշակույթների մարդկանց միջև:",
      realHome: "Իրական տուն", realHomeDesc: "Ապրում եք ընտանիքի հետ, ոչ հյուրանոցում:",
      verified: "Ստուգված տանտերեր", verifiedDesc: "Յուրաքանչյուր ընտանիք ստուգված է:",
      unite: "Միավորում ենք ժողովուրդներին", uniteDesc: "40+ երկրների հյուրեր ճանաչել են Հայաստանը:",
      ourFamilies: "Մեր ընտանիքները", ourFamiliesSub: "Հայկական հյուրընկալություն",
      allFamilies: "Բոլոր ընտանիքները",
      howTitle: "Ինչպես է աշխատում",
      step1: "Ընտրեք ընտանիք", step1desc: "Ֆիլտրեք ըստ քաղաքի, աստղերի",
      step2: "Ամրագրեք այց", step2desc: "Ընտրեք ամսաթվեր",
      step3: "Դարձեք իրենցից", step3desc: "Կհեռանաք որպես ընկեր:",
      becomeTitle: "Ունե՞ք տուն և ցանկություն ընդունել հյուրեր:",
      becomeSub: "Գրանցվեք անվճար:",
      becomeCta: "Ընդունել հյուրեր",
      browseBtn: "Դիտել ընտանիքները",
      freeStay: "Անվճար կացարան",
      freeStayDesc: "Անվճար բնակվել հայկական ընտանիքի հետ",
      bookForFree: "Ամրագրել անվճար",
      paidServices: "Վճարովի ծառայություններ",
      experiencesLabel: "Փորձությունների",
    },
    become: {
      title: "Առաջարկել հյուրընկալություն HayHome-ում",
      subtitle: "Կիսվեք հայկական հյուրընկալությամբ",
      step0: "Կոնտակտներ", step1: "Տեղ", step2: "Պայմաններ", step3: "Փորձակիրություն",
      familyName: "Ազգանուն", yourName: "Անուն", phone: "Հեռախոս", email: "Էլ. փոստ",
        patronymic: "Հայրանուն",         passportTitle: "📝 Անձամահության տվյալներ",         passportSeries: "Անձամահության սերիա",         passportNumber: "Անձամահության համար",         passportDate: "Տրման ամսաթիվ",         passportIssued: "Տրում է",         inn: "ՀՀՀ (ընտրանքային)",         bankTitle: "🏦 Բանկային ռեկվիզիտներ",         bankAccount: "Հաշվամահության / Քարտի համար",         bankName: "Բանկ",
      city: "Քաղաք", region: "Մարզ", address: "Հասցե", pickRegion: "Ընտրեք մարզ",
      priceNight: "Գինը մեկ գիշերվա", maxGuests: "Առավոլ հյուրեր", rooms: "Հյուրերի սենյակներ",
      shortDesc: "Կարճ նկարագրություն", longDesc: "Մանրամասն նկարագրություն",
      amenitiesLabel: "Հարմարություններ", experiencesLabel: "Փորձակիրություններ", langsLabel: "Լեզուներ",
      submit: "Ուղարկել", submitting: "Ուղարկվում է...",
      successTitle: "Հայտն ուղարկված է!", successText: "Մենք կկապվենք ձեզ հետ 24–48 ժամվա ընթացքում:",
      next: "Հաջորդ", back: "Հետ", toHome: "Գլխավոր",
      aiBtn: "Բարելավել AI-ով", aiLoading: "Գրում...", restore: "Վերականգնել",
      aiHint: "Գրեք ձեր բառերով — AI-ն կդարձնի ավելի ջերմ:",
      aiImproved: "AI-ն բարելավել է",
      aiImprovedLong: "AI-ն բարելավել է — ստուգեք",
    },
    common: { loading: "Բեռնում...", error: "Սխալ", rating: "վարկանիշ", newHost: "Նոր", cookieText: "Մենք օգտագործում ենք cookies կայքի աշխատանքի համար", cookieAccept: "Ընդունել" },
    legal: { privacy: "Գաղտնիության քաղաքականություն", terms: "Օգտագործման պայմաններ", rules: "Հարթակի կանոններ", back: "Գլխավոր" },
    welcome: { title: "Բարի գալուստ HayHome! 🏔️", subtitle: "Սկսեք ձեր մշակութային ուղևորությունը", step1title: "Գտնեք ընտանիք", step1desc: "Ընտրեք հայկական ընտանիք, որը կդիմավորի ձեզ ջերմությամբ։", step2title: "Ամրագրեք", step2desc: "Ամրագրեք մի քանի կտտոցով, ապահով և հուսալի։", step3title: "Ընկղմվեք մշակույթի մեջ", step3desc: "Ապրեք տեղայնի պես. ավանդույթներ, խոհանոց, իրական պատմություններ։", startBtn: "Սկսել ծանոթությունը", skipBtn: "Բաց թողնել" },
    dashboard: { profileInfo: "Հյուրի պրոֆիլ", profileInfoDesc: "Ձեր հաշվի տվյալները", partner: "Գործընկերներ" },
    about: { heroTitle: "Մեր մասին", heroSub: "Մենք չենք կառուցում բնակարանների վարձակալության հարթակ: Մենք կառուցում ենք կենդանի մշակութային ցանց:", missionLabel: "Մեր առաքելությունը", missionTitle: "Հայաստանը բացվում է", missionTitle2: "ընտանիքի սրտի միջոցով", missionSub: "HayHome-ը Airbnb չէ: Սա ազգային մասշտաբի մշակութային էկոհամակարգ է: Մենք պահպանում ենք հայկական ընտանեկան արժեքները և ամրապնդում Հայաստանի կերպարը՝ որպես աշխարհի ամենահյուրընկալ ժողովուրդ:", card1title: "Ավանդույթների պահպանում", card1desc: "Յուրաքանչյուր ընտանիք մշակութային կոդի պահապան է: Մենք օգնում ենք այդ կոդին ապրել և փոխանցվել սերունդներին:", card2title: "Ժողովուրդների միավորում", card2desc: "40+ երկրների հյուրեր արդեն ծանաչել են Հայաստանը մեր տանտերերի միջոցով: Յուրաքանչյուր այց՝ կամուրջ մշակույթների միջև:", card3title: "Հպարտություն երկրի համար", card3desc: "Հայկական ընտանիքները վաստակում են «Ավանդույթների պահապան» կարգավիճակ՝ ամբողջ համայնքի ճանաչումը:", storyLabel: "Ինչպես սկսվեց", storyTitle: "Գաղափար, որը ծնվեց ընթրիքին", story1: "Ամեն ինչ սկսվեց պարզ դիտարկումից. Հայաստանում ապրում են հարյուրավոր ընտանիքներ, որոնք պատրաստ են ընդունել հյուրեր և ցույց տալ իրական հյուրընկալություն, բայց նրանք գործիք չունեին աշխարհին պատմելու դրա մասին:", story2: "Իսկ զբոսաշրջիկները ամբողջ աշխարհից հենց սա են ուզում՝ ոչ թե հյուրանոցային սպասարկում, այլ կենդանի փորձ: Իրական պատմություններ մեծ սեղանի շուրջ:", story3: "HayHome-ը ստեղծվել է այս մարդկանց միացնելու համար: Սա վստահության, մշակույթի և ջերմության հարթակ է: Ոչ միայն բիզնես՝ շարժում:", valuesLabel: "Մեր արժեքները", valuesTitle: "Ինչու մենք չենք Airbnb", v1t: "Տանտերը վարձատու չէ", v1d: "Յուրաքանչյուր տանտեր «Ավանդույթների պահապան» է: Նա ներկայացնում է իր ապրելակերպը, մշակույթը և պատմությունը:", v2t: "Փորձ, ոչ թե մահճակալ", v2d: "Հյուրը փնտրում է ոչ թե քնելու տեղ, այլ եզակի փորձ՝ վարպետության դասեր, ընթրիքներ, պատմություններ:", v3t: "Վստահություն ստուգման միջոցով", v3d: "Յուրաքանչյուր ընտանիք անցնում է ստուգում: Աստղերի համակարգը երաշխավորում է որակը:", v4t: "Հայերը ծանոթացնում են հայերի", v4d: "Տարբեր շրջանների հայկական ընտանիքներ ծանոթանում են միմյանց հարթակի միջոցով:", v5t: "Գեյմիֆիկացիա և կարգավիճակներ", v5d: "«Լավագույն խոհանոց», «Գինու վարպետ» նշանները՝ համայնքի ճանաչում:", v6t: "Պատմություններ, ոչ թե կարծիքներ", v6d: "«Ես եկա որպես զբոսաշրջիկ, իսկ հեռացա որպես այդ ընտանիքի որդի»՝ սա է իրական ակնարկը:", statsTitle: "HayHome այսօր", s1: "Ընտանիք ցանցում", s2: "Հայաստանի մարզեր", s3: "Հյուրերի երկրներ", s4: "Միջին վարկանիշ", toneLabel: "Մեր ձայնը", toneTitle: "Ինչպես ենք խոսում", toneSub: "Մենք խոսում ենք ավագ եղբոր պես՝ հյուրընկալ տանտեր, հայրենասեր՝ առանց փառասիրության՝ ոչ թե կորպորացիայի պես:", secTitle: "Անվտանգություն և վստահություն", secDesc: "Յուրաքանչյուր ընտանիք անցնում է փաստաթղթերի ստուգում: Ապահովագրություն և աջակցություն 24/7:", ctaTitle: "Միացիր մեր ընտանիքին", ctaSub: "Կարևոր չէ, թե որտեղից եք: Հայկական ընտանիքը միշտ ուրախությամբ է ընդունում հյուրերին:" },
    auth: { loginTitle: "Մուտք գործել", registerTitle: "Ստեղծել հաշիվ", registerSub: "Հյուրի գրանցում — անվճար", password: "Գաղտնաբառ", confirmPassword: "Կրկնել գաղտնաբառը", name: "Ձեր անունը", loginBtn: "Մուտք", loggingIn: "Մուտք...", registerBtn: "Գրանցվել", registering: "Գրանցում...", noAccount: "Հաշիվ չունե՞ք:", hasAccount: "Արդեն հաշիվ ունե՞ք:", wantToHost: "Ցանկանո՞ւմ եք ընդունել հյուրեր:", wrongCreds: "Սխալ email կամ գաղտնաբառ", passMismatch: "Գաղտնաբառերը չեն համընկնում", minPass: "Նվազ. 6 նիշ", socialOr: "կամ", socialAutoCreate: "Սոցիալական ցանցի միջոցով մուտք գործելիս հաշիվը ստեղծվում է ինքնաշխատ", consentPD: "Ես համաձայն եմ անձնական տվյալների մշակմանը" },
  },

  fr: {
    nav: { findFamily: "Trouver une famille", hostGuests: "Accueillir des hôtes", about: "À propos", login: "Connexion", register: "S'inscrire", logout: "Se déconnecter", partner: "Partenaires" },
    hero: {
      greeting: "Bienvenue !",
      title1: "Rejoignez",
      title2: "notre famille",
      subtitle: "L'Arménie s'ouvre par le cœur d'une famille. Un vrai dîner, des histoires vivantes, une vue sur l'Ararat.",
      searchPlaceholder: "Erevan, Dilijan, Sevan...",
      searchBtn: "Trouver une famille",
      familiesWaiting: "familles vous attendent",
    },
    hosts: {
      pageTitle: "familles en Arménie",
      searchPlaceholder: "Rechercher famille, ville...",
      filters: "Filtres", byRating: "Par note", byPriceAsc: "Prix croissant", byPriceDesc: "Prix décroissant",
      region: "Région", allRegions: "Toutes les régions", minStars: "Étoiles min.", anyStars: "Toutes",
      priceTo: "Prix jusqu'à", resetFilters: "Réinitialiser", notFound: "Aucune famille trouvée",
      notFoundSub: "Modifiez vos filtres", verified: "Vérifié", perNight: "/nuit",
      guests: "hôtes", upTo: "jusqu'à", book: "Réserver une visite", backToList: "Toutes les familles",
      aboutFamily: "À propos", amenities: "Équipements", experiences: "Ce qui vous attend",
      languages: "Langues", reviews: "Avis", newGuest: "Soyez le premier hôte!",
      freeCancel: "Annulation gratuite sous 48h", directContact: "Contact direct", noHidden: "Pas de frais cachés",
      writeReview: "Écrire un avis",
      reviewPlaceholder: "Racontez votre expérience... (min 10 caractères)",
      submitReview: "Envoyer l'avis",
      reviewSuccess: "Merci pour votre avis!",
      mustBeGuest: "Seuls les hôtes avec une réservation terminée peuvent laisser un avis",
      calendarTitle: "Calendrier de disponibilité",
      mon: "Lun", tue: "Mar", wed: "Mer", thu: "Jeu", fri: "Ven", sat: "Sam", sun: "Dim",
      available: "Disponible", booked: "Réservé", blocked: "Bloqué",
      noCalendar: "Vous n'avez pas de calendrier. Devenez hôte pour gérer les dates.",
      listView: "Liste", mapView: "Carte",
    },
    home: {
      whyTitle: "Pourquoi HayHome?",
      whySub: "Ce n'est pas Airbnb. C'est quelque chose de plus — une connexion entre les cultures.",
      realHome: "Une vraie maison", realHomeDesc: "Vous vivez avec la famille, pas dans un hôtel.",
      verified: "Hôtes vérifiés", verifiedDesc: "Chaque famille est vérifiée. Le système d'étoiles garantit la qualité.",
      unite: "Unir les peuples", uniteDesc: "Des hôtes de 40+ pays ont découvert l'Arménie.",
      ourFamilies: "Nos familles", ourFamiliesSub: "Séjours authentiques chez des familles arméniennes",
      allFamilies: "Toutes les familles",
      howTitle: "Comment ça marche",
      step1: "Choisissez une famille", step1desc: "Filtrez par ville, étoiles, prix",
      step2: "Réservez une visite", step2desc: "Choisissez les dates",
      step3: "Devenez des leurs", step3desc: "Vous repartirez comme un ami.",
      becomeTitle: "Vous avez une maison et souhaitez accueillir des hôtes?",
      becomeSub: "Inscrivez-vous gratuitement. 12 premiers mois sans commission.",
      becomeCta: "Accueillir des hôtes",
      browseBtn: "Voir les familles",
      freeStay: "Séjour gratuit",
      freeStayDesc: "Séjournez chez une famille arménienne gratuitement",
      bookForFree: "Réserver gratuitement",
      paidServices: "Services payants",
      experiencesLabel: "Expériences",
    },
    become: {
      title: "Accueillir des hôtes sur HayHome",
      subtitle: "Partagez la chaleur des familles arméniennes",
      step0: "Contacts", step1: "Lieu", step2: "Conditions", step3: "Expérience",
      familyName: "Nom de famille", yourName: "Votre nom", phone: "Téléphone", email: "Email",
        patronymic: "Patronyme",         passportTitle: "📝 Passeport",         passportSeries: "Série du passeport",         passportNumber: "Numéro du passeport",         passportDate: "Date de délivrance",         passportIssued: "Délivré par",         inn: "Numéro fiscal (facultatif)",         bankTitle: "🏦 Coordonnées bancaires",         bankAccount: "Numéro de compte / carte",         bankName: "Banque",
      city: "Ville", region: "Région", address: "Adresse", pickRegion: "Sélectionnez une région",
      priceNight: "Prix par nuit", maxGuests: "Max hôtes", rooms: "Chambres",
      shortDesc: "Description courte", longDesc: "Parlez-nous de vous",
      amenitiesLabel: "Équipements", experiencesLabel: "Expériences", langsLabel: "Langues",
      submit: "Soumettre", submitting: "Envoi...",
      successTitle: "Candidature envoyée!", successText: "Notre responsable vous contactera sous 24–48h.",
      next: "Suivant", back: "Retour", toHome: "Accueil",
      aiBtn: "Améliorer avec IA", aiLoading: "Écriture...", restore: "Restaurer",
      aiHint: "Écrivez votre texte — l'IA le rendra plus chaleureux.",
      aiImproved: "IA a amélioré le texte",
      aiImprovedLong: "IA a amélioré — vérifiez si nécessaire",
    },
    common: { loading: "Chargement...", error: "Erreur", rating: "note", newHost: "Nouveau", cookieText: "Nous utilisons des cookies pour le fonctionnement du site", cookieAccept: "Accepter" },
    legal: { privacy: "Politique de confidentialité", terms: "Conditions d'utilisation", rules: "Règles de la plateforme", back: "Accueil" },
    welcome: { title: "Bienvenue sur HayHome ! 🏔️", subtitle: "Commencez votre voyage culturel", step1title: "Trouvez une famille", step1desc: "Choisissez une famille arménienne qui vous accueillera avec chaleur.", step2title: "Réservez", step2desc: "Finalisez votre réservation en quelques clics, en toute sécurité.", step3title: "Immergez-vous dans la culture", step3desc: "Vivez comme un local : traditions, cuisine, vraies histoires autour d'une grande table.", startBtn: "Commencer", skipBtn: "Passer" },
    dashboard: { profileInfo: "Profil invité", profileInfoDesc: "Vos informations de compte", partner: "Partenaires" },
    about: { heroTitle: "À propos", heroSub: "Nous ne construisons pas une plateforme de location. Nous construisons un réseau culturel vivant.", missionLabel: "Notre mission", missionTitle: "L'Arménie s'ouvre", missionTitle2: "par le cœur d'une famille", missionSub: "HayHome n'est pas Airbnb. C'est un écosystème culturel d'envergure nationale. Nous préservons les valeurs familiales arméniennes et renforçons l'image de l'Arménie comme le peuple le plus hospitalier du monde.", card1title: "Préserver les traditions", card1desc: "Chaque famille est gardienne d'un héritage culturel. Nous aidons cet héritage à vivre et à se transmettre aux générations futures.", card2title: "Unir les peuples", card2desc: "Des hôtes de 40+ pays ont déjà découvert l'Arménie grâce à nos familles. Chaque visite est un pont entre les cultures.", card3title: "Fierté du pays", card3desc: "Les familles arméniennes obtiennent le statut de « Gardien des traditions » — une reconnaissance de toute la communauté.", storyLabel: "Comment tout a commencé", storyTitle: "Une idée née autour d'un dîner", story1: "Tout a commencé par une observation simple : des centaines de familles arméniennes sont prêtes à accueillir des hôtes et à accueillir des hôtes — mais n'avaient aucun outil pour en parler au monde.", story2: "Et les touristes du monde entier veulent exactement cela — pas un service hôtelier, mais une expérience vécue. De vraies histoires autour d'une grande table.", story3: "HayHome a été créé pour relier ces personnes. C'est une plateforme de confiance, de culture et de chaleur. Pas juste une entreprise — un mouvement.", valuesLabel: "Nos valeurs", valuesTitle: "Pourquoi nous ne sommes pas Airbnb", v1t: "Hôte, pas propriétaire", v1d: "Chaque hôte est un « Gardien des traditions ». Il présente son mode de vie, sa culture et son histoire.", v2t: "L'expérience, pas le lit", v2d: "Le client ne cherche pas une place pour dormir, mais une expérience unique : ateliers, dîners, histoires.", v3t: "Confiance par la vérification", v3d: "Chaque famille est vérifiée. Le système d'étoiles garantit la qualité.", v4t: "Les Arméniens se rencontrent", v4d: "Des familles arméniennes de différentes régions se découvrent grâce à la plateforme.", v5t: "Ludification et statuts", v5d: "Les badges « Meilleure cuisine », « Maître du vin » sont des reconnaissances de la communauté.", v6t: "Des histoires, pas des avis", v6d: "« Je suis arrivé touriste et reparti comme leur fils » — voilà un vrai témoignage.", statsTitle: "HayHome aujourd'hui", s1: "Familles dans le réseau", s2: "Régions d'Arménie", s3: "Pays d'origine des hôtes", s4: "Note moyenne", toneLabel: "Notre voix", toneTitle: "Comment nous parlons", toneSub: "Nous parlons comme un grand frère, un hôte accueillant, un patriote sans jingoïsme — pas comme une corporation.", secTitle: "Sécurité et confiance", secDesc: "Chaque famille passe par une vérification de documents. Assurance et support 24h/24 et 7j/7.", ctaTitle: "Rejoignez notre famille", ctaSub: "Peu importe d'où vous venez. Une famille arménienne est toujours heureuse d'accueillir ses hôtes." },
    auth: { loginTitle: "Se connecter", registerTitle: "Créer un compte", registerSub: "Inscription gratuite", password: "Mot de passe", confirmPassword: "Confirmer le mot de passe", name: "Votre nom", loginBtn: "Connexion", loggingIn: "Connexion...", registerBtn: "S'inscrire", registering: "Inscription...", noAccount: "Pas de compte?", hasAccount: "Déjà un compte?", wantToHost: "Vous voulez accueillir?", wrongCreds: "Email ou mot de passe incorrect", passMismatch: "Les mots de passe ne correspondent pas", minPass: "Minimum 6 caractères", socialOr: "ou", socialAutoCreate: "La connexion via réseau social crée automatiquement un compte", consentPD: "Je consens au traitement de mes données personnelles" },
  },

  de: {
    nav: { findFamily: "Familie finden", hostGuests: "Gäste empfangen", about: "Über uns", login: "Anmelden", register: "Registrieren", logout: "Abmelden", partner: "Partner" },
    hero: {
      greeting: "Willkommen!",
      title1: "Werden Sie",
      title2: "Teil unserer Familie",
      subtitle: "Armenien öffnet sich durch das Herz einer Familie. Ein echtes Abendessen, lebendige Geschichten, ein Blick auf den Ararat.",
      searchPlaceholder: "Jerewan, Dilijan, Sevan...",
      searchBtn: "Familie finden",
      familiesWaiting: "Familien warten auf Sie",
    },
    hosts: {
      pageTitle: "Familien in Armenien",
      searchPlaceholder: "Suche nach Familie, Stadt...",
      filters: "Filter", byRating: "Nach Bewertung", byPriceAsc: "Preis aufsteigend", byPriceDesc: "Preis absteigend",
      region: "Region", allRegions: "Alle Regionen", minStars: "Mind. Sterne", anyStars: "Beliebig",
      priceTo: "Preis bis", resetFilters: "Filter zurücksetzen", notFound: "Keine Familien gefunden",
      notFoundSub: "Ändern Sie die Filter", verified: "Verifiziert", perNight: "/Nacht",
      guests: "Gäste", upTo: "bis zu", book: "Besuch buchen", backToList: "Alle Familien",
      aboutFamily: "Über die Familie", amenities: "Ausstattung", experiences: "Was Sie erwartet",
      languages: "Sprachen", reviews: "Bewertungen", newGuest: "Seien Sie der erste Gast!",
      freeCancel: "Kostenlose Stornierung 48h", directContact: "Direktkontakt", noHidden: "Keine versteckten Gebühren",
      writeReview: "Bewertung schreiben",
      reviewPlaceholder: "Erzählen Sie von Ihrer Erfahrung... (min 10 Zeichen)",
      submitReview: "Bewertung senden",
      reviewSuccess: "Danke für Ihre Bewertung!",
      mustBeGuest: "Nur Gäste mit abgeschlossener Buchung können bewerten",
      calendarTitle: "Verfügbarkeitskalender",
      mon: "Mo", tue: "Di", wed: "Mi", thu: "Do", fri: "Fr", sat: "Sa", sun: "So",
      available: "Verfügbar", booked: "Gebucht", blocked: "Gesperrt",
      noCalendar: "Sie haben keinen Kalender. Werden Sie Gastgeber, um Daten zu verwalten.",
      listView: "Liste", mapView: "Karte",
    },
    home: {
      whyTitle: "Warum HayHome?",
      whySub: "Das ist kein Airbnb. Es ist etwas mehr — eine Verbindung zwischen Kulturen.",
      realHome: "Ein echtes Zuhause", realHomeDesc: "Sie leben mit der Familie, nicht im Hotel.",
      verified: "Verifizierte Gastgeber", verifiedDesc: "Jede Familie wird überprüft.",
      unite: "Völker verbinden", uniteDesc: "Gäste aus 40+ Ländern haben Armenien entdeckt.",
      ourFamilies: "Unsere Familien", ourFamiliesSub: "Echte armenische Gastfreundschaft",
      allFamilies: "Alle Familien",
      howTitle: "So funktioniert es",
      step1: "Familie wählen", step1desc: "Nach Stadt, Sternen, Preis filtern",
      step2: "Besuch buchen", step2desc: "Termine auswählen",
      step3: "Einer von ihnen werden", step3desc: "Sie gehen als Freund weg.",
      becomeTitle: "Haben Sie ein Zuhause und möchten Gäste empfangen?",
      becomeSub: "Kostenlos registrieren. Erste 12 Monate ohne Provision.",
      becomeCta: "Gäste empfangen",
      browseBtn: "Familien ansehen",
      freeStay: "Kostenloser Aufenthalt",
      freeStayDesc: "Kostenlos bei einer armenischen Familie wohnen",
      bookForFree: "Kostenlos buchen",
      paidServices: "Kostenpflichtige Dienste",
      experiencesLabel: "Erlebnisse",
    },
    become: {
      title: "Gäste in HayHome empfangen",
      subtitle: "Teilen Sie armenische Gastfreundschaft",
      step0: "Kontakte", step1: "Standort", step2: "Konditionen", step3: "Erfahrung",
      familyName: "Familienname", yourName: "Ihr Name", phone: "Telefon", email: "E-Mail",
        patronymic: "Patronym",         passportTitle: "📝 Reisepass",         passportSeries: "Pass-Serie",         passportNumber: "Pass-Nummer",         passportDate: "Ausstellungsdatum",         passportIssued: "Ausgestellt von",         inn: "Steuer-ID (optional)",         bankTitle: "🏦 Bankverbindung",         bankAccount: "Konto-/Kartennummer",         bankName: "Bank",
      city: "Stadt", region: "Region", address: "Adresse", pickRegion: "Region auswählen",
      priceNight: "Preis pro Nacht", maxGuests: "Max. Gäste", rooms: "Gästezimmer",
      shortDesc: "Kurzbeschreibung", longDesc: "Erzählen Sie mehr über sich",
      amenitiesLabel: "Ausstattung", experiencesLabel: "Erfahrungen", langsLabel: "Sprachen",
      submit: "Antrag senden", submitting: "Senden...",
      successTitle: "Antrag gesendet!", successText: "Unser Manager meldet sich in 24–48h.",
      next: "Weiter", back: "Zurück", toHome: "Startseite",
      aiBtn: "Mit KI verbessern", aiLoading: "Schreibt...", restore: "Wiederherstellen",
      aiHint: "Schreiben Sie Ihren Text — KI macht ihn wärmer.",
      aiImproved: "KI hat Text verbessert",
      aiImprovedLong: "KI hat verbessert — bei Bedarf bearbeiten",
    },
    common: { loading: "Laden...", error: "Fehler", rating: "Bewertung", newHost: "Neu", cookieText: "Wir verwenden Cookies für die Website", cookieAccept: "Akzeptieren" },
    legal: { privacy: "Datenschutzerklärung", terms: "Nutzungsbedingungen", rules: "Plattformregeln", back: "Zur Startseite" },
    welcome: { title: "Willkommen bei HayHome! 🏔️", subtitle: "Beginnen Sie Ihre kulturelle Reise", step1title: "Familie finden", step1desc: "Wählen Sie eine armenische Familie, die Sie herzlich willkommen heißt.", step2title: "Buchen", step2desc: "Schließen Sie Ihre Buchung in wenigen Klicks sicher ab.", step3title: "In die Kultur eintauchen", step3desc: "Leben Sie wie ein Einheimischer: Traditionen, Küche, echte Geschichten.", startBtn: "Entdecken beginnen", skipBtn: "Überspringen" },
    dashboard: { profileInfo: "Gastprofil", profileInfoDesc: "Ihre Kontodaten", partner: "Partner" },
    about: { heroTitle: "Über uns", heroSub: "Wir bauen keine Mietplattform. Wir bauen ein lebendiges kulturelles Netzwerk.", missionLabel: "Unsere Mission", missionTitle: "Armenien öffnet sich", missionTitle2: "durch das Herz einer Familie", missionSub: "HayHome ist kein Airbnb. Es ist ein kulturelles Ökosystem von nationaler Bedeutung. Wir bewahren armenische Familienwerte und stärken Armeniens Image als das gastfreundlichste Volk der Welt.", card1title: "Bewahrung von Traditionen", card1desc: "Jede Familie ist Hüter eines kulturellen Codes. Wir helfen diesem Code zu leben und an Generationen weitergegeben zu werden.", card2title: "Völker verbinden", card2desc: "Gäste aus 40+ Ländern haben Armenien bereits durch unsere Gastgeber entdeckt. Jeder Besuch ist eine Brücke zwischen Kulturen.", card3title: "Stolz auf das Land", card3desc: "Armenische Familien verdienen den Status 'Hüter der Traditionen' — Anerkennung der gesamten Gemeinschaft.", storyLabel: "Wie alles begann", storyTitle: "Eine Idee, die beim Abendessen entstand", story1: "Alles begann mit einer einfachen Beobachtung: In Armenien leben Hunderte von Familien, die bereit sind, Gäste aufzunehmen und echte Gastfreundschaft zu zeigen — aber sie hatten kein Werkzeug, um der Welt davon zu erzählen.", story2: "Und Touristen aus aller Welt wollen genau das — keinen Hotelservice, sondern ein lebendiges Erlebnis. Echte Geschichten an einem großen Tisch.", story3: "HayHome wurde geschaffen, um diese Menschen zu verbinden. Es ist eine Plattform des Vertrauens, der Kultur und der Wärme. Nicht nur ein Geschäft — eine Bewegung.", valuesLabel: "Unsere Werte", valuesTitle: "Warum wir nicht Airbnb sind", v1t: "Gastgeber, nicht Vermieter", v1d: "Jeder Gastgeber ist ein 'Hüter der Traditionen'. Er präsentiert seine Lebensweise, Kultur und Geschichte.", v2t: "Erlebnis, kein Bett", v2d: "Der Gast sucht keinen Schlafplatz, sondern ein einzigartiges Erlebnis: Workshops, Abendessen, Geschichten.", v3t: "Vertrauen durch Verifizierung", v3d: "Jede Familie wird geprüft. Das Sternesystem garantiert Qualität.", v4t: "Armenier lernen Armenier kennen", v4d: "Armenische Familien aus verschiedenen Regionen entdecken einander über die Plattform.", v5t: "Gamification und Status", v5d: "Abzeichen wie 'Beste Küche', 'Weinmeister' sind Anerkennung der Gemeinschaft.", v6t: "Geschichten, keine Bewertungen", v6d: "'Ich kam als Tourist und ging als ihr Sohn' — das ist eine echte Bewertung.", statsTitle: "HayHome heute", s1: "Familien im Netzwerk", s2: "Regionen Armeniens", s3: "Herkunftsländer der Gäste", s4: "Durchschnittliche Bewertung", toneLabel: "Unsere Stimme", toneTitle: "Wie wir sprechen", toneSub: "Wir sprechen wie ein älterer Bruder, ein gastfreundlicher Gastgeber, ein Patriot ohne Pomp — nicht wie eine Corporation.", secTitle: "Sicherheit und Vertrauen", secDesc: "Jede Familie durchläuft eine Dokumentenprüfung. Versicherung und 24/7-Support.", ctaTitle: "Werden Sie Teil unserer Familie", ctaSub: "Es spielt keine Rolle, woher Sie kommen. Eine armenische Familie freut sich immer, Gäste willkommen zu heißen." },
    auth: { loginTitle: "Anmelden", registerTitle: "Konto erstellen", registerSub: "Gast-Registrierung — kostenlos", password: "Passwort", confirmPassword: "Passwort bestätigen", name: "Ihr Name", loginBtn: "Anmelden", loggingIn: "Anmeldung...", registerBtn: "Registrieren", registering: "Registrierung...", noAccount: "Kein Konto?", hasAccount: "Bereits ein Konto?", wantToHost: "Gäste empfangen?", wrongCreds: "Ungültige E-Mail oder Passwort", passMismatch: "Passwörter stimmen nicht überein", minPass: "Mindestens 6 Zeichen", socialOr: "oder", socialAutoCreate: "Die Anmeldung über ein soziales Netzwerk erstellt automatisch ein Konto", consentPD: "Ich willige in die Verarbeitung meiner personenbezogenen Daten ein" },
  },

  es: {
    nav: { findFamily: "Encontrar familia", hostGuests: "Recibir huéspedes", about: "Sobre nosotros", login: "Iniciar sesión", register: "Registrarse", logout: "Cerrar sesión", partner: "Socios" },
    hero: {
      greeting: "¡Bienvenido!",
      title1: "Únete",
      title2: "a nuestra familia",
      subtitle: "Armenia se abre a través del corazón de una familia. Una cena real, historias vivas, una vista del Ararat.",
      searchPlaceholder: "Ereván, Dilijan, Sevan...",
      searchBtn: "Encontrar familia",
      familiesWaiting: "familias te esperan",
    },
    hosts: {
      pageTitle: "familias en Armenia",
      searchPlaceholder: "Buscar familia, ciudad...",
      filters: "Filtros", byRating: "Por calificación", byPriceAsc: "Precio: más barato", byPriceDesc: "Precio: más caro",
      region: "Región", allRegions: "Todas las regiones", minStars: "Estrellas mín.", anyStars: "Cualquiera",
      priceTo: "Precio hasta", resetFilters: "Restablecer", notFound: "No se encontraron familias",
      notFoundSub: "Intente cambiar los filtros", verified: "Verificado", perNight: "/noche",
      guests: "huéspedes", upTo: "hasta", book: "Reservar visita", backToList: "Todas las familias",
      aboutFamily: "Sobre la familia", amenities: "Comodidades", experiences: "Lo que le espera",
      languages: "Idiomas", reviews: "Reseñas", newGuest: "¡Sé el primer huésped!",
      freeCancel: "Cancelación gratuita 48h", directContact: "Contacto directo", noHidden: "Sin cargos ocultos",
      writeReview: "Escribir reseña",
      reviewPlaceholder: "Cuente su experiencia... (mín 10 caracteres)",
      submitReview: "Enviar reseña",
      reviewSuccess: "¡Gracias por su reseña!",
      mustBeGuest: "Solo huéspedes con reserva completada pueden dejar reseña",
      calendarTitle: "Calendario de disponibilidad",
      mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom",
      available: "Disponible", booked: "Reservado", blocked: "Bloqueado",
      noCalendar: "No tienes calendario. Conviértete en anfitrión para gestionar fechas.",
      listView: "Lista", mapView: "Mapa",
    },
    home: {
      whyTitle: "¿Por qué HayHome?",
      whySub: "Esto no es Airbnb. Es algo más — una conexión entre culturas.",
      realHome: "Un hogar real", realHomeDesc: "Vives con la familia, no en un hotel.",
      verified: "Anfitriones verificados", verifiedDesc: "Cada familia está verificada.",
      unite: "Uniendo pueblos", uniteDesc: "Huéspedes de 40+ países ya conocen Armenia.",
      ourFamilies: "Nuestras familias", ourFamiliesSub: "Hospitalidad armenia auténtica",
      allFamilies: "Todas las familias",
      howTitle: "Cómo funciona",
      step1: "Elige una familia", step1desc: "Filtra por ciudad, estrellas, precio",
      step2: "Reserva una visita", step2desc: "Selecciona fechas",
      step3: "Conviértete en uno de ellos", step3desc: "Te irás como amigo.",
      becomeTitle: "¿Tienes casa y quieres recibir huéspedes?",
      becomeSub: "Regístrate gratis. Primeros 12 meses sin comisión.",
      becomeCta: "Recibir huéspedes",
      browseBtn: "Ver familias",
      freeStay: "Alojamiento gratuito",
      freeStayDesc: "Alójate con una familia armenia de forma gratuita",
      bookForFree: "Reservar gratis",
      paidServices: "Servicios de pago",
      experiencesLabel: "Experiencias",
    },
    become: {
      title: "Recibir huéspedes en HayHome",
      subtitle: "Comparte la hospitalidad armenia",
      step0: "Contactos", step1: "Ubicación", step2: "Condiciones", step3: "Experiencia",
      familyName: "Nombre de familia", yourName: "Tu nombre", phone: "Teléfono", email: "Correo",
        patronymic: "Patronímico",         passportTitle: "📝 Pasaporte",         passportSeries: "Serie del pasaporte",         passportNumber: "Número de pasaporte",         passportDate: "Fecha de emisión",         passportIssued: "Emitido por",         inn: "NIF (opcional)",         bankTitle: "🏦 Datos bancarios",         bankAccount: "Número de cuenta / tarjeta",         bankName: "Banco",
      city: "Ciudad", region: "Región", address: "Dirección", pickRegion: "Selecciona región",
      priceNight: "Precio por noche", maxGuests: "Máx. huéspedes", rooms: "Habitaciones",
      shortDesc: "Descripción corta", longDesc: "Cuéntanos más sobre ti",
      amenitiesLabel: "Comodidades", experiencesLabel: "Experiencias", langsLabel: "Idiomas",
      submit: "Enviar solicitud", submitting: "Enviando...",
      successTitle: "¡Solicitud enviada!", successText: "Nuestro manager te contactará en 24–48h.",
      next: "Siguiente", back: "Atrás", toHome: "Inicio",
      aiBtn: "Mejorar con IA", aiLoading: "Escribiendo...", restore: "Restaurar",
      aiHint: "Escribe tu texto — la IA lo hará más cálido.",
      aiImproved: "IA mejoró el texto",
      aiImprovedLong: "IA mejoró — edita si es necesario",
    },
    common: { loading: "Cargando...", error: "Error", rating: "calificación", newHost: "Nuevo", cookieText: "Usamos cookies para el funcionamiento del sitio", cookieAccept: "Aceptar" },
    legal: { privacy: "Política de privacidad", terms: "Términos de servicio", rules: "Reglas de la plataforma", back: "Inicio" },
    welcome: { title: "¡Bienvenido a HayHome! 🏔️", subtitle: "Comienza tu viaje cultural", step1title: "Encuentra una familia", step1desc: "Elige una familia armenia que te reciba con calidez y hospitalidad.", step2title: "Reserva", step2desc: "Completa tu reserva en pocos clics, de forma segura.", step3title: "Sumérgete en la cultura", step3desc: "Vive como un local: tradiciones, cocina, historias reales.", startBtn: "Comenzar exploración", skipBtn: "Omitir" },
    dashboard: { profileInfo: "Perfil de huésped", profileInfoDesc: "Datos de tu cuenta", partner: "Socios" },
    about: { heroTitle: "Sobre nosotros", heroSub: "No construimos una plataforma de alquiler. Construimos una red cultural viva.", missionLabel: "Nuestra misión", missionTitle: "Armenia se abre", missionTitle2: "a través del corazón de una familia", missionSub: "HayHome no es Airbnb. Es un ecosistema cultural de escala nacional. Preservamos los valores familiares armenios y fortalecemos la imagen de Armenia como el pueblo más hospitalario del mundo.", card1title: "Preservar tradiciones", card1desc: "Cada familia es guardiana de un código cultural. Ayudamos a que este código viva y se transmita a las generaciones futuras.", card2title: "Unir a los pueblos", card2desc: "Huéspedes de 40+ países ya han descubierto Armenia a través de nuestros anfitriones. Cada visita es un puente entre culturas.", card3title: "Orgullo por el país", card3desc: "Las familias armenias obtienen el estatus de «Guardián de tradiciones» — reconocimiento de toda la comunidad.", storyLabel: "Cómo empezó todo", storyTitle: "Una idea que nació en una cena", story1: "Todo empezó con una observación simple: en Armenia viven cientos de familias listas para recibir huéspedes y mostrar la verdadera hospitalidad, pero no tenían una herramienta para contárselo al mundo.", story2: "Y los turistas de todo el mundo quieren exactamente eso — no servicio hotelero, sino una experiencia viva. Historias reales alrededor de una gran mesa.", story3: "HayHome fue creado para conectar a estas personas. Es una plataforma de confianza, cultura y calidez. No solo un negocio — un movimiento.", valuesLabel: "Nuestros valores", valuesTitle: "Por qué no somos Airbnb", v1t: "Anfitrión, no arrendador", v1d: "Cada anfitrión es un «Guardián de tradiciones». Presenta su forma de vida, cultura e historia.", v2t: "Experiencia, no una cama", v2d: "El huésped no busca un lugar para dormir, sino una experiencia única: talleres, cenas, historias.", v3t: "Confianza mediante verificación", v3d: "Cada familia es verificada. El sistema de estrellas garantiza la calidad.", v4t: "Los armenios se conocen entre sí", v4d: "Familias armenias de diferentes regiones se conocen a través de la plataforma.", v5t: "Gamificación y estatus", v5d: "Insignias como «Mejor cocina», «Maestro del vino» son reconocimiento de la comunidad.", v6t: "Historias, no reseñas", v6d: "«Llegué como turista y me fui como su hijo» — esa es una verdadera reseña.", statsTitle: "HayHome hoy", s1: "Familias en la red", s2: "Regiones de Armenia", s3: "Países de origen", s4: "Calificación promedio", toneLabel: "Nuestra voz", toneTitle: "Cómo hablamos", toneSub: "Hablamos como un hermano mayor, un anfitrión acogedor, un patriota sin soberbia — no como una corporación.", secTitle: "Seguridad y confianza", secDesc: "Cada familia pasa por una verificación de documentos. Seguro y soporte 24/7.", ctaTitle: "Únete a nuestra familia", ctaSub: "No importa de dónde vengas. Una familia armeniana siempre está feliz de recibir a sus huéspedes." },
    auth: { loginTitle: "Iniciar sesión", registerTitle: "Crear cuenta", registerSub: "Registro de huésped — gratis", password: "Contraseña", confirmPassword: "Confirmar contraseña", name: "Tu nombre", loginBtn: "Iniciar sesión", loggingIn: "Iniciando...", registerBtn: "Registrarse", registering: "Registrando...", noAccount: "¿Sin cuenta?", hasAccount: "¿Ya tienes cuenta?", wantToHost: "¿Quieres recibir huéspedes?", wrongCreds: "Email o contraseña incorrectos", passMismatch: "Las contraseñas no coinciden", minPass: "Mínimo 6 caracteres", socialOr: "o", socialAutoCreate: "Iniciar sesión con red social crea una cuenta automáticamente", consentPD: "Doy mi consentimiento para el tratamiento de datos personales" },
  },

  it: {
    nav: { findFamily: "Trova una famiglia", hostGuests: "Ospita viaggiatori", about: "Chi siamo", login: "Accedi", register: "Registrati", logout: "Esci", partner: "Partner" },
    hero: {
      greeting: "Benvenuto!",
      title1: "Unisciti",
      title2: "alla nostra famiglia",
      subtitle: "L'Armenia si apre attraverso il cuore di una famiglia. Una vera cena, storie vive, una vista sull'Ararat.",
      searchPlaceholder: "Yerevan, Dilijan, Sevan...",
      searchBtn: "Trova una famiglia",
      familiesWaiting: "famiglie ti aspettano",
    },
    hosts: {
      pageTitle: "famiglie in Armenia",
      searchPlaceholder: "Cerca famiglia, città...",
      filters: "Filtri", byRating: "Per valutazione", byPriceAsc: "Prezzo crescente", byPriceDesc: "Prezzo decrescente",
      region: "Regione", allRegions: "Tutte le regioni", minStars: "Stelle min.", anyStars: "Qualsiasi",
      priceTo: "Prezzo fino a", resetFilters: "Azzera filtri", notFound: "Nessuna famiglia trovata",
      notFoundSub: "Modifica i filtri", verified: "Verificato", perNight: "/notte",
      guests: "ospiti", upTo: "fino a", book: "Prenota visita", backToList: "Tutte le famiglie",
      aboutFamily: "Sulla famiglia", amenities: "Servizi", experiences: "Cosa ti aspetta",
      languages: "Lingue", reviews: "Recensioni", newGuest: "Sii il primo ospite!",
      freeCancel: "Cancellazione gratuita 48h", directContact: "Contatto diretto", noHidden: "Nessuna tariffa nascosta",
      writeReview: "Scrivi recensione",
      reviewPlaceholder: "Racconta la tua esperienza... (min 10 caratteri)",
      submitReview: "Invia recensione",
      reviewSuccess: "Grazie per la recensione!",
      mustBeGuest: "Solo ospiti con prenotazione completata possono lasciare recensione",
      calendarTitle: "Calendario disponibilità",
      mon: "Lun", tue: "Mar", wed: "Mer", thu: "Gio", fri: "Ven", sat: "Sab", sun: "Dom",
      available: "Disponibile", booked: "Prenotato", blocked: "Bloccato",
      noCalendar: "Non hai un calendario. Diventa host per gestire le date.",
      listView: "Lista", mapView: "Mappa",
    },
    home: {
      whyTitle: "Perché HayHome?",
      whySub: "Non è Airbnb. È qualcosa di più — una connessione tra culture.",
      realHome: "Una vera casa", realHomeDesc: "Vivi con la famiglia, non in un hotel.",
      verified: "Host verificati", verifiedDesc: "Ogni famiglia è verificata.",
      unite: "Unire i popoli", uniteDesc: "Ospiti da 40+ paesi hanno scoperto l'Armenia.",
      ourFamilies: "Le nostre famiglie", ourFamiliesSub: "Autentica ospitalità armena",
      allFamilies: "Tutte le famiglie",
      howTitle: "Come funziona",
      step1: "Scegli una famiglia", step1desc: "Filtra per città, stelle, prezzo",
      step2: "Prenota una visita", step2desc: "Seleziona le date",
      step3: "Diventa uno di loro", step3desc: "Partirai come un amico.",
      becomeTitle: "Hai una casa e vuoi ospitare viaggiatori?",
      becomeSub: "Registrati gratis. Primi 12 mesi senza commissioni.",
      becomeCta: "Ospita viaggiatori",
      browseBtn: "Vedi le famiglie",
      freeStay: "Soggiorno gratuito",
      freeStayDesc: "Soggiorna con una famiglia armena gratuitamente",
      bookForFree: "Prenota gratis",
      paidServices: "Servizi a pagamento",
      experiencesLabel: "Esperienze",
    },
    become: {
      title: "Ospita su HayHome",
      subtitle: "Condividi l'ospitalità armena",
      step0: "Contatti", step1: "Posizione", step2: "Condizioni", step3: "Esperienza",
      familyName: "Nome famiglia", yourName: "Il tuo nome", phone: "Telefono", email: "Email",
        patronymic: "Patronimico",         passportTitle: "📝 Passaporto",         passportSeries: "Serie passaporto",         passportNumber: "Numero passaporto",         passportDate: "Data di rilascio",         passportIssued: "Rilasciato da",         inn: "Codice fiscale (opzionale)",         bankTitle: "🏦 Dati bancari",         bankAccount: "Numero conto / carta",         bankName: "Banca",
      city: "Città", region: "Regione", address: "Indirizzo", pickRegion: "Seleziona regione",
      priceNight: "Prezzo a notte", maxGuests: "Max ospiti", rooms: "Camere",
      shortDesc: "Descrizione breve", longDesc: "Raccontaci di più",
      amenitiesLabel: "Servizi", experiencesLabel: "Esperienze", langsLabel: "Lingue",
      submit: "Invia domanda", submitting: "Invio...",
      successTitle: "Domanda inviata!", successText: "Il nostro responsabile ti contatterà entro 24–48h.",
      next: "Avanti", back: "Indietro", toHome: "Home",
      aiBtn: "Migliora con IA", aiLoading: "Scrive...", restore: "Ripristina",
      aiHint: "Scrivi il tuo testo — l'IA lo renderà più caldo.",
      aiImproved: "IA ha migliorato",
      aiImprovedLong: "IA ha migliorato — modifica se necessario",
    },
    common: { loading: "Caricamento...", error: "Errore", rating: "valutazione", newHost: "Nuovo", cookieText: "Utilizziamo cookie per il funzionamento del sito", cookieAccept: "Accetta" },
    legal: { privacy: "Informativa sulla privacy", terms: "Termini di servizio", rules: "Regole della piattaforma", back: "Home" },
    welcome: { title: "Benvenuto su HayHome! 🏔️", subtitle: "Inizia il tuo viaggio culturale", step1title: "Trova una famiglia", step1desc: "Scegli una famiglia armena che ti accoglierà con calore.", step2title: "Prenota", step2desc: "Completa la prenotazione in pochi clic, in modo sicuro.", step3title: "Immergiti nella cultura", step3desc: "Vivi come un locale: tradizioni, cucina, storie vere.", startBtn: "Inizia l'esplorazione", skipBtn: "Salta" },
    dashboard: { profileInfo: "Profilo ospite", profileInfoDesc: "I tuoi dati account", partner: "Partner" },
    about: { heroTitle: "Chi siamo", heroSub: "Non stiamo costruendo una piattaforma di affitti. Stiamo costruendo una rete culturale viva.", missionLabel: "La nostra missione", missionTitle: "L'Armenia si apre", missionTitle2: "attraverso il cuore di una famiglia", missionSub: "HayHome non è Airbnb. È un ecosistema culturale su scala nazionale. Preserviamo i valori familiari armeni e rafforziamo l'immagine dell'Armenia come il popolo più ospitale del mondo.", card1title: "Preservare le tradizioni", card1desc: "Ogni famiglia è custode di un patrimonio culturale. Aiutiamo questo patrimonio a vivere e a trasmettersi alle generazioni future.", card2title: "Unire le persone", card2desc: "Ospiti da oltre 40 paesi hanno già scoperto l'Armenia attraverso le nostre famiglie. Ogni visita è un ponte tra culture.", card3title: "Orgoglio per il paese", card3desc: "Le famiglie armene ottengono lo status di 'Custode delle tradizioni' — il riconoscimento dell'intera comunità.", storyLabel: "Come è nato", storyTitle: "Un'idea nata a cena", story1: "Tutto è iniziato con un'osservazione semplice: centinaia di famiglie armene sono pronte ad accogliere ospiti e mostrare vera ospitalità — ma non avevano uno strumento per dirlo al mondo.", story2: "E i turisti da tutto il mondo vogliono esattamente questo — non servizio alberghiero, ma un'esperienza autentica. Storie vere intorno a una grande tavola.", story3: "HayHome è stato creato per connettere queste persone. È una piattaforma di fiducia, cultura e calore. Non solo un business — un movimento.", valuesLabel: "I nostri valori", valuesTitle: "Perché non siamo Airbnb", v1t: "Ospite, non padrone di casa", v1d: "Ogni host è un 'Custode delle tradizioni'. Presenta il proprio stile di vita, cultura e storia.", v2t: "Esperienza, non un letto", v2d: "L'ospite non cerca un posto per dormire, ma un'esperienza unica: laboratori, cene, storie.", v3t: "Fiducia attraverso verifica", v3d: "Ogni famiglia è verificata. Il sistema a stelle garantisce la qualità.", v4t: "Gli armeni si incontrano", v4d: "Famiglie armene di diverse regioni si incontrano attraverso la piattaforma.", v5t: "Gamification e status", v5d: "Badge come 'Migliore cucina', 'Maestro del vino' sono riconoscimenti della comunità.", v6t: "Storie, non recensioni", v6d: "'Sono arrivato come turista e sono partito come loro figlio' — questa è una vera recensione.", statsTitle: "HayHome oggi", s1: "Famiglie nella rete", s2: "Regioni dell'Armenia", s3: "Paesi di origine", s4: "Valutazione media", toneLabel: "La nostra voce", toneTitle: "Come parliamo", toneSub: "Parliamo come un fratello maggiore, un ospite accogliente, un patriota senza prosopopea — non come una corporazione.", secTitle: "Sicurezza e fiducia", secDesc: "Ogni famiglia passa attraverso una verifica documentale. Assicurazione e supporto 24/7.", ctaTitle: "Unisciti alla nostra famiglia", ctaSub: "Non importa da dove vieni. Una famiglia armeniana è sempre felice di accogliere i propri ospiti." },
    auth: { loginTitle: "Accedi", registerTitle: "Crea account", registerSub: "Registrazione ospite — gratuita", password: "Password", confirmPassword: "Conferma password", name: "Il tuo nome", loginBtn: "Accedi", loggingIn: "Accesso...", registerBtn: "Registrati", registering: "Registrazione...", noAccount: "Nessun account?", hasAccount: "Hai già un account?", wantToHost: "Vuoi ospitare?", wrongCreds: "Email o password errati", passMismatch: "Le password non corrispondono", minPass: "Minimo 6 caratteri", socialOr: "o", socialAutoCreate: "L'accesso tramite social network crea automaticamente un account", consentPD: "Acconsento al trattamento dei dati personali" },
  },

  ar: {
    nav: { findFamily: "ابحث عن عائلة", hostGuests: "استقبال الضيوف", about: "من نحن", login: "تسجيل الدخول", register: "إنشاء حساب", logout: "تسجيل الخروج", partner: "شركاء" },
    hero: {
      greeting: "¡Bienvenido!",
      title1: "انضم",
      title2: "إلى عائلتنا",
      subtitle: "أرمينيا تنفتح من خلال قلب الأسرة. عشاء حقيقي، قصص حية، منظر جبل أرارات.",
      searchPlaceholder: "يريفان، ديليجان، سيفان...",
      searchBtn: "ابحث عن عائلة",
      familiesWaiting: "عائلة تنتظرك",
    },
    hosts: {
      pageTitle: "عائلة في أرمينيا",
      searchPlaceholder: "ابحث عن عائلة، مدينة...",
      filters: "فلاتر", byRating: "حسب التقييم", byPriceAsc: "السعر: الأرخص", byPriceDesc: "السعر: الأغلى",
      region: "المنطقة", allRegions: "جميع المناطق", minStars: "أقل النجوم", anyStars: "أي",
      priceTo: "السعر حتى", resetFilters: "إعادة ضبط", notFound: "لم يتم العثور على عائلات",
      notFoundSub: "جرب تغيير الفلاتر", verified: "موثق", perNight: "/ليلة",
      guests: "ضيوف", upTo: "حتى", book: "احجز زيارة", backToList: "جميع العائلات",
      aboutFamily: "عن العائلة", amenities: "المرافق", experiences: "ما ينتظرك",
      languages: "اللغات", reviews: "التقييمات", newGuest: "كن أول ضيف!",
      freeCancel: "إلغاء مجاني خلال 48 ساعة", directContact: "تواصل مباشر", noHidden: "لا رسوم خفية",
      writeReview: "اكتب تقييماً",
      reviewPlaceholder: "احكِ عن تجربتك... (10 أحرف على الأقل)",
      submitReview: "إرسال التقييم",
      reviewSuccess: "شكراً لتقييمك!",
      mustBeGuest: "فقط الضيوف الذين أكملوا الحجز يمكنهم ترك تقييم",
      calendarTitle: "تقويم التوفر",
      mon: "إثن", tue: "ثلا", wed: "أرب", thu: "خمي", fri: "جمع", sat: "سبت", sun: "أحد",
      available: "متاح", booked: "محجوز", blocked: "محظور",
      noCalendar: "ليس لديك تقويم. كن مضيفاً لإدارة التواريخ.",
      listView: "قائمة", mapView: "خريطة",
    },
    home: {
      whyTitle: "لماذا HayHome؟",
      whySub: "هذا ليس Airbnb. إنه شيء أكثر — تواصل بين الثقافات.",
      realHome: "منزل حقيقي", realHomeDesc: "تعيش مع الأسرة، لا في فندق.",
      verified: "مضيفون موثقون", verifiedDesc: "كل عائلة موثقة.",
      unite: "توحيد الشعوب", uniteDesc: "ضيوف من 40+ دولة اكتشفوا أرمينيا.",
      ourFamilies: "عائلاتنا", ourFamiliesSub: "الضيافة الأرمينية الأصيلة",
      allFamilies: "جميع العائلات",
      howTitle: "كيف يعمل",
      step1: "اختر عائلة", step1desc: "فلتر حسب المدينة والنجوم والسعر",
      step2: "احجز زيارة", step2desc: "اختر التواريخ",
      step3: "كن أحدهم", step3desc: "ستغادر كصديق.",
      becomeTitle: "هل لديك منزل وتريد استقبال الضيوف؟",
      becomeSub: "سجل مجاناً. أول 12 شهراً بدون عمولة.",
      becomeCta: "استقبال الضيوف مجاناً",
      browseBtn: "عرض العائلات",
      freeStay: "إقامة مجانية",
      freeStayDesc: "أقم مع عائلة أرمينية مجاناً",
      bookForFree: "احجز مجاناً",
      paidServices: "الخدمات المدفوعة",
      experiencesLabel: "التجارب",
    },
    become: {
      title: "استقبال الضيوف في HayHome",
      subtitle: "شارك الضيافة الأرمينية",
      step0: "جهات الاتصال", step1: "الموقع", step2: "الشروط", step3: "التجربة",
      familyName: "اسم العائلة", yourName: "اسمك", phone: "الهاتف", email: "البريد الإلكتروني",
        patronymic: "اسم الأب",         passportTitle: "📝 جواز السفر",         passportSeries: "سلسلة جواز السفر",         passportNumber: "رقم جواز السفر",         passportDate: "تاريخ الإصدار",         passportIssued: "صادر من",         inn: "الرقم الضريبي (اختياري)",         bankTitle: "🏦 بيانات مصرف",         bankAccount: "رقم الحساب / البطاقة",         bankName: "المصرف",
      city: "المدينة", region: "المنطقة", address: "العنوان", pickRegion: "اختر منطقة",
      priceNight: "السعر لكل ليلة", maxGuests: "أقصى عدد ضيوف", rooms: "غرف الضيوف",
      shortDesc: "وصف مختصر", longDesc: "أخبرنا المزيد عنك",
      amenitiesLabel: "المرافق", experiencesLabel: "التجارب", langsLabel: "اللغات",
      submit: "إرسال الطلب", submitting: "جار الإرسال...",
      successTitle: "تم إرسال الطلب!", successText: "سيتصل بك مديرنا خلال 24–48 ساعة.",
      next: "التالي", back: "رجوع", toHome: "الرئيسية",
      aiBtn: "تحسين بالذكاء الاصطناعي", aiLoading: "جار الكتابة...", restore: "استعادة",
      aiHint: "اكتب نصك — سيجعله الذكاء الاصطناعي أكثر دفئاً.",
      aiImproved: "حسّن الذكاء الاصطناعي النص",
      aiImprovedLong: "حسّن الذكاء الاصطناعي — راجع إذا لزم الأمر",
    },
    common: { loading: "جار التحميل...", error: "خطأ", rating: "تقييم", newHost: "جديد", cookieText: "نستخدم ملفات تعريف الارتباط لعمل الموقع", cookieAccept: "قبول" },
    legal: { privacy: "سياسة الخصوصية", terms: "شروط الخدمة", rules: "قواعد المنصة", back: "الرئيسية" },
    welcome: { title: "مرحباً بك في HayHome! 🏔️", subtitle: "ابدأ رحلتك الثقافية", step1title: "ابحث عن عائلة", step1desc: "اختر عائلة أرمنية ستستقبلك بالدفء والكرم.", step2title: "احجز", step2desc: "أتمم حجزك بنقرات قليلة بأمان وموثوقية.", step3title: "انغمس في الثقافة", step3desc: "عش كالسكان المحليين: تقاليد، مطبخ، قصص حقيقية.", startBtn: "ابدأ الاستكشاف", skipBtn: "تخطى" },
    dashboard: { profileInfo: "ملف الضيف", profileInfoDesc: "بيانات حسابك", partner: "شركاء" },
    about: { heroTitle: "من نحن", heroSub: "نحن لا نبني منصة للإيجار. نحن نبني شبكة ثقافية حية.", missionLabel: "مهمتنا", missionTitle: "أرمينيا تنفتح", missionTitle2: "من خلال قلب الأسرة", missionSub: "HayHome ليست Airbnb. إنها منظومة ثقافية على المستوى الوطني. نحافظ على القيم العائلية الأرمينية ونعزز صورة أرمينيا كأكثر شعب مضياف في العالم.", card1title: "الحفاظ على التقاليد", card1desc: "كل عائلة هي حامية للتراث الثقافي. نساعد هذا التراث على الحياة والانتقال إلى الأجيال القادمة.", card2title: "توحيد الناس", card2desc: "ضيوف من أكثر من 40 دولة اكتشفوا أرمينيا بالفعل من خلال مضيفينا. كل زيارة هي جسر بين الثقافات.", card3title: "الفخر بالوطن", card3desc: "العائلات الأرمينية تحصل على مكانة 'حامي التقاليد' — تقدير من المجتمع بأكمله.", storyLabel: "كيف بدأنا", storyTitle: "فكرة وُلدت على مائدة العشاء", story1: "بدأ كل شيء بملاحظة بسيطة: مئات العائلات الأرمينية مستعدة لاستقبال الضيوف وإظهار الضيافة الحقيقية — لكن لم يكن لديهم أداة لإخبار العالم.", story2: "والسياح من جميع أنحاء العالم يريدون بالضبط هذا — ليس خدمة الفنادق، بل تجربة حية. قصص حقيقية حول طاولة كبيرة.", story3: "تم إنشاء HayHome لربط هؤلاء الناس. إنها منصة للثقة والثقافة والدفء. ليست مجرد عمل تجاري — بل حركة.", valuesLabel: "قيمنا", valuesTitle: "لماذا لسنا Airbnb", v1t: "مضيف وليس مالك", v1d: "كل مضيف هو 'حامي التقاليد'. يقدم أسلوب حياته وثقافته وتاريخه.", v2t: "تجربة وليست سريرًا", v2d: "الضيف لا يبحث عن مكان للنوم، بل عن تجربة فريدة: ورش عمل، عشاء، قصص.", v3t: "الثقة من خلال التحقق", v3d: "كل عائلة تم التحقق منها. نظام النجوم يضمن الجودة.", v4t: "الأرمن يلتقون ببعضهم", v4d: "العائلات الأرمينية من مناطق مختلفة تلتقي ببعضها من خلال المنصة.", v5t: "الألعاب والمكانة", v5d: "شارات مثل 'أفضل مطبخ'، 'خبير النبيذ' هي تقدير من المجتمع.", v6t: "قصص وليست تقييمات", v6d: "أتيت كسائح وغادرت كابنهم — هذا هو التقييم الحقيقي.", statsTitle: "HayHome اليوم", s1: "العائلات في الشبكة", s2: "مناطق أرمينيا", s3: "دول الضيوف", s4: "متوسط التقييم", toneLabel: "صوتنا", toneTitle: "كيف نتحدث", toneSub: "نتحدث مثل أخ أكبر، مضيف مرحب، وطني غيور بلا تعالي — لا مثل شركة.", secTitle: "الأمان والثقة", secDesc: "كل عائلة تخضع للتحقق من المستندات. التأمين والدعم على مدار الساعة.", ctaTitle: "انضم إلى عائلتنا", ctaSub: "لا يهم من أين أنت. العائلة الأرمينية تسعد دائمًا باستضافة ضيوفها." },
    auth: { loginTitle: "تسجيل الدخول", registerTitle: "إنشاء حساب", registerSub: "تسجيل الضيف — مجاني", password: "كلمة المرور", confirmPassword: "تأكيد كلمة المرور", name: "اسمك", loginBtn: "دخول", loggingIn: "جار الدخول...", registerBtn: "إنشاء حساب", registering: "جار التسجيل...", noAccount: "ليس لديك حساب؟", hasAccount: "لديك حساب بالفعل؟", wantToHost: "تريد استقبال الضيوف؟", wrongCreds: "بريد إلكتروني أو كلمة مرور غير صحيحة", passMismatch: "كلمتا المرور غير متطابقتين", minPass: "6 أحرف على الأقل", socialOr: "أو", socialAutoCreate: "تسجيل الدخول عبر وسائل التواصل الاجتماعي ينشئ حسابًا تلقائيًا", consentPD: "أوافق على معالجة بياناتي الشخصية" },
  },

  zh: {
    nav: { findFamily: "寻找家庭", hostGuests: "接待客人", about: "关于我们", login: "登录", register: "注册", logout: "退出", partner: "合作伙伴" },
    hero: {
      greeting: "مرحباً!",
      title1: "加入",
      title2: "我们的家庭",
      subtitle: "亚美尼亚通过家庭的心向您敞开。真实的晚餐，生动的故事，亚拉腊山的美景。不是酒店——是家。",
      searchPlaceholder: "埃里温，迪利然，塞凡...",
      searchBtn: "寻找家庭",
      familiesWaiting: "个家庭等待您",
    },
    hosts: {
      pageTitle: "个亚美尼亚家庭",
      searchPlaceholder: "搜索家庭、城市、地区...",
      filters: "筛选", byRating: "按评分", byPriceAsc: "价格从低到高", byPriceDesc: "价格从高到低",
      region: "地区", allRegions: "所有地区", minStars: "最低星级", anyStars: "任意",
      priceTo: "价格上限", resetFilters: "重置筛选", notFound: "未找到家庭",
      notFoundSub: "请尝试更改筛选条件", verified: "已认证", perNight: "/晚",
      guests: "位客人", upTo: "最多", book: "预订参观", backToList: "所有家庭",
      aboutFamily: "关于家庭", amenities: "设施", experiences: "等待您的体验",
      languages: "语言", reviews: "评价", newGuest: "成为第一位客人！",
      freeCancel: "48小时内免费取消", directContact: "与家庭直接联系", noHidden: "无隐藏费用",
      writeReview: "写评价",
      reviewPlaceholder: "分享您的体验...（至少10个字符）",
      submitReview: "提交评价",
      reviewSuccess: "感谢您的评价！",
      mustBeGuest: "只有完成预订的客人才能留下评价",
      calendarTitle: "可用性日历",
      mon: "一", tue: "二", wed: "三", thu: "四", fri: "五", sat: "六", sun: "日",
      available: "可预订", booked: "已预订", blocked: "已屏蔽",
      noCalendar: "您没有日历。成为房东以管理日期。",
      listView: "列表", mapView: "地图",
    },
    home: {
      whyTitle: "为什么选择HayHome？",
      whySub: "这不是Airbnb。这是更多——不同文化之间的联系。",
      realHome: "真实的家", realHomeDesc: "您与家人同住，而不是在酒店。",
      verified: "认证房东", verifiedDesc: "每个家庭都经过验证。",
      unite: "连接各国人民", uniteDesc: "来自40多个国家的客人已通过我们的房东了解亚美尼亚。",
      ourFamilies: "我们的家庭", ourFamiliesSub: "正宗的亚美尼亚热情好客",
      allFamilies: "所有家庭",
      howTitle: "如何运作",
      step1: "选择家庭", step1desc: "按城市、星级、价格筛选",
      step2: "预订参观", step2desc: "选择日期",
      step3: "成为他们的一员", step3desc: "您将作为朋友离开。",
      becomeTitle: "您有房子并想接待客人吗？",
      becomeSub: "免费注册。前12个月无佣金。",
      becomeCta: "免费接待客人",
      browseBtn: "浏览家庭",
      freeStay: "免费住宿",
      freeStayDesc: "免费入住亚美尼亚家庭",
      bookForFree: "免费预订",
      paidServices: "付费服务",
      experiencesLabel: "体验",
    },
    become: {
      title: "在HayHome接待客人",
      subtitle: "分享亚美尼亚的热情好客",
      step0: "联系方式", step1: "位置", step2: "条件", step3: "体验",
      familyName: "家庭名称", yourName: "您的姓名", phone: "电话", email: "电子邮件",
        patronymic: "父名",         passportTitle: "📝 护照信息",         passportSeries: "护照号码段",         passportNumber: "护照号码",         passportDate: "签发日期",         passportIssued: "签发机关",         inn: "税号（可选）",         bankTitle: "🏦 银行信息",         bankAccount: "账户/卡号",         bankName: "银行",
      city: "城市", region: "地区", address: "地址", pickRegion: "选择地区",
      priceNight: "每晚价格", maxGuests: "最多客人数", rooms: "客房数",
      shortDesc: "简短描述", longDesc: "详细介绍自己",
      amenitiesLabel: "设施", experiencesLabel: "体验", langsLabel: "语言",
      submit: "提交申请", submitting: "提交中...",
      successTitle: "申请已发送！", successText: "我们的经理将在24-48小时内与您联系。",
      next: "下一步", back: "返回", toHome: "首页",
      aiBtn: "AI优化", aiLoading: "生成中...", restore: "恢复",
      aiHint: "用您自己的话写——AI会让它更温暖、更吸引客人。",
      aiImproved: "AI已优化文本",
      aiImprovedLong: "AI已优化——如有需要请编辑",
    },
    common: { loading: "加载中...", error: "错误", rating: "评分", newHost: "新", cookieText: "我们使用cookies来运行网站", cookieAccept: "接受" },
    legal: { privacy: "隐私政策", terms: "服务条款", rules: "平台规则", back: "首页" },
    welcome: { title: "欢迎来到HayHome！🏔️", subtitle: "开始您的文化之旅", step1title: "寻找家庭", step1desc: "选择一个会热情欢迎您的亚美尼亚家庭。", step2title: "预订", step2desc: "几步完成预订，安全可靠。", step3title: "沉浸文化", step3desc: "像当地人一样生活：传统、美食、真实故事。", startBtn: "开始探索", skipBtn: "跳过" },
    dashboard: { profileInfo: "客人资料", profileInfoDesc: "您的账户信息", partner: "合作伙伴" },
    about: { heroTitle: "关于我们", heroSub: "我们不是在构建一个租赁平台。我们在构建一个活生生的文化网络。", missionLabel: "我们的使命", missionTitle: "亚美尼亚通过", missionTitle2: "家庭的心向您敞开", missionSub: "HayHome不是Airbnb。它是一个全国性的文化生态系统。我们保护亚美尼亚家庭价值观，加强亚美尼亚作为世界上最热情好客民族的形象。", card1title: "传承传统", card1desc: "每个家庭都是文化遗产的守护者。我们帮助这份遗产活下去，传承给后代。", card2title: "连接人群", card2desc: "来自40多个国家的客人已经通过我们的主人发现了亚美尼亚。每次访问都是文化之间的桥梁。", card3title: "为祖国自豪", card3desc: "亚美尼亚家庭获得'传统守护者'称号——来自整个社区的认可。", storyLabel: "起源故事", storyTitle: "一个诞生于晚餐的想法", story1: "一切都始于一个简单的观察：数以百计的亚美尼亚家庭准备好迎接客人，展示真正的好客——但他们没有工具向世界讲述。", story2: "而来自世界各地的游客正想要这些——不是酒店服务，而是真实的体验。大桌子旁的真实故事。", story3: "HayHome的创建就是为了连接这些人。它是一个信任、文化和温暖的平台。不仅仅是生意——是一场运动。", valuesLabel: "我们的价值观", valuesTitle: "为什么我们不是Airbnb", v1t: "主人，不是房东", v1d: "每个主人都是'传统守护者'。他们展示自己的生活方式、文化和历史。", v2t: "体验，不是一张床", v2d: "客人寻找的不是睡觉的地方，而是独特的体验：大师课、晚餐、故事。", v3t: "通过验证建立信任", v3d: "每个家庭都经过验证。星级系统保证质量。", v4t: "亚美尼亚人相遇", v4d: "来自不同地区的亚美尼亚家庭通过平台相互认识。", v5t: "游戏化与地位", v5d: "像'最佳厨房'、'葡萄酒大师'这样的徽章是社区的认可。", v6t: "故事，不是评论", v6d: "'我作为游客而来，离开时成了他们的儿子'——这才是真正的评价。", statsTitle: "HayHome今天", s1: "网络中的家庭", s2: "亚美尼亚地区", s3: "客人来源国", s4: "平均评分", toneLabel: "我们的声音", toneTitle: "我们如何说话", toneSub: "我们像一个哥哥、一个热情的主人、一个不浮夸的爱国者那样说话——而不是像一家公司。", secTitle: "安全与信任", secDesc: "每个家庭都通过文件验证。保险和24/7支持。", ctaTitle: "加入我们的家庭", ctaSub: "无论你来自哪里。一个亚美尼亚家庭总是乐意欢迎客人。" },
    auth: { loginTitle: "登录", registerTitle: "创建账户", registerSub: "游客注册 — 免费", password: "密码", confirmPassword: "确认密码", name: "您的姓名", loginBtn: "登录", loggingIn: "登录中...", registerBtn: "注册", registering: "注册中...", noAccount: "没有账户？", hasAccount: "已有账户？", wantToHost: "想接待客人？", wrongCreds: "邮箱或密码错误", passMismatch: "密码不匹配", minPass: "最少6个字符", socialOr: "或", socialAutoCreate: "通过社交网络登录会自动创建账户", consentPD: "我同意处理我的个人数据" },
  },

  fa: {
    nav: { findFamily: "یافتن خانواده", hostGuests: "پذیرش مهمان", about: "درباره ما", login: "ورود", register: "ثبت‌نام", logout: "خروج", partner: "همکاران" },
    hero: {
      greeting: "خوش آمدید!",
      title1: "به خانواده",
      title2: "ما بپیوندید",
      subtitle: "ارمنستان از طریق قلب خانواده‌ای باز می‌شود. یک شام واقعی، داستان‌های زنده، منظره آرارات.",
      searchPlaceholder: "ایروان، دیلیجان، سوان...",
      searchBtn: "یافتن خانواده",
      familiesWaiting: "خانواده منتظر شما هستند",
    },
    hosts: {
      pageTitle: "خانواده در ارمنستان",
      searchPlaceholder: "جستجو خانواده، شهر...",
      filters: "فیلترها", byRating: "بر اساس امتیاز", byPriceAsc: "قیمت: ارزان‌تر", byPriceDesc: "قیمت: گران‌تر",
      region: "منطقه", allRegions: "همه مناطق", minStars: "حداقل ستاره", anyStars: "هر",
      priceTo: "قیمت تا", resetFilters: "بازنشانی", notFound: "خانواده‌ای یافت نشد",
      notFoundSub: "فیلترها را تغییر دهید", verified: "تأییدشده", perNight: "/شب",
      guests: "مهمان", upTo: "تا", book: "رزرو بازدید", backToList: "همه خانواده‌ها",
      aboutFamily: "درباره خانواده", amenities: "امکانات", experiences: "آنچه در انتظار شماست",
      languages: "زبان‌ها", reviews: "نظرات", newGuest: "اولین مهمان باشید!",
      freeCancel: "لغو رایگان در 48 ساعت", directContact: "تماس مستقیم", noHidden: "بدون هزینه‌های پنهان",
      writeReview: "نظر بنویسید",
      reviewPlaceholder: "تجربه خود را بیان کنید... (حداقل ۱۰ کاراکتر)",
      submitReview: "ارسال نظر",
      reviewSuccess: "از نظر شما سپاسگزاریم!",
      mustBeGuest: "فقط مهمانانی که رزرو را تکمیل کردهاند میتوانند نظر بدهند",
      calendarTitle: "تقویم در دسترس",
      mon: "دوش", tue: "سه‌", wed: "چهار", thu: "پنج", fri: "جمع", sat: "شنب", sun: "یک",
      available: "در دسترس", booked: "رزرو شده", blocked: "مسدود شده",
      noCalendar: "شما تقویم ندارید. برای مدیریت تاریخ‌ها میزبان شوید.",
      listView: "فهرست", mapView: "نقشه",
    },
    home: {
      whyTitle: "چرا HayHome؟",
      whySub: "این Airbnb نیست. چیزی بیشتر است — پیوند بین فرهنگ‌ها.",
      realHome: "یک خانه واقعی", realHomeDesc: "با خانواده زندگی می‌کنید، نه در هتل.",
      verified: "میزبانان تأییدشده", verifiedDesc: "هر خانواده تأیید شده است.",
      unite: "اتحاد ملت‌ها", uniteDesc: "مهمانان از ۴۰+ کشور ارمنستان را کشف کرده‌اند.",
      ourFamilies: "خانواده‌های ما", ourFamiliesSub: "مهمان‌نوازی اصیل ارمنی",
      allFamilies: "همه خانواده‌ها",
      howTitle: "چگونه کار می‌کند",
      step1: "خانواده انتخاب کنید", step1desc: "بر اساس شهر، ستاره، قیمت فیلتر کنید",
      step2: "بازدید رزرو کنید", step2desc: "تاریخ‌ها را انتخاب کنید",
      step3: "یکی از آن‌ها شوید", step3desc: "به عنوان دوست خواهید رفت.",
      becomeTitle: "آیا خانه دارید و می‌خواهید مهمان بپذیرید؟",
      becomeSub: "رایگان ثبت‌نام کنید. ۱۲ ماه اول بدون کمیسیون.",
      becomeCta: "پذیرش مهمان رایگان",
      browseBtn: "مشاهده خانواده‌ها",
      freeStay: "اقامت رایگان",
      freeStayDesc: "در خانواده ارمنی به صورت رایگان زندگی کنید",
      bookForFree: "رزرو رایگان",
      paidServices: "خدمات پولی",
      experiencesLabel: "تجربیات",
    },
    become: {
      title: "پذیرش مهمان در HayHome",
      subtitle: "مهمان‌نوازی ارمنی را به اشتراک بگذارید",
      step0: "مخاطبین", step1: "موقعیت", step2: "شرایط", step3: "تجربه",
      familyName: "نام خانواده", yourName: "نام شما", phone: "تلفن", email: "ایمیل",
        patronymic: "نام پدر",         passportTitle: "📝 پاسپورت",         passportSeries: "سری پاسپورت",         passportNumber: "شماره پاسپورت",         passportDate: "تاریخ صدور",         passportIssued: "صادرکننده",         inn: "کد مالیاتی (اختیاری)",         bankTitle: "🏦 اطلاعات بانکی",         bankAccount: "شماره حساب / کارت",         bankName: "بانک",
      city: "شهر", region: "منطقه", address: "آدرس", pickRegion: "منطقه را انتخاب کنید",
      priceNight: "قیمت هر شب", maxGuests: "حداکثر مهمان", rooms: "اتاق مهمان",
      shortDesc: "توضیح کوتاه", longDesc: "بیشتر درباره خود بگویید",
      amenitiesLabel: "امکانات", experiencesLabel: "تجربیات", langsLabel: "زبان‌ها",
      submit: "ارسال درخواست", submitting: "در حال ارسال...",
      successTitle: "درخواست ارسال شد!", successText: "مدیر ما در عرض ۲۴–۴۸ ساعت با شما تماس خواهد گرفت.",
      next: "بعدی", back: "برگشت", toHome: "خانه",
      aiBtn: "بهبود با هوش مصنوعی", aiLoading: "در حال نوشتن...", restore: "بازیابی",
      aiHint: "متن خود را بنویسید — هوش مصنوعی آن را گرم‌تر می‌کند.",
      aiImproved: "هوش مصنوعی بهبود داد",
      aiImprovedLong: "هوش مصنوعی بهبود داد — در صورت نیاز ویرایش کنید",
    },
    common: { loading: "بارگذاری...", error: "خطا", rating: "امتیاز", newHost: "جدید", cookieText: "ما برای کار سایت از کوکی‌ها استفاده می‌کنیم", cookieAccept: "پذیرفتن" },
    legal: { privacy: "سیاست حریم خصوصی", terms: "شرایط خدمات", rules: "قوانین پلتفرم", back: "خانه" },
    welcome: { title: "به HayHome خوش آمدید! 🏔️", subtitle: "سفر فرهنگی خود را آغاز کنید", step1title: "یک خانواده پیدا کنید", step1desc: "یک خانواده ارمنی را انتخاب کنید که شما را با گرمی می‌پذیرد.", step2title: "رزرو کنید", step2desc: "رزرو خود را در چند کلیک، ایمن و مطمئن تکمیل کنید.", step3title: "در فرهنگ غوطه‌ور شوید", step3desc: "مثل بومی‌ها زندگی کنید: سنت‌ها، آشپزی، داستان‌های واقعی.", startBtn: "شروع کشف", skipBtn: "رد کردن" },
    dashboard: { profileInfo: "پروفایل مهمان", profileInfoDesc: "اطلاعات حساب شما", partner: "همکاران" },
    about: { heroTitle: "درباره ما", heroSub: "ما یک پلتفرم اجاره نمی‌سازیم. ما یک شبکه فرهنگی زنده می‌سازیم.", missionLabel: "مأموریت ما", missionTitle: "ارمنستان باز می‌شود", missionTitle2: "از طریق قلب یک خانواده", missionSub: "HayHome یک Airbnb نیست. یک اکوسیستم فرهنگی در مقیاس ملی است. ما ارزش‌های خانوادگی ارمنی را حفظ می‌کنیم و تصویر ارمنستان را به عنوان مهمان‌نوازترین مردم جهان تقویت می‌کنیم.", card1title: "حفظ سنت‌ها", card1desc: "هر خانواده نگهدار یک میراث فرهنگی است. ما کمک می‌کنیم این میراث زنده بماند و به نسل‌های آینده منتقل شود.", card2title: "اتصال مردم", card2desc: "مهمانان از بیش از ۴۰ کشور از طریق میزبانان ما ارمنستان را کشف کرده‌اند. هر بازدید پلی بین فرهنگ‌هاست.", card3title: "افتخار به کشور", card3desc: "خانواده‌های ارمنی عنوان 'نگهبان سنت‌ها' را دریافت می‌کنند — قدردانی از کل جامعه.", storyLabel: "چگونه شروع شد", storyTitle: "ایده‌ای که در یک شام متولد شد", story1: "همه چیز با یک مشاهده ساده شروع شد: صدها خانواده ارمنی آماده پذیرش مهمانان و نشان دادن مهمان‌نوازی واقعی هستند — اما ابزاری برای گفتن به دنیا نداشتند.", story2: "و گردشگران از سراسر جهان دقیقاً همین را می‌خواهند — نه خدمات هتل، بلکه یک تجربه زنده. داستان‌های واقعی دور یک میز بزرگ.", story3: "HayHome برای connecting این افراد ایجاد شد. این یک پلتفرم اعتماد، فرهنگ و گرمی است. فقط یک کسب‌وکار نیست — یک حرکت است.", valuesLabel: "ارزش‌های ما", valuesTitle: "چرا ما Airbnb نیستیم", v1t: "میزبان، نه صاحب‌خانه", v1d: "هر میزبان یک 'نگهبان سنت‌ها' است. سبک زندگی، فرهنگ و تاریخ خود را ارائه می‌دهد.", v2t: "تجربه، نه یک تخت", v2d: "مهمان به دنبال جای خواب نیست، بلکه تجربه‌ای منحصربه‌فرد: کارگاه‌ها، شام‌ها، داستان‌ها.", v3t: "اعتماد از طریق تأیید", v3d: "هر خانواده تأیید شده است. سیستم ستاره‌ها کیفیت را تضمین می‌کند.", v4t: "ارمنی‌ها همدیگر را ملاقات می‌کنند", v4d: "خانواده‌های ارمنی از مناطق مختلف از طریق پلتفرم با هم آشنا می‌شوند.", v5t: "گیمیفیکیشن و وضعیت", v5d: "نشان‌هایی مانند 'بهترین آشپزخانه'، 'استاد شراب' قدردانی جامعه است.", v6t: "داستان‌ها، نه نظرات", v6d: "'به عنوان گردشگر آمدم و به عنوان پسرشان رفتم' — این یک نظر واقعی است.", statsTitle: "HayHome امروز", s1: "خانواده‌های در شبکه", s2: "مناطق ارمنستان", s3: "کشورهای مهمان", s4: "میانگین امتیاز", toneLabel: "صدای ما", toneTitle: "چگونه صحبت می‌کنیم", toneSub: "ما مثل یک برادر بزرگتر، یک میزبان خوش‌آمدگویی، یک وطن‌دوست بدون خودشیفتگی صحبت می‌کنیم — نه مثل یک شرکت.", secTitle: "امنیت و اعتماد", secDesc: "هر خانواده از طریق تأیید مدارک می‌گذرد. بیمه و پشتیبانی ۲۴/۷.", ctaTitle: "به خانواده ما بپیوندید", ctaSub: "مهم نیست از کجا می‌آیید. یک خانواده ارمنی همیشه از مهمانان خود با خوشحالی پذیرایی می‌کند." },
    auth: { loginTitle: "ورود به حساب", registerTitle: "ایجاد حساب", registerSub: "ثبت‌نام مهمان — رایگان", password: "رمز عبور", confirmPassword: "تأیید رمز عبور", name: "نام شما", loginBtn: "ورود", loggingIn: "در حال ورود...", registerBtn: "ثبت‌نام", registering: "در حال ثبت‌نام...", noAccount: "حساب ندارید؟", hasAccount: "قبلاً حساب دارید؟", wantToHost: "می‌خواهید مهمان بپذیرید؟", wrongCreds: "ایمیل یا رمز عبور نادرست", passMismatch: "رمزهای عبور مطابقت ندارند", minPass: "حداقل ۶ کاراکتر", socialOr: "یا", socialAutoCreate: "ورود از طریق شبکه اجتماعی به‌طور خودکار حساب ایجاد می‌کند", consentPD: "به پردازش داده‌های شخصی خود رضایت میدهم" },
  },
};

export default t;
