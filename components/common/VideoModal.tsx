"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoUrl,
  title
}: VideoModalProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
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
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-10"
          onClick={onClose}
        >
          {/* Controls */}
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-all z-[1000001] hover:rotate-90 duration-300"
          >
            <X size={40} />
          </button>

          {/* Wrapper for Video + Title */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="flex flex-col items-center gap-8 translate-y-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Container */}
            <div className="relative w-[70vw] h-[70vh] rounded-4xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
                title={title || "Video Player"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            {/* Title Under Video */}
            {title && (
              <div className="text-white font-black text-center px-6 max-w-4xl">
                 <p className="text-xl md:text-3xl uppercase tracking-[0.2em] opacity-80">{title}</p>
                 <div className="h-1 w-20 bg-brand-orange mx-auto mt-4 rounded-full"></div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
