import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HayHome — Договор",
  robots: { index: false, follow: false },
};

export default function ContractPrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        /* Hide Header, Footer, CookieBanner, MobileBottomBar on print page */
        header, footer, [class*="cookie"], [class*="bottom-bar"] {
          display: none !important;
        }
        @media print {
          html, body { margin: 0; padding: 0; }
          body * { visibility: hidden; }
          #contract-content, #contract-content * { visibility: visible; }
          #contract-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
          }
          @page {
            margin: 15mm;
            size: A4;
          }
        }
      `}</style>
      <div id="contract-content">
        {children}
      </div>
    </>
  );
}
