import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HayHome — Реквизиты",
  description: "Реквизиты ИП САРГСЯН РЕВИК СЕРГЕЕВИЧ — HayHome",
};

export default function RequisitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
