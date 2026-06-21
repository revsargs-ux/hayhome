import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "HayHome — Армянское гостеприимство",
  description: "Познакомьтесь с Арменией через настоящих армянских семей. Уникальный опыт, домашняя еда, традиции и тёплый приём.",
  keywords: "Армения, гостеприимство, семья, туризм, homestay, Ереван",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
