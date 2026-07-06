"use client";
import { useState, useRef, useEffect } from "react";
import { Landmark, Loader2 } from "lucide-react";
import type { SwiftBank } from "@/lib/swiftBanks";

interface BankResult extends SwiftBank { bic: string; }

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (bic: string, name: string, country: string) => void;
  placeholder?: string;
  className?: string;
}

const FLAG: Record<string, string> = {
  AM: "🇦🇲", RU: "🇷🇺", DE: "🇩🇪", FR: "🇫🇷", GB: "🇬🇧", US: "🇺🇸",
  CH: "🇨🇭", NL: "🇳🇱", IT: "🇮🇹", ES: "🇪🇸", AT: "🇦🇹", GE: "🇬🇪",
  TR: "🇹🇷", AE: "🇦🇪", CN: "🇨🇳", IR: "🇮🇷", KZ: "🇰🇿", PL: "🇵🇱", JP: "🇯🇵",
};

export default function BankAutocomplete({ value, onChange, onSelect, placeholder, className }: Props) {
  const [results, setResults] = useState<BankResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const search = (q: string) => {
    if (timer.current) clearTimeout(timer.current);
    if (q.trim().length < 2) { setResults([]); setOpen(false); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/bank/bic?q=${encodeURIComponent(q)}`);
        const data = await res.json() as { results: BankResult[] };
        setResults(data.results || []);
        setOpen((data.results || []).length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          value={value}
          onChange={e => { onChange(e.target.value); search(e.target.value); }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder || "Ameriabank / ARMIAM22"}
          className={className}
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Landmark size={16} />}
        </div>
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {results.map(r => (
            <li key={r.bic}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 cursor-pointer border-b last:border-0 border-gray-100"
              onMouseDown={e => {
                e.preventDefault();
                onChange(r.name);
                onSelect?.(r.bic, r.name, r.countryName);
                setOpen(false);
              }}>
              <span className="text-lg shrink-0">{FLAG[r.country] || "🏦"}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{r.name}</div>
                <div className="text-xs text-gray-400">{r.bic} · {r.countryName}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
