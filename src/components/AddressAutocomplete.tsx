"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { reverseGeocode } from "@/lib/geo";

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  address?: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSelect?: (result: NominatimResult) => void;
  onCityDetected?: (city: string, region: string, country: string) => void;
}

export default function AddressAutocomplete({ value, onChange, placeholder, onSelect, onCityDetected }: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced search — triggers at 3+ characters
  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&accept-language=ru,en,hy&addressdetails=1`,
          { headers: { "Accept-Language": "ru,en,hy" } }
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInput = (val: string) => {
    setQuery(val);
    onChange(val);
    setOpen(true);
    search(val);
  };

  const handleSelect = (result: NominatimResult) => {
    const parts = result.display_name.split(", ");
    const short = parts.length > 2 ? parts.slice(0, 3).join(", ") : result.display_name;
    setQuery(short);
    onChange(short);
    setOpen(false);
    onSelect?.(result);

    // Extract and propagate city info
    const addr = result.address;
    if (addr && onCityDetected) {
      const city = addr.city || addr.town || addr.village || "";
      const region = addr.state || "";
      const country = addr.country || "";
      if (city) onCityDetected(city, region, country);
    }
  };

  // Reverse geocode from GPS coordinates
  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          if (geo.city) {
            const displayVal = [geo.city, geo.region, geo.country].filter(Boolean).join(", ");
            setQuery(displayVal);
            onChange(displayVal);
            onCityDetected?.(geo.city, geo.region, geo.country);
          }
        } catch {
          // silently fail
        }
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const formatResult = (result: NominatimResult): { address: string; city: string; country: string } => {
    const parts = result.display_name.split(", ");
    const addr = result.address;
    const road = addr?.road ? `${addr.road}${addr.house_number ? ", " + addr.house_number : ""}` : parts[0] || "";
    const city = addr?.city || addr?.town || addr?.village || addr?.state || parts[1] || "";
    const country = addr?.country || parts[parts.length - 1] || "";
    return { address: road, city, country };
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder={placeholder || ""}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={handleGeolocate}
          className="flex-shrink-0 px-3 py-3 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-300 transition"
          title="GPS"
        >
          📍
        </button>
      </div>
      {loading && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
        </div>
      )}
      {open && results.length > 0 && (
        <div className="absolute z-[2000] mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 max-h-72 overflow-y-auto">
          {results.map((r) => {
            const { address, city, country } = formatResult(r);
            return (
              <button
                key={r.place_id}
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition"
              >
                <div className="text-sm font-medium text-gray-900">{address}</div>
                <div className="text-xs text-gray-500">
                  {[city, country].filter(Boolean).join(", ")}
                </div>
              </button>
            );
          })}
          <div className="px-4 py-2 text-[10px] text-gray-300 bg-gray-50 rounded-b-xl">
            <a href="https://nominatim.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              © OpenStreetMap (Nominatim)
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
