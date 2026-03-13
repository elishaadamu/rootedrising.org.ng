"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import VideoModal from "./VideoModal";

interface VideoCardProps {
  title: string;
  videoUrl: string;
  index?: number;
  variant?: "white" | "slate";
  aspect?: "square" | "video";
}

export default function VideoCard({ 
  title, 
  videoUrl, 
  index = 0, 
  variant = "slate",
  aspect = "video"
}: VideoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  useEffect(() => {
    // Extract YouTube ID from URL
    const getYouTubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(videoUrl);
    if (videoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    } else {
      // Fallback or handle non-youtube
      setThumbnailUrl("/images/placeholder-video.jpg");
    }
  }, [videoUrl]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`group flex flex-col gap-6 overflow-hidden rounded-[2.5rem] p-6 border transition-all hover:shadow-2xl hover:-translate-y-2 text-center h-full min-h-[410px] ${
          variant === "white" ? "bg-white border-slate-100" : "bg-slate-50 border-slate-100"
        }`}
      >
        <div 
          className={`relative overflow-hidden rounded-3xl shadow-inner cursor-pointer ${
            aspect === "square" ? "aspect-square" : "aspect-video"
          }`}
          onClick={() => setIsOpen(true)}
        >
          {/* Skeleton Loader */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 bg-slate-300 rounded-full"></div>
            </div>
          )}
          
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                 // If maxresdefault fails, try hqdefault
                 const videoId = thumbnailUrl.split('/vi/')[1]?.split('/')[0];
                 if (videoId && !thumbnailUrl.includes('hqdefault')) {
                    setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
                 }
              }}
            />
          )}

          {/* Overlay & Play Button */}
          <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/40 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white scale-90 group-hover:scale-100 group-hover:bg-brand-orange transition-all duration-500 shadow-2xl">
              <Play size={28} fill="currentColor" className="ml-1" />
            </div>
          </div>
        </div>

        <h3 className="px-2 text-xl font-black text-slate-900 group-hover:text-brand-orange transition-colors min-h-[64px] flex items-center justify-center leading-tight tracking-tight">
          {title}
        </h3>
      </motion.div>

      <VideoModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        videoUrl={videoUrl} 
        title={title} 
      />
    </>
  );
}
