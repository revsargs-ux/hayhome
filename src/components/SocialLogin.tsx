"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";

type ProviderKey = "google" | "facebook" | "yandex" | "vk" | "apple" | "telegram";

const PROVIDER_META: Record<ProviderKey, { label: string; bg: string; textColor: string; icon: string }> = {
  google:    { label: "Google",   bg: "#ffffff", textColor: "#3c4043", icon: "G" },
  telegram:  { label: "Telegram", bg: "#0088cc", textColor: "#ffffff", icon: "✈" },
  apple:     { label: "Apple",    bg: "#000000", textColor: "#ffffff", icon: "" },
  vk:        { label: "VK",       bg: "#0077ff", textColor: "#ffffff", icon: "VK" },
  facebook:  { label: "Facebook", bg: "#1877f2", textColor: "#ffffff", icon: "f" },
  yandex:    { label: "Yandex",   bg: "#fc3f1d", textColor: "#ffffff", icon: "Я" },
};

const PROVIDER_ORDER: ProviderKey[] = ["google", "telegram", "apple", "vk", "facebook", "yandex"];

export function SocialLogin() {
  const { tr } = useLang();
  const a = tr.auth;
  const [providers, setProviders] = useState<ProviderKey[]>([]);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((r) => r.json())
      .then((data) => {
        if (data.providers?.length) {
          setProviders(data.providers as ProviderKey[]);
        }
      })
      .catch(() => {});
  }, []);

  if (providers.length === 0) return null;

  return (
    <div className="mt-4">
      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">{a.socialOr || "or"}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        {providers.map((provider) => {
          const meta = PROVIDER_META[provider];
          return (
            <a
              key={provider}
              href={`/api/auth/${provider}`}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-200 hover:border-gray-300 transition text-sm font-medium"
              style={{ background: meta.bg, color: meta.textColor }}
            >
              <span className="text-base font-bold w-5 text-center">{meta.icon}</span>
              <span>{meta.label}</span>
            </a>
          );
        })}
      </div>

      {/* Auto-create note */}
      {a.socialAutoCreate && (
        <p className="text-center text-xs text-gray-400 mt-3">{a.socialAutoCreate}</p>
      )}
    </div>
  );
}
