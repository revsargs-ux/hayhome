import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HayHome — Семьи Армении | Armenian Host Families",
  description: "Найдите армянскую семью для незабываемого гостеприимства. Homestays, кулинария, традиции.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
