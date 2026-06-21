import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "HayHome — Armenian Hospitality",
  description: "Experience Armenia through the heart of a family. Unique homestays, home cooking, traditions and warm welcome.",
  keywords: "Armenia, hospitality, family, tourism, homestay, Yerevan, hay-home",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <LanguageProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
