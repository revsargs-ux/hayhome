import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap", variable: "--font-inter" });
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomBar from "@/components/MobileBottomBar";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import LightboxWrapper from "@/components/LightboxWrapper";
import CookieBanner from "@/components/CookieBanner";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#D4001A",
};

export const metadata: Metadata = {
  title: "HayHome — Гостеприимство в Армении",
  description: "HayHome — платформа для проживания в армянских семьях. Откройте Армению через сердце семьи: домашняя еда, традиции и тёплый приём. / Experience Armenia through the heart of a family — unique homestays, home cooking and traditions. / Բացահայտիր Հայաստանը հայ ընտանիքի սրտով — տնական ուտեստ, ավանդույթներ եւ ջերմ ընդունելություն।",
  keywords: "Armenia, hospitality, family, tourism, homestay, Yerevan, hay-home, Armenian culture, Armenian food, lavash, khorovats, wine tasting, Հայաստան, հյուրընկալություն, армянское гостеприимство",
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "HayHome — Гостеприимство в Армении",
    description: "Experience Armenia through the heart of a family. Unique homestays, home cooking, traditions and warm welcome.",
    url: "https://hay-home.com",
    siteName: "HayHome",
    images: [{ url: "https://hay-home.com/og-image.png", width: 1200, height: 630, alt: "HayHome — Armenian Hospitality" }],
    locale: "ru_RU",
    alternateLocale: ["en_US", "hy_AM", "fr_FR", "de_DE", "es_ES", "it_IT", "ar_AR", "zh_CN", "fa_IR"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HayHome — Гостеприимство в Армении",
    description: "Experience Armenia through the heart of a family. Unique homestays, home cooking, traditions and warm welcome.",
    images: ["https://hay-home.com/og-image.png"],
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  alternates: {
    languages: {
      'ru': '/?lang=ru',
      'en': '/?lang=en',
      'hy': '/?lang=hy',
      'fr': '/?lang=fr',
      'de': '/?lang=de',
      'es': '/?lang=es',
      'it': '/?lang=it',
      'ar': '/?lang=ar',
      'zh': '/?lang=zh',
      'fa': '/?lang=fa',
    },
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

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const YM_ID = process.env.NEXT_PUBLIC_YM_ID;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hy" className={`h-full ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
        {YM_ID && (
          <>
            <Script id="yandex-metrica" strategy="afterInteractive">
              {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return;}
  k=e.createElement(t);k.async=1;k.src=r;a=e.getElementsByTagName(t)[0];a.parentNode.insertBefore(k,a);})
  (window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
  ym(${YM_ID},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
            </Script>
            <noscript>
              <div>
                <img
                  src={`https://mc.yandex.ru/watch/${YM_ID}`}
                  style={{ position: "absolute", left: -9999 }}
                  alt=""
                />
              </div>
            </noscript>
          </>
        )}
        <AuthProvider>
          <LanguageProvider>
            <LightboxWrapper>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileBottomBar />
              <CookieBanner />
              <ServiceWorkerRegister />
            </LightboxWrapper>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
