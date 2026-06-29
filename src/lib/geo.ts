// Reverse geocoding via Nominatim (OpenStreetMap)
// Rate limited: max 1 req/sec — results cached with TTL

export interface GeoResult {
  city: string;
  region: string;
  country: string;
}

const cache = new Map<string, { data: GeoResult; expires: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Reverse geocode coordinates → city, region, country.
 * Uses Nominatim reverse API. Results cached for 10 min.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeoResult> {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru,en`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "ru,en", "User-Agent": "HayHome/1.0 (hay-home.com)" },
  });
  if (!res.ok) {
    throw new Error(`Reverse geocoding failed: ${res.status}`);
  }
  const data = await res.json();
  const addr = data.address || {};

  const result: GeoResult = {
    city: addr.city || addr.town || addr.village || addr.municipality || addr.county || "",
    region: addr.state || addr.region || "",
    country: addr.country || "",
  };

  cache.set(key, { data: result, expires: Date.now() + CACHE_TTL });
  return result;
}
