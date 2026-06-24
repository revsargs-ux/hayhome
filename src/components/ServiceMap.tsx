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
  useEffect(() => setMounted(true), []);

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
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
