"use client";
import { Suspense, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import { X, MapPin, Calendar, DollarSign, User } from "lucide-react";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

interface EventItem {
  id: string;
  title: string;
  titleRu: string;
  titleHy: string;
  description: string;
  descriptionRu: string;
  descriptionHy: string;
  date: string;
  location: string;
  locationRu: string;
  locationHy: string;
  price: number;
  host: string;
  category: "hovots" | "dance" | "music" | "wineTasting" | "pottery" | "cooking" | "art";
  coords: [number, number];
  gradient: string;
}

const EVENTS: EventItem[] = [
  {
    id: "e1",
    title: "Khorovats in Nature with an Armenian Family",
    titleRu: "Хоровац на природе с армянской семьёй",
    titleHy: "Խորոված բնության մեջ՝ հայ ընտանիքի հետ",
    description: "Experience authentic Armenian barbecue in the mountains. Learn the art of grilling meat over an open fire, paired with fresh herbs and homemade wine.",
    descriptionRu: "Попробуйте настоящий армянский барбекю в горах. Изучите искусство приготовления мяса на открытом огне со свежими травами и домашним вином.",
    descriptionHy: "Վայելեք իսկական հայկական խորովածը լեռներում: Սովորեք մսի խորովման արվեստը բաց կրակի վրա՝ թարմ խոտաբույսերով և տնական գինով:",
    date: "2026-07-15",
    location: "Ashtarak gorge",
    locationRu: "Аштаракское ущелье",
    locationHy: "Աշտարակի կիրճ",
    price: 45,
    host: "Sargsyan Family",
    category: "hovots",
    coords: [40.2985, 44.3647],
    gradient: "from-red-500 to-orange-500",
  },
  {
    id: "e2",
    title: "Lavash Master Class",
    titleRu: "Мастер-класс лаваша",
    titleHy: "Լավաշի վարպետության դաս",
    description: "Learn to bake traditional Armenian lavash in a tonir (clay oven). From dough to the final bread — a hands-on cultural experience.",
    descriptionRu: "Научитесь печь традиционный армянский лаваш в тонире (глиняной печи). От теста до готового хлеба — практическое культурное погружение.",
    descriptionHy: "Սովորեք թխել ավանդական հայկական լավաշը թոնիրում (կավե վառարանում): Խմորից մինչև պատրաստի հացը՝ գործնական մշակութային փորձառություն:",
    date: "2026-07-20",
    location: "Yerevan",
    locationRu: "Ереван",
    locationHy: "Երևան",
    price: 30,
    host: "Grandma Anahit",
    category: "cooking",
    coords: [40.1792, 44.4991],
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    id: "e3",
    title: "Wine Tasting in Areni",
    titleRu: "Винная дегустация в Арени",
    titleHy: "Գինու համտեսում Արենիում",
    description: "Discover Armenia's 6000-year wine heritage. Visit local wineries in Areni, taste indigenous grape varieties and learn from winemakers.",
    descriptionRu: "Откройте 6000-летнее винное наследие Армении. Посетите местные винодельни в Арени, продегустируйте местные сорта винограда и пообщайтесь с виноделами.",
    descriptionHy: "Բացահայտեք Հայաստանի 6000-ամյա գինու ժառանգությունը: Այցելեք Արենիի տեղական գորղարանները, համտեսեք տեղական խաղողի տեսակները և շփվեք գինեգործների հետ:",
    date: "2026-08-05",
    location: "Areni",
    locationRu: "Арени",
    locationHy: "Արենի",
    price: 60,
    host: "Areni Wine Cellars",
    category: "wineTasting",
    coords: [39.7308, 45.4708],
    gradient: "from-purple-500 to-red-500",
  },
  {
    id: "e4",
    title: "Armenian Dance Under the Open Sky",
    titleRu: "Армянские танцы под открытым небом",
    titleHy: "Հայկական պարեր բաց երկնքի տակ",
    description: "Join a vibrant evening of traditional Armenian circle dances (Kochari). No experience needed — just bring your energy and joy!",
    descriptionRu: "Присоединяйтесь к яркому вечеру традиционных армянских хороводных танцев (Кочари). Опыт не нужен — только энергия и радость!",
    descriptionHy: "Միացեք ավանդական հայկական շրջապարերի (Քոչարի) վառ երեկոյին: Փորձ չի պահանջվում — միայն էներգիա և ուրախություն!",
    date: "2026-07-28",
    location: "Republic Square, Yerevan",
    locationRu: "Площадь Республики, Ереван",
    locationHy: "Հանրապետության հրապարակ, Երևան",
    price: 25,
    host: "Yerevan Dance Collective",
    category: "dance",
    coords: [40.1792, 44.5126],
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "e5",
    title: "Pottery Workshop in Dilijan",
    titleRu: "Керамическая мастерская в Дилижане",
    titleHy: "Խեցեգործության արհեստանոց Դիլիջանում",
    description: "Get your hands dirty in a traditional pottery studio surrounded by the lush forests of Dilijan. Create your own ceramic souvenir.",
    descriptionRu: "Погрузите руки в глину в традиционной керамической мастерской в окружении лесов Дилижана. Создайте свой собственный керамический сувенир.",
    descriptionHy: "Թաթախեք ձեռքերը կավի մեջ ավանդական խեցեգործության արհեստանոցում՝ շրջապատված Դիլիջանի անտառներով: Ստեղծեք ձեր սեփական կերամիկական հուշանվերը:",
    date: "2026-08-12",
    location: "Dilijan",
    locationRu: "Дилижан",
    locationHy: "Դիլիջան",
    price: 35,
    host: "Dilijan Crafts Center",
    category: "pottery",
    coords: [40.7392, 44.8560],
    gradient: "from-stone-500 to-amber-600",
  },
  {
    id: "e6",
    title: "Culinary Evening — Cooking Dolma",
    titleRu: "Кулинарный вечер — готовим долму",
    titleHy: "Խոհարարական երեկո — տոլմա պատրաստել",
    description: "Learn to wrap perfect dolma — grape leaves stuffed with spiced rice and meat. A communal cooking experience ending with a feast.",
    descriptionRu: "Научитесь заворачивать идеальную долму — виноградные листья с пряным рисом и мясом. Совместное приготовление заканчивается пиршеством.",
    descriptionHy: "Սովորեք փաթաթել կատարյալ տոլմա՝ խաղողի տերևներով և համեմված բրնձով ու մսով: Համատեղ խոհարարությունը ավարտվում է խնջույքով:",
    date: "2026-08-18",
    location: "Gyumri",
    locationRu: "Гюмри",
    locationHy: "Գյումրի",
    price: 40,
    host: "Karapetyan Kitchen",
    category: "cooking",
    coords: [40.7860, 43.8453],
    gradient: "from-green-500 to-teal-500",
  },
];

const CATEGORIES = ["hovots", "dance", "music", "wineTasting", "pottery", "cooking", "art"] as const;

export default function EventsPage() {
  const { lang } = useLang();
  const u = getUI(lang);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showMap, setShowMap] = useState(false);

  const isRu = lang === "ru";
  const isHy = lang === "hy";

  const filtered = useMemo(() => {
    if (activeCategory === "all") return EVENTS;
    return EVENTS.filter((e) => e.category === activeCategory);
  }, [activeCategory]);

  const categoryLabel = (cat: string): string => {
    const map: Record<string, string> = {
      hovots: u.hovots,
      dance: u.dance,
      music: u.music,
      wineTasting: u.wineTasting,
      pottery: u.pottery,
      cooking: u.cooking,
      art: u.art,
    };
    return map[cat] || cat;
  };

  // Adapt events for Map component (expects Host-like objects)
  const mapHosts = filtered.map((e) => ({
    id: e.id,
    familyName: isHy ? e.titleHy : isRu ? e.titleRu : e.title,
    city: isHy ? e.locationHy : isRu ? e.locationRu : e.location,
    region: "Yerevan",
    coverPhoto: "",
    pricePerNight: e.price,
    rating: 0,
    stars: 0,
    _coords: e.coords,
  })) as any;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C45D3E] to-[#D4A04A] opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            {u.eventsTitle}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            {u.eventsSubtitle}
          </p>
        </div>
      </div>

      {/* Filters + Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
            style={activeCategory === "all" ? { background: "linear-gradient(135deg, #C45D3E, #D4A04A)" } : {}}
          >
            {u.allCategories}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
              style={activeCategory === cat ? { background: "linear-gradient(135deg, #C45D3E, #D4A04A)" } : {}}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Map/List toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowMap(!showMap)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50 transition text-gray-700"
          >
            {showMap ? `📋 ${u.events}` : `🗺️ ${u.route}`}
          </button>
        </div>

        {/* Map view */}
        {showMap && (
          <Suspense fallback={<div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-2xl"><div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" /></div>}>
            <div className="mb-8">
              <Map hosts={mapHosts} />
            </div>
          </Suspense>
        )}

        {/* Event cards grid */}
        {!showMap && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image placeholder with gradient */}
                <div className={`h-48 bg-gradient-to-br ${event.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                    {event.category === "hovots" && "🍇"}
                    {event.category === "dance" && "💃"}
                    {event.category === "music" && "🎵"}
                    {event.category === "wineTasting" && "🍷"}
                    {event.category === "pottery" && "🏺"}
                    {event.category === "cooking" && "🥘"}
                    {event.category === "art" && "🎨"}
                  </div>
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 text-xs font-medium text-gray-700">
                    {categoryLabel(event.category)}
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-bold">
                    ${event.price}{u.perPerson}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {isHy ? event.titleHy : isRu ? event.titleRu : event.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {isHy ? event.descriptionHy : isRu ? event.descriptionRu : event.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#C45D3E]" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#C45D3E]" />
                      {isHy ? event.locationHy : isRu ? event.locationRu : event.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={13} className="text-[#C45D3E]" />
                      {event.host}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="w-full py-2.5 rounded-full text-white font-medium text-sm transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #C45D3E, #D4A04A)" }}
                  >
                    {u.learnMore}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero */}
            <div className={`h-56 bg-gradient-to-br ${selectedEvent.gradient} relative`}>
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-gray-700 hover:bg-white transition"
              >
                <X size={18} />
              </button>
              <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30">
                {selectedEvent.category === "hovots" && "🍇"}
                {selectedEvent.category === "dance" && "💃"}
                {selectedEvent.category === "music" && "🎵"}
                {selectedEvent.category === "wineTasting" && "🍷"}
                {selectedEvent.category === "pottery" && "🏺"}
                {selectedEvent.category === "cooking" && "🥘"}
                {selectedEvent.category === "art" && "🎨"}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[50vh] overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-orange-50 text-[#C45D3E] text-xs font-medium">
                  {categoryLabel(selectedEvent.category)}
                </span>
                <span className="text-lg font-bold text-[#C45D3E]">
                  ${selectedEvent.price}{u.perPerson}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {isHy ? selectedEvent.titleHy : isRu ? selectedEvent.titleRu : selectedEvent.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {isHy ? selectedEvent.descriptionHy : isRu ? selectedEvent.descriptionRu : selectedEvent.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} className="text-[#C45D3E]" />
                  {selectedEvent.date}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-[#C45D3E]" />
                  {isHy ? selectedEvent.locationHy : isRu ? selectedEvent.locationRu : selectedEvent.location}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={16} className="text-[#C45D3E]" />
                  {selectedEvent.host}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={16} className="text-[#C45D3E]" />
                  ${selectedEvent.price}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex-1 py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                {u.backBtn}
              </button>
              <button
                className="flex-1 py-3 rounded-full text-white font-medium transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #C45D3E, #D4A04A)" }}
              >
                {u.learnMore}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
