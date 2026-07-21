"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Lazy-load leaflet only on client
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });

import "leaflet/dist/leaflet.css";
import L from "leaflet";

export interface RouteInfo {
  distance: number; // meters
  duration: number; // seconds
  geometry: { coordinates: [number, number][] }; // [lng, lat][]
}

interface RouteMapProps {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  fromLabel?: string;
  toLabel?: string;
  height?: number;
  lang?: string;
}

function createIcon(color: string, isDestination: boolean = false): L.DivIcon {
  const shape = isDestination
    ? "border-radius:50% 50% 50% 0;transform:rotate(-45deg)"
    : "border-radius:50%";
  return L.divIcon({
    className: "route-marker",
    html: `<div style="width:24px;height:24px;background:${color};border:2px solid #fff;${shape};box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, isDestination ? 24 : 12],
    popupAnchor: [0, isDestination ? -24 : -12],
  });
}

function createAirportIcon(): L.DivIcon {
  return L.divIcon({
    className: "airport-marker",
    html: `<div style="width:24px;height:24px;background:#FF9800;border:2px solid #fff;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;">✈️</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

const ROUTE_TEXTS: Record<string, Record<string, string>> = {
  routeUnavailable: {
    ru: "Автомобильный маршрут недоступен",
    en: "Driving route unavailable",
    hy: "Ավտոմոբիլային երթուղին հասանելի չէ",
    fr: "Itinéraire en voiture indisponible",
    de: "Fahrtroute nicht verfügbar",
    es: "Ruta en coche no disponible",
    it: "Percorso stradale non disponibile",
    ar: "المسار بالسيارة غير متاح",
    zh: "驾车路线不可用",
    fa: "مسیر رانندگی در دسترس نیست",
  },
  useNavigator: {
    ru: "Используйте навигатор ниже для построения маршрута",
    en: "Use the navigator links below for directions",
    hy: "Օգտագործեք նավարկիչի հղումները կողքում",
    fr: "Utilisez les liens de navigation ci-dessous",
    de: "Nutzen Sie die Navigationslinks unten",
    es: "Use los enlaces de navegación a continuación",
    it: "Usa i link di navigazione qui sotto",
    ar: "استخدم روابط التنقل أدناه",
    zh: "请使用下方的导航链接",
    fa: "از لینک‌های ناوبری زیر استفاده کنید",
  },
  calculating: {
    ru: "Расчёт маршрута...",
    en: "Calculating route...",
    hy: "Երթուղիի հաշվարկ...",
    fr: "Calcul de l'itinéraire...",
    de: "Route wird berechnet...",
    es: "Calculando ruta...",
    it: "Calcolo percorso...",
    ar: "حساب المسار...",
    zh: "正在计算路线...",
    fa: "در حال محاسبه مسیر...",
  },
  viaAirport: {
    ru: "Вы находитесь за рубежом. Маршрут: ближайший аэропорт → Звартноц → пункт назначения",
    en: "You are abroad. Route: nearest airport → Zvartnots → destination",
    hy: "Դուք արտասրահում եք։ Երթուղի՝ մոտական օդանավ → Զվարթնոց → նպատակ",
    fr: "Vous êtes à l'étranger. Itinéraire: aéroport le plus proche → Zvartnots → destination",
    de: "Sie sind im Ausland. Route: nächster Flughafen → Zvartnots → Ziel",
    es: "Estás en el extranjero. Ruta: aeropuerto más cercano → Zvartnots → destino",
    it: "Sei all'estero. Percorso: aeroporto più vicino → Zvartnots → destinazione",
    ar: "أنت في الخارج. المسار: أقرب مطار → زفارتنوتس → الوجهة",
    zh: "您在境外。路线：最近机场 → 兹瓦尔特诺茨 → 目的地",
    fa: "شما خارج از کشور هستید. مسیر: نزدیک‌ترین فرودگاه → زوارتنوز → مقصد",
  },
  localRoute: {
    ru: "Маршрут по Армении",
    en: "Route within Armenia",
    hy: "Երթուղիը Հայաստանում",
    fr: "Itinéraire en Arménie",
    de: "Route in Armenien",
    es: "Ruta en Armenia",
    it: "Percorso in Armenia",
    ar: "مسار في أرمينيا",
    zh: "亚美尼亚境内路线",
    fa: "مسیر در ارمنستان",
  },
  domesticRoute: {
    ru: "Внутри страны: от вашего местоположения до пункта назначения",
    en: "Domestic: from your location to destination",
    hy: "Երկրի ներսքում՝ ձեր գտնվելու վայրից նպատակ",
    fr: "National: de votre position à la destination",
    de: "Inland: von Ihrem Standort zum Ziel",
    es: "Nacional: de tu ubicación al destino",
    it: "Nazionale: dalla tua posizione alla destinazione",
    ar: "محلي: من موقعك إلى الوجهة",
    zh: "国内：从您的位置到目的地",
    fa: "داخلی: از مکان شما تا مقصد",
  },
  internationalFlight: {
    ru: "Международный перелёт",
    en: "International flight",
    hy: "Միջազգային թիռ",
    fr: "Vol international",
    de: "Internationaler Flug",
    es: "Vuelo internacional",
    it: "Volo internazionale",
    ar: "رحلة دولية",
    zh: "国际航班",
    fa: "پرواز بین‌المللی",
  },
  leg1: {
    ru: "Этап 1: До аэропорта вылета",
    en: "Leg 1: To departure airport",
    hy: "Մաս 1. Մինչև օդանավ",
    fr: "Étape 1: Vers l'aéroport de départ",
    de: "Teil 1: Zum Abflughafen",
    es: "Etapa 1: Al aeropuerto de salida",
    it: "Tappa 1: All'aeroporto di partenza",
    ar: "المرحلة 1: إلى مطار المغادرة",
    zh: "第一段：到出发机场",
    fa: "مرحله ۱: تا فرودگاه رفت",
  },
  leg2: {
    ru: "Этап 2: Звартноц → пункт назначения",
    en: "Leg 2: Zvartnots → destination",
    hy: "Մաս 2. Զվարթնոց → նպատակ",
    fr: "Étape 2: Zvartnots → destination",
    de: "Teil 2: Zvartnots → Ziel",
    es: "Etapa 2: Zvartnots → destino",
    it: "Tappa 2: Zvartnots → destinazione",
    ar: "المرحلة 2: زفارتنوتس → الوجهة",
    zh: "第二段：兹瓦尔特诺茨 → 目的地",
    fa: "مرحله ۲: زوارتنوز → مقصد",
  },
  zvartnotsAirport: {
    ru: "Аэропорт Звартноц, Эчмиадзин",
    en: "Zvartnots Airport, Vagharshapat",
    hy: "Զվարթնոցի միջազգային օդանավական, Վաղարշապատ",
    fr: "Aéroport Zvartnots, Echmiadzin",
    de: "Flughafen Zvartnots, Etschmiadsin",
    es: "Aeropuerto Zvartnots, Echmiadzin",
    it: "Aeroporto Zvartnots, Echmiadzin",
    ar: "مطار زفارتنوتس، إشميادزين",
    zh: "兹瓦尔特诺茨机场，埃奇米亚津",
    fa: "فرودگاه زوارتنوز، واگارشاپات",
  },
  nearestAirport: {
    ru: "Ближайший аэропорт",
    en: "Nearest airport",
    hy: "Մոտական օդանավ",
    fr: "Aéroport le plus proche",
    de: "Nächster Flughafen",
    es: "Aeropuerto más cercano",
    it: "Aeroporto più vicino",
    ar: "أقرب مطار",
    zh: "最近机场",
    fa: "نزدیک‌ترین فرودگاه",
  },
};

// Zvartnots Airport coordinates (Vagharshapat/Edjmiatsin, Armenia)
export const ZVARTNOTS = { lat: 40.1461, lng: 44.4035 };

// Armenia bounding box (approximate)
const ARMENIA_BOUNDS = {
  minLat: 38.84,
  maxLat: 41.31,
  minLng: 43.45,
  maxLng: 46.63,
};

export function isUserInArmenia(lat: number, lng: number): boolean {
  return (
    lat >= ARMENIA_BOUNDS.minLat && lat <= ARMENIA_BOUNDS.maxLat &&
    lng >= ARMENIA_BOUNDS.minLng && lng <= ARMENIA_BOUNDS.maxLng
  );
}

// Calculate distance between two points in km (Haversine)
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Find the nearest airport from a pre-defined list of major world airports
export function findNearestAirport(lat: number, lng: number): { name: string; lat: number; lng: number; code: string } {
  const airports: { name: string; lat: number; lng: number; code: string }[] = [
    // Europe
    { name: "Sheremetyevo, Moscow", lat: 55.9736, lng: 37.4125, code: "SVO" },
    { name: "Domodedovo, Moscow", lat: 55.4087, lng: 37.9063, code: "DME" },
    { name: "Vnukovo, Moscow", lat: 55.6528, lng: 37.2764, code: "VKO" },
    { name: "Pulkovo, Saint Petersburg", lat: 59.8003, lng: 30.3128, code: "LED" },
    { name: "Charles de Gaulle, Paris", lat: 49.0097, lng: 2.5479, code: "CDG" },
    { name: "Orly, Paris", lat: 48.7262, lng: 2.3597, code: "ORY" },
    { name: "Heathrow, London", lat: 51.4700, lng: -0.4543, code: "LHR" },
    { name: "Gatwick, London", lat: 51.1537, lng: -0.1828, code: "LGW" },
    { name: "Frankfurt, Germany", lat: 50.0379, lng: 8.5622, code: "FRA" },
    { name: "Munich, Germany", lat: 48.3538, lng: 11.7861, code: "MUC" },
    { name: "Fiumicino, Rome", lat: 41.8003, lng: 12.2389, code: "FCO" },
    { name: "Malpensa, Milan", lat: 45.6311, lng: 8.7129, code: "MXP" },
    { name: "Barcelona-El Prat", lat: 41.2974, lng: 2.0833, code: "BCN" },
    { name: "Adolfo Suárez Madrid-Barajas", lat: 40.4983, lng: -3.5676, code: "MAD" },
    { name: "Schiphol, Amsterdam", lat: 52.3105, lng: 4.7683, code: "AMS" },
    { name: "Brussels Airport", lat: 50.9014, lng: 4.4844, code: "BRU" },
    { name: "Vienna, Austria", lat: 48.1103, lng: 16.5697, code: "VIE" },
    { name: "Zurich, Switzerland", lat: 47.4647, lng: 8.5492, code: "ZRH" },
    { name: "Geneva, Switzerland", lat: 46.2381, lng: 6.1081, code: "GVA" },
    { name: "Copenhagen", lat: 55.6181, lng: 12.6561, code: "CPH" },
    { name: "Stockholm Arlanda", lat: 59.6519, lng: 17.9186, code: "ARN" },
    { name: "Oslo Gardermoen", lat: 60.1976, lng: 11.1004, code: "OSL" },
    { name: "Helsinki-Vantaa", lat: 60.3172, lng: 24.9633, code: "HEL" },
    { name: "Lisbon", lat: 38.7683, lng: -9.1345, code: "LIS" },
    { name: "Porto", lat: 41.2442, lng: -8.6780, code: "OPO" },
    { name: "Dublin", lat: 53.4213, lng: -6.2701, code: "DUB" },
    { name: "Warsaw Chopin", lat: 52.1673, lng: 20.9672, code: "WAW" },
    { name: "Prague Václav Havel", lat: 50.1008, lng: 14.4441, code: "PRG" },
    { name: "Budapest Ferenc Liszt", lat: 47.4336, lng: 19.2598, code: "BUD" },
    { name: "Bucharest Henri Coandă", lat: 44.5711, lng: 26.0850, code: "OTP" },
    { name: "Sofia", lat: 42.6976, lng: 23.3219, code: "SOF" },
    { name: "Belgrade Nikola Tesla", lat: 44.8186, lng: 20.3091, code: "BEG" },
    { name: "Zagreb Franjo Tuđman", lat: 45.7429, lng: 16.0689, code: "ZAG" },
    { name: "Athens Eleftherios Venizelos", lat: 37.9355, lng: 23.9441, code: "ATH" },
    { name: "Thessaloniki", lat: 40.5218, lng: 22.9714, code: "SKG" },
    // Turkey
    { name: "Istanbul Airport", lat: 41.2753, lng: 28.7519, code: "IST" },
    { name: "Sabiha Gökçen, Istanbul", lat: 40.8985, lng: 29.2483, code: "SAW" },
    { name: "Antalya Airport", lat: 36.8987, lng: 30.8007, code: "AYT" },
    // Middle East
    { name: "Dubai International", lat: 25.2532, lng: 55.3657, code: "DXB" },
    { name: "Abu Dhabi International", lat: 24.4330, lng: 54.6511, code: "AUH" },
    { name: "Tel Aviv Ben Gurion", lat: 32.0004, lng: 34.8704, code: "TLV" },
    { name: "Amman Queen Alia", lat: 31.7225, lng: 35.9961, code: "AMM" },
    { name: "Beirut Rafic Hariri", lat: 33.8272, lng: 35.4522, code: "BEY" },
    { name: "Baghdad International", lat: 33.2625, lng: 44.2342, code: "BGW" },
    { name: "Tehran Imam Khomeini", lat: 35.4161, lng: 51.1522, code: "IKA" },
    { name: "Doha Hamad", lat: 25.2731, lng: 51.6081, code: "DOH" },
    // Caucasus / Central Asia
    { name: "Tbilisi Shota Rustaveli", lat: 41.6744, lng: 44.5950, code: "TBS" },
    { name: "Batumi International", lat: 41.6089, lng: 41.5878, code: "BUS" },
    { name: "Baku Heydar Aliyev", lat: 40.4675, lng: 50.0558, code: "GYD" },
    // Russia (more)
    { name: "Krasnodar Pashkovsky", lat: 45.0349, lng: 39.1706, code: "KRR" },
    { name: "Sochi International", lat: 43.4494, lng: 39.9561, code: "AER" },
    { name: "Mineralnye Vody", lat: 44.2275, lng: 43.0717, code: "MRV" },
    { name: "Kazan", lat: 55.6061, lng: 49.2787, code: "KZN" },
    { name: "Yekaterinburg Koltsovo", lat: 56.7348, lng: 60.8025, code: "SVX" },
    { name: "Novosibirsk Tolmachevo", lat: 55.0097, lng: 82.6506, code: "OVB" },
    { name: "Vladivostok", lat: 43.3892, lng: 131.9842, code: "VVO" },
    // Ukraine
    { name: "Boryspil, Kyiv", lat: 50.3451, lng: 30.8947, code: "KBP" },
    { name: "Lviv Danylo Halytskyi", lat: 49.8081, lng: 23.9597, code: "LWO" },
    // Americas
    { name: "JFK, New York", lat: 40.6413, lng: -73.7781, code: "JFK" },
    { name: "Newark Liberty, New York", lat: 40.6895, lng: -74.1745, code: "EWR" },
    { name: "LAX, Los Angeles", lat: 33.9425, lng: -118.4081, code: "LAX" },
    { name: "O'Hare, Chicago", lat: 41.9742, lng: -87.9073, code: "ORD" },
    { name: "SFO, San Francisco", lat: 37.6213, lng: -122.3790, code: "SFO" },
    { name: "Miami International", lat: 25.7959, lng: -80.2870, code: "MIA" },
    { name: "Toronto Pearson", lat: 43.6777, lng: -79.6248, code: "YYZ" },
    { name: "Mexico City", lat: 19.4363, lng: -99.0721, code: "MEX" },
    { name: "São Paulo Guarulhos", lat: 23.4356, lng: -46.4731, code: "GRU" },
    { name: "Buenos Aires Ezeiza", lat: -34.8222, lng: -58.5358, code: "EZE" },
    { name: "Bogotá El Dorado", lat: 4.7016, lng: -74.1469, code: "BOG" },
    { name: "Lima Jorge Chávez", lat: -12.0219, lng: -77.1143, code: "LIM" },
    // Asia
    { name: "Beijing Capital", lat: 40.0799, lng: 116.6031, code: "PEK" },
    { name: "Shanghai Pudong", lat: 31.1443, lng: 121.8083, code: "PVG" },
    { name: "Tokyo Haneda", lat: 35.5494, lng: 139.7798, code: "HND" },
    { name: "Tokyo Narita", lat: 35.7647, lng: 140.3864, code: "NRT" },
    { name: "Incheon, Seoul", lat: 37.4602, lng: 126.4407, code: "ICN" },
    { name: "Suvarnabhumi, Bangkok", lat: 13.6900, lng: 100.7501, code: "BKK" },
    { name: "Changi, Singapore", lat: 1.3644, lng: 103.9915, code: "SIN" },
    { name: "KLIA, Kuala Lumpur", lat: 2.7456, lng: 101.7099, code: "KUL" },
    { name: "Indira Gandhi, Delhi", lat: 28.5562, lng: 77.1000, code: "DEL" },
    { name: "Chhatrapati Shivaji, Mumbai", lat: 19.0896, lng: 72.8656, code: "BOM" },
    { name: "Ninoy Aquino, Manila", lat: 14.5086, lng: 121.0198, code: "MNL" },
    { name: "Soekarno-Hatta, Jakarta", lat: -6.1256, lng: 106.6558, code: "CGK" },
    { name: "Ngurah Rai, Bali", lat: -8.7467, lng: 115.1672, code: "DPS" },
    // Africa
    { name: "Cairo International", lat: 30.1219, lng: 31.4056, code: "CAI" },
    { name: "Cape Town International", lat: -33.9714, lng: 18.6019, code: "CPT" },
    { name: "O.R. Tambo, Johannesburg", lat: -26.1392, lng: 28.2460, code: "JNB" },
    { name: "Marrakech Menara", lat: 31.6068, lng: -8.0363, code: "RAK" },
    { name: "CasaBlanca Mohammed V", lat: 33.3675, lng: -7.5898, code: "CMN" },
  ];

  let nearest = airports[0];
  let minDist = Infinity;
  for (const apt of airports) {
    const d = haversineKm(lat, lng, apt.lat, apt.lng);
    if (d < minDist) {
      minDist = d;
      nearest = apt;
    }
  }
  return nearest;
}

async function fetchOSRMRoute(fromLng: number, fromLat: number, toLng: number, toLat: number): Promise<RouteInfo | null> {
  try {
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`);
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      return {
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
        geometry: data.routes[0].geometry,
      };
    }
  } catch {
    // ignore
  }
  return null;
}

export default function RouteMap({ fromLat, fromLng, toLat, toLng, fromLabel, toLabel, height = 300, lang = "ru" }: RouteMapProps) {
  const [route1, setRoute1] = useState<RouteInfo | null>(null);
  const [route2, setRoute2] = useState<RouteInfo | null>(null);
  const [route1Error, setRoute1Error] = useState(false);
  const [route2Error, setRoute2Error] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [routeMode, setRouteMode] = useState<"local" | "international">("local");
  const [nearestAirport, setNearestAirport] = useState<{ name: string; lat: number; lng: number; code: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Detect if user is in Armenia
    if (isUserInArmenia(fromLat, fromLng)) {
      setRouteMode("local");
      // Single route: GPS → destination
      setRoute1(null);
      setRoute2(null);
      setRoute1Error(false);
      setRoute2Error(false);
      fetchOSRMRoute(fromLng, fromLat, toLng, toLat).then(r => {
        if (r) setRoute1(r); else setRoute1Error(true);
      });
    } else {
      setRouteMode("international");
      const apt = findNearestAirport(fromLat, fromLng);
      setNearestAirport(apt);

      // Route 1: user GPS → nearest airport (skip if very close < 5km)
      const distToAirport = haversineKm(fromLat, fromLng, apt.lat, apt.lng);
      if (distToAirport < 5) {
        setRoute1(null); // Already at airport
      } else {
        fetchOSRMRoute(fromLng, fromLat, apt.lng, apt.lat).then(r => {
          if (r) setRoute1(r); else setRoute1Error(true);
        });
      }

      // Route 2: Zvartnots → destination
      fetchOSRMRoute(ZVARTNOTS.lng, ZVARTNOTS.lat, toLng, toLat).then(r => {
        if (r) setRoute2(r); else setRoute2Error(true);
      });
    }
  }, [fromLat, fromLng, toLat, toLng, mounted]);

  const t = (key: string) => ROUTE_TEXTS[key]?.[lang] || ROUTE_TEXTS[key]?.en || key;

  if (!mounted) {
    return (
      <div className="w-full rounded-2xl bg-gray-100 flex items-center justify-center" style={{ height }}>
        <div className="w-8 h-8 border-3 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  const formatDistance = (m: number): string => {
    if (m < 1000) return `${Math.round(m)} m`;
    return `${(m / 1000).toFixed(1)} km`;
  };

  const formatDuration = (s: number): string => {
    const h = Math.floor(s / 3600);
    const m = Math.round((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}min`;
    return `${m} min`;
  };

  // ── LOCAL MODE: GPS → destination (within Armenia) ──
  if (routeMode === "local") {
    const routeCoords: [number, number][] = route1
      ? route1.geometry.coordinates.map(([lng, lat]) => [lat, lng])
      : [];

    const dist = Math.sqrt(Math.pow(toLat - fromLat, 2) + Math.pow(toLng - fromLng, 2));
    const zoom = dist > 5 ? 7 : dist > 2 ? 9 : dist > 1 ? 11 : 13;
    const center: [number, number] = [(fromLat + toLat) / 2, (fromLng + toLng) / 2];

    return (
      <div className="w-full">
        <div className="text-xs text-green-600 font-medium mb-1 flex items-center gap-1">🚗 {t("domesticRoute")}</div>
        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm" style={{ height }}>
          <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "100%", zIndex: 1 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[fromLat, fromLng]} icon={createIcon("#2196F3", false)}>
              {fromLabel && <Popup>{fromLabel}</Popup>}
            </Marker>
            <Marker position={[toLat, toLng]} icon={createIcon("#D4001A", true)}>
              {toLabel && <Popup>{toLabel}</Popup>}
            </Marker>
            {routeCoords.length > 0 && (
              <Polyline positions={routeCoords} pathOptions={{ color: "#D4001A", weight: 4, opacity: 0.7, dashArray: "8 6" }} />
            )}
          </MapContainer>
        </div>
        {route1 ? (
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-gray-600">📏 {formatDistance(route1.distance)}</span>
            <span className="text-gray-600">⏱️ {formatDuration(route1.duration)}</span>
          </div>
        ) : route1Error ? (
          <div className="mt-2">
            <p className="text-xs text-gray-500 flex items-center gap-1">⚠️ {t("routeUnavailable")}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t("useNavigator")}</p>
          </div>
        ) : (
          <p className="text-xs text-gray-400 mt-1">{t("calculating")}</p>
        )}
      </div>
    );
  }

  // ── INTERNATIONAL MODE: nearest airport → Zvartnots → destination ──
  const apt = nearestAirport || findNearestAirport(fromLat, fromLng);
  const route2Coords: [number, number][] = route2
    ? route2.geometry.coordinates.map(([lng, lat]) => [lat, lng])
    : [];

  // Show map centered on Armenia (Zvartnots → destination)
  const armCenter: [number, number] = [(ZVARTNOTS.lat + toLat) / 2, (ZVARTNOTS.lng + toLng) / 2];
  const armDist = Math.sqrt(Math.pow(toLat - ZVARTNOTS.lat, 2) + Math.pow(toLng - ZVARTNOTS.lng, 2));
  const armZoom = armDist > 5 ? 7 : armDist > 2 ? 9 : armDist > 1 ? 11 : 13;

  const distToAirport = haversineKm(fromLat, fromLng, apt.lat, apt.lng);
  const showLeg1 = distToAirport >= 5 && route1 && route1.distance < 50000; // Only show if < 50km, skip if user is already at airport

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-xs text-blue-600 font-medium mb-1 flex items-center gap-1">✈️ {t("viaAirport")}</div>

      {/* Leg 1: GPS → nearest airport (only if meaningful distance) */}
      {showLeg1 && route1 && (
        <div className="mb-2">
          <div className="text-[10px] text-gray-500 font-medium mb-0.5">{t("leg1")}: {apt.name} ({apt.code})</div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>📏 {formatDistance(route1.distance)}</span>
            <span>⏱️ {formatDuration(route1.duration)}</span>
          </div>
        </div>
      )}

      {/* Flight indicator */}
      {showLeg1 && (
        <div className="flex items-center gap-2 my-2 text-xs text-gray-400">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="flex items-center gap-1">✈️ {t("internationalFlight")}</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      )}

      {/* Leg 2: Zvartnots → destination */}
      <div className="text-[10px] text-orange-600 font-medium mb-1">{t("leg2")}: {t("zvartnotsAirport")}</div>

      <div className="relative w-full rounded-2xl overflow-hidden shadow-sm" style={{ height }}>
        <MapContainer
          center={armCenter}
          zoom={armZoom}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%", zIndex: 1 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Zvartnots marker */}
          <Marker position={[ZVARTNOTS.lat, ZVARTNOTS.lng]} icon={createAirportIcon()}>
            <Popup>✈️ {t("zvartnotsAirport")}</Popup>
          </Marker>
          {/* Destination marker */}
          <Marker position={[toLat, toLng]} icon={createIcon("#D4001A", true)}>
            {toLabel && <Popup>{toLabel}</Popup>}
          </Marker>
          {/* Route: Zvartnots → destination */}
          {route2Coords.length > 0 && (
            <Polyline positions={route2Coords} pathOptions={{ color: "#D4001A", weight: 4, opacity: 0.7, dashArray: "8 6" }} />
          )}
        </MapContainer>
      </div>

      {route2 ? (
        <div className="flex items-center gap-4 mt-2 text-sm">
          <span className="text-gray-600">📏 {formatDistance(route2.distance)}</span>
          <span className="text-gray-600">⏱️ {formatDuration(route2.duration)}</span>
        </div>
      ) : route2Error ? (
        <div className="mt-2">
          <p className="text-xs text-gray-500 flex items-center gap-1">⚠️ {t("routeUnavailable")}</p>
          <p className="text-xs text-gray-400 mt-0.5">{t("useNavigator")}</p>
        </div>
      ) : (
        <p className="text-xs text-gray-400 mt-1">{t("calculating")}</p>
      )}
    </div>
  );
}
