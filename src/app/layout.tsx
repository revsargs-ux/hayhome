import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import LightboxWrapper from "@/components/LightboxWrapper";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "HayHome — Armenian Hospitality",
  description: "Experience Armenia through the heart of a family. Unique homestays, home cooking, traditions and warm welcome.",
  keywords: "Armenia, hospitality, family, tourism, homestay, Yerevan, hay-home, Armenian culture, Armenian food, lavash, khorovats, wine tasting",
  manifest: "/manifest.json",
  openGraph: {
    title: "HayHome — Armenian Hospitality",
    description: "Experience Armenia through the heart of a family. Unique homestays, home cooking, traditions and warm welcome.",
    url: "https://hay-home.com",
    siteName: "HayHome",
    images: [{ url: "https://hay-home.com/hero-bg.jpg", width: 1200, height: 630, alt: "HayHome — Armenian Hospitality" }],
    locale: "ru_RU",
    alternateLocale: ["en_US", "hy_AM", "fr_FR", "de_DE", "es_ES", "it_IT", "ar_AR", "zh_CN", "fa_IR"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HayHome — Armenian Hospitality",
    description: "Experience Armenia through the heart of a family. Unique homestays, home cooking, traditions and warm welcome.",
    images: ["https://hay-home.com/hero-bg.jpg"],
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HayHome",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "HayHome",
  description: "Armenian homestay marketplace — experience Armenia through the heart of a family.",
  url: "https://hay-home.com",
  logo: "https://hay-home.com/icon-512.png",
  image: "https://hay-home.com/hero-bg.jpg",
  email: "info@hayhome.am",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Yerevan",
    addressCountry: "AM",
  },
  sameAs: [
    "https://www.instagram.com/hayhome",
    "https://www.facebook.com/hayhome",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <LanguageProvider>
            <LightboxWrapper>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <ServiceWorkerRegister />
            </LightboxWrapper>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
