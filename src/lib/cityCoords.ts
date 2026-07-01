// City coordinates — standalone module (no leaflet dependency, SSR-safe)

export const CITY_COORDS: Record<string, [number, number]> = {
  "Ереван": [40.1792, 44.4991],
  "Yerevan": [40.1792, 44.4991],
  "Гюмри": [40.7942, 43.8453],
  "Gyumri": [40.7942, 43.8453],
  "Ванадзор": [40.8106, 44.4836],
  "Vanadzor": [40.8106, 44.4836],
  "Tsaghkadzor": [40.5539, 44.7087],
  "Цахкадзор": [40.5539, 44.7087],
  "Дилижан": [40.7419, 44.8628],
  "Dilijan": [40.7419, 44.8628],
  "Севан": [40.5547, 44.9444],
  "Sevan": [40.5547, 44.9444],
  "Горис": [39.5117, 46.3447],
  "Jermuk": [39.8389, 45.1675],
  "Джермук": [39.8389, 45.1675],
  "Тбилиси": [41.7151, 44.8271],
  "Tbilisi": [41.7151, 44.8271],
};

export function getCityCoords(cityName: string): { lat: number; lng: number } {
  const cityKey = Object.keys(CITY_COORDS).find(
    (k) => k.toLowerCase() === (cityName || "").toLowerCase()
  );
  if (cityKey) {
    const [lat, lng] = CITY_COORDS[cityKey];
    return { lat, lng };
  }
  return { lat: 40.1792, lng: 44.4991 }; // Default: Yerevan
}
