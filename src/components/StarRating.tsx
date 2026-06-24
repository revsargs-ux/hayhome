"use client";
import { useLang } from "@/contexts/LanguageContext";

interface Props {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

const ARIA_LABELS: Record<string, (rating: number, max: number) => string> = {
  ru: (r, m) => `${r} из ${m} звёзд`,
  en: (r, m) => `${r} out of ${m} stars`,
  hy: (r, m) => `${r}֊ից ${m} աստղ`,
  fr: (r, m) => `${r} sur ${m} étoiles`,
  de: (r, m) => `${r} von ${m} Sternen`,
  es: (r, m) => `${r} de ${m} estrellas`,
  it: (r, m) => `${r} su ${m} stelle`,
  ar: (r, m) => `${r} من ${m} نجوم`,
  zh: (r, m) => `${r}/${m} 星`,
  fa: (r, m) => `${r} از ${m} ستاره`,
};

export default function StarRating({ rating, max = 5, size = "md" }: Props) {
  const { lang } = useLang();
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-xl" };
  const ariaFn = ARIA_LABELS[lang] || ARIA_LABELS.en;
  return (
    <span className={`${sizes[size]} leading-none`} aria-label={ariaFn(rating, max)}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < Math.round(rating) ? "star-active" : "star-inactive"}>★</span>
      ))}
    </span>
  );
}
