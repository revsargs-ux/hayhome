import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HayHome — Услуги | Services in Armenia",
  description: "Фото, видео, музыка, гиды, повара и другие услуги для вашего визита в Армению.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
