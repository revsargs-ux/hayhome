"use client";
import { useLang } from "@/contexts/LanguageContext";

export default function AdminSettings({ settings, onChange }: { settings: any; onChange: (s: any) => void }) {
  const { lang } = useLang();
  const t = (ru: string, en: string) => lang === "ru" ? ru : en;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">{t("Настройки платформы", "Platform Settings")}</h3>
        <div className="space-y-4">
          {[
            { key: "commissionPercent", label: t("Комиссия (%)", "Commission (%)"), type: "number", min: 0, max: 50 },
            { key: "legalName", label: t("Юридическое название", "Legal Name"), type: "text" },
            { key: "legalAddress", label: t("Юридический адрес", "Legal Address"), type: "text" },
            { key: "iban", label: "IBAN", type: "text" },
            { key: "bankName", label: t("Банк", "Bank"), type: "text" },
            { key: "supportPhone", label: t("Телефон поддержки", "Support Phone"), type: "text" },
            { key: "supportEmail", label: t("Email поддержки", "Support Email"), type: "text" },
          ].map((f: any) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type}
                min={f.min}
                max={f.max}
                value={settings[f.key] || ""}
                onChange={(e) => onChange({ ...settings, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"
              />
            </div>
          ))}
          <button onClick={() => alert(t("Настройки сохранены (локально)", "Settings saved (local)"))}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
            {t("Сохранить", "Save")}
          </button>
        </div>
      </div>
    </div>
  );
}
