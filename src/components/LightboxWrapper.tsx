"use client";
import { LightboxProvider, useLightbox } from "@/contexts/LightboxContext";
import dynamic from "next/dynamic";

const Lightbox = dynamic(() => import("@/components/Lightbox"));

function LightboxRoot() {
  const { isOpen, images, currentIndex, close } = useLightbox();
  if (!isOpen) return null;
  return <Lightbox images={images} currentIndex={currentIndex} onClose={close} />;
}

export default function LightboxWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LightboxProvider>
      {children}
      <LightboxRoot />
    </LightboxProvider>
  );
}
