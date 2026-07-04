"use client";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Service } from "@/lib/types";

export const SERVICE_REGION_COORDS: Record<string, [number, number]> = {
  "Yerevan": [40.1792, 44.4991],
  "Kotayk": [40.5539, 44.7087],
  "Tavush": [40.7392, 44.8560],
  "Gegharkunik": [40.3404, 44.9591],
  "Lori": [40.8106, 44.4836],
  "Shirak": [40.7860, 43.8453],
  "Aragatsotn": [40.3167, 44.3833],
  "Armavir": [40.0167, 44.5667],
  "Ararat": [40.0167, 44.5667],
  "Syunik": [39.5089, 46.2329],
  "Vayots Dzor": [39.8433, 43.7023],
};

export function getServiceCoords(region: string): [number, number] {
  const key = Object.keys(SERVICE_REGION_COORDS).find(
    (k) => k.toLowerCase() === region.toLowerCase()
  );
  if (key) {
    const [lat, lng] = SERVICE_REGION_COORDS[key];
    return [lat + (Math.random() - 0.5) * 0.03, lng + (Math.random() - 0.5) * 0.03];
  }
  return [40.1792 + (Math.random() - 0.5) * 0.03, 44.4991 + (Math.random() - 0.5) * 0.03];
}

function createServiceMarkerIcon(): L.DivIcon {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#C45D3E,#D4A04A);border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

export interface ServiceMapMarker {
  id: string;
  title: string;
  region: string;
  price: number;
  priceUnit: string;
  categoryLabel: string;
  coverPhoto?: string | null;
}

interface ServiceMapProps {
  services: ServiceMapMarker[];
}

export default function ServiceMap({ services }: ServiceMapProps) {
  const [mounted, setMounted] = useState(false);
  const [svcBookings, setSvcBookings] = useState<{ serviceId: string; date: string; status: string }[]>([]);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    fetch("/api/service-bookings/public")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setSvcBookings(data || []))
      .catch(() => {});
  }, []);

  if (!mounted) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-2xl">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  const markerIcon = createServiceMarkerIcon();

  return (
    <div className="relative w-full min-h-[400px] rounded-2xl overflow-hidden shadow-sm">
      <MapContainer
        center={[40.1792, 44.4991]}
        zoom={8}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "500px", zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {services.map((svc) => {
          const coords = getServiceCoords(svc.region);
          return (
            <Marker key={svc.id} position={coords} icon={markerIcon}>
              <Popup>
                <div style={{ minWidth: "180px" }}>
                  {svc.coverPhoto && (
                    <img
                      src={svc.coverPhoto}
                      alt={svc.title}
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
                    {svc.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                    📍 {svc.region}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px" }}>{svc.categoryLabel}</span>
                    <span style={{ fontWeight: 700, color: "#C45D3E", fontSize: "14px" }}>
                      ${svc.price}{svc.priceUnit}
                    </span>
                  </div>
                  {/* 7-day availability */}
                  {(() => {
                    const todayNow = new Date(); todayNow.setHours(0, 0, 0, 0);
                    const bookedDates = new Set(
                      svcBookings
                        .filter((b) => b.serviceId === svc.id && b.status !== "cancelled")
                        .map((b) => b.date)
                    );
                    const days7 = [];
                    for (let i = 0; i < 7; i++) {
                      const d = new Date(todayNow);
                      d.setDate(d.getDate() + i);
                      const ds = d.toISOString().substring(0, 10);
                      days7.push({ dayNum: d.getDate(), booked: bookedDates.has(ds) });
                    }
                    return (
                      <div style={{ marginTop: "8px" }}>
                        <div style={{ fontSize: "10px", color: "#888", marginBottom: "2px" }}>{({ ru: "Ближайшие дни:", en: "Next 7 days:", hy: "Մոտական 7 օրերը:", fr: "7 prochains jours:", de: "Nächste 7 Tage:", es: "Próximos 7 días:", it: "Prossimi 7 giorni:", ar: "أيام 7 القادمة:", zh: "近7天:", fa: "۷ روز آینده:" }[typeof navigator !== "undefined" ? (document.documentElement.lang || "ru") : "ru"])}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
                          {days7.map((d, i) => (
                            <div key={i} style={{
                              textAlign: "center", fontSize: "9px", padding: "3px 0",
                              borderRadius: "3px",
                              background: d.booked ? "#ffd6d6" : "#d4f5d4",
                              color: d.booked ? "#cc0000" : "#2a8c2a",
                              textDecoration: d.booked ? "line-through" : "none",
                            }}>{d.dayNum}</div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  <a
                    href={"/services/book/" + svc.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block", textAlign: "center",
                      padding: "6px 12px", borderRadius: "20px",
                      background: "linear-gradient(135deg, #C45D3E, #F2A900)",
                      color: "#fff", fontSize: "13px", fontWeight: 600,
                      textDecoration: "none", marginTop: "8px",
                    }}
                  >
                    Подробнее
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
