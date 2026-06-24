"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import { Heart } from "lucide-react";

interface Props {
  hostId: string;
  size?: number;
  className?: string;
}

export default function FavoriteButton({ hostId, size = 20, className = "" }: Props) {
  const { user } = useAuth();
  const { lang } = useLang();
  const u = getUI(lang);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetch("/api/favorites", { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => {
        setFavorited(Array.isArray(data) && data.some(f => f.host_id === hostId));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, hostId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || loading) return;

    setBouncing(true);
    setTimeout(() => setBouncing(false), 300);

    if (favorited) {
      setFavorited(false);
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ host_id: hostId }),
      }).catch(() => setFavorited(true));
    } else {
      setFavorited(true);
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ host_id: hostId }),
      }).catch(() => setFavorited(false));
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggle}
      className={`transition-all ${bouncing ? "scale-125" : "scale-100"} ${className}`}
      style={{ transition: "transform 0.2s ease" }}
      aria-label={favorited ? u.removeFromFavorites : u.addToFavorites}
    >
      <Heart
        size={size}
        className={favorited ? "fill-red-500 text-red-500" : "fill-white/80 text-gray-600 hover:text-red-400"}
      />
    </button>
  );
}
