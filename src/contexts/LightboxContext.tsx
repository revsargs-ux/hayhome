"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface LightboxState {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
}

interface LightboxContextValue extends LightboxState {
  open: (images: string[], index?: number) => void;
  close: () => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  const open = useCallback((images: string[], index = 0) => {
    setState({ isOpen: true, images, currentIndex: index });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <LightboxContext.Provider value={{ ...state, open, close }}>
      {children}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
}
