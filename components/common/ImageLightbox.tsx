"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import Image from "next/image";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext
}: ImageLightboxProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-10"
          onClick={onClose}
        >
          {/* Controls */}
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-6 right-6 text-white hover:text-brand-orange transition-colors z-[110]"
          >
            <X size={40} />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 md:left-10 text-white hover:text-brand-orange transition-colors z-[110] p-4 bg-white/5 rounded-full backdrop-blur-md"
          >
            <ChevronLeft size={40} />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 md:right-10 text-white hover:text-brand-orange transition-colors z-[110] p-4 bg-white/5 rounded-full backdrop-blur-md"
          >
            <ChevronRight size={40} />
          </button>

          {/* Image Container */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full h-full max-w-6xl max-h-[75vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image 
                src={images[currentIndex]} 
                alt="Gallery Preview" 
                fill
                className="object-contain"
                priority
                quality={90}
              />
            </div>
            
            {/* Counter */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white bg-black/50 px-6 py-2 rounded-full backdrop-blur-md font-bold z-[120]">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
