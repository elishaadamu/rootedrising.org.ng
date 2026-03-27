"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  className?: string;
  children?: React.ReactNode;
  height?: "full" | "half" | "compact";
  titleSize?: "xl" | "lg" | "md";
  scrollTarget?: string;
}

export default function Hero({ 
  title, 
  subtitle, 
  backgroundImage, 
  className, 
  children,
  height = "half",
  titleSize = "lg",
  scrollTarget = "#next-section"
}: HeroProps) {
  
  const heightClasses = {
    full: "min-h-screen",
    half: "min-h-[70vh] py-32",
    compact: "min-h-[40vh] py-20"
  };

  const titleSizes = {
    xl: "text-4xl sm:text-5xl md:text-7xl",
    lg: "text-3xl sm:text-4xl md:text-6xl",
    md: "text-2xl sm:text-3xl md:text-5xl"
  };

  return (
    <section className={cn("relative flex items-center justify-center overflow-hidden pt-20 pb-40 md:pt-32", heightClasses[height], className)}>
      <div className="absolute inset-0 -z-10 bg-slate-100">
        <Image 
          src={backgroundImage} 
          alt={title} 
          fill 
          className="object-cover brightness-[0.7] transition-scale duration-5000 ease-linear hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-brand-dark/5 via-brand-dark/10 to-slate-900/10 transition-opacity"></div>
        <div className="absolute inset-0 square-grid opacity-20"></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto pb-24"
        >
          <h1 className={cn(
            "mb-8 font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-2xl",
            titleSizes[titleSize]
          )}>
            <span className="header-highlight highlight-cyan max-md:before:hidden!">{title}</span>
          </h1>
          
          {subtitle && (
            <div className="mx-auto mb-10 mt-14 max-w-2xl relative">
              <div className="absolute -top-3 left-6 z-20">
                <span className="bg-slate-900 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.5em] text-white border border-white/10 rounded-full shadow-lg backdrop-blur-md">
                  Initiative
                </span>
              </div>
              <p className="text-lg text-slate-100/90 md:text-xl md:leading-relaxed backdrop-blur-sm py-6 px-8 rounded-4xl border border-white/10 bg-white/5 shadow-2xl">
                {subtitle}
              </p>
            </div>
          )}
          
          {children}
        </motion.div>
      </div>

      <motion.a 
        href={scrollTarget}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        whileHover={{ opacity: 1, scale: 1.1 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 hidden md:block cursor-pointer transition-all"
      >
        <div className="h-10 w-6 rounded-full border-2 border-white flex justify-center p-1.5 backdrop-blur-sm">
          <motion.div 
            animate={{ 
              y: [0, 12, 0],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="h-2 w-1 rounded-full bg-white shadow-sm"
          />
        </div>
      </motion.a>
    </section>
  );
}
