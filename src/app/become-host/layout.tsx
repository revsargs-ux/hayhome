import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HayHome — Станьте хостом | Become a Host",
  description: "Присоединяйтесь к HayHome как принимающая семья. Зарабатывайте, делитесь армянским гостеприимством.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
