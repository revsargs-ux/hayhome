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

export default function RouteMap({ fromLat, fromLng, toLat, toLng, fromLabel, toLabel, height = 300 }: RouteMapProps) {
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [routeError, setRouteError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setRoute(null);
    setRouteError(false);
    // OSRM routing
    fetch(`https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`)
      .then(r => r.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          setRoute({
            distance: data.routes[0].distance,
            duration: data.routes[0].duration,
            geometry: data.routes[0].geometry,
          });
        } else {
          setRouteError(true);
        }
      })
      .catch(() => setRouteError(true));
  }, [fromLat, fromLng, toLat, toLng, mounted]);

  if (!mounted) {
    return (
      <div className="w-full rounded-2xl bg-gray-100 flex items-center justify-center" style={{ height }}>
        <div className="w-8 h-8 border-3 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Leaflet uses [lat, lng]
  const fromPos: [number, number] = [fromLat, fromLng];
  const toPos: [number, number] = [toLat, toLng];

  // Center between the two points
  const center: [number, number] = [(fromLat + toLat) / 2, (fromLng + toLng) / 2];

  // Calculate zoom based on distance
  const dist = Math.sqrt(Math.pow(toLat - fromLat, 2) + Math.pow(toLng - fromLng, 2));
  const zoom = dist > 5 ? 7 : dist > 2 ? 9 : dist > 1 ? 11 : 13;

  // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
  const routeCoords: [number, number][] = route
    ? route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
    : [];

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

  return (
    <div className="w-full">
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
          <Marker position={fromPos} icon={createIcon("#2196F3", false)}>
            {fromLabel && <Popup>{fromLabel}</Popup>}
          </Marker>
          <Marker position={toPos} icon={createIcon("#D4001A", true)}>
            {toLabel && <Popup>{toLabel}</Popup>}
          </Marker>
          {routeCoords.length > 0 && (
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: "#D4001A", weight: 4, opacity: 0.7, dashArray: "8 6" }}
            />
          )}
        </MapContainer>
      </div>
      {route ? (
        <div className="flex items-center gap-4 mt-2 text-sm">
          <span className="text-gray-600">📏 {formatDistance(route.distance)}</span>
          <span className="text-gray-600">⏱️ {formatDuration(route.duration)}</span>
        </div>
      ) : routeError ? (
        <p className="text-xs text-gray-400 mt-1">⚠️ Route unavailable</p>
      ) : (
        <p className="text-xs text-gray-400 mt-1">Calculating route...</p>
      )}
    </div>
  );
}
