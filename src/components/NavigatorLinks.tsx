"use client";

interface NavigatorLinksProps {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  toName?: string;
  lang?: string;
}

export default function NavigatorLinks({ fromLat, fromLng, toLat, toLng, toName, lang = "en" }: NavigatorLinksProps) {
  const label = lang === "ru" ? "Открыть в навигаторе:" : lang === "hy" ? "Բացել նավիգատորում:" : lang === "fr" ? "Ouvrir dans:" : lang === "de" ? "Öffnen in:" : lang === "es" ? "Abrir en:" : lang === "it" ? "Apri in:" : lang === "ar" ? "افتح في:" : lang === "zh" ? "打开导航:" : lang === "fa" ? "باز کردن در:" : "Open in:";

  const providers = [
    {
      name: "Google Maps",
      icon: "🗺️",
      url: `https://www.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`,
      color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    },
    {
      name: "Yandex Maps",
      icon: "🧭",
      url: `https://yandex.ru/maps/?rtext=${fromLat},${fromLng}~${toLat},${toLng}&rtt=auto`,
      color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    },
    {
      name: "Apple Maps",
      icon: "🍎",
      url: `https://maps.apple.com/?daddr=${toLat},${toLng}&saddr=${fromLat},${fromLng}`,
      color: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
    },
    {
      name: "2GIS",
      icon: "📍",
      url: `https://2gis.ru/routeSearch/rsType/car/from/${fromLng},${fromLat}/to/${toLng},${toLat}`,
      color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {providers.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition ${p.color}`}
          >
            <span>{p.icon}</span>
            <span>{p.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
