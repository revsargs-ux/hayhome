import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HayHome — Бронирование | Book a Host Family",
  description: "Забронируйте проживание у армянской семьи. Гостеприимство, кулинария, традиции.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
