"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface CTAProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  className?: string;
  theme?: "forest" | "sky";
}

export default function CTA({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  className,
  theme = "forest"
}: CTAProps) {
  
  const themes = {
    forest: "bg-black/90 backdrop-blur-xl border border-white/10 shadow-black/40",
    sky: "bg-linear-to-r from-brand-cyan via-brand-teal to-black shadow-cyan-500/20"
  };

  return (
    <section className={cn("py-20 px-6 md:px-12 lg:px-24", className)}>
      <div className={cn(
        "mx-auto max-w-5xl rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden",
        themes[theme]
      )}>
        {/* Subtle grid pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h2 className="mb-8 text-4xl font-extrabold md:text-6xl tracking-tight leading-none drop-shadow-lg">
            <span className="header-highlight highlight-cyan">{title}</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-white/90 leading-relaxed font-medium">
            {subtitle}
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link 
              href={primaryButtonHref} 
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-10 py-5 text-lg font-bold text-brand-dark transition-all hover:bg-slate-50 hover:-translate-y-1 hover:shadow-xl sm:w-auto active:scale-95"
            >
              {primaryButtonText}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            {secondaryButtonText && secondaryButtonHref && (
              <Link 
                href={secondaryButtonHref} 
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/40 px-10 py-5 text-lg font-bold text-white transition-all hover:bg-white/10 sm:w-auto active:scale-95"
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -top-12 -left-12 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>
      </div>
    </section>
  );
}
