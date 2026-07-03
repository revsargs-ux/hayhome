import { LangCode } from "./translations";

// Перевод названий языков
export const LANG_NAMES: Record<string, Partial<Record<LangCode, string>>> = {
  "Армянский":    { ru: "Армянский",    en: "Armenian",  hy: "Հայերեն",    fr: "Arménien",  de: "Armenisch", es: "Armenio",   it: "Armeno",    ar: "الأرمينية", zh: "亚美尼亚语", fa: "ارمنی" },
  "Русский":      { ru: "Русский",      en: "Russian",   hy: "Ռուսերեն",   fr: "Russe",     de: "Russisch",  es: "Ruso",      it: "Russo",     ar: "الروسية",   zh: "俄语",     fa: "روسی" },
  "Английский":   { ru: "Английский",   en: "English",   hy: "Անգլերեն",   fr: "Anglais",   de: "Englisch",  es: "Inglés",    it: "Inglese",   ar: "الإنجليزية",zh: "英语",     fa: "انگلیسی" },
  "Французский":  { ru: "Французский",  en: "French",    hy: "Ֆրանսերեն",  fr: "Français",  de: "Französisch",es: "Francés",  it: "Francese",  ar: "الفرنسية",  zh: "法语",     fa: "فرانسوی" },
  "Немецкий":     { ru: "Немецкий",     en: "German",    hy: "Գերմաներեն", fr: "Allemand",  de: "Deutsch",   es: "Alemán",    it: "Tedesco",   ar: "الألمانية", zh: "德语",     fa: "آلمانی" },
  "Персидский":   { ru: "Персидский",   en: "Persian",   hy: "Պարսկերեն",  fr: "Persan",    de: "Persisch",  es: "Persa",     it: "Persiano",  ar: "الفارسية",  zh: "波斯语",   fa: "فارسی" },
  "Арабский":     { ru: "Арабский",     en: "Arabic",    hy: "Արաբերեն",   fr: "Arabe",     de: "Arabisch",  es: "Árabe",     it: "Arabo",     ar: "العربية",   zh: "阿拉伯语", fa: "عربی" },
};

// Перевод бейджей
export const BADGE_NAMES: Record<string, Partial<Record<LangCode, string>>> = {
  "🍽️ Лучшая кухня":      { ru: "🍽️ Лучшая кухня",      en: "🍽️ Best Kitchen",    hy: "🍽️ Լավագույն խոհանոց", fr: "🍽️ Meilleure cuisine", de: "🍽️ Beste Küche",    es: "🍽️ Mejor cocina",   it: "🍽️ Migliore cucina",  ar: "🍽️ أفضل مطبخ",   zh: "🍽️ 最佳厨房",   fa: "🍽️ بهترین آشپزخانه" },
  "🏡 Хранитель традиций": { ru: "🏡 Хранитель традиций", en: "🏡 Tradition Keeper", hy: "🏡 Ավանդույթների պահապան", fr: "🏡 Gardien des traditions", de: "🏡 Hüter der Traditionen", es: "🏡 Guardián de tradiciones", it: "🏡 Custode delle tradizioni", ar: "🏡 حارس التقاليد", zh: "🏡 传统守护者", fa: "🏡 نگهبان سنت‌ها" },
  "🌍 Полиглот":           { ru: "🌍 Полиглот",           en: "🌍 Polyglot",         hy: "🌍 Բազմալեզու",          fr: "🌍 Polyglotte",           de: "🌍 Polyglott",            es: "🌍 Políglota",              it: "🌍 Poliglotta",                ar: "🌍 متعدد اللغات", zh: "🌍 多语言",       fa: "🌍 چندزبانه" },
  "🌿 Фермер":             { ru: "🌿 Фермер",             en: "🌿 Farmer",           hy: "🌿 Ֆերմեր",              fr: "🌿 Fermier",              de: "🌿 Bauer",                es: "🌿 Granjero",               it: "🌿 Agricoltore",               ar: "🌿 مزارع",        zh: "🌿 农民",         fa: "🌿 کشاورز" },
  "🧀 Мастер сыра":        { ru: "🧀 Мастер сыра",        en: "🧀 Cheese Master",    hy: "🧀 Պանրի վարպետ",        fr: "🧀 Maître fromager",       de: "🧀 Käsemeister",           es: "🧀 Maestro quesero",        it: "🧀 Maestro del formaggio",     ar: "🧀 خبير الجبن",   zh: "🧀 奶酪大师",    fa: "🧀 استاد پنیر" },
  "🌲 Эко-хозяин":         { ru: "🌲 Эко-хозяин",         en: "🌲 Eco Host",         hy: "🌲 Էկո-տանտեր",          fr: "🌲 Hôte écologique",       de: "🌲 Öko-Gastgeber",         es: "🌲 Anfitrión ecológico",    it: "🌲 Host ecologico",            ar: "🌲 مضيف بيئي",    zh: "🌲 生态主人",    fa: "🌲 میزبان اکو" },
  "🔨 Мастер ремёсел":     { ru: "🔨 Мастер ремёсел",     en: "🔨 Craft Master",     hy: "🔨 Արհեստի վարպետ",      fr: "🔨 Maître artisan",        de: "🔨 Handwerksmeister",      es: "🔨 Maestro artesano",       it: "🔨 Maestro artigiano",         ar: "🔨 خبير الحرف",   zh: "🔨 工艺大师",    fa: "🔨 استاد صنایع" },
  "🎨 Художники":          { ru: "🎨 Художники",           en: "🎨 Artists",          hy: "🎨 Նկարիչներ",            fr: "🎨 Artistes",              de: "🎨 Künstler",              es: "🎨 Artistas",               it: "🎨 Artisti",                    ar: "🎨 فنانون",       zh: "🎨 艺术家",      fa: "🎨 هنرمندان" },
  "🍷 Мастер вина":        { ru: "🍷 Мастер вина",        en: "🍷 Wine Master",      hy: "🍷 Գինու վարպետ",         fr: "🍷 Maître vigneron",       de: "🍷 Weinmeister",           es: "🍷 Maestro del vino",       it: "🍷 Maestro del vino",           ar: "🍷 خبير النبيذ",  zh: "🍷 葡萄酒大师",  fa: "🍷 استاد شراب" },
  "⭐ Семья года":          { ru: "⭐ Семья года",          en: "⭐ Family of the Year",hy: "⭐ Տարվա ընտանիք",        fr: "⭐ Famille de l'année",     de: "⭐ Familie des Jahres",     es: "⭐ Familia del año",         it: "⭐ Famiglia dell'anno",         ar: "⭐ عائلة العام",   zh: "⭐ 年度家庭",    fa: "⭐ خانواده سال" },
  "🐟 Рыбак":              { ru: "🐟 Рыбак",              en: "🐟 Fisherman",        hy: "🐟 Ձկնորս",               fr: "🐟 Pêcheur",               de: "🐟 Fischer",               es: "🐟 Pescador",               it: "🐟 Pescatore",                  ar: "🐟 صياد",         zh: "🐟 渔民",        fa: "🐟 ماهیگیر" },
  "🔥 Хоровац-мастер":     { ru: "🔥 Хоровац-мастер",     en: "🔥 BBQ Master",       hy: "🔥 Խորովածի վարպետ",       fr: "🔥 Maître barbecue",        de: "🔥 Grill-Meister",         es: "🔥 Maestro BBQ",            it: "🔥 Maestro BBQ",              ar: "🔥 خبير الشواء",  zh: "🔥 烤肉大师",    fa: "🔥 استاد کباب" },
};

// Перевод удобств (amenities)
export const AMENITY_NAMES: Record<string, Partial<Record<LangCode, string>>> = {
  "Wi-Fi":                      { ru:"Wi-Fi",                    en:"Wi-Fi",                       hy:"Wi-Fi",                      fr:"Wi-Fi",                      de:"Wi-Fi",                      es:"Wi-Fi",                      it:"Wi-Fi",                       ar:"Wi-Fi",              zh:"Wi-Fi",         fa:"Wi-Fi" },
  "Отдельная комната":          { ru:"Отдельная комната",         en:"Private room",                hy:"Առանձին սենյակ",              fr:"Chambre privée",             de:"Privatzimmer",               es:"Habitación privada",          it:"Camera privata",              ar:"غرفة خاصة",         zh:"独立房间",       fa:"اتاق خصوصی" },
  "Завтрак":                    { ru:"Завтрак",                   en:"Breakfast",                   hy:"Նախաճաշար",               fr:"Petit-déjeuner",             de:"Frühstück",                  es:"Desayuno",                    it:"Colazione",                   ar:"إفطار",             zh:"早餐",           fa:"صبحانه" },
  "Ужин":                       { ru:"Ужин",                      en:"Dinner",                      hy:"Քնաղ",                      fr:"Dîner",                      de:"Abendessen",                  es:"Cena",                        it:"Cena",                        ar:"عشاء",              zh:"晚餐",           fa:"شام" },
  "Полное питание":              { ru:"Полное питание",             en:"All meals included",          hy:"Ամբեր սնուցում",            fr:"Pension complète",           de:"Vollpension",                 es:"Pensión completa",            it:"Pensione completa",           ar:"وجبات كاملة",       zh:"全餐",           fa:"تمام وعده‌ها" },
  "Горячая вода":               { ru:"Горячая вода",               en:"Hot water",                   hy:"Տաք ջուր",                   fr:"Eau chaude",                 de:"Warmwasser",                  es:"Agua caliente",               it:"Acqua calda",                 ar:"ماء ساخن",          zh:"热水",           fa:"آب گرم" },
  "Кондиционер":                { ru:"Кондиционер",                en:"Air conditioning",            hy:"Կոնդիցիոներ",             fr:"Climatisation",              de:"Klimaanlage",                 es:"Aire acondicionado",          it:"Aria condizionata",           ar:"مكيف هواء",         zh:"空调",           fa:"کولر" },
  "Домашняя еда":               { ru:"Домашняя еда",               en:"Home-cooked meals",           hy:"Տնային ուտեստ",              fr:"Cuisine maison",             de:"Hausmannskost",               es:"Comida casera",               it:"Cucina casalinga",            ar:"طعام منزلي",        zh:"家常菜",         fa:"غذای خانگی" },
  "Баня":                       { ru:"Баня",                       en:"Sauna / bathhouse",           hy:"Բանյա",                      fr:"Sauna / bain de vapeur",     de:"Sauna / Badehaus",            es:"Sauna / baño de vapor",       it:"Sauna / bagno turco",         ar:"حمام بخار",         zh:"桑拿浴室",       fa:"حمام سنتی" },
  "Огород":                     { ru:"Огород",                     en:"Vegetable garden",            hy:"Բաստանային այգի",            fr:"Potager",                    de:"Gemüsegarten",                es:"Huerto",                      it:"Orto",                        ar:"حديقة خضروات",      zh:"菜园",           fa:"باغچه سبزیجات" },
  "Домашнее вино":              { ru:"Домашнее вино",               en:"Homemade wine",               hy:"Տնային գինի",                fr:"Vin maison",                 de:"Hauswein",                    es:"Vino casero",                 it:"Vino fatto in casa",          ar:"نبيذ منزلي",        zh:"自制葡萄酒",     fa:"شراب خانگی" },
  "Домашнее молоко и сыр":      { ru:"Домашнее молоко и сыр",      en:"Homemade milk & cheese",      hy:"Տնային կաթ և պանիր",      fr:"Lait et fromage maison",     de:"Hausmilch und -käse",         es:"Leche y queso caseros",       it:"Latte e formaggio fatti in casa", ar:"حليب وجبن منزلي", zh:"自制牛奶和奶酪", fa:"شیر و پنیر خانگی" },
  "Вид на природу":             { ru:"Вид на природу",              en:"Nature view",                 hy:"Բնության տեսարան",           fr:"Vue sur la nature",          de:"Naturblick",                  es:"Vista a la naturaleza",       it:"Vista sulla natura",          ar:"إطلالة على الطبيعة",zh:"自然景观",       fa:"چشم‌انداز طبیعت" },
  "Вид на Арарат":              { ru:"Вид на Арарат",               en:"View of Ararat",              hy:"Արարատի տեսարան",           fr:"Vue sur l'Ararat",           de:"Blick auf den Ararat",        es:"Vista del Ararat",            it:"Vista sull'Ararat",           ar:"إطلالة على أرارات", zh:"阿拉拉特山景观",  fa:"چشم‌انداز آرارات" },
  "Трансфер":                   { ru:"Трансфер",                    en:"Transfer",                    hy:"Միջապարկ",                   fr:"Transfert",                  de:"Transfer",                    es:"Traslado",                    it:"Transfer",                    ar:"خدمة نقل",          zh:"接送服务",       fa:"سرویس حمل" },
  "Стиральная машина":          { ru:"Стиральная машина",            en:"Washing machine",             hy:"Սպիրքած մեքենա",            fr:"Machine à laver",            de:"Waschmaschine",               es:"Lavadora",                    it:"Lavatrice",                   ar:"غسالة",             zh:"洗衣机",         fa:"ماشین لباسشویی" },
  "Отдельный коттедж":          { ru:"Отдельный коттедж",           en:"Separate cottage",            hy:"Առանձ կոտտեջ",              fr:"Chalet séparé",              de:"Separates Ferienhaus",        es:"Cabaña separada",             it:"Bungalow separato",           ar:"كوخ مستقل",         zh:"独立小屋",       fa:"کلبه جداگانه" },
  "Виноградник":                { ru:"Виноградник",                 en:"Vineyard",                    hy:"Այգի",                       fr:"Vignoble",                   de:"Weinberg",                    es:"Viñedo",                      it:"Vigneto",                     ar:"كرم عنب",           zh:"葡萄园",         fa:"تاکستان" },
  "Рыбалка":                    { ru:"Рыбалка",                     en:"Fishing",                     hy:"Ձկնորսություն",             fr:"Pêche",                      de:"Angeln",                      es:"Pesca",                       it:"Pesca",                       ar:"صيد السمك",         zh:"钓鱼",           fa:"ماهیگیری" },
  "Лодка":                      { ru:"Лодка",                       en:"Boat",                        hy:"Նավակ",                      fr:"Bateau",                     de:"Boot",                        es:"Barca",                       it:"Barca",                       ar:"قارب",              zh:"小船",           fa:"قایق" },
  "Костёр":                     { ru:"Костёр",                      en:"Campfire",                    hy:"Ձարակ",                      fr:"Feu de camp",                de:"Lagerfeuer",                  es:"Fogata",                      it:"Falò",                        ar:"نار معسكر",         zh:"篝火",           fa:"آتش روباز" },
  "Свежий воздух":              { ru:"Свежий воздух",               en:"Fresh air",                   hy:"Քաղեցիկ օդ",                 fr:"Air frais",                  de:"Frische Luft",                es:"Aire fresco",                 it:"Aria fresca",                 ar:"هواء نقي",          zh:"新鲜空气",       fa:"هوای تازه" },
};

// Перевод опытов (experiences)
export const EXPERIENCE_NAMES: Record<string, Partial<Record<LangCode, string>>> = {
  "Мастер-класс по долме":           { ru:"Мастер-класс по долме",          en:"Dolma masterclass",              hy:"Տոլմայի վարպետության դաս",    fr:"Cours de cuisine dolma",       de:"Dolma-Kochkurs",               es:"Clase magistral de dolma",      it:"Corso di dolma",              ar:"ورشة عمل الدولما",       zh:"多尔马烹饪课",     fa:"کلاس آموزش دلمه" },
  "Мастер-класс по гате/кяте":       { ru:"Мастер-класс по гате/кяте",      en:"Gata/Kyata baking class",        hy:"Գատա/Քյաթայի թխելու դաս",      fr:"Cours de pâtisserie gata",     de:"Gata-Back-Kurs",               es:"Clase de repostería gata",      it:"Corso di pasticceria gata",   ar:"ورشة خبز الغاتا",        zh:"加塔糕点课",       fa:"کلاس گاتا" },
  "Экскурсия по Еревану":            { ru:"Экскурсия по Еревану",            en:"Yerevan city tour",              hy:"Երևանով զբանավարություն",  fr:"Visite guidée d'Erevan",       de:"Jerewan-Stadtrundgang",         es:"Tour por Ereván",               it:"Tour di Erevan",              ar:"جولة في يريفان",         zh:"埃里温城市游览",   fa:"تور شهری ایروان" },
  "Дегустация армянских вин":        { ru:"Дегустация армянских вин",        en:"Armenian wine tasting",          hy:"Հայկական գինի համտեսում",    fr:"Dégustation de vins arméniens",de:"Armenische Weinprobe",          es:"Cata de vinos armenios",        it:"Degustazione vini armeni",    ar:"تذوق النبيذ الأرميني",  zh:"亚美尼亚葡萄酒品鉴",fa:"چشیدن شراب ارمنی" },
  "Посещение рынка Вернисаж":        { ru:"Посещение рынка Вернисаж",        en:"Vernissage market visit",        hy:"Վերնիսաժ շուկայի այցելություն",fr:"Visite du marché Vernissage",  de:"Vernissage-Markt Besuch",       es:"Visita al mercado Vernissage",  it:"Visita al mercato Vernissage",ar:"زيارة سوق فيرنيساج",    zh:"参观韦尔尼萨日市场",  fa:"بازار ورنیساژ" },
  "Уход за животными":               { ru:"Уход за животными",               en:"Animal care",                    hy:"Կենդանիների խնամք",         fr:"Soin des animaux",             de:"Tierpflege",                    es:"Cuidado de animales",           it:"Cura degli animali",          ar:"رعاية الحيوانات",        zh:"动物护理",         fa:"نگهداری از حیوانات" },
  "Сбор трав":                       { ru:"Сбор трав",                       en:"Herb gathering",                 hy:"Խոտաբույսերի հավաք",       fr:"Cueillette de plantes",        de:"Kräuter sammeln",               es:"Recolección de hierbas",        it:"Raccolta di erbe",            ar:"جمع الأعشاب",            zh:"采集草药",         fa:"جمع‌آوری گیاهان" },
  "Посещение монастыря":             { ru:"Посещение монастыря",             en:"Monastery visit",                hy:"Վանակ-ավան այցելություն",    fr:"Visite du monastère",          de:"Klosterbesuch",                 es:"Visita al monasterio",          it:"Visita al monastero",         ar:"زيارة الدير",            zh:"参观修道院",       fa:"بازدید از صومعه" },
  "Приготовление домашнего сыра":    { ru:"Приготовление домашнего сыра",    en:"Homemade cheese making",         hy:"Տնային պանրի պատրաստել",    fr:"Fabrication de fromage maison",de:"Hausgemachter Käse herstellen", es:"Elaboración de queso casero",   it:"Produzione di formaggio",     ar:"صنع الجبن المنزلي",     zh:"制作自制奶酪",     fa:"درست کردن پنیر خانگی" },
  "Мастер-класс по кузнечному делу": { ru:"Мастер-класс по кузнечному делу",en:"Blacksmithing masterclass",      hy:"Դարբնագործության դաս",      fr:"Cours de forge",               de:"Schmiede-Kurs",                 es:"Clase de herrería",             it:"Corso di fabbro",             ar:"ورشة الحدادة",           zh:"铁匠工艺课程",     fa:"کلاس آهنگری" },
  "Ткачество карпетов":              { ru:"Ткачество карпетов",              en:"Carpet weaving",                 hy:"Գորգերի գործ",              fr:"Tissage de tapis",             de:"Teppichweberei",                es:"Tejido de alfombras",           it:"Tessitura di tappeti",        ar:"نسج السجاد",             zh:"地毯编织",         fa:"بافت قالی" },
  "Обзорная экскурсия по Гюмри":    { ru:"Обзорная экскурсия по Гюмри",    en:"Gyumri sightseeing tour",        hy:"Գյումրիով զբանավարություն",  fr:"Tour panoramique de Gumri",    de:"Sightseeing-Tour Gjumri",       es:"Tour panorámico de Gyumri",     it:"Tour panoramico di Gyumri",   ar:"جولة سياحية في جيومري", zh:"久姆里观光游览",   fa:"تور گردشگری گیومری" },
  "Посещение рынка":                 { ru:"Посещение рынка",                 en:"Market visit",                   hy:"Շուկայի այցելություն",        fr:"Visite du marché",             de:"Marktbesuch",                   es:"Visita al mercado",             it:"Visita al mercato",           ar:"زيارة السوق",            zh:"参观市场",         fa:"بازدید از بازار" },
  "Виноделие":                       { ru:"Виноделие",                       en:"Winemaking",                     hy:"Գինու պատրաստում",            fr:"Vinification",                 de:"Weinherstellung",               es:"Elaboración de vino",           it:"Vinificazione",               ar:"صناعة النبيذ",           zh:"酿酒",             fa:"شراب‌سازی" },
  "Дегустация вин и коньяка":        { ru:"Дегустация вин и коньяка",        en:"Wine & brandy tasting",          hy:"Գինու և կոնյակի համտեսում",fr:"Dégustation vins et cognac",   de:"Wein- und Weinbrand-Probe",     es:"Cata de vinos y coñac",         it:"Degustazione vini e brandy",  ar:"تذوق النبيذ والکنیاك", zh:"葡萄酒和白兰地品鉴", fa:"چشیدن شراب و کنیاک" },
  "Поход к Хор Вирапу":             { ru:"Поход к Хор Вирапу",             en:"Hike to Khor Virap",             hy:"Այցելություն Խոր Վիրապ",     fr:"Randonnée à Khor Virap",       de:"Wanderung zum Khor Virap",      es:"Senderismo a Khor Virap",       it:"Escursione a Khor Virap",     ar:"رحلة إلى خور فيراب",    zh:"霍尔维拉普徒步",   fa:"پیاده‌روی به خور ویراپ" },
  "Сбор винограда (сезон)":          { ru:"Сбор винограда (сезон)",          en:"Grape harvest (seasonal)",       hy:"Խաղողի հավաք (սեզոն)",      fr:"Vendanges (saison)",           de:"Weinlese (Saison)",             es:"Vendimia (temporada)",          it:"Vendemmia (stagionale)",      ar:"حصاد العنب (موسمي)",    zh:"葡萄采摘（季节性）", fa:"برداشت انگور (فصلی)" },
  "Утренняя рыбалка":                { ru:"Утренняя рыбалка",                en:"Morning fishing",                hy:"Առավոտյան ձկնորս",            fr:"Pêche matinale",               de:"Morgenfischen",                 es:"Pesca matutina",                it:"Pesca mattutina",             ar:"صيد الصباح",             zh:"晨间垂钓",         fa:"ماهیگیری صبحگاهی" },
  "Приготовление форели":            { ru:"Приготовление форели",             en:"Cooking fresh trout",            hy:"Իշխանի պատրաստել",          fr:"Préparation de la truite",     de:"Forelle zubereiten",            es:"Cocinar trucha fresca",         it:"Preparare la trota",          ar:"طهي سمك الفورel",       zh:"烹饪新鲜鳟鱼",     fa:"پخت ماهی قزل‌آلا" },
  "Хоровац (шашлык)":               { ru:"Хоровац (шашлык)",                en:"Khorovats (Armenian BBQ)",       hy:"Խորոված (շաշլիկ)",           fr:"Khorovats (barbecue arménien)",de:"Khorovats (armenisches BBQ)",   es:"Khorovats (barbacoa armenia)",  it:"Khorovats (BBQ armeno)",      ar:"خوروفاتس (شواء أرميني)",zh:"科罗瓦茨（亚美尼亚烧烤）",fa:"خوروواتس (کباب ارمنی)" },
  "Монастырь Севанаванк":           { ru:"Монастырь Севанаванк",            en:"Sevanavank monastery",           hy:"Սևանավանք",                 fr:"Monastère de Sevanavank",      de:"Kloster Sewanavank",            es:"Monasterio Sevanavank",         it:"Monastero di Sevanavank",     ar:"دير سيفانافانك",         zh:"赛瓦纳万克修道院", fa:"صومعه سوانواوانک" },
};

// Регионы Армении (для перевода)
export const REGION_NAMES: Record<string, Partial<Record<LangCode, string>>> = {
  "all":          { ru:"Все регионы",   en:"All regions",  hy:"Բոլոր մարզերը", fr:"Toutes régions", de:"Alle Regionen", es:"Todas las regiones", it:"Tutte le regioni", ar:"جميع المناطق", zh:"所有地区", fa:"همه مناطق" },
  "Ереван":       { ru:"Ереван",       en:"Yerevan",     hy:"Երևան",   fr:"Erevan",     de:"Eriwan",     es:"Ereván",     it:"Erevan",     ar:"يريفان",   zh:"埃里温",     fa:"ایروان" },
  "Тавуш":       { ru:"Тавуш",       en:"Tavush",     hy:"Տավուշ",   fr:"Tavush",     de:"Tawusch",    es:"Tavush",     it:"Tavush",     ar:"تافوش",   zh:"塔武什",     fa:"تاووش" },
  "Ширак":       { ru:"Ширак",       en:"Shirak",     hy:"Շիրակ",   fr:"Shirak",     de:"Schirak",    es:"Shirak",     it:"Shirak",     ar:"شيراك",   zh:"希拉克",     fa:"شیراک" },
  "Арарат":       { ru:"Арарат",       en:"Ararat",     hy:"Արարատ",   fr:"Ararat",     de:"Ararat",     es:"Ararat",     it:"Ararat",     ar:"أرارات",   zh:"阿勒山",     fa:"آرارات" },
  "Гегаркуник":   { ru:"Гегаркуник",   en:"Gegharkunik",hy:"Գեղարքունիք", fr:"Gegharkunik",de:"Gegharkunik",es:"Gegharkunik",it:"Gegharkunik",ar:"غيغاركونيك",zh:"格加尔库尼克",fa:"گغارکونیک" },
  "Лори":        { ru:"Лори",        en:"Lori",       hy:"Լոռի",   fr:"Lori",       de:"Lori",       es:"Lori",       it:"Lori",       ar:"لوري",    zh:"洛里",       fa:"لوری" },
  "Вайоц Дзор":  { ru:"Вайоц Дзор",  en:"Vayots Dzor",hy:"Վայոց Ձոր",fr:"Vayots Dzor",de:"Wajoz Dsor", es:"Vayots Dzor",it:"Vayots Dzor",ar:"فايتس دزور",zh:"瓦约茨佐尔",fa:"وایوتس دزور" },
  "Арагацотн":   { ru:"Арагацотн",   en:"Aragatsotn", hy:"Արագածոտն", fr:"Aragatsotn", de:"Aragazotn",  es:"Aragatsotn", it:"Aragatsotn", ar:"أراغاتسوتن",zh:"阿拉加措特恩",fa:"آراگاتسوتن" },
  "Котайк":       { ru:"Котайк",       en:"Kotayk",     hy:"Կոտայք",   fr:"Kotayk",     de:"Kotaik",     es:"Kotayk",     it:"Kotayk",     ar:"كوتايك",   zh:"科泰克",     fa:"کوتایک" },
  "Сюник":       { ru:"Сюник",       en:"Syunik",     hy:"Սյունիք",   fr:"Syunik",     de:"Sjunik",     es:"Syunik",     it:"Syunik",     ar:"سيونيك",   zh:"休尼克",     fa:"سیونیک" },
  "Yerevan":     { ru:"Ереван",       en:"Yerevan",     hy:"Երևան",   fr:"Erevan",     de:"Eriwan",     es:"Ereván",     it:"Erevan",     ar:"يريفان",   zh:"埃里温",     fa:"ایروان" },
  "Kotayk":      { ru:"Котайк",       en:"Kotayk",     hy:"Կոտայք",   fr:"Kotayk",     de:"Kotaik",     es:"Kotayk",     it:"Kotayk",     ar:"كوتايك",   zh:"科泰克",     fa:"کوتایک" },
  "Tavush":      { ru:"Тавуш",       en:"Tavush",     hy:"Տավուշ",   fr:"Tavush",     de:"Tawusch",    es:"Tavush",     it:"Tavush",     ar:"تافوش",   zh:"塔武什",     fa:"تاووش" },
  "Gegharkunik": { ru:"Гегаркуник",   en:"Gegharkunik",hy:"Գեղարքունիք", fr:"Gegharkunik",de:"Gegharkunik",es:"Gegharkunik",it:"Gegharkunik",ar:"غيغاركونيك",zh:"格加尔库尼克",fa:"گغارکونیک" },
  "Lori":        { ru:"Лори",        en:"Lori",       hy:"Լոռի",   fr:"Lori",       de:"Lori",       es:"Lori",       it:"Lori",       ar:"لوري",    zh:"洛里",       fa:"لوری" },
  "Shirak":      { ru:"Ширак",       en:"Shirak",     hy:"Շիրակ",   fr:"Shirak",     de:"Schirak",    es:"Shirak",     it:"Shirak",     ar:"شيراك",   zh:"希拉克",     fa:"شیراک" },
  "Aragatsotn":  { ru:"Арагацотн",   en:"Aragatsotn", hy:"Արագածոտն", fr:"Aragatsotn", de:"Aragazotn",  es:"Aragatsotn", it:"Aragatsotn", ar:"أراغاتسوتن",zh:"阿拉加措特恩",fa:"آراگاتسوتن" },
  "Armavir":     { ru:"Армавир",     en:"Armavir",    hy:"Արմավիր",   fr:"Armavir",    de:"Armawir",    es:"Armavir",    it:"Armavir",    ar:"أرمافير", zh:"阿尔马维尔",   fa:"آرمافیر" },
  "Ararat":      { ru:"Арарат",       en:"Ararat",     hy:"Արարատ",   fr:"Ararat",     de:"Ararat",     es:"Ararat",     it:"Ararat",     ar:"أرارات",   zh:"阿勒山",     fa:"آرارات" },
  "Syunik":      { ru:"Сюник",       en:"Syunik",     hy:"Սյունիք",   fr:"Syunik",     de:"Sjunik",     es:"Syunik",     it:"Syunik",     ar:"سيونيك",   zh:"休尼克",     fa:"سیونیک" },
  "Vayots Dzor": { ru:"Вайоц Дзор",  en:"Vayots Dzor",hy:"Վայոց Ձոր",fr:"Vayots Dzor",de:"Wajoz Dsor", es:"Vayots Dzor",it:"Vayots Dzor",ar:"فايتس دزور",zh:"瓦约茨佐尔",fa:"وایوتس دزور" },
  "Ashtarak":    { ru:"Аштарак",     en:"Ashtarak",   hy:"Աշտարակ",   fr:"Ashtarak",   de:"Aschtarak",  es:"Ashtarak",  it:"Ashtarak",  ar:"أشتاراك", zh:"阿什塔拉克",   fa:"اشتراک" },
  "Dilijan":     { ru:"Дилижан",     en:"Dilijan",    hy:"Դիլիջան",   fr:"Dilijan",    de:"Dilidschan", es:"Dilijan",    it:"Dilijan",    ar:"ديليجان",  zh:"迪利然",     fa:"دلیجان" },
  "Gyumri":      { ru:"Гюмри",       en:"Gyumri",     hy:"Գյումրի",   fr:"Gyumri",     de:"Gjumri",     es:"Gyumri",     it:"Gyumri",     ar:"غيومري",   zh:"久姆里",     fa:"گیومری" },
  "Areni":       { ru:"Арени",       en:"Areni",      hy:"Արենի",   fr:"Areni",      de:"Areni",      es:"Areni",      it:"Areni",      ar:"أريني",   zh:"阿雷尼",     fa:"آرنی" },
};

export function translateAmenity(name: string, code: LangCode): string {
  return AMENITY_NAMES[name]?.[code] ?? AMENITY_NAMES[name]?.["en"] ?? name;
}

export function translateExperience(name: string, code: LangCode): string {
  return EXPERIENCE_NAMES[name]?.[code] ?? EXPERIENCE_NAMES[name]?.["en"] ?? name;
}

export function translateLang(langName: string, code: LangCode): string {
  return LANG_NAMES[langName]?.[code] ?? LANG_NAMES[langName]?.["en"] ?? langName;
}

export function translateBadge(badge: string, code: LangCode): string {
  return BADGE_NAMES[badge]?.[code] ?? BADGE_NAMES[badge]?.["en"] ?? badge;
}

export function regionName(region: string, code: LangCode): string {
  return REGION_NAMES[region]?.[code] ?? region;
}

// Получить переведённое поле из хоста
type HostI18n = {
  familyName?: string;
  description?: string;
  longDescription?: string;
};

export function getLocalizedField(
  base: string,
  i18n: Record<string, HostI18n> | undefined,
  field: keyof HostI18n,
  lang: LangCode
): string {
  if (lang === "ru") return base;
  return i18n?.[lang]?.[field] ?? i18n?.["en"]?.[field] ?? base;
}
