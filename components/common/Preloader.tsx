"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [exitAnimation, setExitAnimation] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      // 2 seconds minimum for aesthetic feel as per user request
      setTimeout(() => {
        setExitAnimation(true);
        setTimeout(() => setLoading(false), 800);
      }, 2000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white transition-all duration-800 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        exitAnimation ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"
      }`}
    >
      <div className={`transition-all duration-500 ${exitAnimation ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}>
        {/* Logo and Animation */}
        <div className="relative h-20 w-48 mb-6">
          <Image
            src="/images/logo.png"
            alt="Rooted Rising Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Loading Bar */}
        <div className="h-[2px] w-full bg-slate-100 overflow-hidden relative rounded-full">
          <div className="absolute top-0 bottom-0 w-1/2 bg-linear-to-r from-brand-forest via-brand-teal to-brand-cyan animate-preloader-slide" />
        </div>
      </div>
      
      <div className={`mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 transition-all duration-500 delay-300 ${
        exitAnimation ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      }`}>
        Empowering Local Resilience
      </div>

      <style jsx>{`
        @keyframes preloader-slide {
          from { left: -100%; }
          to { left: 100%; }
        }
        .animate-preloader-slide {
          animation: preloader-slide 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
