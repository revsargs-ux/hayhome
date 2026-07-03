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

export default function Map({ hosts, onHostClick, center, zoom }: MapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [allBookings, setAllBookings] = useState<{ hostId: string; checkIn: string; checkOut: string; status: string }[]>([]);
  useEffect(() => {
    fetch("/api/bookings/public")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAllBookings(data); })
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

          // 7-day availability computation for this host
          const todayNow = new Date(); todayNow.setHours(0, 0, 0, 0);
          const hostBookings = allBookings.filter(
            (b) => b.hostId === host.id && b.status !== "cancelled" && b.status !== "rejected"
          );
          const days7 = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(todayNow);
            d.setDate(d.getDate() + i);
            const booked = hostBookings.some((b) => {
              const ci = new Date(b.checkIn); ci.setHours(0, 0, 0, 0);
              const co = new Date(b.checkOut); co.setHours(0, 0, 0, 0);
              return d >= ci && d < co;
            });
            return { dayNum: d.getDate(), booked };
          });

          return (
            <Marker key={host.id} position={coords} icon={markerIcon}>
              <Popup>
                <div style={{ minWidth: "180px" }}>
                  {host.coverPhoto && (
                    <img
                      src={host.coverPhoto}
                      alt={host.familyName}
                      style={{
                        width: "100%",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    />
                  )}
                  <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px", color: "#1a1a1a" }}>
                    {host.familyName}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                    📍 {host.city}, {host.region}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px" }}>
                      {host.rating > 0 ? `⭐ ${host.rating}` : ""}
                    </span>
                    <span style={{ fontWeight: 700, color: "#D4001A", fontSize: "14px" }}>
                      ${host.pricePerNight}/night
                    </span>
                  </div>
                  {/* 7-day availability calendar */}
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ fontSize: "10px", color: "#888", marginBottom: "2px" }}>Ближайшие дни:
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
                      {days7.map((dinfo, i) => (
                        <div key={i} style={{
                          textAlign: "center",
                          fontSize: "9px",
                          padding: "3px 0",
                          borderRadius: "3px",
                          background: dinfo.booked ? "#ffd6d6" : "#d4f5d4",
                          color: dinfo.booked ? "#cc0000" : "#2a8c2a",
                          textDecoration: dinfo.booked ? "line-through" : "none",
                        }}>
                          {dinfo.dayNum}
                        </div>
                      ))}
                    </div>
                  </div>
                  <a
                    href={`/hosts/${host.id}`}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      background: "linear-gradient(135deg, #D4001A, #F2A900)",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Забронировать
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
        <GeolocationButton />
      </MapContainer>
    </div>
  );
}
