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

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    // Robust YouTube ID extraction
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 md:p-12 lg:p-20"
           onClick={onClose}
         >
           {/* Close Button */}
           <button 
             onClick={(e) => { e.stopPropagation(); onClose(); }}
             className="absolute top-6 right-6 p-4 rounded-full bg-black/20 hover:bg-black/50 text-white/50 hover:text-white transition-all z-[1000001] hover:rotate-90 duration-300 backdrop-blur-md border border-white/10"
           >
             <X size={28} />
           </button>
 
           {/* Modal Content */}
           <motion.div 
             initial={{ scale: 0.95, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.95, opacity: 0 }}
             className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center gap-6 sm:gap-10"
             onClick={(e) => e.stopPropagation()}
           >
             {/* 16:9 Video Container */}
             <div className="relative w-full aspect-video rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 bg-black">
               <iframe
                 src={getEmbedUrl(videoUrl)}
                 title={title || "Video Player"}
                 className="absolute inset-0 h-full w-full"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                 allowFullScreen
               ></iframe>
             </div>
 
             {/* Title Under Video */}
             {title && (
               <div className="text-white text-center px-4 max-w-3xl">
                  <h4 className="text-xl sm:text-4xl font-black uppercase tracking-[0.15em] leading-tight drop-shadow-2xl">
                    {title}
                  </h4>
                  <div className="h-1 w-20 bg-brand-orange mx-auto mt-6 rounded-full"></div>
               </div>
             )}
           </motion.div>
         </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
