"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface Slide {
  title: string;
  subtitle?: string;
  backgroundImage: string;
}

interface HeroCarouselProps {
  slides: Slide[];
  className?: string;
  children?: React.ReactNode;
  height?: "full" | "half" | "compact" | "banner";
  titleSize?: "xl" | "lg" | "md";
  scrollTarget?: string;
  intervalMs?: number;
}

export default function HeroCarousel({ 
  slides,
  className, 
  children,
  height = "half",
  titleSize = "lg",
  scrollTarget = "#next-section",
  intervalMs = 5000
}: HeroCarouselProps) {
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [slides, intervalMs]);

  const heightClasses = {
    full: "min-h-screen",
    half: "min-h-[60vh]",
    compact: "min-h-[40vh]",
    banner: "h-[calc(100vh-88px)] w-full"
  };

  const titleSizes = {
    xl: "text-4xl sm:text-5xl md:text-7xl",
    lg: "text-3xl sm:text-4xl md:text-6xl",
    md: "text-2xl sm:text-3xl md:text-5xl"
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section className={cn(
      "relative flex items-center justify-center overflow-hidden", 
      !slides[currentIndex].title && "p-0",
      slides[currentIndex].title && "pt-20 pb-40 md:pt-32",
      heightClasses[height], 
      className
    )}>
      <div className="absolute inset-0 -z-10 bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full"
          >
            <Image 
              src={slides[currentIndex].backgroundImage} 
              alt="Hero Background" 
              fill 
              className={cn(
                "object-cover transition-all duration-1000",
                height === "banner" && "object-[center_40%]"
              )}
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="relative z-20 mx-auto max-w-7xl px-6 text-center md:px-12 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-4xl mx-auto pb-12 sm:pb-24"
          >
            {slides[currentIndex].title && (
              <h1 className={cn(
                "mb-6 sm:mb-8 font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-2xl",
                titleSizes[titleSize]
              )}>
                <span className="header-highlight highlight-cyan max-md:before:hidden!">{slides[currentIndex].title}</span>
              </h1>
            )}
            
            {slides[currentIndex].subtitle && (
              <div className="mx-auto mb-8 sm:mb-10 mt-10 sm:mt-14 max-w-2xl relative">
                <div className="absolute -top-3 left-6 z-20">
                  <span className="bg-slate-900 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.5em] text-white border border-white/10 rounded-full shadow-lg backdrop-blur-md">
                    Foundation
                  </span>
                </div>
                <p className="text-base sm:text-lg text-slate-100/90 md:text-xl md:leading-relaxed backdrop-blur-sm py-5 sm:py-6 px-6 sm:px-8 rounded-4xl border border-white/10 bg-white/5 shadow-2xl">
                  {slides[currentIndex].subtitle}
                </p>
              </div>
            )}
            
          </motion.div>
        </AnimatePresence>
        
        {/* Children (like CTA buttons) remain static below the changing text */}
        <div className="relative z-30 max-w-4xl mx-auto">
          {children}
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1 z-40 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className="group flex h-10 min-w-10 items-center justify-center p-2"
          >
            <div className={cn(
              "h-2 rounded-full transition-all duration-300",
              currentIndex === idx 
                ? "bg-brand-cyan w-6 sm:w-8 scale-110" 
                : "bg-white/50 group-hover:bg-white w-2 sm:w-2.5"
            )} />
          </button>
        ))}
      </div>

     
    </section>
  );
}
