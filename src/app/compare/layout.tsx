import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HayHome — Сравнение семей | Compare Host Families",
  description: "Сравните армянские семьи бок о бок: цены, языки, услуги, рейтинги.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
