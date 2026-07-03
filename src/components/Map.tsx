"use client";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Host } from "@/lib/types";

// Armenian city → coordinates lookup
export const CITY_COORDS: Record<string, [number, number]> = {
  "Ереван": [40.1792, 44.4991],
  "Yerevan": [40.1792, 44.4991],
  "Gyumri": [40.7860, 43.8453],
  "Гюмри": [40.7860, 43.8453],
  "Dilijan": [40.7392, 44.8560],
  "Дилижан": [40.7392, 44.8560],
  "Vanadzor": [40.8106, 44.4836],
  "Ванадзор": [40.8106, 44.4836],
  "Tsaghkadzor": [40.5539, 44.7087],
  "Цахкадзор": [40.5539, 44.7087],
  "Sevan": [40.3404, 44.9591],
  "Севан": [40.3404, 44.9591],
  "Goris": [39.5089, 46.2329],
  "Горис": [39.5089, 46.2329],
  "Jermuk": [39.8433, 43.7023],
  "Джермук": [39.8433, 43.7023],
};

// Region fallback coordinates
export const REGION_COORDS: Record<string, [number, number]> = {
  "Ереван": [40.1792, 44.4991],
  "Ширак": [40.7860, 43.8453],
  "Тавуш": [40.7392, 44.8560],
  "Лори": [40.8106, 44.4836],
  "Котайк": [40.5539, 44.7087],
  "Гегаркуник": [40.3404, 44.9591],
  "Сюник": [39.5089, 46.2329],
  "Вайоц Дзор": [39.8433, 43.7023],
  "Арагацотн": [40.3167, 44.3833],
  "Арарат": [40.0167, 44.5667],
};

// Exported city coordinate lookup for reuse
export function getCityCoords(cityName: string): { lat: number; lng: number } {
  const cityKey = Object.keys(CITY_COORDS).find(
    (k) => k.toLowerCase() === cityName.toLowerCase()
  );
  if (cityKey) {
    const [lat, lng] = CITY_COORDS[cityKey];
    return { lat, lng };
  }
  // Default: Yerevan
  return { lat: 40.1792, lng: 44.4991 };
}

function getHostCoords(host: Host): [number, number] {
  const cityKey = Object.keys(CITY_COORDS).find(
    (k) => host.city.toLowerCase() === k.toLowerCase()
  );
  if (cityKey) {
    const [lat, lng] = CITY_COORDS[cityKey];
    // Add small randomness so markers don't overlap
    return [lat + (Math.random() - 0.5) * 0.02, lng + (Math.random() - 0.5) * 0.02];
  }
  const regionKey = Object.keys(REGION_COORDS).find(
    (k) => host.region.toLowerCase() === k.toLowerCase()
  );
  if (regionKey) {
    const [lat, lng] = REGION_COORDS[regionKey];
    return [lat + (Math.random() - 0.5) * 0.02, lng + (Math.random() - 0.5) * 0.02];
  }
  // Default: Yerevan
  return [40.1792 + (Math.random() - 0.5) * 0.02, 44.4991 + (Math.random() - 0.5) * 0.02];
}

// Custom marker icon using divIcon
function createMarkerIcon(): L.DivIcon {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#D4001A,#F2A900);border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

// Geolocation button component
function GeolocationButton() {
  const map = useMap();
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        map.flyTo(coords, 12, { duration: 1.5 });
      },
      () => {
        // Permission denied or error — silently ignore
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <>
      <button
        onClick={handleLocate}
        className="absolute right-3 top-3 z-[1000] bg-white rounded-lg shadow-md p-2 hover:bg-gray-50 transition"
        title="My location"
        style={{ border: "2px solid rgba(0,0,0,0.1)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4001A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" fill="#2196F3" stroke="#fff" strokeWidth="2" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
        </svg>
      </button>
      {userPos && (
        <Marker
          position={userPos}
          icon={L.divIcon({
            className: "user-location-marker",
            html: `<div style="width:16px;height:16px;background:#2196F3;border:3px solid #fff;border-radius:50%;box-shadow:0 0 8px rgba(33,150,243,0.6);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })}
        >
          <Popup>You are here</Popup>
        </Marker>
      )}
    </>
  );
}

export interface MapHost {
  id: string;
  familyName: string;
  city: string;
  region: string;
  coverPhoto: string;
  pricePerNight: number;
  rating: number;
  stars: number;
}

interface MapProps {
  hosts: Host[];
  onHostClick?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
}

/* Generate calendar HTML string for Leaflet popup (no React) */
function calendarHTML(booked: Set<string>): string {
  const today = new Date();
  const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  let cells = "";
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().substring(0, 10);
    const booked_str = booked.has(dateStr);
    cells += `<div style="text-align:center;border-radius:6px;padding:2px 0;background:${booked_str ? "#fef2f2" : "#f0fdf4"};border:1px solid ${booked_str ? "#fecaca" : "#bbf7d0"}">
      <div style="font-size:8px;color:#999">${dayNames[d.getDay()]}</div>
      <div style="font-size:11px;font-weight:700;color:${booked_str ? "#ef4444" : "#16a34a"};${booked_str ? "text-decoration:line-through" : ""}">${d.getDate()}</div>
    </div>`;
  }
  return `<div style="margin-top:8px"><div style="font-size:10px;font-weight:600;color:#666;margin-bottom:4px">📅 Занятость на 7 дней</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">${cells}</div></div>`;
}

export default function Map({ hosts, onHostClick, center, zoom }: MapProps) {
  const [mounted, setMounted] = useState(false);
  const [allBookings, setAllBookings] = useState<any[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/api/bookings/public")
      .then((r) => r.ok ? r.json() : [])
      .then((data: any[]) => setAllBookings(data || []))
      .catch(() => {});
  }, []);

  const mapHosts: MapHost[] = hosts.map((h) => ({
    id: h.id,
    familyName: h.familyName,
    city: h.city,
    region: h.region,
    coverPhoto: h.coverPhoto,
    pricePerNight: h.pricePerNight,
    rating: h.rating,
    stars: h.stars,
  }));

  const defaultCenter: [number, number] = center || [40.1792, 44.4991];
  const defaultZoom = zoom || 8;

  if (!mounted) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-2xl">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  const markerIcon = createMarkerIcon();

  // Pre-compute booked dates per host
  const BOOKED_STATUSES = ["confirmed", "completed", "pending"];
  function buildHostBookedMap(bookings: any[]): Record<string, Set<string>> {
    const map: Record<string, Set<string>> = {};
    bookings.forEach((b) => {
      if (!b.hostId || !BOOKED_STATUSES.includes(b.status)) return;
      if (!map[b.hostId]) map[b.hostId] = new Set<string>();
      const dates = map[b.hostId];
      let d = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      while (d < end) {
        const iso = d.toISOString();
        dates.add(iso.substring(0, 10));
        d.setDate(d.getDate() + 1);
      }
    });
    return map;
  }
  const hostBookedMap = buildHostBookedMap(allBookings);
  const EMPTY_SET = new Set<string>();

  return (
    <div className="relative w-full min-h-[400px] rounded-2xl overflow-hidden shadow-sm">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "500px", zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {mapHosts.map((host) => {
          const fullHost = hosts.find((h) => h.id === host.id);
          if (!fullHost) return null;
          const coords = getHostCoords(fullHost);
          const booked = hostBookedMap[host.id] || EMPTY_SET;
          const popupContent = (function() {
            const cal = calendarHTML(booked);
            const photo = host.coverPhoto
              ? '<img src="' + host.coverPhoto + '" alt="' + host.familyName + '" style="width:100%;height:80px;object-fit:cover;border-radius:8px;margin-bottom:8px" />'
              : '';
            const rating = host.rating > 0 ? '⭐ ' + host.rating : '';
            return '<div style="min-width:180px">' + photo +
              '<div style="font-weight:700;font-size:14px;margin-bottom:4px;color:#1a1a1a">' + host.familyName + '</div>' +
              '<div style="font-size:12px;color:#666;margin-bottom:4px">📍 ' + host.city + ', ' + host.region + '</div>' +
              '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
                '<span style="font-size:12px">' + rating + '</span>' +
                '<span style="font-weight:700;color:#D4001A;font-size:14px">$' + host.pricePerNight + '/night</span></div>' +
              cal +
              '<a href="/hosts/' + host.id + '" style="display:block;text-align:center;padding:6px 12px;border-radius:20px;background:linear-gradient(135deg,#D4001A,#F2A900);color:#fff;font-size:13px;font-weight:600;text-decoration:none;margin-top:8px">Открыть профиль</a>' +
              '</div>';
          })();
          return (
            <Marker key={host.id} position={coords} icon={markerIcon} eventHandlers={{ click: () => { window.location.href = '/hosts/' + host.id; } }}>
              <Popup><div dangerouslySetInnerHTML={{ __html: popupContent }} /></Popup>
            </Marker>
          );
        })}
        <GeolocationButton />
      </MapContainer>
    </div>
  );
}
