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
  about: {
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
  };
  nav: {
    findFamily: string;
    hostGuests: string;
    about: string;
    login: string;
    register: string;
  };
  hero: {
    greeting: string;
    title1: string;
    title2: string;
    title3: string;
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
  };
  become: {
    title: string;
    subtitle: string;
    step0: string; step1: string; step2: string; step3: string;
    familyName: string; yourName: string; phone: string; email: string;
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
    },
    hero: {
      greeting: "Bari Ekeq!",
      title1: "Войди — стань",
      title2: "частью большой",
      title3: "армянской семьи",
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
      becomeCta: "Принять гостей бесплатно",
      browseBtn: "Посмотреть семьи",
    },
    become: {
      title: "Принять гостей в HayHome",
      subtitle: "Поделитесь армянским гостеприимством с миром",
      step0: "Контакты", step1: "Локация", step2: "Условия", step3: "Опыт",
      familyName: "Название семьи", yourName: "Ваше имя", phone: "Телефон", email: "Email",
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
    common: { loading: "Загрузка...", error: "Ошибка", rating: "рейтинг", newHost: "Новый" },
    auth: { loginTitle: "Войти в аккаунт", registerTitle: "Создать аккаунт", registerSub: "Регистрация гостя — бесплатно", password: "Пароль", confirmPassword: "Повторите пароль", name: "Ваше имя", loginBtn: "Войти", loggingIn: "Вход...", registerBtn: "Зарегистрироваться", registering: "Регистрация...", noAccount: "Нет аккаунта?", hasAccount: "Уже есть аккаунт?", wantToHost: "Хотите принимать гостей?", wrongCreds: "Неверный email или пароль", passMismatch: "Пароли не совпадают", minPass: "Минимум 6 символов" },
    about: { heroTitle: "О нас", heroSub: "Мы не строим платформу для аренды жилья. Мы строим живую культурную сеть.", missionLabel: "Наша миссия", missionTitle: "Армения открывается", missionTitle2: "через сердце семьи", missionSub: "HayHome — это не Airbnb. Это культурная экосистема национального масштаба. Мы сохраняем армянские семейные ценности и укрепляем образ Армении как самого гостеприимного народа мира.", card1title: "Сохранение традиций", card1desc: "Каждая семья — хранитель культурного кода. Мы помогаем этому коду жить и передаваться поколениям.", card2title: "Объединение народов", card2desc: "Гости из 40+ стран уже познакомились с Арменией через наших хозяев. Каждый визит — мост между культурами.", card3title: "Гордость за страну", card3desc: "Армянские семьи зарабатывают статус «Хранителя традиций» — признание всего сообщества.", storyLabel: "Как всё началось", storyTitle: "Идея, которая родилась за ужином", story1: "Всё началось с простого наблюдения: в Армении живут сотни семей, готовых принять гостей и показать настоящее гостеприимство. Но у них не было инструмента рассказать об этом миру.", story2: "А туристы со всего мира хотят именно этого — не отельный сервис, а живой опыт. Настоящие истории за большим столом.", story3: "HayHome создан, чтобы соединить этих людей. Это платформа доверия, культуры и тепла. Не просто бизнес — движение.", valuesLabel: "Наши ценности", valuesTitle: "Чем мы не Airbnb", v1t: "Хозяин — не арендодатель", v1d: "Каждый хозяин — «Хранитель традиций». Он презентует свой уклад жизни, культуру и историю.", v2t: "Опыт, а не кровать", v2d: "Гость ищет не место для ночлега, а уникальный опыт: мастер-классы, ужины, истории.", v3t: "Доверие через верификацию", v3d: "Каждая семья проходит проверку. Система звёзд гарантирует качество.", v4t: "Армяне знакомят армян", v4d: "Армянские семьи из разных регионов знакомятся между собой через платформу.", v5t: "Геймификация и статусы", v5d: "Бейджи «Лучшая кухня», «Мастер вина» — признание сообщества.", v6t: "Истории, не отзывы", v6d: "«Я приехал туристом, а уехал сыном этой семьи» — вот настоящий отзыв.", statsTitle: "HayHome сегодня", s1: "Семей в сети", s2: "Регионов Армении", s3: "Стран гостей", s4: "Средний рейтинг", toneLabel: "Наш голос", toneTitle: "Как мы говорим", toneSub: "Мы говорим как старший брат, гостеприимный хозяин, патриот без пафоса — не как корпорация.", secTitle: "Безопасность и доверие", secDesc: "Каждая семья проходит верификацию документов. Страхование и поддержка 24/7.", ctaTitle: "Войди — стань частью большой армянской семьи", ctaSub: "Не важно откуда вы. Важно что вы готовы открыться новому." },
  },

  en: {
    nav: { findFamily: "Find a Family", hostGuests: "Host Guests", about: "About", login: "Log In", register: "Sign Up" },
    hero: {
      greeting: "Bari Ekeq!",
      title1: "Come in — become",
      title2: "part of one big",
      title3: "Armenian family",
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
    },
    home: {
      whyTitle: "Why HayHome?",
      whySub: "This is not Airbnb. It's something more — a connection between people of different cultures.",
      realHome: "A Real Home", realHomeDesc: "You live with the family, not in a hotel. You eat what they eat. You hear stories not written in guidebooks.",
      verified: "Verified Hosts", verifiedDesc: "Every family is verified. The star system guarantees quality.",
      unite: "Uniting People", uniteDesc: "Guests from 40+ countries have already discovered Armenia through our hosts.",
      ourFamilies: "Our Families", ourFamiliesSub: "Authentic Armenian hospitality",
      allFamilies: "All Families",
      howTitle: "How It Works",
      step1: "Choose a family", step1desc: "Filter by city, stars, price and languages",
      step2: "Book a visit", step2desc: "Select dates and send a request to the family",
      step3: "Become one of them", step3desc: "You'll leave as a friend. And come back again.",
      becomeTitle: "Do you have a home and want to welcome guests?",
      becomeSub: "Register for free. First 12 months — no commission.",
      becomeCta: "Host Guests for Free",
      browseBtn: "Browse Families",
    },
    become: {
      title: "Host Guests in HayHome",
      subtitle: "Share Armenian hospitality with the world",
      step0: "Contacts", step1: "Location", step2: "Terms", step3: "Experience",
      familyName: "Family Name", yourName: "Your Name", phone: "Phone", email: "Email",
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
    common: { loading: "Loading...", error: "Error", rating: "rating", newHost: "New" },
    auth: { loginTitle: "Sign In", registerTitle: "Create Account", registerSub: "Guest registration — free", password: "Password", confirmPassword: "Confirm Password", name: "Your Name", loginBtn: "Sign In", loggingIn: "Signing in...", registerBtn: "Create Account", registering: "Registering...", noAccount: "No account?", hasAccount: "Already have an account?", wantToHost: "Want to host guests?", wrongCreds: "Invalid email or password", passMismatch: "Passwords don't match", minPass: "Minimum 6 characters" },
    about: { heroTitle: "About Us", heroSub: "We are not building a rental platform. We are building a living cultural network.", missionLabel: "Our Mission", missionTitle: "Armenia opens up", missionTitle2: "through the heart of a family", missionSub: "HayHome is not Airbnb. It is a cultural ecosystem of national scale. We preserve Armenian family values and strengthen Armenia's image as the most hospitable people in the world.", card1title: "Preserving Traditions", card1desc: "Every family is a keeper of cultural heritage. We help this heritage live and pass on to future generations.", card2title: "Uniting People", card2desc: "Guests from 40+ countries have already discovered Armenia through our hosts. Every visit is a bridge between cultures.", card3title: "Pride in the Country", card3desc: "Armenian families earn the status of 'Tradition Keeper' — recognition from the whole community.", storyLabel: "How It Started", storyTitle: "An idea born over dinner", story1: "It all started with a simple observation: hundreds of Armenian families are ready to welcome guests and show real hospitality — but had no tool to tell the world.", story2: "And tourists from around the world want exactly this — not hotel service, but a living experience. Real stories around a big table.", story3: "HayHome was created to connect these people. It is a platform of trust, culture and warmth. Not just a business — a movement.", valuesLabel: "Our Values", valuesTitle: "Why We Are Not Airbnb", v1t: "Host, Not Landlord", v1d: "Every host is a 'Tradition Keeper'. They present their way of life, culture and history.", v2t: "Experience, Not a Bed", v2d: "The guest seeks not a place to sleep, but a unique experience: masterclasses, dinners, stories.", v3t: "Trust Through Verification", v3d: "Every family is verified. The star system guarantees quality.", v4t: "Armenians Meet Armenians", v4d: "Armenian families from different regions meet each other through the platform.", v5t: "Gamification & Status", v5d: "Badges like 'Best Kitchen', 'Wine Master' are community recognition.", v6t: "Stories, Not Reviews", v6d: "'I came as a tourist and left as their son' — that's a real review.", statsTitle: "HayHome Today", s1: "Families in the network", s2: "Regions of Armenia", s3: "Guest countries", s4: "Average rating", toneLabel: "Our Voice", toneTitle: "How We Speak", toneSub: "We speak like an older brother, a welcoming host, a patriot without pomposity — not like a corporation.", secTitle: "Safety & Trust", secDesc: "Every family goes through document verification. Insurance and 24/7 support.", ctaTitle: "Come in — become part of one big Armenian family", ctaSub: "It doesn't matter where you are from. What matters is that you are ready to open up to something new." },
  },

  hy: {
    nav: { findFamily: "Գտնել ընտանիք", hostGuests: "Ընդունել հյուրեր", about: "Մեր մասին", login: "Մուտք", register: "Գրանցում" },
    hero: {
      greeting: "Բարի եկաք!",
      title1: "Արի — դարձիր",
      title2: "հայկական մեծ",
      title3: "ընտանիքի մաս",
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
      becomeCta: "Ընդունել հյուրեր անվճար",
      browseBtn: "Դիտել ընտանիքները",
    },
    become: {
      title: "Ընդունել հյուրեր HayHome-ում",
      subtitle: "Կիսվեք հայկական հյուրընկալությամբ",
      step0: "Կոնտակտներ", step1: "Տեղ", step2: "Պայմաններ", step3: "Փորձ",
      familyName: "Ընտանիքի անուն", yourName: "Ձեր անունը", phone: "Հեռախոս", email: "Էլ. փոստ",
      city: "Քաղաք", region: "Մարզ", address: "Հասցե", pickRegion: "Ընտրեք մարզ",
      priceNight: "Գինը մեկ գիշերվա", maxGuests: "Հյուրերի քանակ", rooms: "Սենյակներ",
      shortDesc: "Կարճ նկարագրություն", longDesc: "Ավելի մանրամասն",
      amenitiesLabel: "Հարմարություններ", experiencesLabel: "Փորձ", langsLabel: "Լեզուներ",
      submit: "Ուղարկել", submitting: "Ուղարկվում...",
      successTitle: "Հայտն ուղարկված է!", successText: "Մենք կկապվենք ձեզ հետ 24–48 ժամվա ընթացքում:",
      next: "Հաջորդ", back: "Հետ", toHome: "Գլխավոր",
      aiBtn: "Բարելավել AI-ով", aiLoading: "Գրում...", restore: "Վերականգնել",
      aiHint: "Գրեք ձեր բառերով — AI-ն կդարձնի ավելի ջերմ:",
      aiImproved: "AI-ն բարելավել է",
      aiImprovedLong: "AI-ն բարելավել է — ստուգեք",
    },
    common: { loading: "Բեռնում...", error: "Սխալ", rating: "վարկանիշ", newHost: "Նոր" },
    auth: { loginTitle: "Մուտք գործել", registerTitle: "Ստեղծել հաշիվ", registerSub: "Հյուրի գրանցում — անվճար", password: "Գաղտնաբառ", confirmPassword: "Կրկնել գաղտնաբառը", name: "Ձեր անունը", loginBtn: "Մուտք", loggingIn: "Մուտք...", registerBtn: "Գրանցվել", registering: "Գրանցում...", noAccount: "Հաշիվ չունե՞ք:", hasAccount: "Արդեն հաշիվ ունե՞ք:", wantToHost: "Ցանկանո՞ւմ եք ընդունել հյուրեր:", wrongCreds: "Սխալ email կամ գաղտնաբառ", passMismatch: "Գաղտնաբառերը չեն համընկնում", minPass: "Նվազ. 6 նիշ" },
  },

  fr: {
    nav: { findFamily: "Trouver une famille", hostGuests: "Accueillir des hôtes", about: "À propos", login: "Connexion", register: "S'inscrire" },
    hero: {
      greeting: "Bari Ekeq!",
      title1: "Entrez — devenez",
      title2: "membre d'une grande",
      title3: "famille arménienne",
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
    },
    home: {
      whyTitle: "Pourquoi HayHome?",
      whySub: "Ce n'est pas Airbnb. C'est quelque chose de plus — une connexion entre les cultures.",
      realHome: "Une vraie maison", realHomeDesc: "Vous vivez avec la famille, pas dans un hôtel.",
      verified: "Hôtes vérifiés", verifiedDesc: "Chaque famille est vérifiée. Le système d'étoiles garantit la qualité.",
      unite: "Unir les peuples", uniteDesc: "Des hôtes de 40+ pays ont découvert l'Arménie.",
      ourFamilies: "Nos familles", ourFamiliesSub: "L'hospitalité arménienne authentique",
      allFamilies: "Toutes les familles",
      howTitle: "Comment ça marche",
      step1: "Choisissez une famille", step1desc: "Filtrez par ville, étoiles, prix",
      step2: "Réservez une visite", step2desc: "Choisissez les dates",
      step3: "Devenez des leurs", step3desc: "Vous repartirez comme un ami.",
      becomeTitle: "Vous avez une maison et souhaitez accueillir des hôtes?",
      becomeSub: "Inscrivez-vous gratuitement. 12 premiers mois sans commission.",
      becomeCta: "Accueillir des hôtes gratuitement",
      browseBtn: "Voir les familles",
    },
    become: {
      title: "Accueillir des hôtes sur HayHome",
      subtitle: "Partagez l'hospitalité arménienne",
      step0: "Contacts", step1: "Lieu", step2: "Conditions", step3: "Expérience",
      familyName: "Nom de famille", yourName: "Votre nom", phone: "Téléphone", email: "Email",
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
    common: { loading: "Chargement...", error: "Erreur", rating: "note", newHost: "Nouveau" },
    auth: { loginTitle: "Se connecter", registerTitle: "Créer un compte", registerSub: "Inscription gratuite", password: "Mot de passe", confirmPassword: "Confirmer le mot de passe", name: "Votre nom", loginBtn: "Connexion", loggingIn: "Connexion...", registerBtn: "S'inscrire", registering: "Inscription...", noAccount: "Pas de compte?", hasAccount: "Déjà un compte?", wantToHost: "Vous voulez accueillir?", wrongCreds: "Email ou mot de passe incorrect", passMismatch: "Les mots de passe ne correspondent pas", minPass: "Minimum 6 caractères" },
  },

  de: {
    nav: { findFamily: "Familie finden", hostGuests: "Gäste empfangen", about: "Über uns", login: "Anmelden", register: "Registrieren" },
    hero: {
      greeting: "Bari Ekeq!",
      title1: "Komm rein — werde",
      title2: "Teil einer großen",
      title3: "armenischen Familie",
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
      becomeCta: "Gäste kostenlos empfangen",
      browseBtn: "Familien ansehen",
    },
    become: {
      title: "Gäste in HayHome empfangen",
      subtitle: "Teilen Sie armenische Gastfreundschaft",
      step0: "Kontakte", step1: "Standort", step2: "Konditionen", step3: "Erfahrung",
      familyName: "Familienname", yourName: "Ihr Name", phone: "Telefon", email: "E-Mail",
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
    common: { loading: "Laden...", error: "Fehler", rating: "Bewertung", newHost: "Neu" },
    auth: { loginTitle: "Anmelden", registerTitle: "Konto erstellen", registerSub: "Gast-Registrierung — kostenlos", password: "Passwort", confirmPassword: "Passwort bestätigen", name: "Ihr Name", loginBtn: "Anmelden", loggingIn: "Anmeldung...", registerBtn: "Registrieren", registering: "Registrierung...", noAccount: "Kein Konto?", hasAccount: "Bereits ein Konto?", wantToHost: "Gäste empfangen?", wrongCreds: "Ungültige E-Mail oder Passwort", passMismatch: "Passwörter stimmen nicht überein", minPass: "Mindestens 6 Zeichen" },
  },

  es: {
    nav: { findFamily: "Encontrar familia", hostGuests: "Recibir huéspedes", about: "Sobre nosotros", login: "Iniciar sesión", register: "Registrarse" },
    hero: {
      greeting: "¡Bari Ekeq!",
      title1: "Entra — conviértete",
      title2: "en parte de una gran",
      title3: "familia armenia",
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
      becomeCta: "Recibir huéspedes gratis",
      browseBtn: "Ver familias",
    },
    become: {
      title: "Recibir huéspedes en HayHome",
      subtitle: "Comparte la hospitalidad armenia",
      step0: "Contactos", step1: "Ubicación", step2: "Condiciones", step3: "Experiencia",
      familyName: "Nombre de familia", yourName: "Tu nombre", phone: "Teléfono", email: "Correo",
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
    common: { loading: "Cargando...", error: "Error", rating: "calificación", newHost: "Nuevo" },
    auth: { loginTitle: "Iniciar sesión", registerTitle: "Crear cuenta", registerSub: "Registro de huésped — gratis", password: "Contraseña", confirmPassword: "Confirmar contraseña", name: "Tu nombre", loginBtn: "Iniciar sesión", loggingIn: "Iniciando...", registerBtn: "Registrarse", registering: "Registrando...", noAccount: "¿Sin cuenta?", hasAccount: "¿Ya tienes cuenta?", wantToHost: "¿Quieres recibir huéspedes?", wrongCreds: "Email o contraseña incorrectos", passMismatch: "Las contraseñas no coinciden", minPass: "Mínimo 6 caracteres" },
  },

  it: {
    nav: { findFamily: "Trova una famiglia", hostGuests: "Ospita viaggiatori", about: "Chi siamo", login: "Accedi", register: "Registrati" },
    hero: {
      greeting: "Bari Ekeq!",
      title1: "Entra — diventa",
      title2: "parte di una grande",
      title3: "famiglia armena",
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
      becomeCta: "Ospita gratis",
      browseBtn: "Vedi le famiglie",
    },
    become: {
      title: "Ospita su HayHome",
      subtitle: "Condividi l'ospitalità armena",
      step0: "Contatti", step1: "Posizione", step2: "Condizioni", step3: "Esperienza",
      familyName: "Nome famiglia", yourName: "Il tuo nome", phone: "Telefono", email: "Email",
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
    common: { loading: "Caricamento...", error: "Errore", rating: "valutazione", newHost: "Nuovo" },
    auth: { loginTitle: "Accedi", registerTitle: "Crea account", registerSub: "Registrazione ospite — gratuita", password: "Password", confirmPassword: "Conferma password", name: "Il tuo nome", loginBtn: "Accedi", loggingIn: "Accesso...", registerBtn: "Registrati", registering: "Registrazione...", noAccount: "Nessun account?", hasAccount: "Hai già un account?", wantToHost: "Vuoi ospitare?", wrongCreds: "Email o password errati", passMismatch: "Le password non corrispondono", minPass: "Minimo 6 caratteri" },
  },

  ar: {
    nav: { findFamily: "ابحث عن عائلة", hostGuests: "استقبال الضيوف", about: "من نحن", login: "تسجيل الدخول", register: "إنشاء حساب" },
    hero: {
      greeting: "!Bari Ekeq",
      title1: "ادخل — كن",
      title2: "جزءاً من عائلة",
      title3: "أرمينية كبيرة",
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
    },
    become: {
      title: "استقبال الضيوف في HayHome",
      subtitle: "شارك الضيافة الأرمينية",
      step0: "جهات الاتصال", step1: "الموقع", step2: "الشروط", step3: "التجربة",
      familyName: "اسم العائلة", yourName: "اسمك", phone: "الهاتف", email: "البريد الإلكتروني",
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
    common: { loading: "جار التحميل...", error: "خطأ", rating: "تقييم", newHost: "جديد" },
    auth: { loginTitle: "تسجيل الدخول", registerTitle: "إنشاء حساب", registerSub: "تسجيل الضيف — مجاني", password: "كلمة المرور", confirmPassword: "تأكيد كلمة المرور", name: "اسمك", loginBtn: "دخول", loggingIn: "جار الدخول...", registerBtn: "إنشاء حساب", registering: "جار التسجيل...", noAccount: "ليس لديك حساب؟", hasAccount: "لديك حساب بالفعل؟", wantToHost: "تريد استقبال الضيوف؟", wrongCreds: "بريد إلكتروني أو كلمة مرور غير صحيحة", passMismatch: "كلمتا المرور غير متطابقتين", minPass: "6 أحرف على الأقل" },
  },

  zh: {
    nav: { findFamily: "寻找家庭", hostGuests: "接待客人", about: "关于我们", login: "登录", register: "注册" },
    hero: {
      greeting: "欢迎！Bari Ekeq!",
      title1: "加入我们——成为",
      title2: "亚美尼亚大家庭",
      title3: "的一份子",
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
    },
    become: {
      title: "在HayHome接待客人",
      subtitle: "分享亚美尼亚的热情好客",
      step0: "联系方式", step1: "位置", step2: "条件", step3: "体验",
      familyName: "家庭名称", yourName: "您的姓名", phone: "电话", email: "电子邮件",
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
    common: { loading: "加载中...", error: "错误", rating: "评分", newHost: "新" },
    auth: { loginTitle: "登录", registerTitle: "创建账户", registerSub: "游客注册 — 免费", password: "密码", confirmPassword: "确认密码", name: "您的姓名", loginBtn: "登录", loggingIn: "登录中...", registerBtn: "注册", registering: "注册中...", noAccount: "没有账户？", hasAccount: "已有账户？", wantToHost: "想接待客人？", wrongCreds: "邮箱或密码错误", passMismatch: "密码不匹配", minPass: "最少6个字符" },
  },

  fa: {
    nav: { findFamily: "یافتن خانواده", hostGuests: "پذیرش مهمان", about: "درباره ما", login: "ورود", register: "ثبت‌نام" },
    hero: {
      greeting: "!Bari Ekeq",
      title1: "بیایید — بخشی از",
      title2: "یک خانواده بزرگ",
      title3: "ارمنی شوید",
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
    },
    become: {
      title: "پذیرش مهمان در HayHome",
      subtitle: "مهمان‌نوازی ارمنی را به اشتراک بگذارید",
      step0: "مخاطبین", step1: "موقعیت", step2: "شرایط", step3: "تجربه",
      familyName: "نام خانواده", yourName: "نام شما", phone: "تلفن", email: "ایمیل",
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
    common: { loading: "بارگذاری...", error: "خطا", rating: "امتیاز", newHost: "جدید" },
    auth: { loginTitle: "ورود به حساب", registerTitle: "ایجاد حساب", registerSub: "ثبت‌نام مهمان — رایگان", password: "رمز عبور", confirmPassword: "تأیید رمز عبور", name: "نام شما", loginBtn: "ورود", loggingIn: "در حال ورود...", registerBtn: "ثبت‌نام", registering: "در حال ثبت‌نام...", noAccount: "حساب ندارید؟", hasAccount: "قبلاً حساب دارید؟", wantToHost: "می‌خواهید مهمان بپذیرید؟", wrongCreds: "ایمیل یا رمز عبور نادرست", passMismatch: "رمزهای عبور مطابقت ندارند", minPass: "حداقل ۶ کاراکتر" },
  },
};

export default t;
