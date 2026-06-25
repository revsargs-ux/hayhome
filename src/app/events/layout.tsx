import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HayHome — Мероприятия | Events in Armenia",
  description: "Кулинарные мастер-классы, дегустации вина, танцы, музыка и другие мероприятия в Армении.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
