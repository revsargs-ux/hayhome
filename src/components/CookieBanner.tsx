"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";

export default function CookieBanner() {
  const { tr } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("hayhome_cookie_accepted")) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("hayhome_cookie_accepted", "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center gap-4 max-w-md sm:max-w-lg">
        <p className="text-sm text-gray-700 text-center sm:text-left">
          {tr.common.cookieText}
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-5 py-2 rounded-full text-white text-sm font-medium transition-colors"
          style={{ backgroundColor: "#D4001A" }}
        >
          {tr.common.cookieAccept}
        </button>
      </div>
    </div>
  );
}
